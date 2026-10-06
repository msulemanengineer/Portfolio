/**
 * Verified identity facts only — sourced from the SE + AI resumes and LinkedIn.
 * Anything shown about Muhammad on the site should come from this folder.
 */
export const identity = {
  name: "Muhammad Suleman",
  shortName: "M. Suleman",
  discipline: "AI/ML Engineer",
  status: "Open to AI engineering roles",
  location: "Lahore, PK",
  email: "sulemanaslam.engineer@gmail.com",
  links: {
    github: "https://github.com/msulemanengineer",
    linkedin: "https://www.linkedin.com/in/msulemanengineer/",
  },
  resumes: {
    ai: "/resume/muhammad-suleman-ai-ml-engineer-resume.pdf",
    engineering: "/resume/muhammad-suleman-software-engineer-resume.pdf",
  },
} as const;

export type ContactKind = "mail" | "external" | "file";

export const contactLinks: ReadonlyArray<{ label: string; href: string; kind: ContactKind }> = [
  { label: "Email", href: `mailto:${identity.email}`, kind: "mail" },
  { label: "LinkedIn", href: identity.links.linkedin, kind: "external" },
  { label: "GitHub", href: identity.links.github, kind: "external" },
  { label: "CV", href: identity.resumes.ai, kind: "file" },
];
