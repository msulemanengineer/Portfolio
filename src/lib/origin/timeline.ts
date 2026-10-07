/**
 * The entry sequence, in ms from the moment the engine starts.
 * DOM reveals read these as CSS delays; the canvas reads them directly.
 */
export const T = {
  frame: 0,
  axis: 250,
  lattice: 450,
  latticeSpan: 650,
  name: 850,
  written: 1450,
  boundary: 2050,
  boundaryDur: 1250,
  fit: 2700,
  learned: 2850,
  forks: 3300,
  chrome: 3400,
  end: 4300,
} as const;


/** CSS custom properties for an element revealed at `delay` ms. */
export function reveal(
  delay: number,
  kind: "fade" | "rise" | "draw-x" | "draw-y" | "appear" = "fade",
  duration?: number,
) {
  const style: Record<string, string> = {
    "--d": `${delay}ms`,
    "--reveal": `ms-${kind}`,
  };
  if (duration) style["--dur"] = `${duration}ms`;
  return style;
}

/**
 * Runs before first paint (inlined in <head>): flags that JS is on, so
 * scroll-in reveals may hide content until it is observed.
 */
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.dataset.js='1';d.dataset.intro='done';})();`;
