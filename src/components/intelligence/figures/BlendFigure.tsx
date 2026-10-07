import s from "./figures.module.css";

/**
 * The matching score's two independent paths and the blend that joins them.
 * Structure and numbers are the README's; the 0.7 / 0.3 bar is drawn to scale.
 */
export function BlendFigure() {
  return (
    <div className={s.blend}>
      <div className={s.inputs}>
        <span className={s.doc}>Resume · PDF</span>
        <span className={s.doc}>Job description</span>
      </div>

      <div className={s.lanes}>
        <div className={s.lane} data-tone="semantic">
          <p className={s.laneName}>Semantic path — meaning</p>
          <ol className={s.steps}>
            <li>
              Chunk <em>~180 words · 30 overlap</em>
            </li>
            <li>
              Embed <em>all-MiniLM-L6-v2</em>
            </li>
            <li>
              Average <em>→ one 384-d vector</em>
            </li>
            <li>
              Cosine <em>→ semantic %</em>
            </li>
          </ol>
        </div>
        <div className={s.lane} data-tone="skill">
          <p className={s.laneName}>Keyword path — explainability</p>
          <ol className={s.steps}>
            <li>
              Normalise <em>lowercase · aliases</em>
            </li>
            <li>
              Match <em>50-skill dictionary</em>
            </li>
            <li>
              Compare <em>matching · missing</em>
            </li>
            <li>
              Share found <em>→ coverage %</em>
            </li>
          </ol>
        </div>
      </div>

      <div className={s.blendBar} role="img" aria-label="Overall score: 70 percent semantic similarity, 30 percent skill coverage">
        <span className={s.segSemantic} style={{ flexBasis: "70%" }}>
          0.7 × semantic
        </span>
        <span className={s.segSkill} style={{ flexBasis: "30%" }}>
          0.3 × coverage
        </span>
      </div>
      <p className={s.blendFormula}>= overall match, shown with its formula — never a bare number</p>

    </div>
  );
}
