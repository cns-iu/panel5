const stops = ['#440154','#482878','#3e4989','#31688e','#26828e','#1f9e89','#35b779','#6ece58','#b5de2b','#fde725'];
export function viridisColor(value: number | null, min: number | null, max: number | null, hasData = true): string {
  if (!hasData || value === null || min === null || max === null) return '#c8d1dc';
  const t = min === max ? 0.5 : Math.max(0, Math.min(1, (value - min) / (max - min)));
  const idx = Math.min(stops.length - 1, Math.floor(t * (stops.length - 1)));
  return stops[idx];
}
