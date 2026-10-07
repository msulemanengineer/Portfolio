import type { Metadata } from "next";
import { LabSheet } from "@/components/lab/LabSheet";

export const metadata: Metadata = {
  title: "ML Lab — interactive experiments",
  alternates: { canonical: "/lab" },
  description:
    "Interactive machine learning experiments by Muhammad Suleman: score a review with learned word weights, retrieve passages by cosine similarity, and watch gradient descent fit a line.",
};

export default function LabPage() {
  return <LabSheet />;
}
