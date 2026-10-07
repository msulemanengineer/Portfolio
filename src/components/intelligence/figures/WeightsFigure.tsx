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

  return (
    <div className={s.sentiment}>
      <dl className={s.stats}>
        <div>
          <dt>Accuracy</dt>
          <dd>{pct(data.accuracy)}</dd>
          <dd className={s.statNote}>on {data.testRows} unseen reviews</dd>
        </div>
        <div>
          <dt>Macro F1</dt>
          <dd>{data.f1Macro.toFixed(3)}</dd>
          <dd className={s.statNote}>both classes weighted equally</dd>
        </div>
        <div>
          <dt>ROC-AUC</dt>
          <dd>{data.rocAuc.toFixed(3)}</dd>
          <dd className={s.statNote}>ranking quality</dd>
        </div>
        <div>
          <dt>Cross-validation</dt>
          <dd>
            {data.cvMean.toFixed(3)}
            <small> ± {data.cvStd.toFixed(3)}</small>
          </dd>
          <dd className={s.statNote}>training set, agrees with test</dd>
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

    </div>
  );
}
