const DEFAULT_IMAGE_BASE = "https://lifelands.ir";

function getBase(): string {
  const raw = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? DEFAULT_IMAGE_BASE;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export function resolveImageUrl(path: string): string {
  if (!path) return "/game-placeholder.svg";
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${getBase()}/${clean}`;
}
