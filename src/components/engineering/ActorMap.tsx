"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { SystemSheet } from "@/content/engineering";
import s from "./Explorer.module.css";

interface Wire {
  d: string;
  lit: boolean;
  late: boolean;
  key: string;
}

/** Orthogonal connector between two boxes, like a drafted wire. */
function wire(a: DOMRect, b: DOMRect, origin: DOMRect) {
  const x1 = a.right - origin.left;
  const y1 = a.top + a.height / 2 - origin.top;
  const x2 = b.left - origin.left;
  const y2 = b.top + b.height / 2 - origin.top;
  const mid = Math.round((x1 + x2) / 2);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} H ${mid} V ${y2.toFixed(1)} H ${x2.toFixed(1)}`;
}

interface ActorMapProps {
  sys: SystemSheet;
  active: number;
  onPick: (i: number) => void;
  /** Overview mode: show only each user's headline features. */
  mainOnly?: boolean;
}

/**
 * Users → the platform → the modules that serve the selected user.
 * Laid out in HTML so long module names wrap; wires are measured and drawn
 * over the top in SVG, and requests travel them.
 */
export function ActorMap({ sys, active, onPick, mainOnly = false }: ActorMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const userRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const modRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const actor = sys.actors[active];
  userRefs.current.length = sys.actors.length;
  const shown = mainOnly ? actor.main : actor.modules;
  modRefs.current.length = shown.length;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const core = coreRef.current;
    if (!root || !core) return;
    const measure = () => {
      const o = root.getBoundingClientRect();
      const c = core.getBoundingClientRect();
      const next: Wire[] = [];
      userRefs.current.forEach((el, i) => {
        if (!el) return;
        next.push({ d: wire(el.getBoundingClientRect(), c, o), lit: i === active, late: false, key: `u${i}` });
      });
      modRefs.current.forEach((el, i) => {
        if (!el) return;
        next.push({ d: wire(c, el.getBoundingClientRect(), o), lit: true, late: true, key: `m${shown[i]}` });
      });
      setWires(next);
      setSize({ w: o.width, h: o.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [sys.id, active, shown]);

  const onUserKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = sys.actors.length;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (next === null) return;
    e.preventDefault();
    onPick(next);
    userRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className={s.map}>
      <svg className={s.wires} width={size.w} height={size.h} aria-hidden="true">
        {wires.map((w, k) => (
          <g key={`${w.key}-${active}`} className={s.edge} data-lit={w.lit ? "" : undefined}>
            <path d={w.d} pathLength={1} style={{ "--k": k } as CSSProperties} />
            {w.lit && (
              <rect
                className={s.packet}
                data-late={w.late ? "" : undefined}
                width={6}
                height={6}
                x={-3}
                y={-3}
                style={{ offsetPath: `path("${w.d}")`, "--k": k } as CSSProperties}
              />
            )}
          </g>
        ))}
      </svg>

      <div className={s.users} role="radiogroup" aria-label={`Users of ${sys.name}`}>
        {sys.actors.map((a, i) => (
          <button
            key={a.name}
            ref={(el) => {
              userRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === active}
            tabIndex={i === active ? 0 : -1}
            className={s.user}
            onClick={() => onPick(i)}
            onKeyDown={(e) => onUserKey(e, i)}
          >
            <span>{a.name}</span>
            <em aria-hidden="true">{a.modules.length}</em>
          </button>
        ))}
      </div>

      <div className={s.coreCol}>
        <div ref={coreRef} className={s.coreBox}>
          {sys.name}
        </div>
      </div>

      <ol key={`${sys.id}-${active}`} className={s.mods} aria-label={`Modules serving the ${actor.name.toLowerCase()}`}>
        {shown.map((m, i) => (
          <li
            key={m}
            ref={(el) => {
              modRefs.current[i] = el;
            }}
            style={{ "--k": i } as CSSProperties}
          >
            <span className={s.modNo}>{String(m + 1).padStart(2, "0")}</span>
            {sys.built[m]}
          </li>
        ))}
      </ol>
    </div>
  );
}
