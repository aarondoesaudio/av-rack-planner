import { v4 as uuidv4 } from 'uuid';
import type { DocumentState, DocumentAction, PlacedItem, RackDefinition, GearItem } from '../types/rack';

export const initialState: DocumentState = {
  racks: [],
  gear: {},
  waiting: [],
};

function removeGearFromAllRacks(racks: RackDefinition[], gearId: string): RackDefinition[] {
  return racks.map((rack) => ({
    ...rack,
    placed: rack.placed.filter((p) => p.gearId !== gearId),
  }));
}

function placeItem(
  state: DocumentState,
  gearId: string,
  rackId: string,
  targetRu: number
): DocumentState {
  const gear = state.gear[gearId];
  if (!gear) return state;

  const rack = state.racks.find((r) => r.id === rackId);
  if (!rack) return state;

  const ruSize = gear.ruSize;
  const topRu = targetRu + ruSize - 1;

  // Bounds check
  if (targetRu < 1 || topRu > rack.heightRu) {
    // Return to waiting if not already there
    const racksWithout = removeGearFromAllRacks(state.racks, gearId);
    const waitingWithout = state.waiting.filter((id) => id !== gearId);
    return { ...state, racks: racksWithout, waiting: [...waitingWithout, gearId] };
  }

  // Remove gear from wherever it currently lives (other rack or waiting)
  const racksWithout = removeGearFromAllRacks(state.racks, gearId);
  const waitingWithout = state.waiting.filter((id) => id !== gearId);

  // Work on the target rack from the cleaned state
  const targetRack = racksWithout.find((r) => r.id === rackId)!;
  const otherRacks = racksWithout.filter((r) => r.id !== rackId);

  // Find conflicts: placed items overlapping [targetRu, topRu]
  const conflicts = targetRack.placed.filter((p) => {
    const pGear = state.gear[p.gearId];
    if (!pGear) return false;
    const pTop = p.startRu + pGear.ruSize - 1;
    return p.startRu <= topRu && pTop >= targetRu;
  });

  if (conflicts.length === 0) {
    // No conflicts — just insert
    const newPlaced: PlacedItem = { gearId, rackId, startRu: targetRu };
    const placed = [...targetRack.placed, newPlaced].sort((a, b) => a.startRu - b.startRu);
    const updatedRack = { ...targetRack, placed };
    return {
      ...state,
      racks: [...otherRacks, updatedRack].sort(
        (a, b) => state.racks.findIndex((r) => r.id === a.id) - state.racks.findIndex((r) => r.id === b.id)
      ),
      waiting: waitingWithout,
    };
  }

  // There are conflicts — try shifting items above the conflict zone upward
  // Minimum shift needed: the lowest-starting conflict must move above topRu
  const lowestConflictStart = Math.min(...conflicts.map((p) => p.startRu));
  const shiftAmount = topRu - lowestConflictStart + 1;

  // Gather ALL items in the target rack that are at or above the topmost conflict RU
  // and need shifting (those that would be displaced or are above the insertion zone)
  const sortedPlaced = [...targetRack.placed].sort((a, b) => a.startRu - b.startRu);

  // Items to shift: any item whose range overlaps with [targetRu..topRu] or is above it
  const itemsToShift = sortedPlaced.filter((p) => {
    const pGear = state.gear[p.gearId];
    if (!pGear) return false;
    const pTop = p.startRu + pGear.ruSize - 1;
    return pTop >= targetRu;
  });

  const itemsToKeep = sortedPlaced.filter((p) => {
    const pGear = state.gear[p.gearId];
    if (!pGear) return false;
    const pTop = p.startRu + pGear.ruSize - 1;
    return pTop < targetRu;
  });

  // Check if shifting upward is possible
  const maxShiftedRu = Math.max(
    ...itemsToShift.map((p) => {
      const pGear = state.gear[p.gearId];
      return p.startRu + (pGear ? pGear.ruSize - 1 : 0) + shiftAmount;
    })
  );

  if (maxShiftedRu > rack.heightRu) {
    // No room — return new item to waiting, leave everything else as-is
    return {
      ...state,
      racks: state.racks,
      waiting: [...state.waiting.filter((id) => id !== gearId), gearId],
    };
  }

  // Perform the shift
  const shiftedItems: PlacedItem[] = itemsToShift.map((p) => ({
    ...p,
    startRu: p.startRu + shiftAmount,
  }));

  const newItem: PlacedItem = { gearId, rackId, startRu: targetRu };
  const newPlaced = [...itemsToKeep, newItem, ...shiftedItems].sort(
    (a, b) => a.startRu - b.startRu
  );

  const updatedRack = { ...targetRack, placed: newPlaced };
  const allRacks = [...otherRacks, updatedRack].sort(
    (a, b) => state.racks.findIndex((r) => r.id === a.id) - state.racks.findIndex((r) => r.id === b.id)
  );

  return { ...state, racks: allRacks, waiting: waitingWithout };
}

export function documentReducer(
  state: DocumentState,
  action: DocumentAction
): DocumentState {
  switch (action.type) {
    case 'ADD_RACK': {
      const newRack: RackDefinition = {
        id: uuidv4(),
        name: action.payload.name,
        location: action.payload.location,
        heightRu: action.payload.heightRu,
        placed: [],
      };
      return { ...state, racks: [...state.racks, newRack] };
    }

    case 'UPDATE_RACK': {
      const { rackId, ...updates } = action.payload;
      const racks = state.racks.map((rack) => {
        if (rack.id !== rackId) return rack;
        const updated = { ...rack };
        if (updates.name !== undefined) updated.name = updates.name;
        if (updates.location !== undefined) updated.location = updates.location;
        if (updates.heightRu !== undefined) {
          updated.heightRu = updates.heightRu;
          // Remove items that exceed new height, return them to waiting
          const overflow = updated.placed.filter((p) => {
            const g = state.gear[p.gearId];
            return g ? p.startRu + g.ruSize - 1 > updates.heightRu! : false;
          });
          updated.placed = updated.placed.filter((p) => {
            const g = state.gear[p.gearId];
            return g ? p.startRu + g.ruSize - 1 <= updates.heightRu! : true;
          });
          // Return overflowed items to waiting (handled below via the returned state)
          if (overflow.length > 0) {
            const overflowIds = overflow.map((p) => p.gearId);
            return {
              ...updated,
              _overflow: overflowIds, // temp marker
            } as RackDefinition & { _overflow?: string[] };
          }
        }
        return updated;
      });

      // Extract any overflow items and add to waiting
      let newWaiting = [...state.waiting];
      const cleanedRacks = racks.map((rack) => {
        const r = rack as RackDefinition & { _overflow?: string[] };
        if (r._overflow) {
          newWaiting = [...newWaiting, ...r._overflow.filter((id) => !newWaiting.includes(id))];
          const { _overflow, ...clean } = r;
          void _overflow;
          return clean as RackDefinition;
        }
        return rack;
      });

      return { ...state, racks: cleanedRacks, waiting: newWaiting };
    }

    case 'REMOVE_RACK': {
      const rack = state.racks.find((r) => r.id === action.payload);
      const returnedIds = rack ? rack.placed.map((p) => p.gearId) : [];
      const newWaiting = [
        ...state.waiting,
        ...returnedIds.filter((id) => !state.waiting.includes(id)),
      ];
      return {
        ...state,
        racks: state.racks.filter((r) => r.id !== action.payload),
        waiting: newWaiting,
      };
    }

    case 'REORDER_RACKS': {
      const rackMap = new Map(state.racks.map((r) => [r.id, r]));
      const reordered = action.payload.map((id) => rackMap.get(id)!).filter(Boolean);
      return { ...state, racks: reordered };
    }

    case 'ADD_GEAR': {
      return {
        ...state,
        gear: { ...state.gear, [action.payload.id]: action.payload },
        waiting: [...state.waiting, action.payload.id],
      };
    }

    case 'UPDATE_GEAR': {
      const newGear = action.payload;
      const oldGear = state.gear[newGear.id];
      let updatedState = { ...state, gear: { ...state.gear, [newGear.id]: newGear } };

      // If ruSize grew, validate all rack placements — displace if it no longer fits
      if (oldGear && oldGear.ruSize !== newGear.ruSize) {
        for (const rack of state.racks) {
          const placement = rack.placed.find((p) => p.gearId === newGear.id);
          if (placement && placement.startRu + newGear.ruSize - 1 > rack.heightRu) {
            updatedState = {
              ...updatedState,
              racks: removeGearFromAllRacks(updatedState.racks, newGear.id),
              waiting: [...updatedState.waiting.filter((id) => id !== newGear.id), newGear.id],
            };
          }
          break;
        }
      }

      return updatedState;
    }

    case 'DUPLICATE_GEAR': {
      const original = state.gear[action.payload];
      if (!original) return state;
      const duplicate: GearItem = { ...original, id: uuidv4(), name: original.name };
      return {
        ...state,
        gear: { ...state.gear, [duplicate.id]: duplicate },
        waiting: [...state.waiting, duplicate.id],
      };
    }

    case 'DELETE_GEAR': {
      const { [action.payload]: _removed, ...remainingGear } = state.gear;
      void _removed;
      return {
        ...state,
        gear: remainingGear,
        waiting: state.waiting.filter((id) => id !== action.payload),
        racks: removeGearFromAllRacks(state.racks, action.payload),
      };
    }

    case 'PLACE_ITEM': {
      return placeItem(state, action.payload.gearId, action.payload.rackId, action.payload.targetRu);
    }

    case 'RETURN_TO_WAITING': {
      const racksWithout = removeGearFromAllRacks(state.racks, action.payload);
      const waitingWithout = state.waiting.filter((id) => id !== action.payload);
      return {
        ...state,
        racks: racksWithout,
        waiting: [...waitingWithout, action.payload],
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}
