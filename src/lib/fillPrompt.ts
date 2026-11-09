const VAR = /\{\{(\w+)\|?([^}]*)\}\}/g;

export interface PromptVar {
  key: string;
  fallback: string;
}

export interface Segment {
  text: string;
  isVar: boolean;
}

export function promptVars(template: string): PromptVar[] {
  return Array.from(template.matchAll(VAR), (m) => ({ key: m[1], fallback: m[2] }));
}

function valueFor(key: string, fallback: string, values: Record<string, string>): string {
  const typed = (values[key] ?? "").trim();
  return typed || fallback || `[${key}]`;
}

export function fillPrompt(template: string, values: Record<string, string> = {}): string {
  return template.replace(VAR, (_m, key: string, fallback: string) => valueFor(key, fallback, values));
}

/** Splits the filled prompt so the UI can highlight variables without injecting HTML. */
export function promptSegments(template: string, values: Record<string, string> = {}): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of template.matchAll(VAR)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: template.slice(last, at), isVar: false });
    out.push({ text: valueFor(m[1], m[2], values), isVar: true });
    last = at + m[0].length;
  }
  if (last < template.length) out.push({ text: template.slice(last), isVar: false });
  return out;
}
