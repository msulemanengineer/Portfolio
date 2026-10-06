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

function Intro() {
  const { intro } = engineering;
  return (
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
      <div className={s.introFigure} aria-hidden="false">
        <SystemField />
        <p className={s.introCaption}>The shape the platforms below share — hover a part.</p>
      </div>
    </InView>
  );
}

function Record() {
  return (
    <section className={s.record} aria-labelledby="record-title">
      <InView className={s.sectionHead}>
        <p className={s.kicker} data-settle="">
          01 — The record
        </p>
        <h2 id="record-title" className={s.sectionTitle} data-settle="" style={i(1)}>
          Endless Invo., Lahore
        </h2>
        <p className={s.sectionLede} data-settle="" style={i(2)}>
          Drawn to scale. Pick a role to read it.
        </p>
      </InView>
      <InView threshold={0.25}>
        <RoleTimeline />
      </InView>
    </section>
  );
}

function Systems() {
  return (
    <section className={s.systems} aria-labelledby="systems-title">
      <InView className={s.sectionHead}>
        <p className={s.kicker} data-settle="">
          02 — The systems
        </p>
        <h2 id="systems-title" className={s.sectionTitle} data-settle="" style={i(1)}>
          Three platforms, in production
        </h2>
        <p className={s.sectionLede} data-settle="" style={i(2)}>
          Client work at Endless Invo. Switch platforms, then pick a user to trace their path.
        </p>
      </InView>
      <InView threshold={0.1}>
        <ProjectExplorer systems={engineering.systems} />
      </InView>
    </section>
  );
}

function Capabilities() {
  const { toolkit, education, certifications } = engineering;
  return (
    <section className={s.capabilities} aria-labelledby="toolkit-title">
      <InView className={s.sectionHead}>
        <p className={s.kicker} data-settle="">
          03 — The toolkit
        </p>
        <h2 id="toolkit-title" className={s.sectionTitle} data-settle="" style={i(1)}>
          What I build with
        </h2>
      </InView>
      <InView as="dl" className={s.toolkit}>
        {toolkit.map((t, k) => (
          <div key={t.area} className={s.toolRow} data-settle="" style={i(k)}>
            <dt>{t.area}</dt>
            <dd>{t.items.join(" · ")}</dd>
          </div>
        ))}
      </InView>
      <InView className={s.learning}>
        <div data-settle="">
          <p className={s.blockLabel}>Education</p>
          <p className={s.eduDegree}>{education.degree}</p>
          <p className={s.eduSchool}>{education.school}</p>
          <p className={s.eduFocus}>{education.focus}</p>
        </div>
        <div data-settle="" style={i(1)}>
          <p className={s.blockLabel}>Certifications</p>
          <ul className={s.certs}>
            {certifications.map((c) => (
              <li key={c.name}>
                <span className={s.certDate}>{c.date}</span>
                <span>
                  {c.name} <em>{c.issuer}</em>
                </span>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer" aria-label={`Verify ${c.name}`}>
                    Verify ↗
                  </a>
                ) : (
                  <span />
                )}
              </li>
            ))}
          </ul>
        </div>
      </InView>
    </section>
  );
}

function Cta() {
  const { cta } = engineering;
  return (
    <InView as="section" className={s.cta}>
      <p className={s.kicker} data-settle="">
        {cta.kicker}
      </p>
      <h2 className={s.ctaTitle} data-settle="" style={i(1)}>
        {cta.title}
      </h2>
      <p className={s.ctaBody} data-settle="" style={i(2)}>
        {cta.body}
      </p>
      <div className={s.ctaActions} data-settle="" style={i(3)}>
        <Link href="/intelligence" className={s.primary}>
          {cta.primary}
          <svg viewBox="0 0 28 12" aria-hidden="true">
            <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </Link>
        <a href={cta.resumeHref} target="_blank" rel="noreferrer" download="" className={s.secondary}>
          {cta.resume} ↓
        </a>
        <a href={`mailto:${identity.email}`} className={s.tertiary}>
          {identity.email}
        </a>
      </div>
    </InView>
  );
}

/** Sheet 01 — Written. */
export function EngineeringSheet() {
  return (
    <div className={s.sheet}>
      <Intro />
      <Record />
      <Systems />
      <Capabilities />
      <Cta />
    </div>
  );
}
