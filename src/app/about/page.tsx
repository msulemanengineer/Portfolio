import type { Metadata } from "next";
import { AboutSheet } from "@/components/about/AboutSheet";

export const metadata: Metadata = {
  title: "About — the journey",
  alternates: { canonical: "/about" },
  description:
    "Muhammad Suleman: Computer Science at COMSATS University Islamabad, software engineer at Endless Invo., and now building toward AI engineering — the journey, in order.",
};

export default function AboutPage() {
  return <AboutSheet />;
}
