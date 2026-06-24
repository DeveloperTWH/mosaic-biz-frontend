export function getBadgeImage(badge?: string | null): string | null {
  if (!badge) return null;
  const key = badge.trim().toLowerCase().replace(/[\s_-]+/g, "");
  const badgeMap: Record<string, string> = {
    bronze: "/badge.png",
    silver: "/badge/Silver.png",
    gold: "/badge/Gold.png",
    platinum: "/badge/Platinum.png",
    diamond: "/badge/Diamond.png",
  };
  return badgeMap[key] ?? null;
}

export function handleBadgeImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.src.endsWith("/badge.png")) return;
  img.src = "/badge.png";
}
