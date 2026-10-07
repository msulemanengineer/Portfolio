"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type KeyboardEvent } from "react";
import type { SystemSheet } from "@/content/engineering";
import { ActorMap } from "./ActorMap";
import s from "./Explorer.module.css";

/**
 * One platform at a time: switch with the tabs (or ← →), then pick a user to
 * trace their path to the modules that serve them.
 */
export function ProjectExplorer({ systems }: { systems: readonly SystemSheet[] }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(0);

  useEffect(() => {
    const i = systems.findIndex((x) => x.id === window.location.hash.slice(1));
    if (i >= 0) setIdx(i);
  }, [systems]);

  const select = (i: number) => {
    setIdx(i);
    setPicked(0);
    history.replaceState(null, "", `#${systems[i].id}`);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = systems.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (idx + 1) % n;
    if (e.key === "ArrowLeft") next = (idx - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    select(next);
    document.getElementById(`tab-${systems[next].id}`)?.focus();
  };

  const sys = systems[idx];
  const active = picked;
  const actor = sys.actors[active];

  return (
    <div className={s.explorer}>
      <div role="tablist" aria-label="Platforms" className={s.tabs}>
        {systems.map((x, i) => (
          <button
            key={x.id}
            id={`tab-${x.id}`}
            role="tab"
            type="button"
            aria-selected={i === idx}
            aria-controls={`panel-${x.id}`}
            tabIndex={i === idx ? 0 : -1}
            className={s.tab}
            onClick={() => select(i)}
            onKeyDown={onTabKey}
          >
            <span className={s.tabNo}>{x.no}</span>
            <span className={s.tabName}>{x.name}</span>
            <span className={s.tabMeta}>
              {x.domain} · {x.role}
            </span>
          </button>
        ))}
      </div>

      <div
        key={sys.id}
        id={`panel-${sys.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${sys.id}`}
        className={s.panel}
      >
        <div className={s.left}>
          <div className={s.badges}>
            <span className={s.roleBadge} data-role={sys.role}>
              My role · {sys.roleNote}
            </span>
            {sys.url ? (
              <a href={sys.url} target="_blank" rel="noreferrer" className={s.live}>
                Open {sys.host} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className={s.offline}>No longer online · launch screenshot</span>
            )}
          </div>
          <p className={s.summary}>{sys.summary}</p>

          <p className={`${s.label} ${s.mapLabel}`}>
            <span>Pick a user — main features</span>
            <span className={s.count}>
              <b>{actor.modules.length}</b> in the case study
            </span>
          </p>
          <ActorMap sys={sys} active={active} onPick={setPicked} mainOnly />
          <p className={s.caption} aria-live="polite">
            <strong>{actor.name}</strong> — {actor.does}
          </p>
          <Link href={`/work/${sys.id}`} className={s.caseLink}>
            Read the case study
            <svg viewBox="0 0 28 12" aria-hidden="true">
              <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </Link>
        </div>

        <div className={s.right}>
          <div className={s.browser}>
            <div className={s.browserBar} aria-hidden="true">
              <span />
              <span />
              <span />
              <em>{sys.host}</em>
            </div>
            <div className={s.shot}>
              <Image
                src={sys.image.src}
                alt={sys.image.alt}
                width={sys.image.width}
                height={sys.image.height}
                sizes="(max-width: 1023px) 100vw, 58vw"
                priority={idx === 0}
                className={s.shotImg}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
