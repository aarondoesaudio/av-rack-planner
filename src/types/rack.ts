export interface GearItem {
  id: string;
  name: string;
  ruSize: number;
  color: string;
  isHeat: boolean;
  isBlank: boolean;
}

export interface PlacedItem {
  gearId: string;
  rackId: string;
  startRu: number; // 1-indexed from bottom of rack
}

export interface RackDefinition {
  id: string;
  name: string;
  location: string;
  heightRu: number;
  placed: PlacedItem[]; // sorted by startRu ascending
}

export interface DocumentState {
  racks: RackDefinition[];
  gear: Record<string, GearItem>;
  waiting: string[]; // gearIds not placed in any rack
}

export type DocumentAction =
  | { type: 'ADD_RACK'; payload: { name: string; location: string; heightRu: number } }
  | { type: 'UPDATE_RACK'; payload: { rackId: string; name?: string; location?: string; heightRu?: number } }
  | { type: 'REMOVE_RACK'; payload: string }
  | { type: 'REORDER_RACKS'; payload: string[] }
  | { type: 'ADD_GEAR'; payload: GearItem }
  | { type: 'UPDATE_GEAR'; payload: GearItem }
  | { type: 'DUPLICATE_GEAR'; payload: string }
  | { type: 'DELETE_GEAR'; payload: string }
  | { type: 'PLACE_ITEM'; payload: { gearId: string; rackId: string; targetRu: number } }
  | { type: 'RETURN_TO_WAITING'; payload: string }
  | { type: 'LOAD_STATE'; payload: DocumentState };
