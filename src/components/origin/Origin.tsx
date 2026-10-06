"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { origin, type ForkSide } from "@/content/origin";
import { identity } from "@/content/identity";
import { OriginEngine, type Side } from "@/lib/origin/engine";
import { originCssVars } from "@/lib/origin/layout";
import { EXIT_KEY, T, reveal } from "@/lib/origin/timeline";
import { NameMark } from "./NameMark";
import s from "./Origin.module.css";

export function Origin() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const lossRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<OriginEngine | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !canvasRef.current || !nameRef.current || !handleRef.current) return;
    const html = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let returnFrom: Side | null = null;
    try {
      const stored = sessionStorage.getItem(EXIT_KEY);
      if (stored === "written" || stored === "learned") returnFrom = stored;
      sessionStorage.removeItem(EXIT_KEY);
    } catch {}

    let engine: OriginEngine;
    try {
      engine = new OriginEngine({
        root,
        canvas: canvasRef.current,
        name: nameRef.current,
        handle: handleRef.current,
        readouts: { loss: lossRef.current, hint: hintRef.current },
        playIntro: html.dataset.intro === "pending" || html.dataset.intro === "play",
        returnFrom,
        reducedMotion,
        hintAdded: origin.caption.hintAdded,
      });
    } catch {
      html.dataset.intro = "done";
      return;
    }
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const go = (side: ForkSide, href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const engine = engineRef.current;
    if (!engine) return;
    e.preventDefault();
    engine.exit(side).then(() => router.push(href));
  };

  const lean = (side: ForkSide | null) => () => engineRef.current?.setPreview(side);

  return (
    <section
      ref={rootRef}
      className={s.root}
      style={originCssVars}
      aria-labelledby="origin-name"
    >
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />

      {/* Everything drawn by hand lives in this layer, clipped at the boundary. */}
      <div className={s.written}>
        <p className={s.statementWritten} data-reveal style={reveal(T.written)}>
          <span className={s.knock}>{origin.written.statement}</span>
        </p>
        <NameMark ref={nameRef} name={identity.name} className={s.name} />
      </div>

      <p className={s.statementLearned} data-reveal style={reveal(T.learned, "fade", 900)}>
        <span className={s.knock}>{origin.learned.statement}</span>
      </p>

      <p className={s.caption} data-reveal style={reveal(T.learned + 200)}>
        <span className={s.knock}>
          <span ref={hintRef}>
            <span className={s.hintPointer}>{origin.caption.hintPointer}</span>
            <span className={s.hintTouch}>{origin.caption.hintTouch}</span>
          </span>
          <span className={s.sep}>·</span>
          mse <span ref={lossRef} className={s.num}>—</span>
        </span>
      </p>

      <div className={s.axis} aria-hidden="true" data-reveal style={reveal(T.axis, "draw-x", 700)} />

      <div
        ref={handleRef}
        className={s.boundary}
        data-handle
        role="slider"
        tabIndex={0}
        aria-label="Balance between written rules and learned models"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={56}
      >
        <span className={s.boundaryLine} data-reveal style={reveal(T.boundary - 150, "appear", 300)} />
        <span className={s.grip} data-reveal style={reveal(T.forks, "appear", 500)}>
          <span className={s.gripMark} />
        </span>
      </div>

      <nav className={s.forks} aria-label="Choose a world">
        {origin.forks.map((f, i) => (
          <div
            key={f.side}
            className={f.side === "written" ? s.forkWritten : s.forkLearned}
            data-reveal
            style={reveal(T.forks + i * 120)}
          >
            <span className={s.forkKicker} aria-hidden="true">
              {f.no} — {f.kicker}
            </span>
            <Link
              href={f.href}
              className={s.cta}
              onClick={go(f.side, f.href)}
              onPointerEnter={lean(f.side)}
              onPointerLeave={lean(null)}
              onFocus={lean(f.side)}
              onBlur={lean(null)}
            >
              <span className={s.ctaText}>{f.cta}</span>
              <svg className={s.arrow} viewBox="0 0 28 12" aria-hidden="true">
                <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </Link>
          </div>
        ))}
      </nav>

      <p className="sr-only">{origin.description}</p>
    </section>
  );
}
