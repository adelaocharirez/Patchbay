import { describe, expect, it } from "vitest";
import { connectors, packs } from "@/data/connectors";
import { repos } from "@/data/repos";
import { brandOf, hasLogo } from "@/lib/brand";

describe("connector list", () => {
  it("features enough connectors for the home page", () => {
    expect(connectors.filter((c) => c.featured).length).toBeGreaterThanOrEqual(6);
  });

  it("covers every role with at least one featured connector", () => {
    for (const role of ["dev", "student", "freelancer", "creator", "business"] as const) {
      expect(connectors.some((c) => c.featured && c.roles.includes(role)), role).toBe(true);
    }
  });

  it("directory-only connectors have no address, remote ones always do", () => {
    for (const c of connectors) {
      if (c.kind === "directory") expect("url" in c, c.id).toBe(false);
      if (c.kind === "remote") expect(c.url.startsWith("https://"), c.id).toBe(true);
    }
  });

  it("every pack has at least one connector its role can use", () => {
    for (const p of packs) {
      const usable = connectors.filter((c) => p.connectorIds.includes(c.id) && c.roles.includes(p.role));
      expect(usable.length, p.name).toBeGreaterThan(0);
    }
  });
});

describe("brand logos", () => {
  it("returns a path for known services and null for the rest", () => {
    expect(brandOf("notion")?.path.length).toBeGreaterThan(20);
    expect(brandOf("slack")).toBeNull();
    expect(hasLogo("gmail")).toBe(true);
  });

  it("swaps near-black logos to the theme text color so dark mode stays readable", () => {
    expect(brandOf("notion")?.color).toBe("var(--ink)");
    expect(brandOf("stripe")?.color).toMatch(/^#[0-9A-F]{6}$/i);
  });
});

describe("repo board", () => {
  it("marks official repos and keeps every snapshot dated", () => {
    expect(repos.some((r) => r.official)).toBe(true);
    for (const r of repos) expect(r.asOf, `${r.owner}/${r.name}`).toMatch(/^\d{4}-\d{2}/);
  });
});
