/** Patchbay's own mark: a hub with three spokes. */
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--ink)" />
      <g stroke="var(--cta)" strokeWidth="2" strokeLinecap="round">
        <path d="M16 16 8 9" />
        <path d="M16 16 24 10" />
        <path d="M16 16 16 25" />
      </g>
      <circle cx="16" cy="16" r="4" fill="var(--bg)" />
      <circle cx="8" cy="9" r="2.4" fill="var(--bg)" />
      <circle cx="24" cy="10" r="2.4" fill="var(--bg)" />
      <circle cx="16" cy="25" r="2.4" fill="var(--bg)" />
    </svg>
  );
}
