import type { Metadata } from "next";
import { AgentsView } from "@/components/AgentsView";

export const metadata: Metadata = { title: "Agents | Patchbay" };

export default function AgentsPage() {
  return (
    <>
      <header className="pagehead">
        <h1>Agents</h1>
        <p className="lede">Subagents for Claude Code and instruction sets for Claude Projects. Copy one and save it where the note says.</p>
      </header>
      <AgentsView />
    </>
  );
}
