"use client";

import { useState, type CSSProperties } from "react";
import { ActorMap } from "@/components/engineering/ActorMap";
import type { SystemSheet } from "@/content/engineering";
import s from "./CaseStudy.module.css";

/**
 * Sections 02 and 03 share one selection: pick a user on the map and the
 * module board below filters to what serves them (or show everything).
 */
export function CaseSystem({ sys }: { sys: SystemSheet }) {
  const [picked, setPicked] = useState<number | null>(0);
  // Selection follows clicks only — hover never changes it, so nothing moves under the cursor.
  const mapActive = picked ?? 0;
  const actor = sys.actors[mapActive];
  const filter = picked === null ? null : sys.actors[picked];

  return (
    <>
      <section className={s.section} aria-labelledby="system-title">
        <header className={s.sectionHead}>
          <p className={s.kicker}>02 — How it fits together</p>
          <h2 id="system-title" className={s.sectionTitle}>
            Pick a user. Trace their path.
          </h2>
        </header>
        <div className={s.systemGrid}>
          <div className={s.mapWrap}>
            <ActorMap sys={sys} active={mapActive} onPick={setPicked} />
          </div>
          <aside className={s.mapNote} aria-live="polite">
            <p className={s.noteName}>{actor.name}</p>
            <p className={s.noteDoes}>{actor.does}</p>
            <p className={s.noteCount}>
              <b>{actor.modules.length}</b> of {sys.built.length} modules
            </p>
            {actor.touches.length > 0 && (
              <ul className={s.noteTouches}>
                {actor.touches.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </section>

      <section className={s.section} aria-labelledby="built-title">
        <header className={s.sectionHead}>
          <p className={s.kicker}>03 — What I built</p>
          <h2 id="built-title" className={s.sectionTitle}>
            {sys.built.length} modules
          </h2>
        </header>

        <div className={s.filters} role="group" aria-label="Filter modules by user">
          <button type="button" aria-pressed={picked === null} onClick={() => setPicked(null)}>
            All <em>{sys.built.length}</em>
          </button>
          {sys.actors.map((a, i) => (
            <button key={a.name} type="button" aria-pressed={picked === i} onClick={() => setPicked(i)}>
              {a.name} <em>{a.modules.length}</em>
            </button>
          ))}
        </div>

        <ol className={s.board}>
          {sys.built.map((b, k) => {
            const on = !filter || filter.modules.includes(k);
            const users = sys.actors.filter((a) => a.modules.includes(k)).map((a) => a.name);
            return (
              <li key={b} data-off={on ? undefined : ""} style={{ "--k": k } as CSSProperties}>
                <span className={s.boardNo}>{String(k + 1).padStart(2, "0")}</span>
                <span className={s.boardName}>{b}</span>
                <span className={s.boardUsers}>{users.join(" · ")}</span>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
