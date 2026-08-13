export function getFormPublicUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/f/${slug}`;
  }
  return `/f/${slug}`;
}
