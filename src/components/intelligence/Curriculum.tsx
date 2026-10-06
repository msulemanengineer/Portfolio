import type { CSSProperties } from "react";
import { intelligence } from "@/content/intelligence";
import { InView } from "@/components/motion/InView";
import s from "./Intelligence.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** The theory behind the four projects, each credential verifiable. */
export function Curriculum() {
  const { curriculum, toolkit } = intelligence;
  return (
    <section className={s.foundations} aria-labelledby="foundations-title">
      <InView className={s.foundHead}>
        <p className={s.kicker} data-settle="">
          05 — Foundations
        </p>
        <h2 id="foundations-title" className={s.sectionTitle} data-settle="" style={i(1)}>
          {curriculum.title}
        </h2>
        <p className={s.sectionLede} data-settle="" style={i(2)}>
          {curriculum.lede}
        </p>
      </InView>

      <InView as="ol" className={s.certs}>
        {curriculum.items.map((c, k) => (
          <li key={c.name} className={s.cert} data-settle="" style={i(k)}>
            <div className={s.certMain}>
              <p className={s.certDate}>{c.date}</p>
              <div>
                <p className={s.certName}>{c.name}</p>
                <p className={s.certIssuer}>{c.issuer}</p>
              </div>
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className={s.verify}
                aria-label={`Verify ${c.name}, credential ${c.credential}`}
              >
                Verify <span aria-hidden="true">↗</span>
              </a>
            </div>
            {c.courses.length > 0 && (
              <ol className={s.courses}>
                {c.courses.map((course) => (
                  <li key={course.name}>
                    <span className={s.certDate}>{course.date}</span>
                    <span>{course.name}</span>
                    <a
                      href={course.href}
                      target="_blank"
                      rel="noreferrer"
                      className={s.verify}
                      aria-label={`Verify ${course.name}`}
                    >
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </InView>

      <InView as="dl" className={s.toolkit}>
        {toolkit.map((t, k) => (
          <div key={t.area} className={s.toolRow} data-settle="" style={i(k)}>
            <dt>{t.area}</dt>
            <dd>{t.items.join(" · ")}</dd>
          </div>
        ))}
      </InView>
    </section>
  );
}
