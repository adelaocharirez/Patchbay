import type { Metadata } from "next";
import { TrendingView } from "@/components/TrendingView";

export const metadata: Metadata = { title: "Trending | Patchbay" };

export default function TrendingPage() {
  return (
    <>
      <header className="pagehead">
        <h1>Trending</h1>
        <p className="lede">Popular GitHub repos for Claude skills, agents, and tools, ranked by stars.</p>
      </header>
      <TrendingView />
    </>
  );
}
