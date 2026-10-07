"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { identity } from "@/content/identity";
import { ParticleName } from "./ParticleName";
import s from "./Origin.module.css";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Sheet 00 — Origin: the name, reconstructed from noise. */
export function Origin() {
  const rootRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [first, last] = identity.name.split(" ");

  return (
    <section ref={rootRef} className={s.root} aria-labelledby="v3-name">
      <div className={s.glow} aria-hidden="true" />
      <ParticleName rootRef={rootRef} nameRef={nameRef} errorRef={errorRef} countRef={countRef} />

      <div className={s.stack}>
        <p className={s.kicker} style={d(250)}>
          <span className={s.rule} /> AI/ML Engineer · Lahore
        </p>

        {/* Real text, transparent: the particles are drawn exactly over it. */}
        <h1 ref={nameRef} id="v3-name" className={s.name}>
          <span className="sr-only">{identity.name}</span>
          <span className={s.oneLine} data-name-line={identity.name.toUpperCase()} aria-hidden="true">
            <span data-baseline className={s.baseline} />
            {identity.name}
          </span>
          <span className={s.twoLines} aria-hidden="true">
            {[first, last].map((w) => (
              <span key={w} className={s.wordLine} data-name-line={w.toUpperCase()}>
                <span data-baseline className={s.baseline} />
                {w}
              </span>
            ))}
          </span>
        </h1>

        <div className={s.below}>
          <p className={s.thesis} style={d(400)}>
            I build software that follows rules — <em>and software that learns them.</em>
          </p>
          <div className={s.ctas} style={d(550)}>
            <Link href="/intelligence" className={s.primary}>
              AI &amp; Machine Learning
              <svg viewBox="0 0 28 12" aria-hidden="true">
                <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </Link>
            <Link href="/engineering" className={s.secondary}>
              Engineering background
              <svg viewBox="0 0 28 12" aria-hidden="true">
                <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <p className={s.readout} style={d(700)} aria-hidden="true">
        reconstruction error <span ref={errorRef}>—</span> · <span ref={countRef}>—</span> points
      </p>
      <p className={s.hint} style={d(800)} aria-hidden="true">
        Move through the name. Click to scatter it.
      </p>
    </section>
  );
}
