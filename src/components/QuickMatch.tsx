"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { packs } from "@/data/connectors";
import { matchRole } from "@/lib/match";
import { useStore } from "@/lib/store";

export function QuickMatch() {
  const { setRole, addMany } = useStore();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<{ kind: "error" | "match"; text: string; packIndex?: number } | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setMsg({ kind: "error", text: "Type a line about your work first." });
      return;
    }
    const role = matchRole(text);
    const i = packs.findIndex((p) => p.role === role);
    if (!role || i < 0) {
      setMsg({ kind: "error", text: "No match for that. Pick a role on the left instead." });
      return;
    }
    setRole(role);
    setMsg({ kind: "match", text: `Sounds like a ${packs[i].name.toLowerCase()} setup. Everything is filtered for you.`, packIndex: i });
  }

  return (
    <div className="quickmatch">
      <form onSubmit={onSubmit}>
        <label className="eyebrow" htmlFor="qmin">What do you do all day?</label>
        <div className="qmrow">
          <input id="qmin" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="I freelance and send invoices to clients" autoComplete="off" />
          <button className="btn cta" type="submit">
            Set me up <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </form>
      <div className="qmmsg" aria-live="polite">
        {msg && <span className={msg.kind === "error" ? "muted" : ""}>{msg.text}</span>}
        {msg?.packIndex !== undefined && (
          <button type="button" className="btn sm" onClick={() => addMany(packs[msg.packIndex!].connectorIds)}>
            Connect the {packs[msg.packIndex].name} pack
          </button>
        )}
      </div>
    </div>
  );
}
