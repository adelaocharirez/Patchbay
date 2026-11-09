/**
 * Daily refresh job. Run with `npm run refresh`.
 * 1. Updates GitHub star counts in src/data/repos.json.
 * 2. Checks that each remote connector address still answers, and writes src/data/linkstatus.json.
 * Set GITHUB_TOKEN to avoid the low anonymous rate limit.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { connectors } from "../src/data/connectors";
import { RepoSchema, type Repo } from "../src/data/types";

const ROOT = process.cwd();
const REPOS = path.join(ROOT, "src/data/repos.json");
const LINKS = path.join(ROOT, "src/data/linkstatus.json");

async function withTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function refreshStars(): Promise<void> {
  const repos: Repo[] = RepoSchema.array().parse(JSON.parse(await readFile(REPOS, "utf8")));
  const today = new Date().toISOString().slice(0, 10);
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "patchbay-refresh" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  let updated = 0;
  for (const r of repos) {
    try {
      const res = await withTimeout(`https://api.github.com/repos/${r.owner}/${r.name}`, { headers }, 15000);
      if (!res.ok) {
        console.warn(`stars: ${r.owner}/${r.name} -> HTTP ${res.status}, keeping old value`);
        continue;
      }
      const body = (await res.json()) as { stargazers_count?: unknown };
      if (typeof body.stargazers_count === "number") {
        r.stars = body.stargazers_count;
        r.asOf = today;
        delete r.approx;
        updated++;
      }
    } catch (err) {
      console.warn(`stars: ${r.owner}/${r.name} failed: ${(err as Error).message}`);
    }
  }
  await writeFile(REPOS, JSON.stringify(repos, null, 2) + "\n");
  console.log(`stars: updated ${updated} of ${repos.length}`);
}

async function checkLinks(): Promise<void> {
  const results: Record<string, { ok: boolean; status: number | null }> = {};
  for (const c of connectors) {
    if (c.kind !== "remote") continue;
    try {
      const res = await withTimeout(c.url, { method: "GET", headers: { "User-Agent": "patchbay-refresh" }, redirect: "follow" }, 10000);
      // MCP servers usually answer a plain GET with 400, 401, 403, or 405. Any reply below 500 means the host is alive.
      results[c.id] = { ok: res.status < 500 && res.status !== 404, status: res.status };
    } catch {
      results[c.id] = { ok: false, status: null };
    }
  }
  // If nothing answered at all, this machine is probably offline or blocked. Don't mark every connector as dead.
  if (Object.values(results).every((v) => v.status === null)) {
    console.warn("links: no connector answered, so the network is probably blocked. Keeping the old linkstatus.json.");
    return;
  }
  await writeFile(LINKS, JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + "\n");
  const bad = Object.entries(results).filter(([, v]) => !v.ok).map(([id]) => id);
  console.log(`links: ${Object.keys(results).length} checked, ${bad.length} unreachable${bad.length ? ` (${bad.join(", ")})` : ""}`);
}

async function main() {
  await refreshStars();
  await checkLinks();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
