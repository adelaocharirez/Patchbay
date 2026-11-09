import type { RoleId } from "@/data/types";

const KEYWORDS: Record<RoleId, string[]> = {
  dev: ["code", "coding", "app", "bug", "deploy", "repo", "github", "software", "engineer", "developer", "api", "program"],
  student: ["class", "study", "school", "essay", "exam", "homework", "college", "university", "thesis", "student"],
  freelancer: ["client", "invoice", "freelance", "gig", "contract", "agency", "self-employed"],
  creator: ["video", "design", "post", "content", "youtube", "brand", "instagram", "art", "channel", "creator", "tiktok"],
  business: ["shop", "store", "team", "customers", "sales", "manager", "startup", "business", "orders", "owner"],
};

/** Keyword match, not AI. Returns the role with the most hits, or null when nothing matches. */
export function matchRole(text: string): RoleId | null {
  const t = text.toLowerCase();
  let best: RoleId | null = null;
  let bestScore = 0;
  for (const role of Object.keys(KEYWORDS) as RoleId[]) {
    const score = KEYWORDS[role].reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      best = role;
      bestScore = score;
    }
  }
  return best;
}
