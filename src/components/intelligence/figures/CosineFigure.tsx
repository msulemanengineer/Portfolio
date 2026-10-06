"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import s from "./figures.module.css";

const W = 480;
const H = 340;
const O = { x: 56, y: 292 };
const LEN = 236;
const A_DEG = 24;
const MIN = 0;
const MAX = 90;

const rad = (d: number) => (d * Math.PI) / 180;
const tip = (deg: number, len = LEN) => ({
  x: O.x + Math.cos(rad(deg)) * len,
  y: O.y - Math.sin(rad(deg)) * len,
});

function verdict(c: number) {
  if (c > 0.9) return "near-identical descriptions";
  if (c > 0.7) return "strong recommendation";
  if (c > 0.4) return "loosely related";
  if (c > 0.1) return "barely related";
  return "nothing in common";
}

/**
 * Two TF-IDF vectors drawn in two of their thousands of dimensions.
 * TF-IDF weights are never negative, so the angle lives in one quadrant and
 * cosine similarity runs from 0 (no shared terms) to 1 (same direction).
 */
export function CosineFigure() {
  const [b, setB] = useState(58);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const theta = Math.abs(b - A_DEG);
  const cos = Math.cos(rad(theta));
  const pa = tip(A_DEG);
  const pb = tip(b);
  const lo = Math.min(A_DEG, b);
  const hi = Math.max(A_DEG, b);
  const r = 64;
  const arcStart = tip(lo, r);
  const arcEnd = tip(hi, r);
  const mid = tip((lo + hi) / 2, r + 18);

  const fromPointer = useCallback((e: PointerEvent<SVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W - O.x;
    const y = O.y - ((e.clientY - box.top) / box.height) * H;
    const deg = (Math.atan2(y, x) * 180) / Math.PI;
    setB(Math.round(Math.min(MAX, Math.max(MIN, deg))));
  }, []);

  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const step = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = b + step;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = b - step;
    if (e.key === "Home") next = MIN;
    if (e.key === "End") next = MAX;
    if (next === null) return;
    e.preventDefault();
    setB(Math.min(MAX, Math.max(MIN, next)));
  };

  return (
    <div className={s.cosine}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={s.cosineSvg}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
        role="img"
        aria-labelledby="cosine-title"
      >
        <title id="cosine-title">
          {`Two movie vectors ${theta} degrees apart; cosine similarity ${cos.toFixed(2)}.`}
        </title>
        {/* axes: two of the vocabulary's dimensions */}
        <g className={s.axisLines}>
          <line x1={O.x} y1={O.y} x2={W - 24} y2={O.y} />
          <line x1={O.x} y1={O.y} x2={O.x} y2={28} />
        </g>
        <text className={s.axisLabel} x={W - 24} y={O.y + 22} textAnchor="end">
          weight of “space”
        </text>
        <text className={s.axisLabel} x={O.x - 12} y={36} textAnchor="end">
          “heist”
        </text>

        <path
          className={s.arc}
          d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 0 ${arcEnd.x} ${arcEnd.y}`}
        />
        <text className={s.theta} x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="middle">
          θ
        </text>

        <line className={s.vecA} x1={O.x} y1={O.y} x2={pa.x} y2={pa.y} />
        <circle className={s.dotA} cx={pa.x} cy={pa.y} r={5} />
        <text className={s.vecLabel} x={pa.x + 10} y={pa.y + 4}>
          the movie you picked
        </text>

        <line className={s.vecB} x1={O.x} y1={O.y} x2={pb.x} y2={pb.y} />
        <g
          className={s.handle}
          tabIndex={0}
          role="slider"
          aria-label="Angle of the candidate movie"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={b}
          aria-valuetext={`${theta} degrees apart, cosine ${cos.toFixed(2)}`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.currentTarget as SVGGElement).setPointerCapture?.(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => dragging.current && fromPointer(e)}
          onPointerUp={() => (dragging.current = false)}
        >
          <circle cx={pb.x} cy={pb.y} r={22} className={s.hit} />
          <circle cx={pb.x} cy={pb.y} r={7} className={s.dotB} />
        </g>
        <text className={s.vecLabel} x={pb.x + 14} y={pb.y - 10}>
          a candidate
        </text>

        <circle cx={O.x} cy={O.y} r={2.5} className={s.origin} />
      </svg>

      <div className={s.cosineReadout} aria-live="polite">
        <p className={s.cosValue}>
          cos θ = <strong>{cos.toFixed(2)}</strong>
        </p>
        <div className={s.meter} aria-hidden="true">
          <span style={{ width: `${Math.max(0, cos) * 100}%` }} />
        </div>
        <p className={s.cosVerdict}>{verdict(cos)}</p>
      </div>
      <p className={s.hintLine}>Drag the red point. Real TF-IDF vectors have thousands of dimensions — two are drawn here.</p>
    </div>
  );
}
