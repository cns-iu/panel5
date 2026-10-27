/** Resolve a public asset independently of the current client-side route. */
export function staticAsset(path:string): string {
  const base = import.meta.env.BASE_URL;
  if (base !== './') return `${base}${path}`;
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) return `/panel5/${path}`;
  return `/${path}`;
}
