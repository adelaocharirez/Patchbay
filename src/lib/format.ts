const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09" or "2026-09-18" becomes "Sep 2026". */
export function formatAsOf(asOf: string): string {
  const [y, m] = asOf.split("-");
  const i = Number(m) - 1;
  return i >= 0 && i < 12 ? `${MONTHS[i]} ${y}` : asOf;
}

export const formatStars = (n: number): string => n.toLocaleString("en-US");
