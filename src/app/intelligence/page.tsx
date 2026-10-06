import type { Metadata } from "next";
import { IntelligenceSheet } from "@/components/intelligence/IntelligenceSheet";

export const metadata: Metadata = {
  title: "Intelligence — AI & Machine Learning",
  description:
    "Four AI/ML projects by Muhammad Suleman: a TF-IDF recommender, an interpretable sentiment model, embedding-based resume matching and a RAG document assistant, plus the DeepLearning.AI and Stanford foundations behind them.",
};

export default function IntelligencePage() {
  return <IntelligenceSheet />;
}
