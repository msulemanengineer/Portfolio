import {
  MOBILE_QUERY,
  curveFrame,
  geometryFor,
  truth,
  type CurveFrame,
  type Geometry,
} from "./layout";
import { sampleName, type NameDots } from "./name-sampler";
import { mulberry32, gaussian } from "./random";
import { PolyRegressor } from "./regression";
import { EXIT_KEY, INTRO_SEEN_KEY, T } from "./timeline";

export type Side = "written" | "learned";

export interface OriginEngineOptions {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  name: HTMLElement;
  handle: HTMLElement;
  readouts: { loss: HTMLElement | null; hint: HTMLElement | null };
  playIntro: boolean;
  returnFrom: Side | null;
  reducedMotion: boolean;
  hintAdded: string;
}

const INK = "23, 23, 26";
const VERMILION = "224, 72, 42";
const LEVELS = 10;
const CROSS_ALPHA = 0.2;
const DOT_ALPHA = 0.86;
const GHOST = 0.18;
const DEGREE = 6;
const MAX_USER_POINTS = 48;
const TRAIN_CAP = 2400;
const STEPS_PER_FRAME = 4;
/** Release uses an under-damped spring (it *settles*); return is a crisp ease (it is *drawn*). */
const SPRING_K = 115;
const SPRING_C = 2 * 0.48 * Math.sqrt(SPRING_K);
const RETURN_RATE = 21;

interface Tween {
  from: number;
  to: number;
  start: number;
  dur: number;
  done?: () => void;
}

const easeDraw = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export class OriginEngine {
  private readonly o: OriginEngineOptions;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly mq: MediaQueryList;
  private readonly html = document.documentElement;
  private geo!: Geometry;
  private dpr = 1;

  // Lattice nodes (struct of arrays).
  private n = 0;
  private hx = new Float32Array(0);
  private hy = new Float32Array(0);
  private px = new Float32Array(0);
  private py = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private morph = new Float32Array(0);
  private alpha = new Float32Array(0);
  private jx = new Float32Array(0);
  private noise = new Float32Array(0);
  private appear = new Float32Array(0);
  private sample = new Uint8Array(0);
  private gridX0 = 0;
  private gridY0 = 0;
  private cols = 0;
  private rows = 0;

  private dots: NameDots | null = null;
  private fontsReady = false;

  // Boundary between written and learned (px along the orientation axis).
  private b = 0;
  private bRest = 0;
  private preview = 0;
  private tween: Tween | null = null;
  private dragging = false;
  private userMoved = false;
  private lastCssB = NaN;

  // Model.
  private readonly model = new PolyRegressor(DEGREE);
  private us = new Float64Array(512);
  private vs = new Float64Array(512);
  private nTrain = 0;
  private builtFor = NaN;
  private loss = 0;
  private steps = 0;
  private sinceChange = 0;
  private fitStarted = false;
  private curveAlpha = 0;
  private userPts: Array<{ fx: number; fy: number }> = [];

  private pointer = { x: 0, y: 0, inside: false, fine: true };
  private phase: "intro" | "live" = "live";
  private sweepStarted = false;
  private t0 = 0;
  private last = 0;
  private raf = 0;
  private lastReadout = 0;
  private destroyed = false;
  private resizeTimer = 0;
  private readonly cleanups: Array<() => void> = [];

  constructor(options: OriginEngineOptions) {
    this.o = options;
    const ctx = options.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    this.mq = window.matchMedia(MOBILE_QUERY);
    this.layout();

    if (options.playIntro && !options.reducedMotion) {
      this.phase = "intro";
      this.b = this.geo.allWritten;
      this.t0 = performance.now();
      this.html.dataset.intro = "play";
    } else {
      this.startLive(options.returnFrom);
    }

    this.bind();
    document.fonts.ready.then(() => {
      if (this.destroyed) return;
      this.fontsReady = true;
        this.fitMobileRest();
      if (this.phase === "live" && !this.tween) this.b = this.bRest;
      this.dots = sampleName(this.o.name, this.o.root);
      this.request();
    });
    this.writeBoundary();
    this.request();
  }

  // ─── lifecycle ────────────────────────────────────────────────────────────

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.resizeTimer);
    for (const off of this.cleanups) off();
    if (this.phase === "intro") this.html.dataset.intro = "pending";
  }

  /** Sweep the boundary so one world takes the whole sheet, then resolve. */
  exit(side: Side): Promise<void> {
    try {
      sessionStorage.setItem(EXIT_KEY, side);
    } catch {}
    if (this.o.reducedMotion) return Promise.resolve();
    if (this.phase === "intro") this.skip();
    this.o.root.dataset.exit = side;
    const to = side === "written" ? this.geo.allWritten : this.geo.allLearned;
    return new Promise((resolve) => {
      this.startTween(to, 760, () => window.setTimeout(resolve, 60));
    });
  }

  /** Hovering a fork leans the boundary toward what clicking it would do. */
  setPreview(side: Side | null) {
    const len = this.geo.orient === "x" ? this.geo.W : this.geo.H;
    this.preview = side === "written" ? len * 0.06 : side === "learned" ? -len * 0.06 : 0;
    this.request();
  }

  skip() {
    if (this.phase !== "intro") return;
    this.tween = null;
    this.b = this.bRest;
    this.fitStarted = true;
    this.curveAlpha = 1;
    this.appear.fill(0);
    this.snapNodes();
    this.markDataChanged();
    this.finishIntro();
    this.request();
  }

  // ─── setup ────────────────────────────────────────────────────────────────

  private startLive(returnFrom: Side | null) {
    this.phase = "live";
    this.fitStarted = true;
    this.curveAlpha = 1;
    this.b = this.bRest;
    this.snapNodes();
    this.pretrain(1800);
    if (returnFrom && !this.o.reducedMotion) {
      this.b = returnFrom === "written" ? this.geo.allWritten : this.geo.allLearned;
      this.snapNodes();
      this.startTween(this.bRest, 900);
    }
  }

  private finishIntro() {
    this.phase = "live";
    this.html.dataset.intro = "done";
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
  }

  private layout() {
    const rect = this.o.root.getBoundingClientRect();
    const W = Math.max(1, Math.round(rect.width));
    const H = Math.max(1, Math.round(rect.height));
    const prev = this.geo;
    const restFrac = prev ? this.bRest / (prev.orient === "x" ? prev.W : prev.H) : null;

    this.geo = geometryFor(W, H, this.mq.matches);
    const g = this.geo;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.o.canvas.width = Math.round(W * this.dpr);
    this.o.canvas.height = Math.round(H * this.dpr);

    const len = g.orient === "x" ? W : H;
    const sameOrient = prev && prev.orient === g.orient;
    this.bRest = sameOrient && restFrac !== null ? this.clampB(restFrac * len) : g.bRest;

    this.fitMobileRest();
    this.buildNodes();
    this.o.handle.setAttribute("aria-orientation", g.orient === "x" ? "horizontal" : "vertical");
    if (this.fontsReady) this.dots = sampleName(this.o.name, this.o.root);
  }

  private buildNodes() {
    const g = this.geo;
    const s = g.spacing;
    this.cols = Math.max(1, Math.floor((g.right - g.left) / s) + 1);
    this.rows = Math.max(1, Math.floor((g.bottom - g.top) / s) + 1);
    this.gridX0 = g.left + (g.right - g.left - (this.cols - 1) * s) / 2;
    this.gridY0 = g.top + (g.bottom - g.top - (this.rows - 1) * s) / 2;
    const n = this.cols * this.rows;
    this.n = n;
    this.hx = new Float32Array(n);
    this.hy = new Float32Array(n);
    this.px = new Float32Array(n);
    this.py = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.morph = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.jx = new Float32Array(n);
    this.noise = new Float32Array(n);
    this.appear = new Float32Array(n);
    this.sample = new Uint8Array(n);

    const rand = mulberry32(20250301);
    let i = 0;
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++, i++) {
        const x = this.gridX0 + c * s;
        const y = this.gridY0 + r * s;
        this.hx[i] = x;
        this.hy[i] = y;
        this.px[i] = x;
        this.py[i] = y;
        this.sample[i] = rand() < g.sampleP ? 1 : 0;
        this.jx[i] = Math.min(g.right, Math.max(g.left, x + (rand() - 0.5) * s * 0.9));
        this.noise[i] = gaussian(rand) * 0.24;
        // The lattice is drafted column by column (or row by row on mobile): discrete steps.
        const order = g.orient === "x" ? c / this.cols : r / this.rows;
        this.appear[i] = T.lattice + Math.round(order * 14) / 14 * T.latticeSpan;
        this.alpha[i] = this.phase === "intro" ? 0 : 1;
      }
    }
    if (this.phase === "live") this.snapNodes();
    this.markDataChanged();
  }

  /**
   * On mobile the name is stacked, so the resting boundary is measured from it:
   * it cuts through the lower third of the last line — that word is half learned.
   */
  private fitMobileRest() {
    if (this.geo.orient !== "y") return;
    const lines = Array.from(this.o.name.querySelectorAll<HTMLElement>("[data-name-line]")).filter(
      (el) => el.getBoundingClientRect().width > 1,
    );
    const last = lines[lines.length - 1];
    const marker = last?.querySelector<HTMLElement>("[data-baseline]");
    if (!last || !marker) return;
    const top = this.o.root.getBoundingClientRect().top;
    const baseline = marker.getBoundingClientRect().top - top;
    const size = parseFloat(getComputedStyle(last).fontSize);
    this.o.root.style.setProperty("--name-bottom", `${(baseline + size * 0.08).toFixed(1)}px`);
    if (!this.userMoved) this.bRest = this.clampB(baseline - size * 0.3);
  }

  private bind() {
    const { root, handle } = this.o;
    const on = <K extends keyof WindowEventMap>(
      target: Window | HTMLElement | Document,
      type: K | string,
      fn: (e: never) => void,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, fn as EventListener, opts);
      this.cleanups.push(() => target.removeEventListener(type, fn as EventListener, opts));
    };

    on(root, "pointermove", (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      this.pointer.x = e.clientX - r.left;
      this.pointer.y = e.clientY - r.top;
      this.pointer.inside = true;
      this.pointer.fine = e.pointerType === "mouse" || e.pointerType === "pen";
      if (this.dragging) this.dragTo(this.pointer.x, this.pointer.y);
      this.request();
    });
    on(root, "pointerleave", () => {
      this.pointer.inside = false;
      this.request();
    });
    on(root, "pointerdown", (e: PointerEvent) => {
      if (this.phase === "intro") {
        this.skip();
        return;
      }
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-handle]")) return;
      const r = root.getBoundingClientRect();
      this.addPoint(e.clientX - r.left, e.clientY - r.top);
    });

    on(handle, "pointerdown", (e: PointerEvent) => {
      if (this.phase === "intro") this.skip();
      e.stopPropagation();
      e.preventDefault();
      this.dragging = true;
      this.tween = null;
      handle.setPointerCapture(e.pointerId);
      this.o.root.dataset.dragging = "";
    });
    const endDrag = () => {
      if (!this.dragging) return;
      this.dragging = false;
      delete this.o.root.dataset.dragging;
      this.request();
    };
    on(handle, "pointerup", endDrag);
    on(handle, "pointercancel", endDrag);
    on(handle, "keydown", (e: KeyboardEvent) => {
      const len = this.geo.orient === "x" ? this.geo.W : this.geo.H;
      const stepPx = len * 0.03;
      let next: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = this.bRest + stepPx;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = this.bRest - stepPx;
      else if (e.key === "Home") next = this.geo.bMin;
      else if (e.key === "End") next = this.geo.bMax;
      if (next === null) return;
      e.preventDefault();
      this.bRest = this.clampB(next);
      this.userMoved = true;
      this.markDataChanged();
      this.request();
    });

    // Any input during the intro skips it. Capture phase, so global shortcuts don't also fire.
    on(
      window,
      "keydown",
      (e: KeyboardEvent) => {
        if (this.phase !== "intro") return;
        this.skip();
        if (e.key !== "Tab") e.preventDefault();
        e.stopImmediatePropagation();
      },
      { capture: true },
    );
    on(window, "wheel", () => this.phase === "intro" && this.skip(), { passive: true });
    on(window, "touchstart", () => this.phase === "intro" && this.skip(), { passive: true });

    on(document, "visibilitychange", () => {
      this.last = 0;
      if (!document.hidden) this.request();
    });

    const ro = new ResizeObserver(() => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => {
        this.layout();
        if (!this.tween && !this.dragging && this.phase === "live") this.b = this.bRest;
        this.request();
      }, 120);
    });
    ro.observe(root);
    this.cleanups.push(() => ro.disconnect());
  }

  // ─── interaction ──────────────────────────────────────────────────────────

  private clampB(v: number) {
    return Math.min(this.geo.bMax, Math.max(this.geo.bMin, v));
  }

  private dragTo(x: number, y: number) {
    const v = this.clampB(this.geo.orient === "x" ? x : y);
    this.b = v;
    this.bRest = v;
    this.userMoved = true;
    this.markDataChanged();
  }

  private isLearned(x: number, y: number) {
    return this.geo.orient === "x" ? x > this.b : y > this.b;
  }

  private inField(x: number, y: number) {
    const g = this.geo;
    return x >= g.left && x <= g.right && y >= g.top - 8 && y <= g.bottom + 8;
  }

  private addPoint(x: number, y: number) {
    if (!this.fitStarted || !this.inField(x, y) || !this.isLearned(x, y)) return;
    this.userPts.push({ fx: x / this.geo.W, fy: y / this.geo.H });
    if (this.userPts.length > MAX_USER_POINTS) this.userPts.shift();
    if (this.o.readouts.hint) this.o.readouts.hint.textContent = this.o.hintAdded;
    this.markDataChanged();
    this.request();
  }

  private markDataChanged() {
    this.sinceChange = 0;
    this.builtFor = NaN;
  }

  private startTween(to: number, dur: number, done?: () => void) {
    this.tween = { from: this.b, to, start: performance.now(), dur, done };
    this.request();
  }

  // ─── frame loop ───────────────────────────────────────────────────────────

  private request() {
    if (!this.raf && !this.destroyed && !document.hidden) {
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.destroyed) return;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 1 / 60;
    this.last = now;
    let active = false;

    if (this.phase === "intro") {
      active = true;
      const t = now - this.t0;
      if (t >= T.boundary && !this.sweepStarted) {
        this.sweepStarted = true;
        this.startTween(this.bRest, T.boundaryDur);
      }
      if (t >= T.fit && !this.fitStarted) {
        this.fitStarted = true;
        this.markDataChanged();
      }
      if (t >= T.end) this.finishIntro();
    }

    active = this.updateBoundary(now, dt) || active;
    active = this.updateNodes(dt, now - this.t0) || active;
    active = this.train() || active;
    if (this.fitStarted && this.curveAlpha < 1) {
      this.curveAlpha = Math.min(1, this.curveAlpha + dt * 2.5);
      active = true;
    }

    this.draw();
    this.updateReadouts(now, active);
    if (active) this.request();
  };

  private updateBoundary(now: number, dt: number): boolean {
    let moving = false;
    if (this.tween) {
      const tw = this.tween;
      const p = Math.min(1, (now - tw.start) / tw.dur);
      this.b = tw.from + (tw.to - tw.from) * easeDraw(p);
      moving = true;
      if (p >= 1) {
        this.tween = null;
        tw.done?.();
      }
    } else if (!this.dragging && this.phase === "live") {
      const target = this.clampB(this.bRest + this.preview);
      const diff = target - this.b;
      if (Math.abs(diff) > 0.3) {
        this.b += diff * (1 - Math.exp(-dt * 9));
        moving = true;
      } else {
        this.b = target;
      }
    }
    if (moving) this.markDataChanged();
    this.writeBoundary();
    return moving;
  }

  private writeBoundary() {
    if (Math.abs(this.b - this.lastCssB) < 0.05) return;
    this.lastCssB = this.b;
    this.o.root.style.setProperty("--b", `${this.b.toFixed(1)}px`);
    const len = this.geo.orient === "x" ? this.geo.W : this.geo.H;
    const pct = Math.round(Math.min(100, Math.max(0, (this.b / len) * 100)));
    this.o.handle.setAttribute("aria-valuenow", String(pct));
    this.o.handle.setAttribute("aria-valuetext", `${pct}% written rules, ${100 - pct}% learned`);
  }

  private dataY(i: number, c: CurveFrame) {
    return c.cy - c.sy * (truth(this.jx[i] / this.geo.W) + this.noise[i]);
  }

  private snapNodes() {
    const c = curveFrame(this.geo, this.b);
    for (let i = 0; i < this.n; i++) {
      const learned = this.geo.orient === "x" ? this.hx[i] > this.b : this.hy[i] > this.b;
      const data = learned && this.sample[i] === 1;
      this.px[i] = data ? this.jx[i] : this.hx[i];
      this.py[i] = data ? this.dataY(i, c) : this.hy[i];
      this.vx[i] = 0;
      this.vy[i] = 0;
      this.morph[i] = data ? 1 : 0;
      this.alpha[i] = learned && !data ? GHOST : 1;
    }
  }

  private updateNodes(dt: number, t: number): boolean {
    const g = this.geo;
    const c = curveFrame(g, this.b);
    const intro = this.phase === "intro";
    const reduced = this.o.reducedMotion;
    const kMorphIn = 1 - Math.exp(-dt * 7);
    const kMorphOut = 1 - Math.exp(-dt * 16);
    const kAlpha = 1 - Math.exp(-dt * 8);
    const kReturn = 1 - Math.exp(-dt * RETURN_RATE);
    let moving = false;

    for (let i = 0; i < this.n; i++) {
      if (intro && t < this.appear[i]) {
        this.alpha[i] = 0;
        moving = true;
        continue;
      }
      const learned = g.orient === "x" ? this.hx[i] > this.b : this.hy[i] > this.b;
      const data = learned && this.sample[i] === 1;
      const tx = data ? this.jx[i] : this.hx[i];
      const ty = data ? this.dataY(i, c) : this.hy[i];
      const ta = learned && !data ? GHOST : 1;
      const tm = data ? 1 : 0;

      if (reduced) {
        this.px[i] = tx;
        this.py[i] = ty;
        this.morph[i] = tm;
        this.alpha[i] = ta;
        continue;
      }

      if (data) {
        this.vx[i] += ((tx - this.px[i]) * SPRING_K - this.vx[i] * SPRING_C) * dt;
        this.vy[i] += ((ty - this.py[i]) * SPRING_K - this.vy[i] * SPRING_C) * dt;
        this.px[i] += this.vx[i] * dt;
        this.py[i] += this.vy[i] * dt;
      } else {
        this.px[i] += (tx - this.px[i]) * kReturn;
        this.py[i] += (ty - this.py[i]) * kReturn;
        this.vx[i] = 0;
        this.vy[i] = 0;
      }
      this.morph[i] += (tm - this.morph[i]) * (data ? kMorphIn : kMorphOut);
      // Drafted points pop in (a discrete step); dissolving points fade.
      this.alpha[i] = this.alpha[i] === 0 && !learned ? 1 : this.alpha[i] + (ta - this.alpha[i]) * kAlpha;

      if (
        Math.abs(tx - this.px[i]) > 0.08 ||
        Math.abs(ty - this.py[i]) > 0.08 ||
        Math.abs(this.vx[i]) + Math.abs(this.vy[i]) > 0.08 ||
        Math.abs(tm - this.morph[i]) > 0.01 ||
        Math.abs(ta - this.alpha[i]) > 0.01
      ) {
        moving = true;
      } else {
        this.px[i] = tx;
        this.py[i] = ty;
        this.morph[i] = tm;
        this.alpha[i] = ta;
      }
    }
    return moving;
  }

  // ─── learning ─────────────────────────────────────────────────────────────

  private buildTrainingSet() {
    const g = this.geo;
    const c = curveFrame(g, this.b);
    const span = c.x1 - c.x0;
    const need = this.n + this.userPts.length;
    if (this.us.length < need) {
      this.us = new Float64Array(need);
      this.vs = new Float64Array(need);
    }
    let k = 0;
    if (span > 1) {
      for (let i = 0; i < this.n; i++) {
        const learned = g.orient === "x" ? this.hx[i] > this.b : this.hy[i] > this.b;
        if (!learned || this.sample[i] !== 1) continue;
        this.us[k] = ((this.jx[i] - c.x0) / span) * 2 - 1;
        this.vs[k] = truth(this.jx[i] / g.W) + this.noise[i];
        k++;
      }
      for (const p of this.userPts) {
        const x = p.fx * g.W;
        const y = p.fy * g.H;
        if (!this.isLearned(x, y)) continue;
        this.us[k] = ((x - c.x0) / span) * 2 - 1;
        this.vs[k] = (c.cy - y) / c.sy;
        k++;
      }
    }
    this.nTrain = k;
    this.builtFor = this.b;
  }

  private train(): boolean {
    if (!this.fitStarted) return false;
    if (this.builtFor !== this.b) this.buildTrainingSet();
    if (this.nTrain < 3 || this.sinceChange > TRAIN_CAP) return false;
    const steps = this.o.reducedMotion ? TRAIN_CAP : STEPS_PER_FRAME;
    let prev = this.loss;
    for (let s = 0; s < steps; s++) {
      const lr = 0.04 / (1 + this.sinceChange / 450);
      this.loss = this.model.step(this.us, this.vs, this.nTrain, lr);
      this.steps++;
      this.sinceChange++;
      if (this.sinceChange > 300 && Math.abs(prev - this.loss) < 2e-8) {
        this.sinceChange = TRAIN_CAP + 1;
        break;
      }
      prev = this.loss;
    }
    return !this.o.reducedMotion;
  }

  private pretrain(steps: number) {
    this.buildTrainingSet();
    for (let s = 0; s < steps && this.nTrain >= 3; s++) {
      this.loss = this.model.step(this.us, this.vs, this.nTrain, 0.04 / (1 + s / 450));
      this.steps++;
    }
    this.sinceChange = TRAIN_CAP - 200;
  }

  private predictY(x: number, c: CurveFrame) {
    const u = ((x - c.x0) / (c.x1 - c.x0)) * 2 - 1;
    return c.cy - c.sy * this.model.predict(u);
  }

  // ─── drawing ──────────────────────────────────────────────────────────────

  private draw() {
    const { ctx, geo: g } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, g.W, g.H);

    const crosses: Path2D[] = [];
    const circles: Path2D[] = [];
    for (let l = 0; l < LEVELS; l++) {
      crosses.push(new Path2D());
      circles.push(new Path2D());
    }
    for (let i = 0; i < this.n; i++) {
      const a = this.alpha[i];
      if (a <= 0.01) continue;
      const level = Math.min(LEVELS - 1, Math.round(a * (LEVELS - 1)));
      const x = this.px[i];
      const y = this.py[i];
      const m = this.morph[i];
      const arm = 2.6 * (1 - m);
      if (arm > 0.25) {
        const p = crosses[level];
        p.moveTo(x - arm, y);
        p.lineTo(x + arm, y);
        p.moveTo(x, y - arm);
        p.lineTo(x, y + arm);
      }
      const r = 2.15 * m;
      if (r > 0.25) {
        const p = circles[level];
        p.moveTo(x + r, y);
        p.arc(x, y, r, 0, Math.PI * 2);
      }
    }
    ctx.lineWidth = 1;
    for (let l = 1; l < LEVELS; l++) {
      const f = l / (LEVELS - 1);
      ctx.strokeStyle = `rgba(${INK}, ${CROSS_ALPHA * f})`;
      ctx.stroke(crosses[l]);
      ctx.fillStyle = `rgba(${INK}, ${DOT_ALPHA * f})`;
      ctx.fill(circles[l]);
    }

    this.drawNameDots();
    this.drawModel();
    this.drawPointer();
  }

  private drawNameDots() {
    const d = this.dots;
    if (!d) return;
    const { ctx } = this;
    const horizontal = this.geo.orient === "x";
    const s = d.size;
    // The breaking-away band is shallower when the boundary cuts a word horizontally.
    const front = d.step * (horizontal ? 7 : 3.5);
    const amp = d.step * (horizontal ? 2.6 : 1.4);
    ctx.fillStyle = `rgba(${INK}, 0.9)`;
    ctx.beginPath();
    for (let k = 0; k < d.count; k++) {
      const x = d.xs[k];
      const y = d.ys[k];
      const dist = horizontal ? x - this.b : y - this.b;
      if (dist < 0) continue;
      // Points near the boundary are still breaking away from the glyph.
      const lift = amp * Math.exp(-dist / front);
      ctx.rect(x + Math.cos(d.angle[k]) * lift - s / 2, y + Math.sin(d.angle[k]) * lift - s / 2, s, s);
    }
    ctx.fill();
  }

  private drawModel() {
    if (!this.fitStarted || this.curveAlpha <= 0) return;
    const c = curveFrame(this.geo, this.b);
    const span = c.x1 - c.x0;
    const { ctx } = this;

    for (const p of this.userPts) {
      const x = p.fx * this.geo.W;
      const y = p.fy * this.geo.H;
      if (!this.isLearned(x, y)) continue;
      ctx.beginPath();
      ctx.arc(x, y, 3.6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${VERMILION}, 0.95)`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    if (span < 40 || this.nTrain < 3) return;
    const sigma = Math.sqrt(this.loss) * c.sy;
    const clampY = (y: number) => Math.min(c.yMax + 24, Math.max(c.yMin - 24, y));
    const stepPx = 3;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let x = c.x0; x <= c.x1; x += stepPx) {
      xs.push(x);
      ys.push(clampY(this.predictY(x, c)));
    }

    ctx.beginPath();
    for (let i = 0; i < xs.length; i++) {
      const y = ys[i] - sigma;
      if (i === 0) ctx.moveTo(xs[i], y);
      else ctx.lineTo(xs[i], y);
    }
    for (let i = xs.length - 1; i >= 0; i--) ctx.lineTo(xs[i], ys[i] + sigma);
    ctx.closePath();
    ctx.fillStyle = `rgba(${VERMILION}, ${0.085 * this.curveAlpha})`;
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i < xs.length; i++) {
      if (i === 0) ctx.moveTo(xs[i], ys[i]);
      else ctx.lineTo(xs[i], ys[i]);
    }
    ctx.strokeStyle = `rgba(${VERMILION}, ${this.curveAlpha})`;
    ctx.lineWidth = 1.7;
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  /** A ghost point follows the cursor on the learned side: click and it becomes data. */
  private drawPointer() {
    const p = this.pointer;
    if (!p.inside || !p.fine || this.dragging || this.phase === "intro") return;
    if (!this.inField(p.x, p.y) || !this.isLearned(p.x, p.y) || !this.fitStarted) return;
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${VERMILION}, 0.9)`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  private updateReadouts(now: number, active: boolean) {
    if (active && now - this.lastReadout < 120) return;
    this.lastReadout = now;
    const loss = this.o.readouts.loss;
    if (loss) loss.textContent = this.fitStarted && this.nTrain >= 3 ? this.loss.toFixed(3) : "—";
  }
}
