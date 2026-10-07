import { ImageResponse } from "next/og";

/** The preview card shown when the site is shared (LinkedIn, WhatsApp, X, Slack…). */
export const alt = "Muhammad Suleman — AI/ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamic = "force-static";

export default function OpengraphImage() {
  // A field of points, drawn deterministically, echoing the particle hero.
  const dots: Array<[number, number, number]> = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 140; i++) dots.push([rand() * 1200, 60 + rand() * 230, 1.5 + rand() * 2.5]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "64px 72px",
          background: "#131312",
          color: "#ecEae3",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {dots.map(([x, y, r], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r,
              height: r,
              background: i % 9 === 0 ? "#e0482a" : "rgba(236,234,227,0.35)",
            }}
          />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26, letterSpacing: 4, color: "#a6a39b" }}>
          <div style={{ width: 60, height: 3, background: "#e0482a" }} />
          <span>AI/ML ENGINEER · LAHORE</span>
        </div>
        <div style={{ display: "flex", fontSize: 132, fontWeight: 800, lineHeight: 0.95, marginTop: 24, letterSpacing: -2 }}>
          MUHAMMAD SULEMAN
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 28, color: "#ecEae3" }}>
          <span>I build software that follows rules —</span>
          <span style={{ color: "#e0482a", marginLeft: 12 }}>and software that learns them.</span>
        </div>
      </div>
    ),
    size,
  );
}
