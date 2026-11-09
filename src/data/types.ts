import { z } from "zod";

export const RoleIdSchema = z.enum(["dev", "student", "freelancer", "creator", "business"]);
export type RoleId = z.infer<typeof RoleIdSchema>;

export const RiskSchema = z.enum(["low", "med", "high"]);
export type Risk = z.infer<typeof RiskSchema>;

export const CATEGORIES = ["Email and calendar", "Files", "Chat", "Notes and tasks", "Design", "Sales", "Dev and data", "Payments"] as const;
export const CategorySchema = z.enum(CATEGORIES);
export type Category = z.infer<typeof CategorySchema>;

const slug = z.string().regex(/^[a-z0-9-]+$/, "use lowercase letters, digits, and hyphens");

const connectorBase = z.object({
  id: slug,
  name: z.string().min(1),
  description: z.string().min(1),
  category: CategorySchema,
  risk: RiskSchema,
  roles: z.array(RoleIdSchema).min(1),
  can: z.array(z.string().min(1)).min(1),
  /** Shown on the most useful connectors on the home page. */
  featured: z.boolean().optional(),
  /** Plan limits, admin approval, or other things to know before connecting. */
  note: z.string().optional(),
});

export const ConnectorSchema = z.discriminatedUnion("kind", [
  connectorBase.extend({
    kind: z.literal("remote"),
    url: z.string().url().startsWith("https://"),
    /** True when Claude's own directory also lists it, which is the easier way to connect. */
    inDirectory: z.boolean().optional(),
    alt: z.object({ label: z.string(), id: slug, url: z.string().url() }).optional(),
  }),
  connectorBase.extend({ kind: z.literal("local"), command: z.string().min(1) }),
  connectorBase.extend({ kind: z.literal("directory") }),
]);
export type Connector = z.infer<typeof ConnectorSchema>;

export const PackSchema = z.object({
  role: RoleIdSchema,
  name: z.string(),
  connectorIds: z.array(slug).min(1),
});
export type Pack = z.infer<typeof PackSchema>;

export const PromptSchema = z.object({
  id: slug,
  title: z.string().min(1),
  roles: z.array(RoleIdSchema).min(1),
  needs: slug.optional(),
  text: z.string().min(10),
});
export type Prompt = z.infer<typeof PromptSchema>;

export const AgentSchema = z.object({
  id: slug,
  title: z.string().min(1),
  type: z.enum(["subagent", "project"]),
  roles: z.array(RoleIdSchema).min(1),
  description: z.string().min(1),
  file: z.string().optional(),
  text: z.string().min(20),
});
export type Agent = z.infer<typeof AgentSchema>;

export const RepoKindSchema = z.enum(["Lists", "Skills", "Agents", "Tools"]);
export type RepoKind = z.infer<typeof RepoKindSchema>;

export const RepoSchema = z.object({
  owner: z.string().min(1),
  name: z.string().min(1),
  kind: RepoKindSchema,
  description: z.string().min(1),
  stars: z.number().int().nonnegative(),
  approx: z.boolean().optional(),
  /** Published by Anthropic or the MCP project itself. */
  official: z.boolean().optional(),
  asOf: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "use YYYY-MM or YYYY-MM-DD"),
});
export type Repo = z.infer<typeof RepoSchema>;

export const LinkStatusSchema = z.object({
  checkedAt: z.string().nullable(),
  results: z.record(z.object({ ok: z.boolean(), status: z.number().nullable() })),
});
export type LinkStatus = z.infer<typeof LinkStatusSchema>;
