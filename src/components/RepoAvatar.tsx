"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

/** The owner's GitHub picture, with a letter tile underneath that shows when the picture can't load. */
export function RepoAvatar({ owner, size = 44 }: { owner: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="avatar" style={{ width: size, height: size }}>
      <span className="avatar-fallback" aria-hidden="true">{owner.charAt(0).toUpperCase()}</span>
      {!failed && <img src={`https://github.com/${owner}.png?size=${size * 2}`} alt="" width={size} height={size} loading="lazy" onError={() => setFailed(true)} />}
    </span>
  );
}
