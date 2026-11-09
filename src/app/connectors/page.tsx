import type { Metadata } from "next";
import { ConnectorsView } from "@/components/ConnectorsView";

export const metadata: Metadata = { title: "Connectors | Patchbay" };

export default function ConnectorsPage() {
  return (
    <>
      <header className="pagehead">
        <h1>Connectors</h1>
        <p className="lede">Add the tools you use to your stack, then run guided setup. Directory connectors take one click in Claude. Others open a pre-filled form.</p>
      </header>
      <ConnectorsView />
    </>
  );
}
