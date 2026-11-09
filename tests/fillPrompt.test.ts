import { describe, expect, it } from "vitest";
import { fillPrompt, promptSegments, promptVars } from "@/lib/fillPrompt";

const t = "Check the last {{n|5}} deploys of {{project}} and {{task|fix it}}.";

describe("promptVars", () => {
  it("lists variables with their defaults", () => {
    expect(promptVars(t)).toEqual([
      { key: "n", fallback: "5" },
      { key: "project", fallback: "" },
      { key: "task", fallback: "fix it" },
    ]);
  });
});

describe("fillPrompt", () => {
  it("uses defaults, then a bracketed placeholder when there is no default", () => {
    expect(fillPrompt(t)).toBe("Check the last 5 deploys of [project] and fix it.");
  });

  it("uses typed values and trims them", () => {
    expect(fillPrompt(t, { n: " 10 ", project: "web" })).toBe("Check the last 10 deploys of web and fix it.");
  });

  it("treats a blank value as not typed", () => {
    expect(fillPrompt(t, { n: "   " })).toContain("last 5 deploys");
  });
});

describe("promptSegments", () => {
  it("joins back to the filled prompt and flags variables", () => {
    const segs = promptSegments(t, { project: "web" });
    expect(segs.map((s) => s.text).join("")).toBe(fillPrompt(t, { project: "web" }));
    expect(segs.filter((s) => s.isVar).map((s) => s.text)).toEqual(["5", "web", "fix it"]);
  });
});
