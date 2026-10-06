import type { CSSProperties } from "react";
import { intelligence } from "@/content/intelligence";
import { InView } from "@/components/motion/InView";
import { IntroField } from "./IntroField";
import s from "./Intelligence.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function Intro() {
  const { intro, chapters } = intelligence;
  return (
    <InView as="header" className={s.intro}>
      <IntroField />
      <p className={s.kicker} data-settle="">
        {intro.kicker}
      </p>
      <h1 className={s.title} data-settle="" style={i(1)}>
        {intro.title}
      </h1>
      <p className={s.lede} data-settle="" style={i(2)}>
        {intro.lede}
      </p>
      <nav aria-label="The four projects" className={s.progression}>
        <ol>
          {chapters.map((c, k) => (
            <li key={c.id} data-settle="" style={i(3 + k)}>
              <a href={`#${c.id}`} className={s.step}>
                <span className={s.stepNo}>{c.no}</span>
                <span className={s.stepVerb}>{c.verb}</span>
                <span className={s.stepArrow}>{c.step}</span>
                <span className={s.stepProject}>{c.short}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </InView>
  );
}
