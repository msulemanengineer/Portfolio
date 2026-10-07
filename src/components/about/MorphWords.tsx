"use client";

import { useEffect, useRef, useState } from "react";
import { mulberry32 } from "@/lib/origin/random";
import s from "./About.module.css";

const PAPER = "236, 234, 227";
const VERMILION = "224, 72, 42";
const HOLD = 3400;

interface Props {
  words: readonly string[];
}

/**
 * The homepage's particle effect, turned into a sentence about me: a few
 * thousand points flow from word to word. The pointer pushes them; a click
 * scatters them; they always find their way back.
 */
export function MorphWords({ words }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(77);

    let W = 0;
    let H = 0;
    let dpr = 1;
    let n = 0;
    let targets: Float32Array[] = [];
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let size = 2;
    let word = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let switchAt = last + HOLD;
    const ptr = { x: -9999, y: -9999, on: false };

    const sample = (text: string) => {
      const off = document.createElement("canvas");
      off.width = Math.round(W);
      off.height = Math.round(H);
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return { pts: [] as number[], step: 3 };
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-instrument-sans").trim() || "sans-serif";
      const setFont = (px: number) => {
        o.font = `600 ${px}px ${family}`;
        if ("fontStretch" in o) o.fontStretch = "condensed";
      };
      setFont(100);
      const per100 = o.measureText(text.toUpperCase()).width / 100;
      const fs = Math.min((W * 0.96) / per100, H * 1.02);
      setFont(fs);
      o.textBaseline = "alphabetic";
      o.fillStyle = "#000";
      o.fillText(text.toUpperCase(), 0, H * 0.5 + fs * 0.36);
      const step = Math.max(2.6, fs / 44);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const pts: number[] = [];
      for (let y = 0; y < H; y += step)
        for (let x = 0; x < W; x += step) {
          if (data[(Math.floor(y) * off.width + Math.floor(x)) * 4 + 3] < 128) continue;
          pts.push(x + (rand() - 0.5) * step * 0.8, y + (rand() - 0.5) * step * 0.8);
        }
      return { pts, step };
    };

    const build = () => {
      const r = wrap.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const sampled = words.map(sample);
      n = Math.max(...sampled.map((w) => w.pts.length / 2));
      size = Math.max(1.6, Math.min(...sampled.map((w) => w.step)) * 0.66);
      // Every word gets exactly n targets: shuffled, padded by repeating its own points.
      targets = sampled.map(({ pts }) => {
        const m = pts.length / 2;
        const order = Array.from({ length: m }, (_, i) => i);
        for (let i = m - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
        const t = new Float32Array(n * 2);
        for (let i = 0; i < n; i++) {
          const k = order[i % m];
          t[i * 2] = pts[k * 2];
          t[i * 2 + 1] = pts[k * 2 + 1];
        }
        return t;
      });
      const first = px.length !== n;
      if (first) {
        px = new Float32Array(n);
        py = new Float32Array(n);
        vx = new Float32Array(n);
        vy = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          px[i] = reduced ? targets[word][i * 2] : rand() * W;
          py[i] = reduced ? targets[word][i * 2 + 1] : rand() * H;
        }
      }
    };

    const next = () => {
      word = (word + 1) % words.length;
      setIndex(word);
      // A gentle push outward, so the letters dissolve before they reform.
      for (let i = 0; i < n; i++) {
        vx[i] += (rand() - 0.5) * 200;
        vy[i] += (rand() - 0.5) * 140;
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!reduced && now > switchAt) {
        next();
        switchAt = now + HOLD;
      }
      const t = targets[word];
      const k = 46;
      const c = 2 * 0.7 * Math.sqrt(k);
      const R = Math.max(70, Math.min(W, H) * 0.32);

      for (let i = 0; i < n; i++) {
        let ax = (t[i * 2] - px[i]) * k - vx[i] * c;
        let ay = (t[i * 2 + 1] - py[i]) * k - vy[i] * c;
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
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const settled = new Path2D();
      const warm = new Path2D();
      const hot = new Path2D();
      for (let i = 0; i < n; i++) {
        const e = Math.abs(px[i] - t[i * 2]) + Math.abs(py[i] - t[i * 2 + 1]);
        (e > 22 ? hot : e > 5 ? warm : settled).rect(px[i] - size / 2, py[i] - size / 2, size, size);
      }
      ctx.fillStyle = `rgba(${PAPER}, 0.95)`;
      ctx.fill(settled);
      ctx.fillStyle = `rgba(${VERMILION}, 0.6)`;
      ctx.fill(warm);
      ctx.fillStyle = `rgba(${VERMILION}, 1)`;
      ctx.fill(hot);

      if (visible && !document.hidden && !reduced) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const move = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = !reduced;
      kick();
    };
    const leave = () => {
      ptr.on = false;
    };
    const burst = (e: PointerEvent) => {
      if (reduced) return;
      const r = wrap.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      for (let i = 0; i < n; i++) {
        const dx = px[i] - cx;
        const dy = py[i] - cy;
        const d = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - d / (W * 0.5)) * 1100;
        vx[i] += (dx / d) * f;
        vy[i] += (dy / d) * f;
      }
      kick();
    };

    let builtW = 0;
    const ro = new ResizeObserver(() => {
      const w = wrap.getBoundingClientRect().width;
      if (Math.abs(w - builtW) < 1) return;
      builtW = w;
      build();
      kick();
    });
    document.fonts.ready.then(() => {
      builtW = wrap.getBoundingClientRect().width;
      build();
      ro.observe(wrap);
      last = performance.now();
      switchAt = last + HOLD + 600;
      if (reduced) {
        // One still frame of the first word.
        raf = requestAnimationFrame(frame);
      } else kick();
    });
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) {
        switchAt = performance.now() + HOLD;
        kick();
      }
    });
    io.observe(wrap);
    const vis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", vis);
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);
    wrap.addEventListener("pointerdown", burst);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
      wrap.removeEventListener("pointerdown", burst);
    };
  }, [words]);

  return (
    <div className={s.morph}>
      <div ref={wrapRef} className={s.morphStage}>
        <canvas ref={canvasRef} className={s.morphCanvas} aria-hidden="true" />
      </div>
      <p className={s.morphIndex} aria-hidden="true">
        {words.map((w, k) => (
          <span key={w} data-on={k === index ? "" : undefined}>
            {String(k + 1).padStart(2, "0")} {w}
          </span>
        ))}
      </p>
    </div>
  );
}
