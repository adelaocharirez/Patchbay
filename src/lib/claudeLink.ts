const BASE = "https://claude.ai";

/** Opens Claude's "Add custom connector" box with the name and address filled in. */
export function connectorLink(name: string, url: string): string {
  const q = new URLSearchParams({ modal: "add-custom-connector", connectorName: name, connectorUrl: url });
  return `${BASE}/customize/connectors?${q.toString()}`;
}

export const CONNECTORS_PAGE = `${BASE}/customize/connectors`;

/** Opens a new Claude chat with the prompt already typed in. */
export function newChatLink(prompt: string): string {
  return `${BASE}/new?q=${encodeURIComponent(prompt)}`;
}
