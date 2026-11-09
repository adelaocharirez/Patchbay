import { describe, expect, it } from "vitest";
import { agents } from "@/data/agents";
import { connectors, packs } from "@/data/connectors";
import { prompts } from "@/data/prompts";
import { linkStatus, repos } from "@/data/repos";
import { matchRole } from "@/lib/match";
import { formatAsOf } from "@/lib/format";

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe("data files", () => {
  it("have unique ids", () => {
    expect(unique(connectors.map((c) => c.id))).toBe(true);
    expect(unique(prompts.map((p) => p.id))).toBe(true);
    expect(unique(agents.map((a) => a.id))).toBe(true);
    expect(unique(repos.map((r) => `${r.owner}/${r.name}`))).toBe(true);
  });

  it("packs only reference connectors that exist", () => {
    const ids = new Set(connectors.map((c) => c.id));
    for (const p of packs) for (const id of p.connectorIds) expect(ids.has(id), `${p.name} -> ${id}`).toBe(true);
  });

  it("prompts only need connectors that exist", () => {
    const ids = new Set(connectors.map((c) => c.id));
    for (const p of prompts) if (p.needs) expect(ids.has(p.needs), `${p.id} needs ${p.needs}`).toBe(true);
  });

  it("every connector has at least one prompt or is a documented exception", () => {
    const withPrompt = new Set(prompts.map((p) => p.needs));
    const exceptions = new Set(["miro", "atlassian", "canva", "playwright", "box", "m365"]);
    for (const c of connectors) expect(withPrompt.has(c.id) || exceptions.has(c.id), c.id).toBe(true);
  });

  it("subagents name a file to save to", () => {
    for (const a of agents.filter((x) => x.type === "subagent")) expect(a.file, a.id).toMatch(/^\.claude\/agents\/.+\.md$/);
  });

  it("link status refers to real connectors", () => {
    const ids = new Set(connectors.map((c) => c.id));
    for (const id of Object.keys(linkStatus.results)) expect(ids.has(id), id).toBe(true);
  });
});

describe("matchRole", () => {
  it("matches a freelancer", () => expect(matchRole("I freelance and send invoices to clients")).toBe("freelancer"));
  it("matches a developer", () => expect(matchRole("I write code and deploy my app")).toBe("dev"));
  it("returns null when nothing matches", () => expect(matchRole("hello there")).toBeNull());
});

describe("formatAsOf", () => {
  it("formats month and full dates", () => {
    expect(formatAsOf("2026-09")).toBe("Sep 2026");
    expect(formatAsOf("2026-11-08")).toBe("Nov 2026");
  });
});
