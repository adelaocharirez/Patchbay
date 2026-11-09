import { describe, expect, it } from "vitest";
import { connectorLink, newChatLink } from "@/lib/claudeLink";

describe("connectorLink", () => {
  it("builds the pre-filled add-connector link", () => {
    const link = new URL(connectorLink("notion", "https://mcp.notion.com/mcp"));
    expect(link.origin).toBe("https://claude.ai");
    expect(link.pathname).toBe("/customize/connectors");
    expect(link.searchParams.get("modal")).toBe("add-custom-connector");
    expect(link.searchParams.get("connectorName")).toBe("notion");
    expect(link.searchParams.get("connectorUrl")).toBe("https://mcp.notion.com/mcp");
  });

  it("encodes addresses that contain special characters", () => {
    const link = new URL(connectorLink("x", "https://example.com/mcp?a=1&b=2"));
    expect(link.searchParams.get("connectorUrl")).toBe("https://example.com/mcp?a=1&b=2");
  });
});

describe("newChatLink", () => {
  it("round-trips the prompt text", () => {
    const text = "Summarize my week & list 3 to-dos?";
    expect(new URL(newChatLink(text)).searchParams.get("q")).toBe(text);
  });
});
