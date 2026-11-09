"use client";

import { ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { repos } from "@/data/repos";
import type { RepoKind } from "@/data/types";
import { formatAsOf, formatStars } from "@/lib/format";
import { useStore } from "@/lib/store";
import { RepoAvatar } from "./RepoAvatar";

type KindFilter = "all" | RepoKind;
const KINDS: KindFilter[] = ["all", "Lists", "Skills", "Agents", "Tools"];

export function TrendingView() {
  const { query } = useStore();
  const [kind, setKind] = useState<KindFilter>("all");
  const max = Math.max(...repos.map((r) => r.stars));
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos.filter((r) => (kind === "all" || r.kind === kind) && `${r.owner} ${r.name} ${r.description}`.toLowerCase().includes(q)).sort((a, b) => b.stars - a.stars);
  }, [kind, query]);

  return (
    <>
      <div className="chips" role="group" aria-label="Repo type">
        {KINDS.map((k) => (
          <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{k === "all" ? "All" : k}</button>
        ))}
      </div>
      <div className="board">
        {shown.map((r, i) => (
          <a className="boardrow" key={`${r.owner}/${r.name}`} href={`https://github.com/${r.owner}/${r.name}`} target="_blank" rel="noopener">
            <span className="rank">{i + 1}</span>
            <RepoAvatar owner={r.owner} />
            <span className="board-main">
              <span className="board-name">{r.name}</span>
              <span className="fine">{r.owner} &middot; {r.description}</span>
              <span className="tags">
                <span className="tag">{r.kind}</span>
                {r.official ? <span className="tag ok"><ShieldCheck size={12} aria-hidden="true" /> Official</span> : <span className="tag">Third-party</span>}
              </span>
            </span>
            <span className="board-bar" role="img" aria-label={`${formatStars(r.stars)} stars`}><i style={{ width: `${Math.max(3, Math.round((r.stars / max) * 100))}%` }} /></span>
            <span className="board-num">
              <span className="num">{r.approx ? "~" : ""}{formatStars(r.stars)}</span>
              <span className="asof">as of {formatAsOf(r.asOf)}</span>
            </span>
          </a>
        ))}
        {!shown.length && <p className="muted empty">No repos match.</p>}
      </div>
      <p className="fine" style={{ marginTop: 16 }}>Star counts are snapshots, and a daily job refreshes them. Third-party skills, hooks, and agents can run code on your machine, so read what you install. Official means published by Anthropic or the MCP project.</p>
    </>
  );
}
