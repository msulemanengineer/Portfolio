import Link from "next/link";
import type { CSSProperties } from "react";
import { InView } from "@/components/motion/InView";
import { engineering } from "@/content/engineering";
import { identity } from "@/content/identity";
import { ProjectExplorer } from "./ProjectExplorer";
import { RoleTimeline } from "./RoleTimeline";
import { SystemField } from "./SystemField";
import s from "./Engineering.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const Arrow = () => (
  <svg viewBox="0 0 28 12" aria-hidden="true">
    <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/** A dark stage like the Origin — but the hero is a live system, not a name. */
function Hero() {
  const { intro, cta } = engineering;
  return (
    <header className={s.hero}>
      <div className={s.glow} aria-hidden="true" />
      <div className={s.heroText}>
        <p className={s.kicker} style={d(100)}>
          <span className={s.rule} /> {intro.kicker}
        </p>
        <h1 className={s.title}>
          <span className={s.line}>
            <span style={d(200)}>Systems</span>
          </span>
          <span className={s.line}>
            <span style={d(320)}>that ship.</span>
          </span>
        </h1>
        <p className={s.lede} style={d(350)}>
          {intro.lede}
        </p>
        <div className={s.ctas} style={d(450)}>
          <a href="#platforms" className={s.primary}>
            See the platforms
            <Arrow />
          </a>
          <a href={cta.resumeHref} target="_blank" rel="noreferrer" download="" className={s.secondary}>
            {cta.resume} ↓
          </a>
        </div>
      </div>

      <figure className={s.heroFigure} style={d(400)}>
        <SystemField />
        <figcaption>Fig. 1 — the shape all three platforms share. Live, simulated traffic; hover a part.</figcaption>
      </figure>

      <p className={s.readout} style={d(1000)} aria-hidden="true">
        {intro.readout}
      </p>
    </header>
  );
}

function Platforms() {
  return (
    <section id="platforms" className={s.section} aria-labelledby="platforms-title">
      <InView className={s.head}>
        <p className={s.kicker} data-settle="">
          01 — Platforms
        </p>
        <h2 id="platforms-title" className={s.sectionTitle} data-settle="" style={i(1)}>
          Three in production.
        </h2>
      </InView>
      <InView threshold={0.1}>
        <ProjectExplorer systems={engineering.systems} />
      </InView>
    </section>
  );
}

function Record() {
  return (
    <section className={s.section} aria-labelledby="record-title">
      <InView className={s.head}>
        <p className={s.kicker} data-settle="">
          02 — Record
        </p>
        <h2 id="record-title" className={s.sectionTitle} data-settle="" style={i(1)}>
          Endless Invo., Lahore.
        </h2>
      </InView>
      <InView threshold={0.25}>
        <RoleTimeline />
      </InView>
    </section>
  );
}

function Stack() {
  const groups = engineering.toolkit.filter((t) => t.area !== "Practice");
  return (
    <section className={s.section} aria-labelledby="stack-title">
      <InView className={s.head}>
        <p className={s.kicker} data-settle="">
          03 — Stack
        </p>
        <h2 id="stack-title" className={s.sectionTitle} data-settle="" style={i(1)}>
          What I build with.
        </h2>
      </InView>
      <InView as="dl" className={s.stack}>
        {groups.map((g, k) => (
          <div key={g.area} data-settle="" style={i(k)}>
            <dt>{g.area}</dt>
            <dd>
              {g.items.map((it) => (
                <span key={it}>{it}</span>
              ))}
            </dd>
          </div>
        ))}
      </InView>
    </section>
  );
}

function Next() {
  const { cta } = engineering;
  return (
    <InView as="section" className={s.next}>
      <h2 className={s.nextTitle} data-settle="">
        {cta.short}
      </h2>
      <div className={s.ctas} data-settle="" style={i(1)}>
        <Link href="/intelligence" className={s.primary}>
          {cta.primary}
          <Arrow />
        </Link>
        <a href={`mailto:${identity.email}`} className={s.secondary}>
          Email me
        </a>
      </div>
    </InView>
  );
}

/** Sheet 01 — Written. */
export function EngineeringSheet() {
  return (
    <div className={s.sheet}>
      <Hero />
      <Platforms />
      <Record />
      <Stack />
      <Next />
    </div>
  );
}
