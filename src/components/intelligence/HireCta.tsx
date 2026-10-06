import Link from "next/link";
import type { CSSProperties } from "react";
import { identity } from "@/content/identity";
import { intelligence } from "@/content/intelligence";
import { InView } from "@/components/motion/InView";
import s from "./Intelligence.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** The page's job, stated at its end: make the next step obvious. */
export function HireCta() {
  const { cta } = intelligence;
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
        <a href={identity.resumes.ai} target="_blank" rel="noreferrer" download="" className={s.primary}>
          {cta.primary}
          <span aria-hidden="true">↓</span>
        </a>
        <a href={`mailto:${identity.email}`} className={s.secondary}>
          {identity.email}
        </a>
      </div>
      <p className={s.ctaLinks} data-settle="" style={i(4)}>
        <a href={identity.links.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a href={identity.links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <Link href="/engineering">{cta.secondary} →</Link>
      </p>
    </InView>
  );
}
