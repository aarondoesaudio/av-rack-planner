/**
 * Returns a contrasting text color (light or dark) based on background luminance.
 * Uses the W3C relative luminance formula.
 */
export function getContrastColor(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.45 ? 'rgba(0,0,0,0.82)' : '#ffffff';
  } catch {
    return '#ffffff';
  }
}

/**
 * Returns a subtler secondary text color (for the RU count label).
 */
export function getSubtleColor(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.45 ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.55)';
  } catch {
    return 'rgba(255,255,255,0.55)';
  }
}
