import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import { SheetChrome } from "@/components/chrome/SheetChrome";
import { StartLoader } from "@/components/chrome/StartLoader";
import { BOOT_SCRIPT } from "@/lib/origin/timeline";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, personJsonLd, websiteJsonLd } from "@/lib/site";
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
  // Only small accents use it; don't let it compete with the first paint.
  preload: false,
});

/** Editorial serif for the carbon sheets (Intelligence, Lab) — option C, chosen by Muhammad. */
const editorial = Newsreader({
  subsets: ["latin"],
  // Static 400 instead of the full variable font: a fraction of the bytes, same look at these sizes.
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Muhammad Suleman",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  authors: [{ name: "Muhammad Suleman", url: SITE_URL }],
  creator: "Muhammad Suleman",
  keywords: [
    "Muhammad Suleman",
    "Muhammad Suleman AI engineer",
    "Muhammad Suleman AI/ML engineer",
    "AI/ML engineer Lahore",
    "machine learning engineer Pakistan",
    "software engineer Lahore",
    "RAG",
    "NLP",
    "recommender systems",
    "Next.js developer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    firstName: "Muhammad",
    lastName: "Suleman",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: "#131312",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${editorial.variable} ${mono.variable}`}
      data-intro="done"
      data-tone="carbon"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, websiteJsonLd]) }}
        />
        <StartLoader />
        <SheetChrome>{children}</SheetChrome>
      </body>
    </html>
  );
}
