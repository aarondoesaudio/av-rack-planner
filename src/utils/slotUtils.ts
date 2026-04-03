export const RU_HEIGHT_PX = 44;
export const SNAP_THRESHOLD_PX = 15;
export const RACK_BORDER_PX = 2; // border width on each side

export function computeTargetRu(
  pointerYRelativeToRackTop: number,
  rackHeightRu: number
): { targetRu: number; snapped: boolean } {
  // Visual slot 0 = top of rack = highest RU number
  const visualSlotFloat = pointerYRelativeToRackTop / RU_HEIGHT_PX;
  const nearestVisualSlot = Math.round(visualSlotFloat);
  const distanceToSlot = Math.abs(pointerYRelativeToRackTop - nearestVisualSlot * RU_HEIGHT_PX);
  const snapped = distanceToSlot <= SNAP_THRESHOLD_PX;

  // Convert: visual slot 0 (top) = rackHeightRu, visual slot (rackHeightRu-1) = 1
  const targetRu = rackHeightRu - nearestVisualSlot;

  return { targetRu, snapped };
}

export function ruToVisualTop(ru: number, rackHeightRu: number): number {
  // RU 1 = bottom of rack visually = (rackHeightRu - 1) * RU_HEIGHT_PX from top
  return (rackHeightRu - ru) * RU_HEIGHT_PX;
}

export function parseSlotDroppableId(id: string): { rackId: string; ru: number } | null {
  const prefix = 'slot-';
  if (!id.startsWith(prefix)) return null;
  const rest = id.slice(prefix.length);
  const lastDash = rest.lastIndexOf('-');
  if (lastDash === -1) return null;
  const rackId = rest.slice(0, lastDash);
  const ru = parseInt(rest.slice(lastDash + 1), 10);
  if (isNaN(ru)) return null;
  return { rackId, ru };
}

export function slotDroppableId(rackId: string, ru: number): string {
  return `slot-${rackId}-${ru}`;
}
