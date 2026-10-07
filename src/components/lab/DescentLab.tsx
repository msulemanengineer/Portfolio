"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { lab } from "@/content/lab";
import s from "./Lab.module.css";

const SIZE = 420;
const PAD = 30;
const span = SIZE - PAD * 2;
const toX = (v: number) => PAD + v * span;
const toY = (v: number) => SIZE - PAD - v * span;

interface P {
  x: number;
  y: number;
}

const SEED: P[] = [
  { x: 0.1, y: 0.22 },
  { x: 0.22, y: 0.3 },
  { x: 0.33, y: 0.31 },
  { x: 0.45, y: 0.47 },
  { x: 0.56, y: 0.5 },
  { x: 0.68, y: 0.62 },
  { x: 0.8, y: 0.66 },
  { x: 0.9, y: 0.8 },
];

function mse(pts: P[], w: number, b: number) {
  if (!pts.length) return 0;
  return pts.reduce((sum, p) => sum + (w * p.x + b - p.y) ** 2, 0) / pts.length;
}

export function DescentLab() {
  const [pts, setPts] = useState<P[]>(SEED);
  const [w, setW] = useState(-0.4);
  const [b, setB] = useState(0.9);
  const [rate, setRate] = useState<number>(lab.descent.rates[1]);
  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const state = useRef({ w, b, pts, rate });
  state.current = { w, b, pts, rate };

  const step = useCallback(() => {
    const { w, b, pts, rate } = state.current;
    if (!pts.length) return;
    let gw = 0;
    let gb = 0;
    for (const p of pts) {
      const r = w * p.x + b - p.y;
      gw += r * p.x;
      gb += r;
    }
    gw = (2 / pts.length) * gw;
    gb = (2 / pts.length) * gb;
    const nw = Math.max(-1e4, Math.min(1e4, w - rate * gw));
    const nb = Math.max(-1e4, Math.min(1e4, b - rate * gb));
    setW(nw);
    setB(nb);
    setEpoch((e) => e + 1);
    setHistory((h) => [...h.slice(-119), mse(pts, nw, nb)]);
  }, []);

  // Once it has clearly blown up, stop: there is nothing more to learn from it.
  useEffect(() => {
    if (running && mse(pts, w, b) > 1e3) setRunning(false);
  }, [running, pts, w, b]);

  useEffect(() => {
    if (!running) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(step, reduced ? 250 : 60);
    return () => window.clearInterval(id);
  }, [running, step]);

  const reset = () => {
    setRunning(false);
    setW(-0.4);
    setB(0.9);
    setEpoch(0);
    setHistory([]);
  };

  const add = (e: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = (((e.clientX - box.left) / box.width) * SIZE - PAD) / span;
    const y = (SIZE - PAD - ((e.clientY - box.top) / box.height) * SIZE) / span;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    setPts((p) => [...p, { x, y }]);
  };

  const loss = mse(pts, w, b);
  const diverging = loss > 5;
  const hMax = Math.max(0.05, ...history.slice(0, 20));
  const spark = history.map((v, i) => `${(i / 119) * 100},${40 - Math.min(1, v / hMax) * 38}`).join(" ");

  return (
    <div className={s.exp}>
      <div className={s.controls}>
        <p className={s.fieldLabel}>Learning rate</p>
        <div className={s.chips} role="group" aria-label="Learning rate">
          {lab.descent.rates.map((r) => (
            <button key={r} type="button" aria-pressed={rate === r} onClick={() => setRate(r)}>
              {r}
              {r === lab.descent.rates[lab.descent.rates.length - 1] && " (too high)"}
            </button>
          ))}
        </div>

        <div className={s.buttons}>
          <button type="button" className={s.primaryBtn} onClick={() => setRunning((v) => !v)}>
            {running ? "Pause" : "Play"}
          </button>
          <button type="button" className={s.ghostBtn} onClick={step} disabled={running}>
            Step
          </button>
          <button type="button" className={s.ghostBtn} onClick={reset}>
            Reset line
          </button>
          <button type="button" className={s.ghostBtn} onClick={() => setPts([])}>
            Clear points
          </button>
        </div>

        <dl className={s.readout} aria-live="polite">
          <div>
            <dt>Epoch</dt>
            <dd>{epoch}</dd>
          </div>
          <div>
            <dt>Loss (MSE)</dt>
            <dd data-bad={diverging ? "" : undefined}>{loss > 999 ? "∞" : loss.toFixed(4)}</dd>
          </div>
          <div>
            <dt>Model</dt>
            <dd>
              {diverging ? "unstable" : <>ŷ = {w.toFixed(2)}x {b >= 0 ? "+" : "−"} {Math.abs(b).toFixed(2)}</>}
            </dd>
          </div>
        </dl>
        <svg className={s.spark} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={spark} />
        </svg>
        <p className={s.sparkLabel} data-bad={diverging ? "" : undefined}>{diverging ? "Diverged: the learning rate is too big, so every step overshoots the minimum. Reset and pick a smaller rate." : "Loss over the last 120 steps"}</p>
      </div>

      <div className={s.stage}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className={s.plot}
          onPointerDown={add}
          role="img"
          aria-label={`${pts.length} data points and a fitted line with loss ${loss.toFixed(3)}. Click to add a point.`}
        >
          <defs>
            <clipPath id="plot-area">
              <rect x={PAD} y={PAD} width={span} height={span} />
            </clipPath>
          </defs>
          <line className={s.axisLine} x1={PAD} y1={SIZE - PAD} x2={SIZE - PAD} y2={SIZE - PAD} />
          <line className={s.axisLine} x1={PAD} y1={SIZE - PAD} x2={PAD} y2={PAD} />
          <g clipPath="url(#plot-area)">
            {pts.map((p, i) => (
              <line key={`r${i}`} className={s.residual} x1={toX(p.x)} y1={toY(p.y)} x2={toX(p.x)} y2={toY(w * p.x + b)} />
            ))}
            <line className={s.fit} x1={toX(0)} y1={toY(b)} x2={toX(1)} y2={toY(w + b)} />
          </g>
          {pts.map((p, i) => (
            <circle key={`p${i}`} className={s.datum} cx={toX(p.x)} cy={toY(p.y)} r={5} />
          ))}
        </svg>
        <p className={s.hintLine}>Click the plot to add a point. Dashed lines are the errors the model is shrinking.</p>
      </div>
    </div>
  );
}
