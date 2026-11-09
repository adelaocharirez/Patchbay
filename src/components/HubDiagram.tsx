"use client";

import { connectors } from "@/data/connectors";
import type { Connector } from "@/data/types";
import { brandOf, monogram } from "@/lib/brand";
import { useStore } from "@/lib/store";

const SIZE = 520;
const C = SIZE / 2;
const TILE = 46;
const INNER_R = 126;
const OUTER_R = 212;

// Featured connectors sit on the inner ring so the most useful ones are closest to Claude.
const ordered: Connector[] = [...connectors].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
const inner = ordered.slice(0, 8);
const outer = ordered.slice(8);

function place(list: Connector[], radius: number, offsetDeg: number) {
  return list.map((c, i) => {
    const a = ((offsetDeg + (360 / list.length) * i) * Math.PI) / 180;
    return { c, x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
  });
}
const nodes = [...place(inner, INNER_R, -90), ...place(outer, OUTER_R, -90 + 360 / outer.length / 2)];

export function HubDiagram() {
  const { run, toggle } = useStore();
  return (
    <svg className="hubsvg" viewBox={`0 0 ${SIZE} ${SIZE}`} role="group" aria-label="Your Claude hub. Select a tool to connect or disconnect it.">
      <circle cx={C} cy={C} r={INNER_R} className="guide" />
      <circle cx={C} cy={C} r={OUTER_R} className="guide" />
      {nodes.map(({ c, x, y }) => (
        <line key={c.id} x1={C} y1={C} x2={x} y2={y} className={`spoke${run.includes(c.id) ? " on" : ""}`} />
      ))}
      <circle cx={C} cy={C} r="48" className="core" />
      <text x={C} y={C - 2} textAnchor="middle" className="core-title">Claude</text>
      <text x={C} y={C + 18} textAnchor="middle" className="core-sub">{run.length} connected</text>
      {nodes.map(({ c, x, y }) => {
        const on = run.includes(c.id);
        const brand = brandOf(c.id);
        return (
          <g
            key={c.id}
            className={`node${on ? " on" : ""}`}
            transform={`translate(${x - TILE / 2} ${y - TILE / 2})`}
            tabIndex={0}
            role="button"
            aria-pressed={on}
            aria-label={`${on ? "Disconnect" : "Connect"} ${c.name}`}
            onClick={() => toggle(c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(c.id);
              }
            }}
          >
            <title>{c.name}</title>
            <rect width={TILE} height={TILE} rx="13" className="tile" />
            {brand ? (
              <svg x={(TILE - 25) / 2} y={(TILE - 25) / 2} width="25" height="25" viewBox="0 0 24 24">
                <path d={brand.path} fill={brand.color} />
              </svg>
            ) : (
              <text x={TILE / 2} y={TILE / 2 + 7} textAnchor="middle" className="node-letter">{monogram(c.id, c.name)}</text>
            )}
            {on && <circle cx={TILE - 3} cy="3" r="6" className="badge" />}
          </g>
        );
      })}
    </svg>
  );
}
