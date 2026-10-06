import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { SheetChrome } from "@/components/chrome/SheetChrome";
import { BOOT_SCRIPT } from "@/lib/origin/timeline";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Muhammad Suleman — AI/ML Engineer",
    template: "%s — Muhammad Suleman",
  },
  description:
    "Muhammad Suleman is an AI/ML engineer with a production software engineering background — recommenders, NLP, embeddings and RAG, built on systems that ship.",
  authors: [{ name: "Muhammad Suleman" }],
};

export const viewport: Viewport = {
  themeColor: "#eceae3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      data-intro="done"
      data-tone="paper"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <SheetChrome>{children}</SheetChrome>
      </body>
    </html>
  );
}
