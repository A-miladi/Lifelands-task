export function formatFaNumber(value: number): string {
  if (!Number.isFinite(value)) return "۰";
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function formatScore(value: number): string {
  if (!Number.isFinite(value)) return "۰";
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function isRecentlyCreated(
  game: { createdAtIso: string },
  daysThreshold = 30,
): boolean {
  const t = Date.parse(game.createdAtIso);
  if (Number.isNaN(t)) return false;
  const days = (Date.now() - t) / (1000 * 60 * 60 * 24);
  return days >= 0 && days < daysThreshold;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
