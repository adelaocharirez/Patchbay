import type { Metadata } from "next";
import { PromptsView } from "@/components/PromptsView";

export const metadata: Metadata = { title: "Prompts | Patchbay" };

export default function PromptsPage() {
  return (
    <>
      <header className="pagehead">
        <h1>Prompts</h1>
        <p className="lede">Pick one, type your details, and copy it or open it in a new Claude chat. Prompts that use a connector tell you what to add first.</p>
      </header>
      <PromptsView />
    </>
  );
}
