import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { InView } from "@/components/motion/InView";
import { lab } from "@/content/lab";
import { DescentLab } from "./DescentLab";
import { NeighboursLab } from "./NeighboursLab";
import { SentimentLab } from "./SentimentLab";
import s from "./Lab.module.css";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

interface PlateProps {
  id: string;
  no: string;
  title: string;
  idea: string;
  note: string;
  repo?: string;
  children: ReactNode;
}

function Plate({ id, no, title, idea, note, repo, children }: PlateProps) {
  return (
    <section id={id} className={s.plate} aria-labelledby={`${id}-title`}>
      <InView className={s.plateHead}>
        <p className={s.plateNo} data-settle="">
          Exp. {no}
        </p>
        <h2 id={`${id}-title`} className={s.plateTitle} data-settle="" style={i(1)}>
          {title}
        </h2>
        <p className={s.plateIdea} data-settle="" style={i(2)}>
          {idea}
        </p>
      </InView>
      {children}
      <p className={s.plateNote}>
        {note}
        {repo && (
          <>
            {" "}
            <a href={repo} target="_blank" rel="noreferrer">
              The real project ↗
            </a>
          </>
        )}
      </p>
    </section>
  );
}

/** Sheet 03 — Scratch. */
export function LabSheet() {
  const { intro, sentiment, neighbours, descent } = lab;
  return (
    <div className={s.sheet}>
      <InView as="header" className={s.intro} eager>
        <p className={s.kicker} data-settle="">
          {intro.kicker}
        </p>
        <h1 className={s.title} data-settle="" style={i(1)}>
          {intro.title}
        </h1>
        <p className={s.lede} data-settle="" style={i(2)}>
          {intro.lede}
        </p>
        <nav className={s.index} aria-label="Experiments" data-settle="" style={i(3)}>
          {[sentiment, neighbours, descent].map((e) => (
            <a key={e.no} href={`#exp-${e.no}`}>
              <span>Exp. {e.no}</span>
              {e.title}
            </a>
          ))}
        </nav>
      </InView>

      <Plate id="exp-01" no={sentiment.no} title={sentiment.title} idea={sentiment.idea} note={sentiment.note} repo={sentiment.repo}>
        <SentimentLab />
      </Plate>
      <Plate id="exp-02" no={neighbours.no} title={neighbours.title} idea={neighbours.idea} note={neighbours.note} repo={neighbours.repo}>
        <NeighboursLab />
      </Plate>
      <Plate id="exp-03" no={descent.no} title={descent.title} idea={descent.idea} note={descent.note}>
        <DescentLab />
      </Plate>

      <InView as="section" className={s.outro}>
        <p className={s.kicker} data-settle="">
          More to come
        </p>
        <p className={s.outroText} data-settle="" style={i(1)}>
          The lab grows as I learn. The full projects behind these experiments are on the AI &amp; ML sheet.
        </p>
        <Link href="/intelligence" className={s.outroLink} data-settle="" style={i(2)}>
          See the AI &amp; ML work →
        </Link>
      </InView>
    </div>
  );
}
