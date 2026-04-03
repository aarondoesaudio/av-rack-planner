import { useState, useCallback, useRef, useEffect } from 'react';
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragMoveEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useDocument } from '../context/DocumentContext';
import { parseSlotDroppableId, computeTargetRu } from '../utils/slotUtils';

export interface DragState {
  activeGearId: string | null;
  pendingDropRackId: string | null;
  pendingDropRu: number | null;
  isDropValid: boolean;
}

export function useRackDnd(rackRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>) {
  const { state, dispatch } = useDocument();

  // Track real pointer position to avoid dnd-kit delta double-counting scroll offsets
  const pointerPos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      pointerPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, []);

  const [dragState, setDragState] = useState<DragState>({
    activeGearId: null,
    pendingDropRackId: null,
    pendingDropRu: null,
    isDropValid: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const gearId = (event.active.data.current as { gearId?: string })?.gearId ?? null;
      setDragState({ activeGearId: gearId, pendingDropRackId: null, pendingDropRu: null, isDropValid: false });
    },
    []
  );

  const onDragMove = useCallback(
    (event: DragMoveEvent) => {
      const gearId = (event.active.data.current as { gearId?: string })?.gearId;
      if (!gearId) return;

      const gear = state.gear[gearId];
      if (!gear) return;

      const over = event.over;
      if (!over) {
        setDragState((prev) => ({ ...prev, pendingDropRackId: null, pendingDropRu: null, isDropValid: false }));
        return;
      }

      // Determine which rack we're hovering over
      let rackId: string | null = null;
      let targetRu: number | null = null;

      const parsed = parseSlotDroppableId(String(over.id));
      if (parsed) {
        rackId = parsed.rackId;
        targetRu = parsed.ru;
      } else if (over.id === 'waiting') {
        setDragState((prev) => ({ ...prev, pendingDropRackId: null, pendingDropRu: null, isDropValid: true }));
        return;
      }

      if (!rackId || targetRu === null) return;

      const rack = state.racks.find((r) => r.id === rackId);
      if (!rack) return;

      // Use pointer position relative to the rack frame for fine-grained snap
      const rackEl = rackRefs.current.get(rackId);
      if (rackEl) {
        const rect = rackEl.getBoundingClientRect();
        const pointerY = pointerPos.current.y - rect.top;
        const computed = computeTargetRu(pointerY, rack.heightRu);
        targetRu = computed.targetRu;
      }

      // Clamp
      targetRu = Math.max(1, Math.min(rack.heightRu - gear.ruSize + 1, targetRu));

      // Validity check: can we fit here?
      const topRu = targetRu + gear.ruSize - 1;
      if (topRu > rack.heightRu || targetRu < 1) {
        setDragState({ activeGearId: gearId, pendingDropRackId: rackId, pendingDropRu: targetRu, isDropValid: false });
        return;
      }

      // Check conflicts and shift feasibility
      const conflicts = rack.placed.filter((p) => {
        if (p.gearId === gearId) return false; // ignore self
        const pGear = state.gear[p.gearId];
        if (!pGear) return false;
        const pTop = p.startRu + pGear.ruSize - 1;
        return p.startRu <= topRu && pTop >= targetRu;
      });

      let valid = true;
      if (conflicts.length > 0) {
        const lowestConflictStart = Math.min(...conflicts.map((p) => p.startRu));
        const shiftAmount = topRu - lowestConflictStart + 1;
        // Check if shifting all items above targetRu upward fits
        const itemsAbove = rack.placed.filter((p) => {
          if (p.gearId === gearId) return false;
          const pGear = state.gear[p.gearId];
          if (!pGear) return false;
          const pTop = p.startRu + pGear.ruSize - 1;
          return pTop >= targetRu;
        });
        const maxAfterShift = Math.max(
          ...itemsAbove.map((p) => {
            const g = state.gear[p.gearId];
            return p.startRu + (g ? g.ruSize - 1 : 0) + shiftAmount;
          })
        );
        valid = maxAfterShift <= rack.heightRu;
      }

      setDragState({ activeGearId: gearId, pendingDropRackId: rackId, pendingDropRu: targetRu, isDropValid: valid });
    },
    [state, rackRefs]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const gearId = (event.active.data.current as { gearId?: string })?.gearId;
      setDragState({ activeGearId: null, pendingDropRackId: null, pendingDropRu: null, isDropValid: false });

      if (!gearId) return;

      const over = event.over;
      if (!over) {
        // Dropped nowhere — return to waiting
        dispatch({ type: 'RETURN_TO_WAITING', payload: gearId });
        return;
      }

      if (over.id === 'waiting') {
        dispatch({ type: 'RETURN_TO_WAITING', payload: gearId });
        return;
      }

      const parsed = parseSlotDroppableId(String(over.id));
      if (!parsed) return;

      const { rackId } = parsed;
      const rack = state.racks.find((r) => r.id === rackId);
      if (!rack) return;

      const gear = state.gear[gearId];
      if (!gear) return;

      // Compute final target RU from pointer position
      let targetRu = parsed.ru;
      const rackEl = rackRefs.current.get(rackId);
      if (rackEl) {
        const rect = rackEl.getBoundingClientRect();
        const pointerY = pointerPos.current.y - rect.top;
        const { targetRu: computed } = computeTargetRu(pointerY, rack.heightRu);
        targetRu = Math.max(1, Math.min(rack.heightRu - gear.ruSize + 1, computed));
      }

      dispatch({ type: 'PLACE_ITEM', payload: { gearId, rackId, targetRu } });
    },
    [state, dispatch, rackRefs]
  );

  return { sensors, dragState, onDragStart, onDragMove, onDragEnd };
}
