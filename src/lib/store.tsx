"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { connectorById } from "@/data/connectors";
import type { RoleId } from "@/data/types";

export type RoleFilter = RoleId | "all";

const KEY = "patchbay-run";
const SAMPLE = ["notion", "asana", "stripe"];

interface Store {
  role: RoleFilter;
  setRole: (r: RoleFilter) => void;
  /** The search box at the top of every page. Each page filters its own list by it. */
  query: string;
  setQuery: (q: string) => void;
  run: string[];
  /** True until the visitor changes the run, so the UI can label the starter set as a sample. */
  sample: boolean;
  toggle: (id: string) => void;
  addMany: (ids: string[]) => void;
  clear: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleFilter>("all");
  const [query, setQuery] = useState("");
  const [run, setRun] = useState<string[]>(SAMPLE);
  const [sample, setSample] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRun(parsed.filter((x): x is string => typeof x === "string" && !!connectorById(x)));
        setSample(false);
      }
    } catch {
      /* storage can be blocked; the sample run still works */
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setRun(next);
    setSample(false);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Store>(
    () => ({
      role,
      setRole,
      query,
      setQuery,
      run,
      sample,
      toggle: (id) => persist(run.includes(id) ? run.filter((x) => x !== id) : [...run, id]),
      addMany: (ids) => persist([...run, ...ids.filter((id) => !run.includes(id))]),
      clear: () => persist([]),
    }),
    [role, query, run, sample, persist],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
