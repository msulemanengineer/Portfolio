import type { Metadata } from "next";
import { EngineeringSheet } from "@/components/engineering/EngineeringSheet";

export const metadata: Metadata = {
  title: "Engineering — Production software",
  description:
    "Muhammad Suleman's software engineering background: Endless Invo. (Apr 2025 – Sep 2026) and three live platforms — Telemedline, Tabbna Academy and Limoarc.",
};

export default function EngineeringPage() {
  return <EngineeringSheet />;
}
