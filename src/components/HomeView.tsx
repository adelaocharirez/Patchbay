"use client";

import { ArrowRight, Bot, MessageSquareText, Plus } from "lucide-react";
import Link from "next/link";
import { agents } from "@/data/agents";
import { connectors, packs } from "@/data/connectors";
import { prompts } from "@/data/prompts";
import { repos } from "@/data/repos";
import type { RoleId } from "@/data/types";
import { connectorById } from "@/data/connectors";
import { formatStars } from "@/lib/format";
import { useStore } from "@/lib/store";
import { HubDiagram } from "./HubDiagram";
import { Logo, LogoStack } from "./Logo";
import { QuickMatch } from "./QuickMatch";
import { RepoAvatar } from "./RepoAvatar";
import { Risk } from "./Risk";
import { SearchResults } from "./SearchResults";

const BLURBS: Record<RoleId, string> = {
  student: "Notes, files, and your schedule in one place.",
  dev: "Code, issues, errors, and live docs.",
  freelancer: "Inbox, invoices, clients, and your calendar.",
  creator: "Designs, files, and notes for your content.",
  business: "Email, chat, deals, and team tasks.",
};

export function HomeView() {
  const { role, query, run, toggle, addMany, setRole } = useStore();
  const searching = query.trim().length > 0;

  const forRole = connectors.filter((c) => role === "all" || c.roles.includes(role));
  const featured = [...forRole.filter((c) => c.featured), ...forRole.filter((c) => !c.featured)].slice(0, 6);
  const promptPicks = prompts.filter((p) => role === "all" || p.roles.includes(role)).slice(0, 4);
  const agentPicks = agents.filter((a) => role === "all" || a.roles.includes(role)).slice(0, 3);
  const topRepos = [...repos].sort((a, b) => b.stars - a.stars).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">Your Claude hub</span>
          <h1>Plug Claude into everything you use</h1>
          <p className="lede">Connect your email, files, and tools in a few clicks. Grab prompts that fill themselves in, drop in ready-made agents, and see what people are starring.</p>
          <QuickMatch />
        </div>
        <div className="hero-art">
          <HubDiagram />
          <p className="fine hero-cap">Select a tool to add it to your stack.</p>
        </div>
      </section>

      {searching ? (
        <SearchResults />
      ) : (
        <>
          <section>
            <div className="sechead-row">
              <h2 className="sechead">Start with your role</h2>
            </div>
            <div className="rolecards">
              {packs.map((p) => {
                const items = p.connectorIds.map(connectorById).filter((c) => !!c);
                const allIn = p.connectorIds.every((id) => run.includes(id));
                return (
                  <article className="rolecard" data-role={p.role} key={p.role}>
                    <LogoStack items={items.map((c) => ({ id: c!.id, name: c!.name }))} size={38} max={4} />
                    <h3>{p.name}</h3>
                    <p>{BLURBS[p.role]}</p>
                    <div className="row">
                      <button type="button" className={`btn sm${allIn ? "" : " cta"}`} onClick={() => addMany(p.connectorIds)} disabled={allIn}>
                        {allIn ? "In your stack" : `Add ${items.length} tools`}
                      </button>
                      <button type="button" className="btn sm ghost" onClick={() => setRole(p.role)}>Filter to this</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section>
            <div className="sechead-row">
              <h2 className="sechead">Most useful connectors</h2>
              <Link href="/connectors" className="more">All connectors <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="featgrid">
              {featured.map((c) => {
                const on = run.includes(c.id);
                return (
                  <article className="feat" key={c.id}>
                    <Logo id={c.id} name={c.name} size={56} />
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                    <Risk level={c.risk} />
                    <button type="button" className={`btn sm${on ? "" : " cta"}`} onClick={() => toggle(c.id)}>
                      {on ? "In your stack" : <><Plus size={15} aria-hidden="true" /> Add to stack</>}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="twocol">
            <section>
              <div className="sechead-row">
                <h2 className="sechead">Prompts to try</h2>
                <Link href="/prompts" className="more">All prompts <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
              <div className="rlist">
                {promptPicks.map((p) => {
                  const need = p.needs ? connectorById(p.needs) : undefined;
                  return (
                    <Link key={p.id} href="/prompts" className="rrow">
                      {need ? <Logo id={need.id} name={need.name} size={36} /> : <span className="logo spark small"><MessageSquareText size={16} aria-hidden="true" /></span>}
                      <span className="rmain"><strong>{p.title}</strong><span className="fine">{need ? `Uses ${need.name}` : "Works right away"}</span></span>
                    </Link>
                  );
                })}
              </div>
            </section>
            <section>
              <div className="sechead-row">
                <h2 className="sechead">What people are starring</h2>
                <Link href="/trending" className="more">Full board <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
              <div className="rlist">
                {topRepos.map((r) => (
                  <a key={`${r.owner}/${r.name}`} href={`https://github.com/${r.owner}/${r.name}`} target="_blank" rel="noopener" className="rrow">
                    <RepoAvatar owner={r.owner} size={36} />
                    <span className="rmain"><strong>{r.name}</strong><span className="fine">{r.owner}</span></span>
                    <span className="num sm">{r.approx ? "~" : ""}{formatStars(r.stars)}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>

          <section>
            <div className="sechead-row">
              <h2 className="sechead">Agents to copy</h2>
              <Link href="/agents" className="more">All agents <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="agentstrip">
              {agentPicks.map((a) => (
                <Link key={a.id} href="/agents" className="agentchip">
                  <span className={`logo agent small ${a.type === "subagent" ? "code" : "proj"}`}><Bot size={16} aria-hidden="true" /></span>
                  <span className="rmain"><strong>{a.title}</strong><span className="fine">{a.description}</span></span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
