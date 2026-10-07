import type { CSSProperties } from "react";
import { identity } from "@/content/identity";

/**
 * The start loader: shown once per session, drawn by CSS alone so it paints
 * before any JavaScript. The name rises letter by letter, a red rule draws
 * across while a counter runs to 100, then the curtain lifts.
 * Visibility is decided by the boot script (html[data-loader="on"]).
 */
export function StartLoader() {
  const [first, last] = identity.name.toUpperCase().split(" ");
  let k = 0;
  const word = (w: string) =>
    w.split("").map((ch) => (
      <span key={k} className="boot-ch" style={{ "--k": k++ } as CSSProperties}>
        {ch}
      </span>
    ));

  return (
    <div className="boot" aria-hidden="true">
      <div className="boot-inner">
        <p className="boot-kicker">
          <span className="boot-dot" /> Loading the work of
        </p>
        <p className="boot-name">
          <span className="boot-word">{word(first)}</span>
          <span className="boot-word">{word(last)}</span>
        </p>
        <div className="boot-bar">
          <span />
        </div>
        <div className="boot-meta">
          <span>AI/ML Engineer · Lahore</span>
          <span className="boot-count" />
        </div>
      </div>
    </div>
  );
}
