/**
 * Sheet 01 — Written. Sources: the SE resume, LinkedIn (dates), and the user's
 * own account of his role per project (Limoarc: frontend only; Telemedline and
 * Tabbna Academy: frontend + backend). Nothing here is estimated.
 */
import { identity } from "./identity";

export type Role = "Frontend" | "Full-stack";

export interface Actor {
  name: string;
  does: string;
  /** Indexes into the system's `built` list this actor relies on. */
  modules: number[];
  /** Integrations this actor's flows pass through. */
  touches: string[];
  /** The 2–3 headline features shown on the /engineering overview (indexes into `built`). */
  main: number[];
}

export interface SystemSheet {
  id: string;
  no: string;
  name: string;
  domain: string;
  /** null when the product is no longer online. */
  url: string | null;
  host: string;
  online: boolean;
  role: Role;
  roleNote: string;
  summary: string;
  actors: Actor[];
  integrations: string[];
  built: string[];
  /** As listed on the user's previous portfolio. WebRTC/Socket.io for Telemedline awaits confirmation. */
  stack: string[];
  image: { src: string; width: number; height: number; alt: string };
}

export const engineering = {
  intro: {
    kicker: "Sheet 01 — Written",
    title: "Systems that ship.",
    lede: "A year and a half at Endless Invo., from intern to Associate Software Engineer, building client platforms for healthcare, medical e-learning and luxury mobility — owning features from the interface to the API, and shipping them to production.",
    facts: [
      { label: "Company", value: "Endless Invo. · Lahore" },
      { label: "Tenure", value: "Apr 2025 – Sep 2026" },
      { label: "Platforms shown", value: "3 production platforms" },
      { label: "Stack", value: "React · Next.js · Node.js · Express · MongoDB" },
    ],
  },

  /** LinkedIn dates (user decision). Bars on the timeline are drawn to scale. */
  roles: [
    {
      title: "Associate Software Engineer",
      start: "2025-06",
      end: "2026-09",
      label: "Jun 2025 – Sep 2026",
      points: [
        "Developed and shipped features for production client applications with React, Next.js, Node.js, Express and MongoDB.",
        "Owned end-to-end business workflows across healthcare, booking and e-commerce — from UI through API integration to backend functionality.",
        "Integrated REST APIs, authentication flows, payment services, Google Maps and other third-party services.",
        "Built and maintained admin dashboards for users, content, orders, bookings, drivers and operations.",
        "Debugged across the stack, took part in code reviews and technical discussions, and folded in feedback from senior engineers.",
      ],
    },
    {
      title: "Software Engineer Intern",
      start: "2025-04",
      end: "2025-06",
      label: "Apr 2025 – Jun 2025",
      points: [
        "Built reusable React components and connected them to REST APIs on live client projects.",
        "Fixed frontend and backend issues under senior developers’ guidance, following the team’s SDLC and Git workflow.",
        "Took part in daily meetings, feature planning and technical discussions.",
      ],
    },
  ],

  /**
   * Features come from the live products (telemedline.com, academy.tabbna.sa,
   * crawled 2026-10-02) and, for Limoarc — whose domain is now parked — from
   * the launch screenshot plus the SE resume.
   */
  systems: [
    {
      id: "telemedline",
      no: "01",
      name: "Telemedline",
      domain: "Telemedicine",
      url: "https://telemedline.com/",
      host: "telemedline.com",
      online: true,
      role: "Full-stack",
      roleNote: "Frontend and backend",
      summary: "A telemedicine platform where patients see a provider by video, phone or text — booking, intake, payment and prescriptions in one flow — while doctors and admins run schedules, records and reporting.",
      actors: [
        {
          name: "Patient",
          does: "Books a video, phone or text visit, answers intake questions, pays by self-pay or insurance, and gets prescriptions sent to a local pharmacy.",
          modules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], main: [0, 1, 2],
          touches: ["Video calls", "Phone calls", "Messaging", "Payments & insurance"],
        },
        {
          name: "Doctor",
          does: "Holds video, phone and text visits, manages a schedule, reviews patient history and gets notified of bookings.",
          modules: [0, 1, 2, 10, 11, 12, 13], main: [0, 10, 11],
          touches: ["Video calls", "Phone calls", "Messaging", "Notifications"],
        },
        {
          name: "Admin",
          does: "Manages users, oversees appointments and runs reporting.",
          modules: [14, 15, 16], main: [14, 15, 16],
          touches: ["Notifications"],
        },
      ],
      integrations: ["Video calls", "Phone calls", "Messaging", "Payments & insurance", "Notifications"],
      stack: ["React", "Node.js", "MongoDB"],
      built: [
        "Video consultations",
        "Phone (audio) consultations",
        "Text a practitioner",
        "Instant booking and scheduling",
        "Visit intake: reason and health questions",
        "Doctor search and filtering",
        "Care categories: urgent, primary, chronic, mental health",
        "Payments: self-pay or insurance",
        "Prescriptions sent to a local pharmacy",
        "Consultation history",
        "Doctor schedule management",
        "Patient history for doctors",
        "Booking notifications",
        "Provider sign-up (“Join our team”)",
        "User management",
        "Appointment oversight",
        "Reporting workflows",
      ],
      image: { src: "/work/telemedline.webp", width: 1919, height: 871, alt: "Telemedline homepage: doctor search, video and text consultation entry points." },
    },
    {
      id: "tabbna",
      no: "02",
      name: "Tabbna Academy",
      domain: "Medical e-learning · Saudi Arabia",
      url: "https://academy.tabbna.sa/",
      host: "academy.tabbna.sa",
      online: true,
      role: "Full-stack",
      roleNote: "Frontend and backend",
      summary: "A medical e-learning platform for healthcare professionals — accredited courses by specialty, live webinars and conferences, and CME certificates earned on completion.",
      actors: [
        {
          name: "Learner",
          does: "Finds courses by specialty, level and price, watches lectures, takes quizzes, joins live webinars and conferences, and earns CME certificates.",
          modules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], main: [2, 9, 8],
          touches: ["Moyasar payments", "CME certificates", "Live webinars", "Arabic & English"],
        },
        {
          name: "Instructor",
          does: "Builds courses and lectures and runs webinars from an instructor dashboard.",
          modules: [12, 13, 15], main: [12, 13, 15],
          touches: ["Live webinars"],
        },
        {
          name: "Admin",
          does: "Manages courses, specialties, conferences and user access from an admin dashboard.",
          modules: [12, 14, 16, 17], main: [16, 12, 17],
          touches: [],
        },
      ],
      integrations: ["Moyasar payments", "CME certificates", "Live webinars", "Arabic & English"],
      stack: ["React", "Node.js", "Express.js", "MongoDB"],
      built: [
        "Specialty catalog",
        "Course search and filters: specialty, level, price",
        "Free and premium courses",
        "Moyasar checkout",
        "Video lectures",
        "Quizzes and lecture notes",
        "Downloadable clinical PDFs",
        "Learner progress tracking",
        "CME certificates on completion",
        "Live interactive webinars",
        "Conferences and summits",
        "Arabic and English interface",
        "Course and lecture management",
        "Webinar management",
        "Conference management",
        "Instructor dashboard",
        "Admin dashboard",
        "User access management",
      ],
      image: { src: "/work/tabbna.webp", width: 1919, height: 869, alt: "Tabbna Academy homepage: specialities, courses, webinars and conferences." },
    },
    {
      id: "limoarc",
      no: "03",
      name: "Limoarc",
      domain: "Luxury chauffeur booking",
      url: null,
      host: "limoarc.com",
      online: false,
      role: "Frontend",
      roleNote: "Frontend",
      summary: "A chauffeur and limo booking platform — one-way and hourly rides, airport transfers and business travel, with apps for customers, drivers, partners and admins.",
      actors: [
        {
          name: "Customer",
          does: "Books one-way or by the hour, picks pickup and drop-off on the map, gets a quote, applies a coupon, pays and follows the trip live.",
          modules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], main: [0, 1, 10],
          touches: ["Google Maps", "Stripe", "Coupons", "Live trip tracking"],
        },
        {
          name: "Driver",
          does: "Signs up as a chauffeur, manages rides, navigates and tracks earnings.",
          modules: [10, 11, 12, 13, 14], main: [12, 13, 14],
          touches: ["Google Maps", "Live trip tracking"],
        },
        { name: "Partner", does: "Manages fleet and rides.", modules: [12, 15], main: [15, 12], touches: [] },
        { name: "Admin", does: "Runs notifications and platform operations.", modules: [12, 16, 17], main: [17, 16], touches: [] },
      ],
      integrations: ["Google Maps", "Stripe", "Coupons", "Live trip tracking"],
      stack: ["React", "Google Maps", "Stripe"],
      built: [
        "One-way and hourly booking",
        "Pickup and drop-off with Google Maps",
        "Date and time scheduling",
        "Instant quotes",
        "Multiple service categories",
        "Airport transfers",
        "Service-area pages",
        "Business bookings (“For Business”)",
        "Stripe checkout",
        "Coupon discounts",
        "Real-time trip tracking",
        "Chauffeur sign-up",
        "Ride management",
        "Driver navigation",
        "Driver earnings",
        "Fleet management",
        "Notifications",
        "Platform operations dashboard",
      ],
      image: { src: "/work/limoarc.webp", width: 1889, height: 868, alt: "Limoarc homepage at launch: one-way and hourly booking form over a city skyline." },
    },
  ] satisfies SystemSheet[],

  toolkit: [
    { area: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"] },
    { area: "Backend", items: ["Node.js", "Express.js", "Python", "REST APIs", "Authentication", "Third-party integrations"] },
    { area: "Data", items: ["MongoDB", "PostgreSQL", "MySQL", "Supabase"] },
    { area: "Payments & maps", items: ["Stripe", "Moyasar", "Google Maps"] },
    { area: "Cloud & tools", items: ["Docker", "Kubernetes", "Azure", "Git", "GitHub", "Postman", "Netlify"] },
    { area: "Practice", items: ["OOP", "Data structures & algorithms", "SDLC", "Design patterns", "Debugging", "Performance optimisation"] },
  ],

  education: {
    degree: "Bachelor’s in Computer Science",
    school: "COMSATS University Islamabad — Lahore Campus",
    focus: "Object-oriented programming, data structures and algorithms, databases, software engineering.",
  },

  certifications: [
    {
      name: "Introduction to Software Engineering",
      issuer: "IBM",
      date: "Jul 2026",
      href: "https://www.coursera.org/account/accomplishments/verify/3BBBYNNX03K3",
    },
    {
      name: "Getting Started with Front-End and Web Development",
      issuer: "IBM",
      date: "Aug 2024",
      href: null,
    },
  ],

  cta: {
    kicker: "Where this goes next",
    title: "Now I’m bringing these systems to machine learning.",
    body: "The same habits — clear architecture, APIs that hold up, honest testing — applied to recommenders, NLP, embeddings and RAG.",
    primary: "See the AI & ML work",
    resume: "Engineering résumé",
    resumeHref: identity.resumes.engineering,
  },
} as const;
