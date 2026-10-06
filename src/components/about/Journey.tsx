"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { about, type Milestone, type Phase } from "@/content/about";
import s from "./About.module.css";

const ORDER: Phase[] = ["foundations", "building", "learning"];
const KIND: Record<Milestone["kind"], string> = {
  education: "Education",
  certificate: "Certificate",
  work: "Work",
  project: "Projects",
  hackathon: "Hackathon",
  now: "Now",
};

/**
 * The journey as a drafted line that draws down the page as you read.
 * A sticky panel keeps the current chapter, date and overall progress in view.
 * Scroll work writes straight to the DOM (no re-render per frame); React only
 * updates when the active milestone actually changes.
 */
export function Journey() {
  const items = about.journey;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);
  const markRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.45;
      const box = list.getBoundingClientRect();
      const filled = Math.max(0, Math.min(box.height, line - box.top));
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${box.height ? filled / box.height : 0})`;
      if (progRef.current) progRef.current.style.transform = `scaleX(${box.height ? filled / box.height : 0})`;
      let idx = 0;
      markRefs.current.forEach((m, i) => {
        if (m && m.getBoundingClientRect().top <= line) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();

    // Entries ease in once, as they first come into view.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.seen = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    list.querySelectorAll("li[data-phase]").forEach((li) => io.observe(li));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = items[active];
  const phase = about.phases[current.phase];

  const jump = (p: Phase) => {
    const i = items.findIndex((m) => m.phase === p);
    markRefs.current[i]?.closest("li")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={s.journey}>
      <aside className={s.panel} aria-label="Chapters">
        <p className={s.panelKicker}>Chapter</p>
        <p key={current.phase} className={s.panelNo} aria-hidden="true">
          {phase.no}
        </p>
        <p key={`${current.phase}-name`} className={s.panelName}>
          {phase.name}
        </p>
        <p className={s.panelNote}>{phase.note}</p>
        <div className={s.panelProgress}>
          <span className={s.panelDate} aria-live="polite">
            {current.label}
          </span>
          <span className={s.progTrack} aria-hidden="true">
            <span ref={progRef} className={s.progFill} />
          </span>
        </div>
        <ol className={s.chapters}>
          {ORDER.map((p) => (
            <li key={p}>
              <button type="button" aria-current={p === current.phase ? "step" : undefined} onClick={() => jump(p)}>
                <span>{about.phases[p].no}</span> {about.phases[p].name}
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <ol ref={listRef} className={s.milestones}>
        <span className={s.rail} aria-hidden="true" />
        <span ref={fillRef} className={s.railFill} aria-hidden="true" />
        {items.map((m, i) => {
          const firstOfPhase = i === 0 || items[i - 1].phase !== m.phase;
          return (
            <li
              key={m.at + m.title}
              className={s.milestone}
              data-phase={m.phase}
              id={`m-${m.at}`}
              data-kind={m.kind}
              data-on={i <= active ? "" : undefined}
              data-current={i === active ? "" : undefined}
            >
              {firstOfPhase && (
                <p className={s.phaseLabel}>
                  {about.phases[m.phase].no} — {about.phases[m.phase].name}
                </p>
              )}
              <p className={s.meta}>
                <span
                  ref={(el) => {
                    markRefs.current[i] = el;
                  }}
                  className={s.mark}
                  aria-hidden="true"
                />
                <span className={s.date}>{m.label}</span>
                {m.kind !== "now" && <span className={s.kind}>{KIND[m.kind]}</span>}
              </p>
              <h3 className={s.mTitle}>{m.title}</h3>
              <p className={s.mBody}>{m.body}</p>
              {m.tags && (
                <p className={s.tags}>
                  {m.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </p>
              )}
              {m.media && (
                <div className={s.media}>
                  {m.media.map((img) => (
                    <figure key={img.src}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        sizes="(max-width: 767px) 80vw, 340px"
                      />
                      <figcaption>{img.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
              {m.links && (
                <ul className={s.links}>
                  {m.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noreferrer">
                        {l.text} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {m.link &&
                (m.link.href.startsWith("/") ? (
                  <Link href={m.link.href} className={s.mLink}>
                    {m.link.text} →
                  </Link>
                ) : (
                  <a href={m.link.href} target="_blank" rel="noreferrer" className={s.mLink}>
                    {m.link.text} ↗
                  </a>
                ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
