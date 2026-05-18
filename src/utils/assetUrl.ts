export function assetUrl(path: string): string {
  if (!path) return path;
  const stripped = path.startsWith('/') ? path.slice(1) : path;
  return import.meta.env.BASE_URL + stripped;
}
