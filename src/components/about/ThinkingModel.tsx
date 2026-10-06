"use client";

import { useEffect, useRef, useState } from "react";
import s from "./About.module.css";

const INK = "23, 23, 26";
const VERMILION = "224, 72, 42";
const LAYERS = [4, 8, 12, 12, 8, 4];
const N = 48;

type V3 = [number, number, number];
type Mode = 0 | 1;

/** Written: a 4 × 4 × 3 lattice. */
function lattice(): V3[] {
  const out: V3[] = [];
  for (let z = 0; z < 3; z++)
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) out.push([(x - 1.5) * 0.62, (y - 1.5) * 0.62, (z - 1) * 0.62]);
  return out;
}

/** Learned: six layers of a network, each a ring of nodes. */
function network(): { pos: V3[]; layer: number[] } {
  const pos: V3[] = [];
  const layer: number[] = [];
  LAYERS.forEach((size, l) => {
    const x = (l / (LAYERS.length - 1) - 0.5) * 3.2;
    // Each layer is a column of nodes with a little depth, so it reads as a net side-on.
    for (let k = 0; k < size; k++) {
      const y = (k - (size - 1) / 2) * 0.26;
      const z = (k % 2 ? 1 : -1) * 0.22 * Math.min(1, size / 8);
      pos.push([x, y, z]);
      layer.push(l);
    }
  });
  return { pos, layer };
}

const A = lattice();
const NET = network();
const B = NET.pos;

// Lattice edges: neighbours one step apart on a single axis.
const latticeEdges: Array<[number, number]> = [];
for (let i = 0; i < N; i++)
  for (let j = i + 1; j < N; j++) {
    const d = Math.hypot(A[i][0] - A[j][0], A[i][1] - A[j][1], A[i][2] - A[j][2]);
    if (d < 0.63) latticeEdges.push([i, j]);
  }
// Network edges: every node to every node in the next layer.
const netEdges: Array<[number, number]> = [];
const next: number[][] = Array.from({ length: N }, () => []);
for (let i = 0; i < N; i++) {
  const cands = [];
  for (let j = 0; j < N; j++) if (NET.layer[j] === NET.layer[i] + 1) cands.push(j);
  cands
    .sort((a, b) => Math.abs(B[a][1] - B[i][1]) - Math.abs(B[b][1] - B[i][1]))
    .slice(0, 4)
    .forEach((j) => {
      netEdges.push([i, j]);
      next[i].push(j);
    });
}
const latticeNbr: number[][] = Array.from({ length: N }, () => []);
for (const [i, j] of latticeEdges) {
  latticeNbr[i].push(j);
  latticeNbr[j].push(i);
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Pulse {
  from: number;
  to: number;
  t: number;
  speed: number;
}

/**
 * Fig. 1 — the same 48 points, two ways of thinking. Written: a rigid lattice.
 * Learned: a layered network with signals propagating forward. Drag to turn it,
 * hover a node to light its connections, or switch modes.
 */
export function ThinkingModel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>(0);
  const userRef = useRef(false);
  const [mode, setMode] = useState<Mode>(0);

  const choose = (m: Mode) => {
    userRef.current = true;
    modeRef.current = m;
    setMode(m);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let morph = 0;
    let yaw = -0.22;
    let pitch = -0.16;
    let clock = 0;
    let vYaw = 0;
    let vPitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let hover = -1;
    let sinceSwitch = 0;
    const ptr = { x: -1, y: -1 };
    const pulses: Pulse[] = [];
    const proj = new Float32Array(N * 3);

    const size = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };

    const spawn = (from?: number) => {
      const start = from ?? Math.floor(Math.random() * LAYERS[0]);
      if (!next[start].length) return;
      const to = next[start][Math.floor(Math.random() * next[start].length)];
      pulses.push({ from: start, to, t: 0, speed: 1.1 + Math.random() * 0.7 });
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Idle: switch between the two ways of thinking every few seconds.
      sinceSwitch += dt;
      if (!userRef.current && !reduced && sinceSwitch > 4.6) {
        sinceSwitch = 0;
        modeRef.current = modeRef.current ? 0 : 1;
        setMode(modeRef.current);
      }
      const target = modeRef.current;
      morph = reduced ? target : morph + (target - morph) * (1 - Math.exp(-dt * 2.6));

      if (!dragging) {
        if (!reduced) {
          clock += dt;
          // Sway around a three-quarter view: always readable, never end-on.
          const home = -0.22 + Math.sin(clock * 0.35) * 0.26;
          yaw += (home - yaw) * (1 - Math.exp(-dt * 0.8));
        }
        yaw += vYaw;
        pitch += vPitch;
        vYaw *= 0.92;
        vPitch *= 0.92;
      }
      pitch = Math.max(-1.1, Math.min(0.6, pitch));

      // Project.
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const scale = Math.min(W, H) * 0.27;
      for (let i = 0; i < N; i++) {
        const local = ease(Math.min(1, Math.max(0, morph * 1.35 - (i / N) * 0.35)));
        const x = A[i][0] + (B[i][0] - A[i][0]) * local;
        const y = A[i][1] + (B[i][1] - A[i][1]) * local;
        const z = A[i][2] + (B[i][2] - A[i][2]) * local;
        const x1 = x * cy - z * sy;
        const z1 = x * sy + z * cy;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const f = 4.2 / (4.2 + z2);
        proj[i * 3] = W / 2 + x1 * scale * f;
        proj[i * 3 + 1] = H / 2 + y1 * scale * f;
        proj[i * 3 + 2] = z2;
      }

      // Hover: nearest node to the pointer.
      hover = -1;
      if (ptr.x >= 0 && !dragging) {
        let best = 18 * 18;
        for (let i = 0; i < N; i++) {
          const d = (proj[i * 3] - ptr.x) ** 2 + (proj[i * 3 + 1] - ptr.y) ** 2;
          if (d < best) {
            best = d;
            hover = i;
          }
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const P = (i: number) => [proj[i * 3], proj[i * 3 + 1]] as const;

      // A soft floor shadow gives the object weight on the page.
      const floor = H / 2 + scale * 1.55;
      const sh = ctx.createRadialGradient(W / 2, floor, 0, W / 2, floor, scale * 1.4);
      sh.addColorStop(0, `rgba(${INK}, 0.12)`);
      sh.addColorStop(1, `rgba(${INK}, 0)`);
      ctx.save();
      ctx.translate(W / 2, floor);
      ctx.scale(1, 0.16);
      ctx.translate(-W / 2, -floor);
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(W / 2, floor, scale * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Edges: the lattice fades out as the network fades in.
      const la = 1 - morph;
      if (la > 0.02) {
        for (const [i, j] of latticeEdges) {
          const [ax, ay] = P(i);
          const [bx, by] = P(j);
          const d = 1 - ((proj[i * 3 + 2] + proj[j * 3 + 2]) / 2 + 2) / 4;
          ctx.strokeStyle = `rgba(${INK}, ${(0.18 + d * 0.5) * la})`;
          ctx.lineWidth = 0.8 + d * 0.9;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
      if (morph > 0.02) {
        for (const [i, j] of netEdges) {
          const [ax, ay] = P(i);
          const [bx, by] = P(j);
          const d = 1 - ((proj[i * 3 + 2] + proj[j * 3 + 2]) / 2 + 2) / 4;
          ctx.strokeStyle = `rgba(${INK}, ${(0.1 + d * 0.22) * morph})`;
          ctx.lineWidth = 0.7 + d * 0.6;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }

      // Hovered node: its connections in vermilion.
      if (hover >= 0) {
        const nbrs = morph > 0.5 ? [...next[hover], ...netEdges.filter((e) => e[1] === hover).map((e) => e[0])] : latticeNbr[hover];
        ctx.strokeStyle = `rgba(${VERMILION}, 0.85)`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        const [hx, hy] = P(hover);
        for (const j of nbrs) {
          const [bx, by] = P(j);
          ctx.moveTo(hx, hy);
          ctx.lineTo(bx, by);
        }
        ctx.stroke();
      }

      // Signals propagate forward through the network.
      if (!reduced && morph > 0.6) {
        if (pulses.length < 14 && Math.random() < 0.18) spawn();
        for (let k = pulses.length - 1; k >= 0; k--) {
          const p = pulses[k];
          p.t += dt * p.speed;
          if (p.t >= 1) {
            pulses.splice(k, 1);
            if (Math.random() < 0.85) spawn(p.to);
            continue;
          }
          const [ax, ay] = P(p.from);
          const [bx, by] = P(p.to);
          const x = ax + (bx - ax) * p.t;
          const y = ay + (by - ay) * p.t;
          const fade = Math.min(1, (morph - 0.6) * 2.5);
          const t0 = Math.max(0, p.t - 0.22);
          ctx.strokeStyle = `rgba(${VERMILION}, ${0.55 * fade})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(ax + (bx - ax) * t0, ay + (by - ay) * t0);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.fillStyle = `rgba(${VERMILION}, ${fade})`;
          ctx.beginPath();
          ctx.arc(x, y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (morph < 0.5) {
        pulses.length = 0;
      }

      // Nodes, back to front: crosses when written, dots when learned.
      const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => proj[b * 3 + 2] - proj[a * 3 + 2]);
      for (const i of order) {
        const [x, y] = P(i);
        const depth = 1 - (proj[i * 3 + 2] + 2) / 4;
        const alpha = 0.45 + depth * 0.55;
        const lit = i === hover;
        if (la > 0.02) {
          const arm = (lit ? 6 : 3 + depth * 2) * la;
          ctx.strokeStyle = lit ? `rgba(${VERMILION}, 1)` : `rgba(${INK}, ${alpha * la})`;
          ctx.lineWidth = 1.2 + depth * 0.6;
          ctx.beginPath();
          ctx.moveTo(x - arm, y);
          ctx.lineTo(x + arm, y);
          ctx.moveTo(x, y - arm);
          ctx.lineTo(x, y + arm);
          ctx.stroke();
        }
        if (morph > 0.02) {
          const r = (lit ? 5.5 : 2.4 + depth * 2.2) * morph;
          ctx.fillStyle = lit ? `rgba(${VERMILION}, 1)` : `rgba(${INK}, ${alpha * morph})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      dragging = true;
      userRef.current = true;
      const p = local(e);
      lastX = p.x;
      lastY = p.y;
      canvas.setPointerCapture(e.pointerId);
      canvas.dataset.dragging = "";
    };
    const move = (e: PointerEvent) => {
      const p = local(e);
      ptr.x = p.x;
      ptr.y = p.y;
      if (dragging) {
        const dx = p.x - lastX;
        const dy = p.y - lastY;
        yaw += dx * 0.008;
        pitch += dy * 0.006;
        vYaw = dx * 0.0015;
        vPitch = dy * 0.001;
        lastX = p.x;
        lastY = p.y;
      }
      kick();
    };
    const up = () => {
      dragging = false;
      delete canvas.dataset.dragging;
    };
    const leave = () => {
      ptr.x = -1;
      ptr.y = -1;
    };

    size();
    const ro = new ResizeObserver(() => {
      size();
      kick();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    const vis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", vis);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", leave);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <figure className={s.model}>

      <canvas
        ref={canvasRef}
        className={s.modelCanvas}
        role="img"
        aria-label="The same 48 points shown as a rigid lattice or as a layered neural network. Drag to rotate."
      />
      <div className={s.modelFoot}>
        <figcaption className={s.modelCaption}>
          <span>Fig. 1</span> Same 48 points, two ways of thinking.
        </figcaption>
        <div className={s.switch} role="group" aria-label="Way of thinking" data-mode={mode}>
          <button type="button" aria-pressed={mode === 0} onClick={() => choose(0)}>
            <span className={s.cross} aria-hidden="true" /> Written
          </button>
          <button type="button" aria-pressed={mode === 1} onClick={() => choose(1)}>
            <span className={s.node} aria-hidden="true" /> Learned
          </button>
          <span className={s.switchBar} aria-hidden="true" />
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {mode ? "Showing the learned network" : "Showing the written lattice"}
      </span>
    </figure>
  );
}
