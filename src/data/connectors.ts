import { ConnectorSchema, PackSchema, type Connector, type Pack } from "./types";

// Remote addresses come from each vendor's public docs. Directory-only entries (no address) are added from
// Claude's own Connectors directory. Plan and admin notes were checked against public guides in Oct 2026.
// The daily refresh job flags any remote address that stops responding.
export const connectors: Connector[] = ConnectorSchema.array().parse([
  // Email and calendar
  { id: "gmail", name: "Gmail", kind: "directory", category: "Email and calendar", featured: true, risk: "high", roles: ["student", "freelancer", "creator", "business", "dev"], description: "Find, read, and draft email without leaving the chat.", can: ["Search threads and read messages", "Draft, reply, forward, and manage labels"], note: "Can send and forward on your behalf. On Team and Enterprise plans an owner turns it on first." },
  { id: "gcal", name: "Google Calendar", kind: "directory", category: "Email and calendar", featured: true, risk: "med", roles: ["student", "freelancer", "creator", "business", "dev"], description: "Plan your day and prep for meetings from your real schedule.", can: ["Read your calendars", "Create, change, and answer events"], note: "On Team and Enterprise plans an owner turns it on first." },
  { id: "m365", name: "Microsoft 365", kind: "directory", category: "Email and calendar", risk: "med", roles: ["business", "student"], description: "Outlook, OneDrive, SharePoint, and Teams for Microsoft workplaces.", can: ["Read Outlook mail and calendar", "Search OneDrive, SharePoint, and Teams"], note: "Work or school accounts only. A Global Administrator must approve it once. Write tools are off by default." },
  // Files
  { id: "gdrive", name: "Google Drive", kind: "directory", category: "Files", featured: true, risk: "med", roles: ["student", "freelancer", "creator", "business", "dev"], description: "Search your Docs, Sheets, Slides, and PDFs and ask questions about them.", can: ["Read Docs, Sheets, Slides, and PDFs (text only)", "Create, share, and move files"], note: "Sharing and moving files can be set to need approval on Team and Enterprise plans." },
  { id: "box", name: "Box", kind: "directory", category: "Files", risk: "med", roles: ["business"], description: "Search company files and ask questions about documents in Box.", can: ["Search files and folders", "Upload files and create folders"] },
  // Chat
  { id: "slack", name: "Slack", kind: "directory", category: "Chat", featured: true, risk: "high", roles: ["business", "dev", "creator", "freelancer"], description: "Catch up on channels and threads, and draft messages.", can: ["Read channels, threads, and DMs", "Send messages and edit canvases"], note: "Needs a Pro, Max, Team, or Enterprise plan, and the Claude app installed in Slack first." },
  // Notes and tasks
  { id: "notion", name: "Notion", kind: "remote", url: "https://mcp.notion.com/mcp", inDirectory: true, category: "Notes and tasks", featured: true, risk: "med", roles: ["student", "freelancer", "business", "creator"], description: "Search and edit your notes, docs, and databases.", can: ["Search pages, databases, and comments", "Create, update, and move pages"] },
  { id: "asana", name: "Asana", kind: "remote", url: "https://mcp.asana.com/v2/mcp", inDirectory: true, category: "Notes and tasks", risk: "med", roles: ["business", "freelancer"], description: "Manage tasks, projects, and goals.", can: ["Read tasks, projects, and goals", "Create projects and update tasks"] },
  { id: "linear", name: "Linear", kind: "remote", url: "https://mcp.linear.app/mcp", inDirectory: true, category: "Notes and tasks", risk: "med", roles: ["dev", "business"], description: "Track issues, cycles, and projects.", can: ["Read issues, projects, and cycles", "Create and update issues"], alt: { label: "Read-only version", id: "linear-readonly", url: "https://mcp.linear.app/mcp/readonly" } },
  { id: "atlassian", name: "Atlassian", kind: "remote", url: "https://mcp.atlassian.com/v2/mcp", inDirectory: true, category: "Notes and tasks", risk: "med", roles: ["dev", "business"], description: "Jira, Confluence, Bitbucket, and Loom in one.", can: ["Search Jira and Confluence", "Create and edit issues and pages"], note: "Delete tools stay off unless your Atlassian admin allows them." },
  // Design
  { id: "canva", name: "Canva", kind: "directory", category: "Design", featured: true, risk: "med", roles: ["creator", "business", "freelancer"], description: "Generate, edit, and export designs.", can: ["Search and read your designs", "Generate, import, and export designs"] },
  { id: "figma", name: "Figma", kind: "remote", url: "https://mcp.figma.com/mcp", inDirectory: true, category: "Design", risk: "med", roles: ["creator", "dev"], description: "Read design files and turn frames into code.", can: ["Read frames, variables, and components", "Create FigJam diagrams"] },
  { id: "miro", name: "Miro", kind: "remote", url: "https://mcp.miro.com/", category: "Design", risk: "med", roles: ["creator", "business"], description: "Summarize boards and create diagrams.", can: ["Search and summarize boards", "Create diagrams and tables"] },
  // Sales
  { id: "hubspot", name: "HubSpot", kind: "directory", category: "Sales", risk: "med", roles: ["business", "freelancer"], description: "Look up customers and deals, and draft follow-ups.", can: ["Read CRM records and campaign analytics", "Update records, emails, and landing pages"] },
  // Dev and data
  { id: "github", name: "GitHub", kind: "remote", url: "https://api.githubcopilot.com/mcp/", category: "Dev and data", featured: true, risk: "med", roles: ["dev"], description: "Work with repos, issues, and pull requests.", can: ["Read code and pull requests", "Open issues and comments"], note: "Claude's directory also has a read-only GitHub Integration for browsing repo files. This one can do more." },
  { id: "sentry", name: "Sentry", kind: "remote", url: "https://mcp.sentry.dev/mcp", category: "Dev and data", risk: "low", roles: ["dev"], description: "Investigate app errors and crashes.", can: ["Read error reports", "Look up stack traces"] },
  { id: "context7", name: "Context7", kind: "remote", url: "https://mcp.context7.com/mcp", category: "Dev and data", featured: true, risk: "low", roles: ["dev", "student"], description: "Current library docs while you code.", can: ["Look up up-to-date library docs"] },
  { id: "deepwiki", name: "DeepWiki", kind: "remote", url: "https://mcp.deepwiki.com/mcp", category: "Dev and data", risk: "low", roles: ["dev", "student"], description: "Ask questions about any public repo. No sign-in.", can: ["Read docs generated for public repos"] },
  { id: "vercel", name: "Vercel", kind: "remote", url: "https://mcp.vercel.com", category: "Dev and data", risk: "med", roles: ["dev"], description: "Check deployments and project logs.", can: ["Read deployments and logs", "Manage projects"] },
  { id: "supabase", name: "Supabase", kind: "remote", url: "https://mcp.supabase.com/mcp", category: "Dev and data", risk: "high", roles: ["dev"], description: "Inspect and manage your database.", can: ["Read schemas and tables", "Run queries and migrations"], note: "Point it at a development project first, not production." },
  { id: "playwright", name: "Playwright", kind: "local", command: "claude mcp add playwright npx @playwright/mcp@latest", category: "Dev and data", risk: "med", roles: ["dev"], description: "Let Claude Code drive a real browser. Runs on your computer.", can: ["Click, fill, and read web pages", "Test your own site"] },
  // Payments
  { id: "stripe", name: "Stripe", kind: "remote", url: "https://mcp.stripe.com", category: "Payments", featured: true, risk: "high", roles: ["freelancer", "business"], description: "Look up payments, customers, and invoices.", can: ["Read payments and customers", "Take billing actions"], note: "Keep tools on ask-first so nothing moves money without your OK." },
]);

export const packs: Pack[] = PackSchema.array().parse([
  { role: "student", name: "Student", connectorIds: ["notion", "gdrive", "gcal", "deepwiki"] },
  { role: "dev", name: "Developer", connectorIds: ["github", "linear", "sentry", "context7", "vercel"] },
  { role: "freelancer", name: "Freelancer", connectorIds: ["gmail", "gcal", "notion", "stripe", "canva"] },
  { role: "creator", name: "Creator", connectorIds: ["canva", "figma", "notion", "gdrive"] },
  { role: "business", name: "Business", connectorIds: ["gmail", "gcal", "slack", "hubspot", "asana"] },
]);

export const connectorById = (id: string): Connector | undefined => connectors.find((c) => c.id === id);
