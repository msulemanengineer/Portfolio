"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { lab } from "@/content/lab";
import s from "./Lab.module.css";

const SIZE = 420;
const PAD = 34;
const span = SIZE - PAD * 2;
const toX = (v: number) => PAD + v * span;
const toY = (v: number) => SIZE - PAD - v * span;

const cos = (ax: number, ay: number, bx: number, by: number) =>
  (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by) || 1);

export function NeighboursLab() {
  const [q, setQ] = useState({ x: 0.62, y: 0.5 });
  const [k, setK] = useState(3);
  const [min, setMin] = useState(0.9);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef(false);

  const ranked = lab.neighbours.passages
    .map((p) => ({ ...p, sim: cos(q.x, q.y, p.x, p.y) }))
    .sort((a, b) => b.sim - a.sim);
  const hits = ranked.slice(0, k).filter((p) => p.sim >= min);
  const hitSet = new Set(hits.map((h) => h.label));

  const move = (e: PointerEvent<SVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = (((e.clientX - box.left) / box.width) * SIZE - PAD) / span;
    const y = (SIZE - PAD - ((e.clientY - box.top) / box.height) * SIZE) / span;
    setQ({ x: Math.min(1, Math.max(0.03, x)), y: Math.min(1, Math.max(0.03, y)) });
  };

  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const d = e.shiftKey ? 0.08 : 0.03;
    const map: Record<string, [number, number]> = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] };
    const m = map[e.key];
    if (!m) return;
    e.preventDefault();
    setQ((p) => ({ x: Math.min(1, Math.max(0.03, p.x + m[0])), y: Math.min(1, Math.max(0.03, p.y + m[1])) }));
  };

  const angle = (Math.atan2(q.y, q.x) * 180) / Math.PI;

  return (
    <div className={s.exp}>
      <div className={s.controls}>
        <label className={s.fieldLabel} htmlFor="k">
          Top-k <b>{k}</b>
        </label>
        <input id="k" type="range" min={1} max={6} step={1} value={k} onChange={(e) => setK(+e.target.value)} className={s.range} />

        <label className={s.fieldLabel} htmlFor="min">
          Minimum similarity <b>{min.toFixed(2)}</b>
        </label>
        <input
          id="min"
          type="range"
          min={0.5}
          max={0.99}
          step={0.01}
          value={min}
          onChange={(e) => setMin(+e.target.value)}
          className={s.range}
        />

        <ol className={s.results} aria-live="polite">
          {hits.length === 0 && (
            <li className={s.notFound}>
              <b>“Not found in the document.”</b> Nothing clears the threshold, so the assistant says so instead of guessing.
            </li>
          )}
          {hits.map((h, i) => (
            <li key={h.label}>
              <span className={s.rank}>{i + 1}</span>
              <span className={s.rLabel}>{h.label}</span>
              <span className={s.rTrack}>
                <span style={{ "--w": (h.sim - 0.5) / 0.5 } as CSSProperties} />
              </span>
              <span className={s.rVal}>{h.sim.toFixed(3)}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={s.stage}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className={s.plot}
          onPointerMove={(e) => drag.current && move(e)}
          onPointerUp={() => (drag.current = false)}
          onPointerLeave={() => (drag.current = false)}
          onPointerDown={(e) => {
            drag.current = true;
            move(e);
          }}
          overflow="hidden"
          role="img"
          aria-label={`Query vector at ${angle.toFixed(0)} degrees; ${hits.length} passages retrieved.`}
        >
          <line className={s.axisLine} x1={PAD} y1={SIZE - PAD} x2={SIZE - 8} y2={SIZE - PAD} />
          <line className={s.axisLine} x1={PAD} y1={SIZE - PAD} x2={PAD} y2={8} />
          {/* the cone of directions that clear the threshold */}
          {(() => {
            const a = Math.acos(min);
            const base = Math.atan2(q.y, q.x);
            const r = span * 1.0;
            const p1 = [toX(Math.cos(base - a)), toY(Math.sin(base - a))];
            const p2 = [toX(Math.cos(base + a)), toY(Math.sin(base + a))];
            return (
              <path
                className={s.cone}
                d={`M ${PAD} ${SIZE - PAD} L ${p1[0]} ${p1[1]} A ${r} ${r} 0 0 0 ${p2[0]} ${p2[1]} Z`}
              />
            );
          })()}
          {hits.map((h) => (
            <line key={h.label} className={s.hitRay} x1={PAD} y1={SIZE - PAD} x2={toX(h.x)} y2={toY(h.y)} />
          ))}
          {lab.neighbours.passages.map((p) => {
            const on = hitSet.has(p.label);
            return (
              <g key={p.label} className={s.passage} data-on={on ? "" : undefined}>
                <circle cx={toX(p.x)} cy={toY(p.y)} r={on ? 6 : 4} />
                <text
                  x={p.x > 0.55 ? toX(p.x) - 10 : toX(p.x) + 10}
                  y={toY(p.y) + 4}
                  textAnchor={p.x > 0.55 ? "end" : "start"}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
          <line className={s.queryRay} x1={PAD} y1={SIZE - PAD} x2={toX(q.x)} y2={toY(q.y)} />
          <g
            className={s.query}
            tabIndex={0}
            role="slider"
            aria-label="Question vector — arrow keys to move"
            aria-valuenow={Math.round(angle)}
            aria-valuetext={`${angle.toFixed(0)} degrees`}
            onKeyDown={onKey}
          >
            <circle cx={toX(q.x)} cy={toY(q.y)} r={16} className={s.hit} />
            <rect x={toX(q.x) - 6} y={toY(q.y) - 6} width={12} height={12} transform={`rotate(45 ${toX(q.x)} ${toY(q.y)})`} />
          </g>
        </svg>
        <p className={s.hintLine}>Drag the red diamond, or focus it and use the arrow keys.</p>
      </div>
    </div>
  );
}
