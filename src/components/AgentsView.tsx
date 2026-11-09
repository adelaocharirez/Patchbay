"use client";

import { Bot, FolderKanban } from "lucide-react";
import { useMemo, useState } from "react";
import { agents } from "@/data/agents";
import { useStore } from "@/lib/store";
import { CopyButton } from "./CopyButton";

type TypeFilter = "all" | "subagent" | "project";
const TYPES: [TypeFilter, string][] = [
  ["all", "All"],
  ["subagent", "Claude Code subagents"],
  ["project", "Project instructions"],
];

export function AgentsView() {
  const { role, query } = useStore();
  const [type, setType] = useState<TypeFilter>("all");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((a) => (role === "all" || a.roles.includes(role)) && (type === "all" || a.type === type) && `${a.title} ${a.description}`.toLowerCase().includes(q));
  }, [role, type, query]);

  return (
    <>
      <div className="chips" role="group" aria-label="Agent type">
        {TYPES.map(([id, label]) => (
          <button key={id} type="button" className="chip" aria-pressed={type === id} onClick={() => setType(id)}>{label}</button>
        ))}
      </div>
      <div className="pgrid-cards">
        {shown.map((a) => {
          const code = a.type === "subagent";
          return (
            <article className="pcard" key={a.id}>
              <div className="pcard-top">
                <span className={`logo agent ${code ? "code" : "proj"}`}>{code ? <Bot size={22} aria-hidden="true" /> : <FolderKanban size={22} aria-hidden="true" />}</span>
                <div className="pcard-title">
                  <h3>{a.title}</h3>
                  <span className="tag">{code ? "Claude Code subagent" : "Claude Project instructions"}</span>
                </div>
              </div>
              <p className="ccard-desc">{a.description}</p>
              <details>
                <summary>See the full text</summary>
                <pre>{a.text}</pre>
                <p className="fine">
                  {code ? `Save as ${a.file} in your project, or in ~/.claude/agents/ to use it in every project.` : "In Claude, create a Project and paste this into its instructions."}
                </p>
              </details>
              <div className="row"><CopyButton text={a.text} label="Copy" primary /></div>
            </article>
          );
        })}
        {!shown.length && <p className="muted empty">No agents for that mix. Try another role or type.</p>}
      </div>
    </>
  );
}
