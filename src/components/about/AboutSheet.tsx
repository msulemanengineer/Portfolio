import Link from "next/link";
import type { CSSProperties } from "react";
import { InView } from "@/components/motion/InView";
import { about } from "@/content/about";
import { identity } from "@/content/identity";
import { Journey } from "./Journey";
import { ThinkingModel } from "./ThinkingModel";
import s from "./About.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Sheet 04 — Margin. */
export function AboutSheet() {
  const { intro, principles } = about;
  return (
    <div className={s.sheet}>
      <InView as="header" className={s.intro}>
        <div className={s.introText}>
          <p className={s.kicker} data-settle="">
            {intro.kicker}
          </p>
          <h1 className={s.title} data-settle="" style={i(1)}>
            {intro.title}
          </h1>
          <p className={s.lede} data-settle="" style={i(2)}>
            {intro.lede}
          </p>
          <dl className={s.facts} data-settle="" style={i(3)}>
            {intro.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={s.monoWrap} data-settle="" style={i(2)}>
          <ThinkingModel />
        </div>
      </InView>

      <section className={s.section} aria-labelledby="journey-title">
        <InView className={s.sectionHead}>
          <p className={s.kicker} data-settle="">
            01 — The journey
          </p>
          <h2 id="journey-title" className={s.sectionTitle} data-settle="" style={i(1)}>
            How I got here
          </h2>
        </InView>
        <Journey />
      </section>

      <section className={s.section} aria-labelledby="principles-title">
        <InView className={s.sectionHead}>
          <p className={s.kicker} data-settle="">
            02 — How I work
          </p>
          <h2 id="principles-title" className={s.sectionTitle} data-settle="" style={i(1)}>
            Three habits
          </h2>
        </InView>
        <InView as="ol" className={s.principles}>
          {principles.map((p, k) => (
            <li key={p.title} data-settle="" style={i(k)}>
              <span className={s.pNo}>{String(k + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </InView>
      </section>

      <InView as="section" className={s.cta}>
        <p className={s.kicker} data-settle="">
          What’s next
        </p>
        <h2 className={s.ctaTitle} data-settle="" style={i(1)}>
          The next chapter is an AI engineering team.
        </h2>
        <div className={s.ctaActions} data-settle="" style={i(2)}>
          <Link href="/contact" className={s.primary}>
            Get in touch
            <svg viewBox="0 0 28 12" aria-hidden="true">
              <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </Link>
          <a href={identity.resumes.ai} target="_blank" rel="noreferrer" download="" className={s.secondary}>
            AI/ML résumé ↓
          </a>
        </div>
      </InView>
    </div>
  );
}
