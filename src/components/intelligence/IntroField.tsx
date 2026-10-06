"use client";

import { useEffect, useRef } from "react";
import { gaussian, mulberry32 } from "@/lib/origin/random";
import s from "./Intelligence.module.css";

const INK = "233, 230, 221";
const VERMILION = "224, 72, 42";
const K = 4;

interface Pt {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ph1: number;
  ph2: number;
  w1: number;
  w2: number;
  amp: number;
  r: number;
}

/**
 * The Origin's grid, fully dissolved into data — and searched.
 * The cursor (or, without one, a wandering probe) is a query; its 4 nearest
 * points light up, the same top-k retrieval the RAG project performs.
 * Points arrive scattered and settle onto a latent curve (SETTLE: a spring).
 */
export function IntroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest("header");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let pts: Pt[] = [];
    let raf = 0;
    let visible = true;
    let start = performance.now();
    let last = start;
    const pointer = { x: 0, y: 0, active: false };
    const probe = { x: 0, y: 0 };

    const curveY = (u: number) => 0.5 - Math.sin(u * 5.4 + 0.7) * 0.2;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const rand = mulberry32(2026);
      const count = W < 600 ? 90 : 170;
      pts = Array.from({ length: count }, () => {
        const u = rand();
        const hx = u * W;
        const hy = Math.min(0.96, Math.max(0.04, curveY(u) + gaussian(rand) * 0.13)) * H;
        const fresh = !reduced;
        return {
          hx,
          hy,
          x: fresh ? rand() * W : hx,
          y: fresh ? rand() * H : hy,
          vx: 0,
          vy: 0,
          ph1: rand() * Math.PI * 2,
          ph2: rand() * Math.PI * 2,
          w1: 0.25 + rand() * 0.35,
          w2: 0.2 + rand() * 0.3,
          amp: 3 + rand() * 7,
          r: 1 + rand() * 1.3,
        };
      });
      start = performance.now();
    };

    const draw = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;

      // Probe wanders along the latent curve when no cursor is steering.
      const u = (Math.sin(t * 0.13) * 0.5 + 0.5) * 0.9 + 0.05;
      probe.x += ((u * W) - probe.x) * 0.04;
      probe.y += (curveY(u) * H + Math.sin(t * 0.7) * H * 0.06 - probe.y) * 0.04;
      const q = pointer.active ? pointer : probe;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const k = 60;
      const c = 2 * 0.55 * Math.sqrt(k);
      for (const p of pts) {
        const tx = p.hx + (reduced ? 0 : Math.sin(t * p.w1 + p.ph1) * p.amp);
        const ty = p.hy + (reduced ? 0 : Math.cos(t * p.w2 + p.ph2) * p.amp);
        if (reduced) {
          p.x = tx;
          p.y = ty;
        } else {
          p.vx += ((tx - p.x) * k - p.vx * c) * dt;
          p.vy += ((ty - p.y) * k - p.vy * c) * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
      }

      // Top-k nearest to the query.
      const near: Array<{ p: Pt; d: number }> = [];
      for (const p of pts) {
        const d = (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
        if (near.length < K) {
          near.push({ p, d });
          near.sort((a, b) => a.d - b.d);
        } else if (d < near[K - 1].d) {
          near[K - 1] = { p, d };
          near.sort((a, b) => a.d - b.d);
        }
      }
      const hits = new Set(near.map((n) => n.p));

      ctx.fillStyle = `rgba(${INK}, 0.3)`;
      ctx.beginPath();
      for (const p of pts) {
        if (hits.has(p)) continue;
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();

      const reveal = Math.min(1, Math.max(0, (t - 1.2) / 0.6));
      if (reveal > 0) {
        ctx.strokeStyle = `rgba(${VERMILION}, ${0.55 * reveal})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const n of near) {
          ctx.moveTo(q.x, q.y);
          ctx.lineTo(n.p.x, n.p.y);
        }
        ctx.stroke();

        ctx.fillStyle = `rgba(${VERMILION}, ${reveal})`;
        ctx.beginPath();
        for (const n of near) {
          ctx.moveTo(n.p.x + 2.6, n.p.y);
          ctx.arc(n.p.x, n.p.y, 2.6, 0, Math.PI * 2);
        }
        ctx.fill();

        ctx.strokeStyle = `rgba(${INK}, ${0.85 * reveal})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (visible && !document.hidden && !reduced) raf = requestAnimationFrame(draw);
    };

    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.x >= 0 && pointer.x <= W && pointer.y >= 0 && pointer.y <= H;
      if (reduced) kick();
    };
    const onLeave = () => {
      pointer.active = false;
      if (reduced) kick();
    };

    build();
    probe.x = W * 0.5;
    probe.y = H * 0.5;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    let builtWidth = W;
    const ro = new ResizeObserver(() => {
      const w = canvas.getBoundingClientRect().width;
      if (Math.abs(w - builtWidth) < 1) return;
      builtWidth = w;
      build();
      kick();
    });
    ro.observe(canvas);
    const onVis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", onVis);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className={s.scatter} aria-hidden="true" />;
}
