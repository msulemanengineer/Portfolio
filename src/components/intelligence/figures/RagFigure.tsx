import type { CSSProperties } from "react";
import s from "./figures.module.css";

const ingest = [
  { name: "PDF", meta: "upload" },
  { name: "pypdf", meta: "extract text" },
  { name: "Chunks", meta: "1,000 chars · 200 overlap" },
  { name: "MiniLM", meta: "384-d embeddings" },
  { name: "FAISS", meta: "vector index" },
];

const ask = [
  { name: "Question", meta: "plain English" },
  { name: "MiniLM", meta: "same embedding" },
  { name: "Search", meta: "top 4 · cosine ≥ 0.20" },
  { name: "Strict prompt", meta: "answer only from these" },
  { name: "LLM", meta: "OpenAI · Anthropic · mock" },
];

/** The RAG pipeline as built: two lanes that meet at the FAISS index. */
export function RagFigure() {
  return (
    <div className={s.rag}>
      <div className={s.ragLane}>
        <p className={s.laneName}>Ingest — once per document</p>
        <ol className={s.flow}>
          {ingest.map((n, i) => (
            <li key={n.name} className={s.node} data-settle="" style={{ "--i": i } as CSSProperties}>
              <span className={s.nodeName}>{n.name}</span>
              <span className={s.nodeMeta}>{n.meta}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.join} aria-hidden="true">
        <span>search the index</span>
      </div>

      <div className={s.ragLane}>
        <p className={s.laneName}>Ask — every question</p>
        <ol className={s.flow}>
          {ask.map((n, i) => (
            <li key={n.name} className={s.node} data-settle="" style={{ "--i": i + 5 } as CSSProperties}>
              <span className={s.nodeName}>{n.name}</span>
              <span className={s.nodeMeta}>{n.meta}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.outcomes}>
        <div className={s.outcome} data-tone="answer">
          <p className={s.outcomeName}>Answer + sources</p>
          <p>Every passage used, with its page number and similarity score.</p>
        </div>
        <div className={s.outcome} data-tone="refuse">
          <p className={s.outcomeName}>“Not found in the document.”</p>
          <p>When nothing clears the threshold, it says so instead of guessing.</p>
        </div>
      </div>
    </div>
  );
}
