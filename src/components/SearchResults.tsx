"use client";

import { Bot, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { agents } from "@/data/agents";
import { connectors } from "@/data/connectors";
import { prompts } from "@/data/prompts";
import { repos } from "@/data/repos";
import { fillPrompt } from "@/lib/fillPrompt";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { RepoAvatar } from "./RepoAvatar";

export function SearchResults() {
  const { query } = useStore();
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const c = connectors.filter((x) => `${x.name} ${x.description} ${x.category}`.toLowerCase().includes(q));
  const p = prompts.filter((x) => `${x.title} ${x.text}`.toLowerCase().includes(q));
  const a = agents.filter((x) => `${x.title} ${x.description}`.toLowerCase().includes(q));
  const r = repos.filter((x) => `${x.owner} ${x.name} ${x.description}`.toLowerCase().includes(q));

  if (!c.length && !p.length && !a.length && !r.length) {
    return <p className="muted empty">Nothing matches &ldquo;{query}&rdquo;. Try a tool name like Gmail, or a job like invoices.</p>;
  }

  return (
    <div className="results">
      {c.length > 0 && (
        <section>
          <h2 className="sechead">Connectors <span className="chipn">{c.length}</span></h2>
          <div className="rlist">
            {c.map((x) => (
              <Link key={x.id} href="/connectors" className="rrow">
                <Logo id={x.id} name={x.name} size={36} />
                <span className="rmain"><strong>{x.name}</strong><span className="fine">{x.description}</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {p.length > 0 && (
        <section>
          <h2 className="sechead">Prompts <span className="chipn">{p.length}</span></h2>
          <div className="rlist">
            {p.map((x) => (
              <Link key={x.id} href="/prompts" className="rrow">
                <span className="logo spark small"><MessageSquareText size={16} aria-hidden="true" /></span>
                <span className="rmain"><strong>{x.title}</strong><span className="fine">{fillPrompt(x.text).slice(0, 90)}&hellip;</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {a.length > 0 && (
        <section>
          <h2 className="sechead">Agents <span className="chipn">{a.length}</span></h2>
          <div className="rlist">
            {a.map((x) => (
              <Link key={x.id} href="/agents" className="rrow">
                <span className="logo agent code small"><Bot size={16} aria-hidden="true" /></span>
                <span className="rmain"><strong>{x.title}</strong><span className="fine">{x.description}</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {r.length > 0 && (
        <section>
          <h2 className="sechead">Repos <span className="chipn">{r.length}</span></h2>
          <div className="rlist">
            {r.map((x) => (
              <Link key={`${x.owner}/${x.name}`} href="/trending" className="rrow">
                <RepoAvatar owner={x.owner} size={36} />
                <span className="rmain"><strong>{x.name}</strong><span className="fine">{x.owner} &middot; {x.description}</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
