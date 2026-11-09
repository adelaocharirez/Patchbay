import { brandOf, monogram } from "@/lib/brand";

/** A connector's brand mark on a tile, or a letter tile when there is no logo in the icon set. */
export function Logo({ id, name, size = 44 }: { id: string; name: string; size?: number }) {
  const brand = brandOf(id);
  return (
    <span className="logo" style={{ width: size, height: size, borderRadius: Math.round(size * 0.28) }} aria-hidden="true">
      {brand ? (
        <svg viewBox="0 0 24 24" width={size * 0.54} height={size * 0.54}>
          <path d={brand.path} fill={brand.color} />
        </svg>
      ) : (
        <span className="mono-letter" style={{ fontSize: size * 0.36 }}>{monogram(id, name)}</span>
      )}
    </span>
  );
}

/** Overlapping logo tiles, used for packs and the sidebar stack summary. */
export function LogoStack({ items, size = 36, max = 4 }: { items: { id: string; name: string }[]; size?: number; max?: number }) {
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  return (
    <span className="logostack">
      {shown.map((c) => (
        <Logo key={c.id} id={c.id} name={c.name} size={size} />
      ))}
      {extra > 0 && (
        <span className="logo more" style={{ width: size, height: size, borderRadius: Math.round(size * 0.28) }}>+{extra}</span>
      )}
    </span>
  );
}
