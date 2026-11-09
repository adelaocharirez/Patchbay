"use client";

import Link from "next/link";
import { useState } from "react";
import { connectorById } from "@/data/connectors";
import { prompts } from "@/data/prompts";
import type { Connector } from "@/data/types";
import { CONNECTORS_PAGE, connectorLink } from "@/lib/claudeLink";
import { useStore } from "@/lib/store";
import { CopyButton } from "./CopyButton";
import { Logo } from "./Logo";
import { Risk } from "./Risk";

const NOTE = "Free accounts can add one custom connector. On Team and Enterprise plans an owner may need to add each connector first. After adding one, review its tool permissions in Claude.";

function StepBody({ c }: { c: Connector }) {
  const directory = c.kind === "directory" || (c.kind === "remote" && c.inDirectory);
  if (directory) {
    return (
      <>
        <ol className="steps">
          <li>Open Claude&apos;s connector settings and choose Discover.</li>
          <li>Search for {c.name}, press Connect, and sign in.</li>
          <li>Come back here and press Done.</li>
        </ol>
        {c.note && <p className="fine">{c.note}</p>}
        <div className="row">
          <a className="btn cta" target="_blank" rel="noopener" href={CONNECTORS_PAGE}>Open connectors</a>
          {c.kind === "remote" && <a className="btn" target="_blank" rel="noopener" href={connectorLink(c.id, c.url)}>Add by address instead</a>}
        </div>
      </>
    );
  }
  if (c.kind === "remote") {
    return (
      <>
        <ol className="steps">
          <li>Open the link. Claude shows its Add custom connector box with the name and address filled in.</li>
          <li>Press Add, then sign in to {c.name} if asked.</li>
          <li>Come back here and press Done.</li>
        </ol>
        {c.note && <p className="fine">{c.note}</p>}
        <div className="row">
          <a className="btn cta" target="_blank" rel="noopener" href={connectorLink(c.id, c.url)}>Open in Claude</a>
          {c.alt && <a className="btn" target="_blank" rel="noopener" href={connectorLink(c.alt.id, c.alt.url)}>{c.alt.label}</a>}
        </div>
        <details className="manual">
          <summary>Add it by hand instead</summary>
          <p>Name</p>
          <div className="urlrow"><code>{c.id}</code><CopyButton text={c.id} /></div>
          <p>Server address</p>
          <div className="urlrow"><code>{c.url}</code><CopyButton text={c.url} /></div>
        </details>
      </>
    );
  }
  return (
    <>
      <ol className="steps">
        <li>Open a terminal where Claude Code is installed. Node.js 18 or newer is needed.</li>
        <li>Run this command.</li>
        <li>Come back here and press Done.</li>
      </ol>
      <div className="urlrow"><code>{c.kind === "local" ? c.command : ""}</code>{c.kind === "local" && <CopyButton text={c.command} />}</div>
    </>
  );
}

export function RunPanel() {
  const { run, sample, toggle, clear } = useStore();
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  const items = run.map(connectorById).filter((c): c is Connector => !!c);
  const header = (
    <div className="runhead">
      <h2>Your stack</h2>
      <span className="eyebrow">{items.length} added</span>
    </div>
  );

  function next() {
    if (step + 1 < items.length) setStep(step + 1);
    else {
      setStep(-1);
      setDone(true);
    }
  }
  const back = () => {
    setStep(-1);
    setDone(false);
  };

  if (!items.length) {
    return (
      <div className="run" aria-live="polite">
        {header}
        <p className="muted">Nothing here yet. Add connectors from the list, or add a whole pack.</p>
        <p className="fine">{NOTE}</p>
      </div>
    );
  }

  if (done) {
    const suggestions = items.flatMap((c) => prompts.filter((p) => p.needs === c.id).slice(0, 1).map((p) => ({ c, p })));
    return (
      <div className="run" aria-live="polite">
        {header}
        <p>All set. In a chat, open the + menu and switch each connector on. Then try these prompts:</p>
        {suggestions.map(({ c, p }) => (
          <div className="li" key={p.id}>
            <Logo id={c.id} name={c.name} size={32} />
            <div className="li-main"><strong>{p.title}</strong><span className="fine">Uses {c.name}</span></div>
          </div>
        ))}
        {!suggestions.length && <p className="fine">Head to Prompts for ideas.</p>}
        <div className="row">
          <Link className="btn cta" href="/prompts">Open prompts</Link>
          <button type="button" className="btn" onClick={back}>Back to my stack</button>
        </div>
      </div>
    );
  }

  if (step >= 0 && items[step]) {
    const c = items[step];
    const pct = Math.round((step / items.length) * 100);
    return (
      <div className="run" aria-live="polite">
        {header}
        <div className="prog" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: `${pct}%` }} /></div>
        <p className="eyebrow">Step {step + 1} of {items.length}</p>
        <div className="stephead">
          <Logo id={c.id} name={c.name} size={48} />
          <div><h3>{c.name}</h3><Risk level={c.risk} /></div>
        </div>
        <StepBody c={c} />
        <div className="row">
          <button type="button" className="btn" onClick={next}>{step + 1 >= items.length ? "Done, finish" : "Done, next"}</button>
          <button type="button" className="btn sm ghost" onClick={next}>Skip</button>
          <button type="button" className="btn sm ghost" onClick={back}>Back</button>
        </div>
      </div>
    );
  }

  const high = items.filter((c) => c.risk === "high").length;
  const checklist = items.map((c) => `${c.name}: ${c.kind === "remote" ? c.url : c.kind === "local" ? c.command : "Add from Claude's connector directory"}`).join("\n");
  return (
    <div className="run" aria-live="polite">
      {header}
      {sample && <p className="fine">A sample stack so you can see how it works. Clear it to start your own.</p>}
      {items.map((c) => (
        <div className="li" key={c.id}>
          <Logo id={c.id} name={c.name} size={32} />
          <div className="li-main"><strong>{c.name}</strong><Risk level={c.risk} /></div>
          <button type="button" className="btn sm ghost" onClick={() => toggle(c.id)} aria-label={`Remove ${c.name}`}>Remove</button>
        </div>
      ))}
      {high > 0 && <p className="warn">{high} of these can send messages, move money, or change live systems. Check their permissions once connected.</p>}
      <button type="button" className="btn cta" onClick={() => setStep(0)}>Start guided setup</button>
      <div className="row">
        <CopyButton text={checklist} label="Copy checklist" />
        <button type="button" className="btn sm ghost" onClick={clear}>Clear</button>
      </div>
      <p className="fine">{NOTE}</p>
    </div>
  );
}
