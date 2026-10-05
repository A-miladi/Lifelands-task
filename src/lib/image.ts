const IMAGE_BASE = "https://dl.lifelands.ir";

export function resolveImageUrl(path: string): string {
  if (!path) return "/game-placeholder.svg";
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${IMAGE_BASE}/${clean}`;
}
