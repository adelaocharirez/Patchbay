"use client";

import { Bot, House, MessageSquareText, Plug, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { connectorById } from "@/data/connectors";
import type { Connector } from "@/data/types";
import { useStore, type RoleFilter } from "@/lib/store";
import { LogoStack } from "./Logo";
import { Mark } from "./Mark";

const NAV = [
  { href: "/", label: "Home", Icon: House },
  { href: "/connectors", label: "Connectors", Icon: Plug },
  { href: "/prompts", label: "Prompts", Icon: MessageSquareText },
  { href: "/agents", label: "Agents", Icon: Bot },
  { href: "/trending", label: "Trending", Icon: TrendingUp },
];

const ROLES: { id: RoleFilter; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "student", label: "Student" },
  { id: "dev", label: "Developer" },
  { id: "freelancer", label: "Freelancer" },
  { id: "creator", label: "Creator" },
  { id: "business", label: "Business" },
];

export function Sidebar() {
  const path = usePathname();
  const { role, setRole, run } = useStore();
  const items = run.map(connectorById).filter((c): c is Connector => !!c);

  return (
    <aside className="side">
      <Link href="/" className="brand" aria-label="Patchbay home">
        <Mark />
        <span>Patchbay</span>
      </Link>

      <nav className="nav" aria-label="Sections">
        {NAV.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className="navlink" aria-current={path === href ? "page" : undefined}>
            <Icon size={18} aria-hidden="true" />
            {label}
            {href === "/connectors" && items.length > 0 && <span className="count">{items.length}</span>}
          </Link>
        ))}
      </nav>

      <div className="rolebox">
        <span className="eyebrow">I am a</span>
        <div className="rolelist" role="radiogroup" aria-label="Your role">
          {ROLES.map((r) => (
            <button key={r.id} type="button" role="radio" aria-checked={role === r.id} className="roleitem" data-role={r.id} onClick={() => setRole(r.id)}>
              <i className="roledot" />
              {r.label}
            </button>
          ))}
        </div>
        <label className="roleselect">
          <span className="sr">Your role</span>
          <select value={role} onChange={(e) => setRole(e.target.value as RoleFilter)}>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>Role: {r.label}</option>
            ))}
          </select>
        </label>
      </div>

      <Link href="/connectors" className="stackcard">
        <span className="eyebrow">My stack</span>
        {items.length ? <LogoStack items={items} size={32} max={5} /> : <span className="muted">Nothing connected yet</span>}
        <span className="stacklink">{items.length ? "Open stack" : "Pick connectors"}</span>
      </Link>
    </aside>
  );
}
