/** Copy for Sheet 00 — the Origin. */
export const origin = {
  written: {
    statement: "I write software that follows rules.",
  },
  learned: {
    statement: "Now I’m learning how software can find them.",
  },
  forks: [
    {
      side: "written",
      href: "/engineering",
      no: "01",
      kicker: "Written",
      cta: "Engineering background",
    },
    {
      side: "learned",
      href: "/intelligence",
      no: "02",
      kicker: "Learned",
      cta: "AI & Machine Learning",
    },
  ],
  caption: {
    hintPointer: "Click to add data — the curve re-fits",
    hintTouch: "Tap to add data — the curve re-fits",
    hintAdded: "Added — the curve is re-fitting",
  },
  description:
    "Left of the red line, a grid of drafted points follows fixed rules. Right of it, the grid dissolves into data, and a curve fits itself to that data in real time using gradient descent. Drag the red line to trade rules for learning.",
} as const;

export type ForkSide = (typeof origin.forks)[number]["side"];
