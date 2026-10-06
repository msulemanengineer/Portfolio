import type { ReactNode } from "react";
import { intelligence, type FigureKind } from "@/content/intelligence";
import { ChapterSection } from "./ChapterSection";
import { Curriculum } from "./Curriculum";
import { HireCta } from "./HireCta";
import { Intro } from "./Intro";
import { BlendFigure } from "./figures/BlendFigure";
import { CosineFigure } from "./figures/CosineFigure";
import { RagFigure } from "./figures/RagFigure";
import { WeightsFigure } from "./figures/WeightsFigure";
import s from "./Intelligence.module.css";

const figures: Record<FigureKind, { node: ReactNode; caption: string }> = {
  cosine: {
    node: <CosineFigure />,
    caption:
      "Illustration — cosine similarity between two TF-IDF vectors. The math is exact; the two dimensions are chosen for the drawing.",
  },
  weights: {
    node: <WeightsFigure />,
    caption:
      "Measured — from reports/metrics.json and the repository README. Test set: 597 reviews never seen in training or tuning.",
  },
  blend: {
    node: <BlendFigure />,
    caption: "How the score is built, as implemented. Examples from the project README.",
  },
  rag: {
    node: <RagFigure />,
    caption: "The pipeline as built. Parameters are the defaults in backend/config.py.",
  },
};

/** Sheet 02 — Learned. */
export function IntelligenceSheet() {
  return (
    <div className={s.sheet}>
      <Intro />
      {intelligence.chapters.map((c) => (
        <ChapterSection
          key={c.id}
          chapter={c}
          figure={figures[c.figure].node}
          caption={figures[c.figure].caption}
        />
      ))}
      <Curriculum />
      <HireCta />
    </div>
  );
}
