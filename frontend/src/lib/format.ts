export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function formatLastEdited(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Edited just now";
  if (diffMins < 60) return `Edited ${diffMins}m ago`;
  if (diffHours < 24) return `Edited ${diffHours}h ago`;
  if (diffDays === 1) return "Edited yesterday";
  if (diffDays < 7) return `Edited ${diffDays} days ago`;
  return `Edited ${formatDate(dateString)}`;
}

export function shortId(id: string): string {
  return id.slice(0, 8);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
