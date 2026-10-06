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

export const INTRO_SEEN_KEY = "ms:origin-seen";
export const EXIT_KEY = "ms:origin-exit";

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
 * Runs before first paint (inlined in <head>). Decides whether the intro plays:
 * only on a first visit to "/" this session, and never with reduced motion.
 */
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.dataset.js='1';try{var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=window.sessionStorage.getItem('${INTRO_SEEN_KEY}');d.dataset.intro=(!rm&&!seen&&location.pathname==='/')?'pending':'done';}catch(e){d.dataset.intro='done';}})();`;
