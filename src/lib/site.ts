import { identity } from "@/content/identity";

/**
 * The public address of the site. Set NEXT_PUBLIC_SITE_URL when deploying
 * (e.g. https://msuleman.dev). The fallback is the current Netlify address; change it when a custom domain is live.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://msulemanengineer.netlify.app").replace(/\/$/, "");

export const SITE_TITLE = `${identity.name} — AI/ML Engineer`;
export const SITE_DESCRIPTION =
  "Muhammad Suleman is an AI/ML engineer from Lahore with a production software engineering background — recommenders, NLP, embeddings and RAG, built on systems that ship.";

/** Structured data: tells search engines who this site is about. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  alternateName: ["Muhammad Suleman Aslam", "M. Suleman"],
  jobTitle: "AI/ML Engineer",
  url: SITE_URL,
  email: `mailto:${identity.email}`,
  image: `${SITE_URL}/opengraph-image`,
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "COMSATS University Islamabad" },
  knowsAbout: [
    "Machine Learning",
    "Artificial Intelligence",
    "Natural Language Processing",
    "Retrieval-Augmented Generation",
    "Recommender Systems",
    "Python",
    "scikit-learn",
    "React",
    "Next.js",
    "Node.js",
  ],
  sameAs: [identity.links.linkedin, identity.links.github],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_TITLE,
  url: SITE_URL,
  author: { "@type": "Person", name: identity.name },
};
