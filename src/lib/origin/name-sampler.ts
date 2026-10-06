import { mulberry32 } from "./random";

export interface NameDots {
  xs: Float32Array;
  ys: Float32Array;
  angle: Float32Array;
  count: number;
  step: number;
  size: number;
}

const STRETCH_KEYWORDS: Array<[number, CanvasFontStretch]> = [
  [62.5, "extra-condensed"],
  [75, "condensed"],
  [87.5, "semi-condensed"],
  [100, "normal"],
];

function stretchKeyword(value: string): CanvasFontStretch {
  const pct = parseFloat(value);
  if (Number.isNaN(pct)) return "normal";
  let best: CanvasFontStretch = "normal";
  let dist = Infinity;
  for (const [p, k] of STRETCH_KEYWORDS) {
    if (Math.abs(p - pct) < dist) {
      dist = Math.abs(p - pct);
      best = k;
    }
  }
  return best;
}

/**
 * Rasterises the name exactly where the DOM renders it, then samples the glyphs
 * into a point cloud. Each line carries `data-name-line` (its text) and a
 * zero-size `[data-baseline]` marker so canvas and DOM share one baseline.
 * Canvas width is fitted to the DOM width, so browsers that lack
 * `ctx.fontStretch` / `ctx.letterSpacing` still line up.
 */
export function sampleName(nameEl: HTMLElement, root: HTMLElement): NameDots | null {
  const lines = Array.from(nameEl.querySelectorAll<HTMLElement>("[data-name-line]")).filter(
    (el) => el.getBoundingClientRect().width > 1,
  );
  if (!lines.length) return null;

  const rootRect = root.getBoundingClientRect();
  const W = Math.ceil(rootRect.width);
  const H = Math.ceil(rootRect.height);
  if (W < 2 || H < 2) return null;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const cs = getComputedStyle(lines[0]);
  const fontSize = parseFloat(cs.fontSize);
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  if ("fontStretch" in ctx) ctx.fontStretch = stretchKeyword(cs.fontStretch);
  if ("letterSpacing" in ctx) ctx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#000";

  let minX = W;
  let minY = H;
  let maxX = 0;
  let maxY = 0;
  for (const line of lines) {
    const text = line.dataset.nameLine ?? "";
    const marker = line.querySelector<HTMLElement>("[data-baseline]");
    if (!text || !marker) continue;
    const rect = line.getBoundingClientRect();
    const x = rect.left - rootRect.left;
    const baseline = marker.getBoundingClientRect().top - rootRect.top;
    const measured = ctx.measureText(text).width || rect.width;
    ctx.save();
    ctx.translate(x, baseline);
    ctx.scale(rect.width / measured, 1);
    ctx.fillText(text, 0, 0);
    ctx.restore();
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + rect.width);
    minY = Math.min(minY, rect.top - rootRect.top);
    maxY = Math.max(maxY, rect.bottom - rootRect.top);
  }
  if (maxX <= minX || maxY <= minY) return null;

  const x0 = Math.max(0, Math.floor(minX));
  const y0 = Math.max(0, Math.floor(minY));
  const w = Math.min(W - x0, Math.ceil(maxX - minX) + 2);
  const h = Math.min(H - y0, Math.ceil(maxY - minY) + 2);
  const data = ctx.getImageData(x0, y0, w, h).data;

  const step = Math.max(2.2, fontSize / 34);
  const rand = mulberry32(1931);
  const xs: number[] = [];
  const ys: number[] = [];
  const angle: number[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const sx = Math.min(w - 1, Math.round(x + step / 2));
      const sy = Math.min(h - 1, Math.round(y + step / 2));
      if (data[(sy * w + sx) * 4 + 3] < 128) continue;
      xs.push(x0 + x + step / 2 + (rand() - 0.5) * step * 0.9);
      ys.push(y0 + y + step / 2 + (rand() - 0.5) * step * 0.9);
      angle.push(rand() * Math.PI * 2);
    }
  }

  return {
    xs: Float32Array.from(xs),
    ys: Float32Array.from(ys),
    angle: Float32Array.from(angle),
    count: xs.length,
    step,
    size: step * 0.5,
  };
}
