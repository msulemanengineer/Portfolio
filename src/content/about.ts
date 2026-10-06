/**
 * Sheet 04 — Margin. The journey, in order. Sources: SE + AI résumés, LinkedIn
 * (dates, certificates), GitHub (repo creation dates), the previous portfolio
 * (COMSATS start year), Muhammad's own account of how he started (2026-10-03),
 * and the Web-e-Thon certificate, photo and team post on LinkedIn.
 */
import { identity } from "./identity";

export type Phase = "foundations" | "building" | "learning";
export type Kind = "education" | "certificate" | "work" | "project" | "hackathon" | "now";

export interface Milestone {
  /** Sortable, YYYY-MM. */
  at: string;
  label: string;
  phase: Phase;
  kind: Kind;
  title: string;
  body: string;
  tags?: string[];
  link?: { href: string; text: string };
  /** Extra links shown as a row, e.g. early projects. */
  links?: Array<{ href: string; text: string }>;
  media?: Array<{ src: string; width: number; height: number; alt: string; caption: string }>;
}


export const about = {
  intro: {
    kicker: "Sheet 04 — Margin",
    title: "Notes from the margin.",
    lede: "I’m Muhammad Suleman — a software engineer with a strong Computer Science foundation from COMSATS University Islamabad, now building toward AI engineering. These are the notes in the margin: how I got here, in order.",
    facts: [
      { label: "Based in", value: identity.location.replace("PK", "Pakistan") },
      { label: "Foundation", value: "BS Computer Science, COMSATS" },
      { label: "Worked at", value: "Endless Invo., Apr 2025 – Sep 2026" },
      { label: "Now", value: identity.status },
    ],
  },

  phases: {
    foundations: { no: "I", name: "Learning to build", note: "From Frontend Mentor challenges to full-stack apps." },
    building: { no: "II", name: "Building for real", note: "Production platforms, real users, real deadlines." },
    learning: { no: "III", name: "Learning to learn", note: "Machine learning — from theory to four working systems." },
  } as Record<Phase, { no: string; name: string; note: string }>,

  journey: [
    {
      at: "2023-01",
      label: "2023",
      phase: "foundations",
      kind: "education",
      title: "Started a BS in Computer Science at COMSATS University Islamabad",
      body: "Lahore Campus. The foundation everything else stands on: programming fundamentals, object-oriented programming, data structures and algorithms, databases and software engineering — in C, Java, Python and JavaScript. Grade: A+.",
      tags: [
        "C",
        "Java",
        "Python",
        "JavaScript",
        "OOP",
        "DSA"
      ]
    },
    {
      at: "2023-10",
      label: "Oct 2023",
      phase: "foundations",
      kind: "project",
      title: "Started learning frontend development",
      body: "Small interfaces first: Frontend Mentor challenges, matching real designs pixel by pixel — then the frontends of my first two websites, one for education and one in healthcare. Both are still online.",
      tags: [
        "HTML",
        "CSS",
        "JavaScript",
        "Frontend Mentor"
      ],
      links: [
        { href: "https://academiaeducational.netlify.app/", text: "Academia — education platform" },
        { href: "https://medicaldotplus.netlify.app/", text: "Medico Plus — healthcare site" }
      ]
    },
    {
      at: "2024-03",
      label: "Early 2024",
      phase: "foundations",
      kind: "project",
      title: "Went deep into backend and databases",
      body: "Four or five months in, the interface wasn’t enough — I wanted to know what it talked to. APIs, authentication, servers and databases: the step from pages to complete applications.",
      tags: [
        "Node.js",
        "Express",
        "MongoDB",
        "REST APIs"
      ]
    },
    {
      at: "2024-07",
      label: "Jul 2024",
      phase: "foundations",
      kind: "certificate",
      title: "First certificates in web development",
      body: "Getting Started with Front-End and Web Development — Coursera, then IBM in August — alongside a full-stack web development course.",
      tags: [
        "Front-end",
        "Full-stack"
      ]
    },
    {
      at: "2025-04",
      label: "Apr 2025",
      phase: "building",
      kind: "work",
      title: "Software Engineer Intern at Endless Invo.",
      body: "First professional code: reusable React components wired to REST APIs on live client projects, and frontend and backend fixes under senior engineers — inside a real SDLC and Git workflow.",
      tags: [
        "React",
        "REST APIs",
        "Git"
      ]
    },
    {
      at: "2025-05",
      label: "31 May – 1 Jun 2025",
      phase: "building",
      kind: "hackathon",
      title: "Web-e-Thon at TechnoVerse — a city dashboard in 10 hours",
      body: "A 10-hour web hackathon run by the ACM COMSATS Lahore student chapter and powered by InvoZone. As team PixelPirates — with Muhammad Saad Shahid and Hassan Muhyyudin — we built SCCD, a Smart City Collaborative Dashboard: citizens report and track city issues, officials resolve them and reply, and admins manage users, roles and analytics, all updating in real time. I built the frontend. We didn’t win — we shipped, and learned to make decisions fast against the clock.",
      tags: [
        "Next.js 13",
        "React Server Components",
        "Tailwind CSS",
        "Supabase",
        "PostgreSQL"
      ],
      media: [
        {
          src: "/about/webethon/team.webp",
          width: 1080,
          height: 1080,
          alt: "Team PixelPirates at TechnoVerse: Muhammad Suleman and teammates in front of the event photo frame",
          caption: "Team PixelPirates at TechnoVerse 4.0"
        },
        {
          src: "/about/webethon/certificate.webp",
          width: 1600,
          height: 1200,
          alt: "Certificate of participation in Web-e-Thon, TechnoVerse, ACM CUI Lahore, powered by InvoZone, 31 May – 1 June",
          caption: "Certificate of participation"
        }
      ]
    },
    {
      at: "2025-06",
      label: "Jun 2025",
      phase: "building",
      kind: "work",
      title: "Associate Software Engineer",
      body: "Owning features end to end on production client platforms — healthcare, medical e-learning and luxury mobility — from the interface through the API to the backend.",
      tags: [
        "Next.js",
        "Node.js",
        "MongoDB",
        "Stripe",
        "Google Maps"
      ],
      link: {
        href: "/engineering",
        text: "See the platforms"
      }
    },
    {
      at: "2026-05",
      label: "May 2026",
      phase: "learning",
      kind: "project",
      title: "Started learning AI and machine learning",
      body: "Coursera courses, YouTube and the documentation itself. For every topic: research it, then build something small with it until it makes sense.",
      tags: [
        "ML algorithms",
        "Python",
        "Practice"
      ]
    },
    {
      at: "2026-07",
      label: "Jul 2026",
      phase: "learning",
      kind: "certificate",
      title: "Machine learning, properly",
      body: "Supervised Machine Learning: Regression and Classification (DeepLearning.AI · Stanford), Machine Learning with Python (IBM) and Introduction to Software Engineering (IBM).",
      tags: [
        "Regression",
        "Classification",
        "Python"
      ],
      link: {
        href: "https://www.coursera.org/account/accomplishments/verify/NF2KDPZCDU3V",
        text: "Verify a certificate"
      }
    },
    {
      at: "2026-08",
      label: "Aug 2026",
      phase: "learning",
      kind: "certificate",
      title: "Completed the Machine Learning Specialization",
      body: "DeepLearning.AI and Stanford Online — Advanced Learning Algorithms, then Unsupervised Learning, Recommenders and Reinforcement Learning.",
      tags: [
        "Neural networks",
        "Recommenders",
        "Clustering"
      ],
      link: {
        href: "https://www.coursera.org/account/accomplishments/specialization/LR7QRIW5GY19",
        text: "Verify the specialization"
      }
    },
    {
      at: "2026-09",
      label: "Sep 2026",
      phase: "learning",
      kind: "project",
      title: "Four AI systems, built and documented",
      body: "A content-based recommender, an interpretable sentiment model, embedding-based resume matching and a RAG document assistant — each with its limits written down.",
      tags: [
        "TF-IDF",
        "Embeddings",
        "FAISS",
        "RAG",
        "FastAPI"
      ],
      link: {
        href: "/intelligence",
        text: "See the AI work"
      }
    },
    {
      at: "2026-10",
      label: "Now",
      phase: "learning",
      kind: "now",
      title: "Looking for my first AI engineering role",
      body: "Close to graduating and still building. I want to work where production engineering and machine learning meet.",
      link: {
        href: "/contact",
        text: "Get in touch"
      }
    },
  ] satisfies Milestone[],

  principles: [
    { title: "Show the working", body: "Every model I build states its limits next to its score. A number without its method isn’t a result." },
    { title: "Ship, then refine", body: "A year and a half of client work taught me that a feature only counts once it’s in front of users." },
    { title: "Learn in public", body: "My ML projects are on GitHub with their system guides — readable, runnable and open to criticism." },
  ],
} as const;
