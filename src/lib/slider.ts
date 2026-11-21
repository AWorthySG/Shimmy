/** Slider position as a whole percentage between 0 and 100. Non-numbers fall back to the middle. */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value)));
}
