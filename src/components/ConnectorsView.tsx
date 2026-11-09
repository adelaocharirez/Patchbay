"use client";

import { useMemo, useState } from "react";
import { connectors, packs } from "@/data/connectors";
import { CATEGORIES, type Category } from "@/data/types";
import { useStore } from "@/lib/store";
import { ConnectorCard } from "./ConnectorCard";
import { RunPanel } from "./RunPanel";

type CatFilter = "all" | Category;

export function ConnectorsView() {
  const { role, query, run, toggle, addMany } = useStore();
  const [cat, setCat] = useState<CatFilter>("all");
  const [safeOnly, setSafeOnly] = useState(false);

  const inRole = useMemo(() => connectors.filter((c) => role === "all" || c.roles.includes(role)), [role]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inRole.filter((c) => (cat === "all" || c.category === cat) && (!safeOnly || c.risk === "low") && `${c.name} ${c.description} ${c.category}`.toLowerCase().includes(q));
  }, [inRole, cat, safeOnly, query]);

  return (
    <div className="split">
      <div>
        <div className="chips" role="group" aria-label="Category">
          <button type="button" className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>All <span className="chipn">{inRole.length}</span></button>
          {CATEGORIES.map((c) => {
            const n = inRole.filter((x) => x.category === c).length;
            return n ? (
              <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c} <span className="chipn">{n}</span></button>
            ) : null;
          })}
        </div>
        <div className="toolrow">
          <label className="check">
            <input type="checkbox" checked={safeOnly} onChange={(e) => setSafeOnly(e.target.checked)} /> Mostly-reads only
          </label>
          <span className="toolrow-packs">
            {packs.map((p) => (
              <button key={p.role} type="button" className="chip ghost" onClick={() => addMany(p.connectorIds)}>+ {p.name} pack</button>
            ))}
          </span>
        </div>
        <div className="cgrid">
          {shown.map((c) => <ConnectorCard key={c.id} c={c} patched={run.includes(c.id)} onToggle={() => toggle(c.id)} />)}
          {!shown.length && <p className="muted empty">No connectors match. Clear the search or pick another role.</p>}
        </div>
      </div>
      <aside className="runcol"><RunPanel /></aside>
    </div>
  );
}
