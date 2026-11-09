import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Sidebar } from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patchbay",
  description: "A hub for Claude: connect your tools in a few clicks, with prompts, agents, and trending repos.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <StoreProvider>
          <div className="shell">
            <Sidebar />
            <div className="content">
              <SearchBar />
              <main>{children}</main>
              <footer>
                <p>Patchbay is an independent project and isn&apos;t affiliated with Anthropic. Logos belong to their owners and appear only to identify each service. Server addresses come from each vendor&apos;s public docs, and plan notes were checked against public guides in October 2026.</p>
                <p>Connectors can read and act on your accounts. Claude asks before using a tool by default. Keep it that way for anything that sends messages, moves money, or changes live systems.</p>
              </footer>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
