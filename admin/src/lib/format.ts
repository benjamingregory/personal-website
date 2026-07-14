export function fmt(n: number | null | undefined): string {
  return n == null ? "—" : n.toLocaleString("en-US");
}

// "just now" · "38m ago" · "5h ago" · "3d ago"
export function relative(date: Date | null | undefined): string | null {
  if (!date) return null;
  const mins = Math.round((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

// Age of a timestamp as a compact unit — "26h", "4d" — for check details.
// Rounds the same way relative() does so a check ("no intel events in 15d")
// never disagrees with the card footer ("last activity 15d ago").
export function age(date: Date): string {
  const hours = Math.round((Date.now() - date.getTime()) / 3_600_000);
  return hours < 48 ? `${hours}h` : `${Math.round(hours / 24)}d`;
}

export function hoursSince(date: Date): number {
  return (Date.now() - date.getTime()) / 3_600_000;
}
