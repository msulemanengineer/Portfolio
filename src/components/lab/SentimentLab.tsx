"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { lab } from "@/content/lab";
import s from "./Lab.module.css";

const W = new Map(lab.sentiment.weights);
const MAX = Math.max(...lab.sentiment.weights.map(([, w]) => Math.abs(w)));

interface Token {
  text: string;
  weight: number | null;
}

/** Same preprocessing as the project: lowercase, strip punctuation, unigrams + the "not good" bigram. */
function score(input: string) {
  const words = input.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  const tokens: Token[] = [];
  for (let i = 0; i < words.length; i++) {
    const pair = `${words[i]} ${words[i + 1] ?? ""}`;
    if (W.has(pair)) {
      tokens.push({ text: words[i], weight: W.get(words[i]) ?? null });
      tokens.push({ text: pair, weight: W.get(pair)! });
      continue;
    }
    tokens.push({ text: words[i], weight: W.get(words[i]) ?? null });
  }
  const total = tokens.reduce((sum, t) => sum + (t.weight ?? 0), 0);
  const p = 1 / (1 + Math.exp(-total));
  return { tokens, total, p, known: tokens.filter((t) => t.weight !== null) };
}

export function SentimentLab() {
  const [text, setText] = useState<string>(lab.sentiment.examples[0]);
  const r = useMemo(() => score(text), [text]);
  const verdict = r.known.length === 0 ? "No known words" : r.p >= 0.5 ? "Positive" : "Negative";

  return (
    <div className={s.exp}>
      <div className={s.controls}>
        <label className={s.fieldLabel} htmlFor="review">
          A review
        </label>
        <textarea
          id="review"
          className={s.input}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
        <div className={s.chips}>
          {lab.sentiment.examples.map((ex) => (
            <button key={ex} type="button" onClick={() => setText(ex)} aria-pressed={text === ex}>
              {ex}
            </button>
          ))}
        </div>

        <p className={s.tokens} aria-label="Tokens and their weights">
          {r.tokens.map((t, i) => (
            <span
              key={i + t.text}
              data-sign={t.weight === null ? "none" : t.weight > 0 ? "pos" : "neg"}
              title={t.weight === null ? "not in the top 20" : t.weight.toFixed(2)}
            >
              {t.text}
              {t.weight !== null && <em>{t.weight > 0 ? "+" : "−"}{Math.abs(t.weight).toFixed(1)}</em>}
            </span>
          ))}
        </p>
      </div>

      <div className={s.stage} aria-live="polite">
        <p className={s.readKicker}>Decision</p>
        <p className={s.verdict} data-sign={verdict === "Positive" ? "pos" : verdict === "Negative" ? "neg" : "none"}>
          {verdict}
        </p>

        <div className={s.meterWrap}>
          <div className={s.meter}>
            <span className={s.meterMid} />
            <span className={s.meterNeedle} style={{ "--p": r.known.length ? r.p : 0.5 } as CSSProperties} />
          </div>
          <div className={s.meterScale}>
            <span>negative</span>
            <span>
              p(positive) = <b>{r.known.length ? r.p.toFixed(2) : "—"}</b>
            </span>
            <span>positive</span>
          </div>
        </div>

        <ol className={s.contribs}>
          {r.known.length === 0 && <li className={s.empty}>None of these words are among the model’s 20 strongest.</li>}
          {r.known.map((t, i) => (
            <li key={i + t.text}>
              <span className={s.cWord}>{t.text}</span>
              <span className={s.cTrack}>
                <span
                  className={s.cBar}
                  data-sign={t.weight! > 0 ? "pos" : "neg"}
                  style={{ "--w": Math.abs(t.weight!) / MAX } as CSSProperties}
                />
              </span>
              <span className={s.cVal}>{t.weight! > 0 ? "+" : "−"}{Math.abs(t.weight!).toFixed(2)}</span>
            </li>
          ))}
        </ol>
        <p className={s.sum}>
          Σ weights = <b>{r.total >= 0 ? "+" : "−"}{Math.abs(r.total).toFixed(2)}</b> → sigmoid → {r.known.length ? r.p.toFixed(2) : "—"}
        </p>
      </div>
    </div>
  );
}
