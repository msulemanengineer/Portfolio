"use client";

import { useState, type CSSProperties } from "react";
import { MorphWords } from "@/components/about/MorphWords";
import { identity } from "@/content/identity";
import s from "./Contact.module.css";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const WORDS = ["Say hello", "Hire me", "Let’s build"] as const;

const Arrow = () => (
  <svg viewBox="0 0 28 12" aria-hidden="true">
    <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/** Contact — one screen: the invitation, the address, the files, the links. */
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

  const [user, domain] = identity.email.split("@");

  return (
    <section className={s.sheet} aria-labelledby="contact-title">
      <div className={s.glow} aria-hidden="true" />

      <p className={s.kicker} style={d(100)}>
        <span className={s.rule} /> Contact · {identity.status}
      </p>
      <h1 id="contact-title" className="sr-only">
        Contact Muhammad Suleman
      </h1>

      <div className={s.words} style={d(200)}>
        <MorphWords words={WORDS} />
      </div>

      <div className={s.mailRow} style={d(300)}>
        <a href={`mailto:${identity.email}`} className={s.mail}>
          {user}
          <wbr />
          <span>@{domain}</span>
        </a>
        <div className={s.mailActions}>
          <a href={`mailto:${identity.email}`} className={s.primary}>
            Write an email
            <Arrow />
          </a>
          <button type="button" onClick={copy} className={s.copy} data-copied={copied ? "" : undefined}>
            {copied ? "Copied ✓" : "Copy address"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
      </div>

      <div className={s.grid} style={d(400)}>
        <a href={identity.resumes.ai} target="_blank" rel="noreferrer" download="" className={s.tile} data-hot="">
          <span className={s.tileLabel}>Résumé · PDF</span>
          <span className={s.tileTitle}>AI/ML Engineer</span>
          <span className={s.tileIcon} aria-hidden="true">↓</span>
        </a>
        <a href={identity.resumes.engineering} target="_blank" rel="noreferrer" download="" className={s.tile}>
          <span className={s.tileLabel}>Résumé · PDF</span>
          <span className={s.tileTitle}>Software Engineer</span>
          <span className={s.tileIcon} aria-hidden="true">↓</span>
        </a>
        <a href={identity.links.linkedin} target="_blank" rel="noreferrer" className={s.tile}>
          <span className={s.tileLabel}>LinkedIn</span>
          <span className={s.tileTitle}>in/msulemanengineer</span>
          <span className={s.tileIcon} aria-hidden="true">↗</span>
        </a>
        <a href={identity.links.github} target="_blank" rel="noreferrer" className={s.tile}>
          <span className={s.tileLabel}>GitHub</span>
          <span className={s.tileTitle}>msulemanengineer</span>
          <span className={s.tileIcon} aria-hidden="true">↗</span>
        </a>
      </div>

      <p className={s.foot} style={d(500)}>
        Lahore, Pakistan · {identity.discipline} · replies by email
      </p>
    </section>
  );
}
