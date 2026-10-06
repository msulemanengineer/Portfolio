import type { CSSProperties } from "react";
import { intelligence } from "@/content/intelligence";
import s from "./figures.module.css";

const data = intelligence.sentiment;
const MAX = Math.max(
  ...data.weights.positive.map(([, w]) => Math.abs(w)),
  ...data.weights.negative.map(([, w]) => Math.abs(w)),
);

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const fmt = (w: number) => `${w > 0 ? "+" : "−"}${Math.abs(w).toFixed(2)}`;

function Word({ word }: { word: string }) {
  const note = data.notes[word];
  return (
    <>
      <span className={s.word}>{word}</span>
      {note && <span className={s.note}>{note}</span>}
    </>
  );
}

/**
 * The strongest learned weights of the deployed Logistic Regression, straight
 * from the project README. A butterfly: negative to the left, positive right.
 */
export function WeightsFigure() {
  const rows = data.weights.positive.map((p, i) => [data.weights.negative[i], p] as const);
  const { tn, fp, fn, tp } = data.confusion;

  return (
    <div className={s.sentiment}>
      <dl className={s.stats}>
        <div>
          <dt>Accuracy</dt>
          <dd>{pct(data.accuracy)}</dd>
          <p>on {data.testRows} unseen reviews</p>
        </div>
        <div>
          <dt>Macro F1</dt>
          <dd>{data.f1Macro.toFixed(3)}</dd>
          <p>both classes weighted equally</p>
        </div>
        <div>
          <dt>ROC-AUC</dt>
          <dd>{data.rocAuc.toFixed(3)}</dd>
          <p>ranking quality</p>
        </div>
        <div>
          <dt>Cross-validation</dt>
          <dd>
            {data.cvMean.toFixed(3)}
            <small> ± {data.cvStd.toFixed(3)}</small>
          </dd>
          <p>training set, agrees with test</p>
        </div>
      </dl>

      <table className={s.weights}>
        <caption>
          What the model learned — the 10 strongest word weights per class
        </caption>
        <thead>
          <tr>
            <th scope="col" className={s.headNeg}>
              <span className={s.swatchNeg} aria-hidden="true" /> Pushes negative
            </th>
            <th scope="col" className={s.headPos}>
              Pushes positive <span className={s.swatchPos} aria-hidden="true" />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([[nw, nv], [pw, pv]]) => (
            <tr key={pw}>
              <td className={s.cellNeg} title={`${nw}: ${fmt(nv)}`}>
                <div className={s.neg}>
                <span className={s.label}>
                  <Word word={nw} />
                </span>
                <span className={s.track}>
                  <span className={s.value}>{fmt(nv)}</span>
                  <span className={s.bar} style={{ "--w": Math.abs(nv) / MAX } as CSSProperties} />
                </span>
                </div>
              </td>
              <td className={s.cellPos} title={`${pw}: ${fmt(pv)}`}>
                <div className={s.pos}>
                <span className={s.track}>
                  <span className={s.bar} style={{ "--w": pv / MAX } as CSSProperties} />
                  <span className={s.value}>{fmt(pv)}</span>
                </span>
                <span className={s.label}>
                  <Word word={pw} />
                </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={s.confusion}>
        <p className={s.confTitle}>Where the {fp + fn} mistakes are</p>
        <table className={s.matrix}>
          <thead>
            <tr>
              <td />
              <th scope="col">Called negative</th>
              <th scope="col">Called positive</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Negative</th>
              <td className={s.hitCell}>{tn}</td>
              <td className={s.missCell}>
                {fp}
                <span>false positive</span>
              </td>
            </tr>
            <tr>
              <th scope="row">Positive</th>
              <td className={s.missCell}>
                {fn}
                <span>false negative</span>
              </td>
              <td className={s.hitCell}>{tp}</td>
            </tr>
          </tbody>
        </table>
        <p className={s.confNote}>
          Errors split 53 / 54 — not biased toward either sentiment. Train accuracy is{" "}
          {data.trainAccuracy.toFixed(3)}; the gap is owned in the README, not hidden.
        </p>
      </div>
    </div>
  );
}
