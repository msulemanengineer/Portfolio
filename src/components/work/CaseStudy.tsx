import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { InView } from "@/components/motion/InView";
import type { SystemSheet } from "@/content/engineering";
import { CaseSystem } from "./CaseSystem";
import s from "./CaseStudy.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

interface CaseStudyProps {
  sys: SystemSheet;
  next: SystemSheet;
}

/** A platform from Sheet 01, opened up. Every fact comes from content/engineering.ts. */
export function CaseStudy({ sys, next }: CaseStudyProps) {
  return (
    <article className={s.sheet} aria-labelledby="case-title">
      <InView as="header" className={s.hero} eager>
        <nav className={s.crumbs} aria-label="Breadcrumb" data-settle="">
          <Link href={`/engineering#${sys.id}`}>← Engineering</Link>
          <span>Case study {sys.no}</span>
        </nav>

        <p className={s.kicker} data-settle="" style={i(1)}>
          {sys.no} — {sys.domain}
        </p>
        <h1 id="case-title" className={s.title} data-settle="" style={i(2)}>
          {sys.name}
        </h1>
        <p className={s.lede} data-settle="" style={i(3)}>
          {sys.summary}
        </p>

        <div className={s.heroRow} data-settle="" style={i(4)}>
          <dl className={s.facts}>
            <div>
              <dt>My role</dt>
              <dd>{sys.roleNote}</dd>
            </div>
            <div>
              <dt>Built at</dt>
              <dd>Endless Invo.</dd>
            </div>
            <div>
              <dt>Users</dt>
              <dd>{sys.actors.map((a) => a.name).join(" · ")}</dd>
            </div>
            <div>
              <dt>Modules</dt>
              <dd>{sys.built.length}</dd>
            </div>
          </dl>
          {sys.url ? (
            <a href={sys.url} target="_blank" rel="noreferrer" className={s.live}>
              Open {sys.host}
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <p className={s.offline}>
              <b>No longer online.</b> The client’s domain has lapsed; the screenshot below is from launch.
            </p>
          )}
        </div>

        <figure className={s.shot} data-settle="" style={i(5)}>
          <span className={s.dimension} aria-hidden="true">
            <i />
            <b>
              {sys.image.width} × {sys.image.height} px
            </b>
          </span>
          <div className={s.browser}>
            <div className={s.browserBar} aria-hidden="true">
              <span />
              <span />
              <span />
              <em>{sys.host}</em>
            </div>
            <div className={s.plot}>
              <Image
                src={sys.image.src}
                alt={sys.image.alt}
                width={sys.image.width}
                height={sys.image.height}
                sizes="(max-width: 1023px) 100vw, 1200px"
                priority
                className={s.img}
              />
            </div>
          </div>
        </figure>
      </InView>

      <InView as="section" className={s.section} aria-labelledby="users-title">
        <header className={s.sectionHead}>
          <p className={s.kicker} data-settle="">
            01 — Who it’s for
          </p>
          <h2 id="users-title" className={s.sectionTitle} data-settle="" style={i(1)}>
            {sys.actors.length} kinds of user
          </h2>
        </header>
        <ul className={s.users}>
          {sys.actors.map((a, k) => (
            <li key={a.name} data-settle="" style={i(k + 2)}>
              <span className={s.userNo}>{String(k + 1).padStart(2, "0")}</span>
              <span className={s.userName}>{a.name}</span>
              <span className={s.userDoes}>{a.does}</span>
              <span className={s.userCount}>{a.modules.length} modules</span>
            </li>
          ))}
        </ul>
      </InView>

      {sys.challenges && sys.challenges.length > 0 && (
        <InView as="section" className={s.section} aria-labelledby="hard-title">
          <header className={s.sectionHead}>
            <p className={s.kicker} data-settle="">
              The hard parts
            </p>
            <h2 id="hard-title" className={s.sectionTitle} data-settle="" style={i(1)}>
              What took the most work
            </h2>
          </header>
          <ol className={s.challenges}>
            {sys.challenges.map((c, k) => (
              <li key={c.title} data-settle="" style={i(k + 2)}>
                <span className={s.chNo}>Problem {String(k + 1).padStart(2, "0")}</span>
                <h3 className={s.chTitle}>{c.title}</h3>
                <p className={s.chBody}>{c.problem}</p>
                {c.proof && (
                  <p className={s.chProof}>
                    <span>How we tested it</span>
                    {c.proof}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </InView>
      )}

      <CaseSystem sys={sys} />

      <InView as="section" className={s.section} aria-labelledby="stack-title">
        <header className={s.sectionHead}>
          <p className={s.kicker} data-settle="">
            04 — Stack & integrations
          </p>
          <h2 id="stack-title" className={s.sectionTitle} data-settle="" style={i(1)}>
            What it runs on
          </h2>
        </header>
        <dl className={s.stack} data-settle="" style={i(2)}>
          <div>
            <dt>Stack</dt>
            <dd>
              {sys.stack.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Integrations</dt>
            <dd>
              {sys.integrations.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>My scope</dt>
            <dd>
              <span>{sys.roleNote}</span>
            </dd>
          </div>
        </dl>
      </InView>

      <InView as="nav" className={s.next} aria-label="Next case study">
        <Link href={`/work/${next.id}`} className={s.nextLink} data-settle="">
          <span className={s.kicker}>Next case study — {next.no}</span>
          <span className={s.nextName}>{next.name}</span>
          <span className={s.nextMeta}>
            {next.domain} · {next.role}
            <svg viewBox="0 0 28 12" aria-hidden="true">
              <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className={s.nextThumb} aria-hidden="true">
            <Image src={next.image.src} alt="" width={480} height={218} sizes="480px" />
          </span>
        </Link>
        <Link href="/engineering#systems-title" className={s.all} data-settle="" style={i(1)}>
          ← All platforms
        </Link>
      </InView>
    </article>
  );
}
