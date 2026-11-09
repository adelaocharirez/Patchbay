"use client";

import { Check, Plus } from "lucide-react";
import { prompts } from "@/data/prompts";
import { linkStatus } from "@/data/repos";
import type { Connector } from "@/data/types";
import { CopyButton } from "./CopyButton";
import { Logo } from "./Logo";
import { Risk } from "./Risk";

export function ConnectorCard({ c, patched, onToggle }: { c: Connector; patched: boolean; onToggle: () => void }) {
  const firstPrompt = prompts.find((p) => p.needs === c.id);
  const status = linkStatus.results[c.id];
  return (
    <article className={`ccard${patched ? " on" : ""}`}>
      <div className="ccard-top">
        <Logo id={c.id} name={c.name} size={52} />
        <div className="ccard-title">
          <h3>{c.name}</h3>
          <Risk level={c.risk} />
        </div>
      </div>
      <p className="ccard-desc">{c.description}</p>
      <div className="tags">
        <span className="tag">{c.category}</span>
        {c.kind === "local" && <span className="tag">Runs on your computer</span>}
        {c.kind === "directory" && <span className="tag">One click in Claude</span>}
        {c.kind === "remote" && c.inDirectory && <span className="tag">One click in Claude</span>}
        {c.kind === "remote" && status && !status.ok && <span className="tag warn">Unreachable at last check</span>}
      </div>
      {c.note && <p className="ccard-note">{c.note}</p>}
      <details>
        <summary>What it can do</summary>
        <ul>{c.can.map((x) => <li key={x}>{x}</li>)}</ul>
        {firstPrompt && <p className="fine">Try the prompt &ldquo;{firstPrompt.title}&rdquo; on the Prompts page.</p>}
        {c.kind === "remote" && (
          <div className="urlrow">
            <code>{c.url}</code>
            <CopyButton text={c.url} label="Copy URL" />
          </div>
        )}
        {c.kind === "local" && (
          <div className="urlrow">
            <code>{c.command}</code>
            <CopyButton text={c.command} />
          </div>
        )}
      </details>
      <button type="button" className={`btn${patched ? "" : " cta"}`} onClick={onToggle}>
        {patched ? <><Check size={16} aria-hidden="true" /> In your stack</> : <><Plus size={16} aria-hidden="true" /> Add to stack</>}
      </button>
    </article>
  );
}
