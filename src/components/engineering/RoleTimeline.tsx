"use client";

import { useState, type CSSProperties } from "react";
import { engineering } from "@/content/engineering";
import s from "./Explorer.module.css";

const month = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
const roles = engineering.roles;
const T0 = Math.min(...roles.map((r) => month(r.start)));
const T1 = Math.max(...roles.map((r) => month(r.end))) + 1;
const SPAN = T1 - T0;
const at = (ym: string, end = false) => ((month(ym) + (end ? 1 : 0) - T0) / SPAN) * 100;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ticks = Array.from({ length: SPAN + 1 }, (_, k) => ({ k, m: (T0 + k) % 12, y: Math.floor((T0 + k) / 12) }));

/** The tenure drawn to scale. Each bar is a button; the panel below follows it. */
export function RoleTimeline() {
  const [sel, setSel] = useState(0);
  const role = roles[sel];
  const ordered = roles.map((r, i) => ({ r, i })).reverse();

  return (
    <div className={s.timeline}>
      <div className={s.axis} aria-hidden="true">
        {ticks.map((t) => (
          <span
            key={t.k}
            className={s.tick}
            data-major={t.m === 0 || t.k === 0 ? "" : undefined}
            style={{ left: `${(t.k / SPAN) * 100}%` }}
          >
            {(t.m === 0 || t.k === 0) && <em>{t.y}</em>}
            {t.k < SPAN && t.k % 3 === 0 && <b>{MONTHS[t.m]}</b>}
          </span>
        ))}
      </div>

      <div className={s.bars} role="tablist" aria-label="Roles">
        {ordered.map(({ r, i }, k) => (
          <button
            key={r.title}
            type="button"
            role="tab"
            aria-selected={sel === i}
            className={s.barRow}
            onClick={() => setSel(i)}
            onPointerEnter={() => setSel(i)}
            style={{ "--from": `${at(r.start)}%`, "--to": `${at(r.end, true)}%`, "--k": k } as CSSProperties}
          >
            <span className={s.bar} data-kind={r.title.includes("Intern") ? "intern" : "associate"} />
            <span className={s.barLabel}>
              {r.title} <em>{r.label}</em>
            </span>
          </button>
        ))}
      </div>

      <div className={s.rolePanel} key={role.title} role="tabpanel">
        <div className={s.roleHead}>
          <p className={s.roleDate}>{role.label}</p>
          <h3 className={s.roleTitle}>{role.title}</h3>
          <p className={s.roleCount}>{month(role.end) - month(role.start) + 1} months</p>
        </div>
        <ul className={s.points}>
          {role.points.map((p, k) => (
            <li key={p} style={{ "--k": k } as CSSProperties}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
