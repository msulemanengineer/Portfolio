"use client";

import Link from "next/link";
import { useState } from "react";
import { identity } from "@/content/identity";
import s from "./Contact.module.css";

const resumes = [
  {
    title: "AI/ML Engineer résumé",
    note: "ML projects, NLP, embeddings, RAG",
    href: identity.resumes.ai,
    primary: true,
  },
  {
    title: "Software Engineer résumé",
    note: "Production work at Endless Invo.",
    href: identity.resumes.engineering,
    primary: false,
  },
];

const elsewhere = [
  { label: "LinkedIn", value: "in/msulemanengineer", href: identity.links.linkedin },
  { label: "GitHub", value: "msulemanengineer", href: identity.links.github },
];

/** The title block, expanded: everything needed to reach Muhammad, on one sheet. */
export function ContactSheet() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${identity.email}`;
    }
  };

  return (
    <div className={s.sheet}>
      <header className={s.head}>
        <p className={s.kicker}>Title block — Contact</p>
        <h1 className={s.title}>Let’s talk.</h1>
        <p className={s.lede}>
          I’m looking for an AI engineering role. Email is the fastest way to reach me.
        </p>
      </header>

      <section className={s.block} aria-label="Contact details">
        <div className={s.emailCell}>
          <p className={s.label}>Email</p>
          <a href={`mailto:${identity.email}`} className={s.email}>
            {identity.email.split("@")[0]}
            <wbr />@{identity.email.split("@")[1]}
          </a>
          <div className={s.emailActions}>
            <a href={`mailto:${identity.email}`} className={s.primary}>
              Write an email
              <svg viewBox="0 0 28 12" aria-hidden="true">
                <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </a>
            <button type="button" onClick={copy} className={s.copy} data-copied={copied ? "" : undefined}>
              {copied ? "Copied ✓" : "Copy address"}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email address copied" : ""}
            </span>
          </div>
        </div>

        <div className={s.resumeCell}>
          <p className={s.label}>Résumés · PDF</p>
          <ul className={s.resumes}>
            {resumes.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noreferrer" download="" data-primary={r.primary ? "" : undefined}>
                  <span className={s.rTitle}>{r.title}</span>
                  <span className={s.rNote}>{r.note}</span>
                  <span className={s.rIcon} aria-hidden="true">
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={s.linksCell}>
          <p className={s.label}>Elsewhere</p>
          <ul className={s.links}>
            {elsewhere.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  <span>{l.label}</span>
                  <em>{l.value} ↗</em>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <dl className={s.meta}>
          <div>
            <dt>Drawn by</dt>
            <dd>{identity.name}</dd>
          </div>
          <div>
            <dt>Discipline</dt>
            <dd>{identity.discipline}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Lahore, Pakistan</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className={s.dot} aria-hidden="true" />
              {identity.status}
            </dd>
          </div>
        </dl>
      </section>

      <nav className={s.more} aria-label="Before you write">
        <p className={s.label}>Before you write</p>
        <Link href="/intelligence">AI & ML work →</Link>
        <Link href="/engineering">Engineering background →</Link>
        <Link href="/about">The journey →</Link>
      </nav>
    </div>
  );
}
