/**
 * Single source of truth for the Origin sheet's proportions.
 * The engine reads these numbers directly; the DOM receives them as CSS
 * custom properties (see `originCssVars`), so canvas and layout never drift.
 */
export const MOBILE_QUERY = "(max-width: 767px), (max-aspect-ratio: 4/5)";

/** Sheet border inset and bottom title-strip height, in px. Mirrors globals.css. */
export const FRAME = 16;
export const STRIP = 48;
export const STRIP_MOBILE = 44;

export const DESKTOP = {
  fieldTop: 0.12,
  axis: 0.7,
  rest: 0.5,
  min: 0.3,
  max: 0.74,
  curveY: 0.315,
  curveAmp: 0.066,
  spacing: 34,
  sampleP: 0.24,
} as const;

export const MOBILE = {
  fieldTop: 0.1,
  nav: 0.7,
  rest: 0.33,
  min: 0.18,
  max: 0.56,
  spacing: 30,
  sampleP: 0.36,
} as const;

export type Orientation = "x" | "y";

export interface Geometry {
  W: number;
  H: number;
  orient: Orientation;
  spacing: number;
  sampleP: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  /** Boundary limits along the orientation axis (px). */
  bMin: number;
  bMax: number;
  bRest: number;
  /** Where the boundary sits when everything is written / everything is learned. */
  allWritten: number;
  allLearned: number;
}

export interface CurveFrame {
  cy: number;
  sy: number;
  x0: number;
  x1: number;
  yMin: number;
  yMax: number;
}

export function geometryFor(W: number, H: number, mobile: boolean): Geometry {
  if (!mobile) {
    const top = Math.round(H * DESKTOP.fieldTop);
    const bottom = Math.round(H * DESKTOP.axis) - 14;
    return {
      W,
      H,
      orient: "x",
      spacing: DESKTOP.spacing,
      sampleP: DESKTOP.sampleP,
      left: FRAME + 14,
      right: W - FRAME - 14,
      top,
      bottom,
      bMin: W * DESKTOP.min,
      bMax: W * DESKTOP.max,
      bRest: W * DESKTOP.rest,
      allWritten: W + 2,
      allLearned: -2,
    };
  }
  const top = Math.round(H * MOBILE.fieldTop);
  const bottom = Math.round(H * MOBILE.nav) - 10;
  return {
    W,
    H,
    orient: "y",
    spacing: MOBILE.spacing,
    sampleP: MOBILE.sampleP,
    left: FRAME + 10,
    right: W - FRAME - 10,
    top,
    bottom,
    bMin: H * MOBILE.min,
    bMax: H * MOBILE.max,
    bRest: H * MOBILE.rest,
    allWritten: bottom + 2,
    allLearned: top - 2,
  };
}

/** The region the model learns over, for a given boundary position. */
export function curveFrame(g: Geometry, b: number): CurveFrame {
  if (g.orient === "x") {
    return {
      cy: g.H * DESKTOP.curveY,
      sy: g.H * DESKTOP.curveAmp,
      x0: Math.max(b, g.left),
      x1: g.right,
      yMin: g.top,
      yMax: g.bottom,
    };
  }
  const r0 = Math.max(b, g.top);
  const span = Math.max(1, g.bottom - r0);
  return {
    cy: r0 + span * 0.56,
    sy: span * 0.15,
    x0: g.left,
    x1: g.right,
    yMin: r0,
    yMax: g.bottom,
  };
}

/** The hidden function the synthetic data is drawn from (in model units). */
export function truth(s: number): number {
  return 0.78 * Math.sin(5.4 * s + 0.7) + 0.3 * Math.sin(12.5 * s + 2.1);
}

export const originCssVars = {
  "--d-field-top": `${DESKTOP.fieldTop * 100}%`,
  "--d-axis": `${DESKTOP.axis * 100}%`,
  "--d-rest": `${DESKTOP.rest * 100}%`,
  "--d-curve-bottom": `${(DESKTOP.curveY + DESKTOP.curveAmp * 1.9) * 100}%`,
  "--m-field-top": `${MOBILE.fieldTop * 100}%`,
  "--m-nav": `${MOBILE.nav * 100}%`,
  "--m-rest": `${MOBILE.rest * 100}%`,
} as Record<string, string>;
