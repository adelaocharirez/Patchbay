"use client";

import { ExternalLink, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { connectorById } from "@/data/connectors";
import { prompts } from "@/data/prompts";
import type { Prompt } from "@/data/types";
import { newChatLink } from "@/lib/claudeLink";
import { fillPrompt, promptSegments, promptVars } from "@/lib/fillPrompt";
import { useStore } from "@/lib/store";
import { CopyButton } from "./CopyButton";
import { Logo } from "./Logo";

function PromptCard({ p }: { p: Prompt }) {
  const { run, toggle } = useStore();
  const [values, setValues] = useState<Record<string, string>>({});
  const need = p.needs ? connectorById(p.needs) : undefined;
  const ready = !need || run.includes(need.id);
  const filled = fillPrompt(p.text, values);

  return (
    <article className="pcard">
      <div className="pcard-top">
        {need ? <Logo id={need.id} name={need.name} size={44} /> : <span className="logo spark"><Sparkles size={20} aria-hidden="true" /></span>}
        <div className="pcard-title">
          <h3>{p.title}</h3>
          {need ? (
            <button type="button" className={`tag btn-tag${ready ? " ok" : ""}`} onClick={() => !ready && toggle(need.id)} disabled={ready}>
              {ready ? `${need.name} is in your stack` : `Needs ${need.name}. Add it`}
            </button>
          ) : (
            <span className="tag">Works right away</span>
          )}
        </div>
      </div>
      <div className="pgrid">
        {promptVars(p.text).map((v) => (
          <label className="pfield" key={v.key}>
            {v.key}
            <input type="text" placeholder={v.fallback || v.key} value={values[v.key] ?? ""} onChange={(e) => setValues({ ...values, [v.key]: e.target.value })} />
          </label>
        ))}
      </div>
      <div className="ptext">
        {promptSegments(p.text, values).map((s, i) => (s.isVar ? <mark key={i}>{s.text}</mark> : <span key={i}>{s.text}</span>))}
      </div>
      <div className="row">
        <CopyButton text={filled} label="Copy prompt" primary />
        <a className="btn" target="_blank" rel="noopener" href={newChatLink(filled)}>Open in Claude <ExternalLink size={14} aria-hidden="true" /></a>
      </div>
    </article>
  );
}

export function PromptsView() {
  const { role, query, run } = useStore();
  const [readyOnly, setReadyOnly] = useState(false);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter(
      (p) => (role === "all" || p.roles.includes(role)) && `${p.title} ${p.text}`.toLowerCase().includes(q) && (!readyOnly || !p.needs || run.includes(p.needs)),
    );
  }, [role, query, readyOnly, run]);

  return (
    <>
      <div className="toolrow">
        <label className="check">
          <input type="checkbox" checked={readyOnly} onChange={(e) => setReadyOnly(e.target.checked)} /> Only what my stack can do
        </label>
        <span className="eyebrow">{shown.length} of {prompts.length}</span>
      </div>
      <div className="pgrid-cards">
        {shown.map((p) => <PromptCard key={p.id} p={p} />)}
        {!shown.length && <p className="muted empty">No prompts match. Add more connectors to your stack, or clear the filters.</p>}
      </div>
      <p className="fine" style={{ marginTop: 16 }}>Open in Claude pre-fills a new chat. It relies on a link format Anthropic hasn&apos;t documented, so Copy prompt is the dependable route.</p>
    </>
  );
}
