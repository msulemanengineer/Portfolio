import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import type { CSSProperties } from "react";
import s from "./preview.module.css";

/** Temporary: compare type systems for Sheet 02. Not linked; not indexed. */
export const metadata: Metadata = { title: "Type preview", robots: { index: false, follow: false } };

const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--f-news" });
const geist = Geist({ subsets: ["latin"], variable: "--f-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--f-geist-mono" });

interface Option {
  id: string;
  name: string;
  note: string;
  vars: CSSProperties;
}

const options: Option[] = [
  {
    id: "A",
    name: "Current — Instrument Serif Italic + Instrument Sans + Plex Mono",
    note: "Literary and expressive. The italic carries the ‘learned’ voice from the homepage.",
    vars: {
      "--display": "var(--font-instrument-serif)",
      "--display-style": "italic",
      "--display-weight": 400,
      "--display-case": "none",
      "--display-stretch": "100%",
      "--display-track": "-0.01em",
      "--body": "var(--font-instrument-sans)",
      "--mono": "var(--font-plex-mono)",
    } as CSSProperties,
  },
  {
    id: "B",
    name: "Engineered — Instrument Sans Condensed + Instrument Sans + Plex Mono",
    note: "No serif at all. Headlines use the same condensed sans as your name on the homepage — consistent, confident, technical.",
    vars: {
      "--display": "var(--font-instrument-sans)",
      "--display-style": "normal",
      "--display-weight": 600,
      "--display-case": "uppercase",
      "--display-stretch": "75%",
      "--display-track": "-0.005em",
      "--body": "var(--font-instrument-sans)",
      "--mono": "var(--font-plex-mono)",
    } as CSSProperties,
  },
  {
    id: "C",
    name: "Editorial — Newsreader + Instrument Sans + Plex Mono",
    note: "A calmer, more readable serif — upright, less decorative than the current italic. Feels like a research journal.",
    vars: {
      "--display": "var(--f-news)",
      "--display-style": "normal",
      "--display-weight": 400,
      "--display-case": "none",
      "--display-stretch": "100%",
      "--display-track": "-0.02em",
      "--body": "var(--font-instrument-sans)",
      "--mono": "var(--font-plex-mono)",
    } as CSSProperties,
  },
  {
    id: "D",
    name: "Technical — Geist + Geist Mono",
    note: "One modern sans family throughout. Clean and product-like; the look of current AI tooling.",
    vars: {
      "--display": "var(--f-geist)",
      "--display-style": "normal",
      "--display-weight": 500,
      "--display-case": "none",
      "--display-stretch": "100%",
      "--display-track": "-0.045em",
      "--body": "var(--f-geist)",
      "--mono": "var(--f-geist-mono)",
    } as CSSProperties,
  },
];

export default function TypePreview() {
  return (
    <div className={`${s.root} ${newsreader.variable} ${geist.variable} ${geistMono.variable}`}>
      <p className={s.intro}>Type preview for Sheet 02 — same content, four type systems. Tell me a letter.</p>
      {options.map((o) => (
        <section key={o.id} className={s.option} style={o.vars}>
          <p className={s.optionName}>
            <span>{o.id}</span> {o.name}
          </p>
          <p className={s.optionNote}>{o.note}</p>

          <div className={s.sample}>
            <p className={s.kicker}>Sheet 02 — Learned</p>
            <h1 className={s.title}>Teaching software to read.</h1>
            <p className={s.lede}>
              Four projects, one progression: turn text into numbers, numbers into meaning, and meaning into answers you can check.
            </p>
          </div>

          <div className={s.chapter}>
            <div>
              <p className={s.kicker}>
                <span className={s.red}>02</span> Weigh · vectors → decisions
              </p>
              <h2 className={s.chapterTitle}>Customer Review Sentiment Analysis</h2>
              <p className={s.question}>Is this review positive or negative — and which words decided it?</p>
              <p className={s.body}>
                A linear model gives every word a weight. The prediction is their sum, so every decision can be read back, word by word.
              </p>
            </div>
            <dl className={s.stats}>
              <div>
                <dt>Accuracy</dt>
                <dd>82.1%</dd>
              </div>
              <div>
                <dt>ROC-AUC</dt>
                <dd>0.895</dd>
              </div>
            </dl>
          </div>
        </section>
      ))}
    </div>
  );
}
