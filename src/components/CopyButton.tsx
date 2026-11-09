"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy", primary = false }: { text: string; label?: string; primary?: boolean }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try {
        setState(document.execCommand("copy") ? "done" : "failed");
      } catch {
        setState("failed");
      }
      ta.remove();
    }
    setTimeout(() => setState("idle"), 1400);
  }

  return (
    <button type="button" className={`btn${primary ? " primary" : " sm"}`} onClick={onClick}>
      {state === "done" ? "Copied" : state === "failed" ? "Select and copy" : label}
    </button>
  );
}
