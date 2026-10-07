import type { CSSProperties, ReactNode } from "react";
import type { Chapter } from "@/content/intelligence";
import { InView } from "@/components/motion/InView";
import s from "./Intelligence.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

interface ChapterSectionProps {
  chapter: Chapter;
  figure: ReactNode;
  caption: string;
}

/** One project, read as a chapter: question → idea → how → its honest limit. */
export function ChapterSection({ chapter: c, figure, caption }: ChapterSectionProps) {
  return (
    <section id={c.id} className={s.chapter} aria-labelledby={`${c.id}-title`}>
      <InView className={s.chapterHead}>
        <p className={s.chapterNo} data-settle="">
          <span>{c.no}</span> {c.verb}
          <span className={s.chapterStep}>{c.step}</span>
        </p>
        <h2 id={`${c.id}-title`} className={s.chapterTitle} data-settle="" style={i(1)}>
          {c.title}
        </h2>
        <p className={s.question} data-settle="" style={i(2)}>
          {c.question}
        </p>
      </InView>

      <div className={s.chapterBody}>
        <InView className={s.text}>
          <p className={s.idea} data-settle="">
            {c.idea}
          </p>

          <div className={s.block} data-settle="" style={i(1)}>
            <h3>How it works</h3>
            <ol className={s.how}>
              {c.how.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
          </div>

          <p className={s.limitLine} data-settle="" style={i(2)}>
            <span>Limit</span>
            {c.limits[0]}
          </p>

          <div className={s.meta} data-settle="" style={i(3)}>
            <p className={s.stack}>{c.stack.join(" · ")}</p>
            <a href={c.repo} target="_blank" rel="noreferrer" className={s.repo}>
              Read the code on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </InView>

        <InView as="figure" className={s.figure} threshold={0.12}>
          <div data-settle="">{figure}</div>
          <figcaption className={s.figcaption}>{caption}</figcaption>
        </InView>
      </div>
    </section>
  );
}
