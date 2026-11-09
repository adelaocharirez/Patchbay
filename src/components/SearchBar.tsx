"use client";

import { Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const HINTS: Record<string, string> = {
  "/": "Search connectors, prompts, agents, and repos",
  "/connectors": "Search connectors",
  "/prompts": "Search prompts",
  "/agents": "Search agents",
  "/trending": "Search repos",
};

export function SearchBar() {
  const { query, setQuery } = useStore();
  const path = usePathname();
  return (
    <div className="searchbar">
      <label className="search">
        <Search size={18} aria-hidden="true" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={HINTS[path] ?? HINTS["/"]} aria-label="Search" />
        {query && (
          <button type="button" className="clear" onClick={() => setQuery("")} aria-label="Clear search">
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </label>
    </div>
  );
}
