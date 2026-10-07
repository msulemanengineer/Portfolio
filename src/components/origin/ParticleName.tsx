"use client";

import { useEffect, useRef, type RefObject } from "react";
import { sampleName } from "@/lib/origin/name-sampler";
import { LOADER_MS } from "@/lib/origin/timeline";
import s from "./Origin.module.css";

const PAPER = "236, 234, 227";
const VERMILION = "224, 72, 42";

interface Props {
  rootRef: RefObject<HTMLElement | null>;
  nameRef: RefObject<HTMLElement | null>;
  errorRef: RefObject<HTMLSpanElement | null>;
  countRef: RefObject<HTMLSpanElement | null>;
}

/**
 * The name as a few thousand particles. They start as noise and are pulled
 * into the letters — a model reconstructing its input. The pointer disturbs
 * them; a click sends a shockwave. The readout is the real mean squared
 * distance between every particle and its place in the name.
 */
export function ParticleName({ rootRef, nameRef, errorRef, countRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const nameEl = nameRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !root || !nameEl || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let n = 0;
    let tx = new Float32Array(0);
    let ty = new Float32Array(0);
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let size = 2;
    let raf = 0;
    let visible = true;
    let born = performance.now();
    let last = born;
    let lastReadout = 0;
    let calm = 0;
    const ptr = { x: -9999, y: -9999, on: false };

    const build = (scatter: boolean) => {
      const r = root.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const dots = sampleName(nameEl, root, W < 700 ? 30 : 46);
      if (!dots) return;
      // Keep the particle count humane on small screens.
      const keep = 1;
      const idx: number[] = [];
      for (let i = 0; i < dots.count; i++) if (Math.random() < keep) idx.push(i);
      n = idx.length;
      tx = new Float32Array(n);
      ty = new Float32Array(n);
      px = new Float32Array(n);
      py = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      size = Math.max(1.4, dots.step * 0.7);
      idx.forEach((j, i) => {
        tx[i] = dots.xs[j];
        ty[i] = dots.ys[j];
        px[i] = scatter && !reduced ? Math.random() * W : tx[i];
        py[i] = scatter && !reduced ? Math.random() * H : ty[i];
      });
      if (countRef.current) countRef.current.textContent = n.toLocaleString("en-US");
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const age = (now - born) / 1000;
      // Warm-up: the pull strengthens over the first second and a half, so it converges like training.
      const warm = reduced ? 1 : Math.min(1, Math.max(0.04, (age - 0.2) / 1.5));
      const k = 38 * warm;
      const c = 2 * 0.58 * Math.sqrt(38) * (0.5 + warm * 0.5);
      const R = Math.max(90, Math.min(W, H) * 0.14);
      let err = 0;
      let moving = false;

      for (let i = 0; i < n; i++) {
        let ax = (tx[i] - px[i]) * k - vx[i] * c;
        let ay = (ty[i] - py[i]) * k - vy[i] * c;
        if (ptr.on) {
          const dx = px[i] - ptr.x;
          const dy = py[i] - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / R) ** 2 * 5200;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        vx[i] += ax * dt;
        vy[i] += ay * dt;
        px[i] += vx[i] * dt;
        py[i] += vy[i] * dt;
        const ex = px[i] - tx[i];
        const ey = py[i] - ty[i];
        err += ex * ex + ey * ey;
        if (!moving && (Math.abs(vx[i]) > 0.5 || Math.abs(vy[i]) > 0.5 || ex * ex + ey * ey > 0.5)) moving = true;
      }
      err = n ? err / n : 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // Settled particles in paper; displaced ones in vermilion, brighter the further they are.
      const settled = new Path2D();
      const hot = new Path2D();
      const warmP = new Path2D();
      for (let i = 0; i < n; i++) {
        const e = Math.abs(px[i] - tx[i]) + Math.abs(py[i] - ty[i]);
        const p = e > 24 ? hot : e > 6 ? warmP : settled;
        p.rect(px[i] - size / 2, py[i] - size / 2, size, size);
      }
      ctx.fillStyle = `rgba(${PAPER}, 0.95)`;
      ctx.fill(settled);

      ctx.fillStyle = `rgba(${VERMILION}, 0.65)`;
      ctx.fill(warmP);
      ctx.fillStyle = `rgba(${VERMILION}, 1)`;
      ctx.fill(hot);

      if (now - lastReadout > 90) {
        lastReadout = now;
        if (errorRef.current) errorRef.current.textContent = err < 0.005 ? "0.000" : err.toFixed(err > 100 ? 0 : 3);
      }

      calm = moving || ptr.on ? 0 : calm + 1;
      if (visible && !document.hidden && (calm < 30 || ptr.on)) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      calm = 0;
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const move = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = !reduced;
      kick();
    };
    const leave = () => {
      ptr.on = false;
      kick();
    };
    // A click (or tap) sends a shockwave through the letters.
    const burst = (e: PointerEvent) => {
      if (reduced) return;
      const target = e.target as HTMLElement;
      if (target.closest("a, button")) return;
      const r = root.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      const R = Math.max(W, H) * 0.35;
      for (let i = 0; i < n; i++) {
        const dx = px[i] - cx;
        const dy = py[i] - cy;
        const d = Math.hypot(dx, dy) || 1;
        if (d > R) continue;
        const f = (1 - d / R) * 900;
        vx[i] += (dx / d) * f;
        vy[i] += (dy / d) * f;
      }
      kick();
    };

    let builtW = 0;
    const ro = new ResizeObserver(() => {
      const w = root.getBoundingClientRect().width;
      if (Math.abs(w - builtW) < 1) return;
      builtW = w;
      build(false);
      kick();
    });
    document.fonts.ready.then(() => {
      // If the start loader is covering the page, assemble the name as it lifts.
      born = performance.now() + (document.documentElement.dataset.loader === "on" ? LOADER_MS - 500 : 0);
      builtW = root.getBoundingClientRect().width;
      build(true);
      kick();
      ro.observe(root);
    });
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("pointerdown", burst);
    const vis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", vis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointerdown", burst);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [rootRef, nameRef, errorRef, countRef]);

  return <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />;
}
