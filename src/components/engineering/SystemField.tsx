"use client";

import { useState, type CSSProperties } from "react";
import s from "./Engineering.module.css";

interface Node {
  id: string;
  x: number;
  y: number;
  w: number;
  title: string;
  meta: string;
}

/** The common shape of the three platforms below, drawn as a system. */
const nodes: Node[] = [
  { id: "web", x: 20, y: 70, w: 170, title: "Customer apps", meta: "React · Next.js" },
  { id: "admin", x: 20, y: 300, w: 170, title: "Admin dashboards", meta: "roles · reporting" },
  { id: "api", x: 280, y: 185, w: 180, title: "REST API", meta: "Node.js · Express" },
  { id: "auth", x: 560, y: 10, w: 150, title: "Auth", meta: "role-based access" },
  { id: "db", x: 560, y: 130, w: 150, title: "Database", meta: "MongoDB" },
  { id: "pay", x: 560, y: 250, w: 150, title: "Payments", meta: "Stripe · Moyasar" },
  { id: "maps", x: 560, y: 370, w: 150, title: "Maps", meta: "Google Maps" },
];

const H = 64;
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

const edges: Array<[string, string]> = [
  ["web", "api"],
  ["admin", "api"],
  ["api", "auth"],
  ["api", "db"],
  ["api", "pay"],
  ["api", "maps"],
];

/** Orthogonal connector, like a drafted wire: out, across, in. */
function wire(a: Node, b: Node) {
  const x1 = a.x + a.w;
  const y1 = a.y + H / 2;
  const x2 = b.x;
  const y2 = b.y + H / 2;
  const mid = Math.round((x1 + x2) / 2);
  return `M ${x1} ${y1} H ${mid} V ${y2} H ${x2}`;
}

export function SystemField() {
  const [focus, setFocus] = useState<string | null>(null);

  const touches = (e: [string, string]) => !focus || e[0] === focus || e[1] === focus;
  const linked = (id: string) =>
    !focus || id === focus || edges.some((e) => (e[0] === focus && e[1] === id) || (e[1] === focus && e[0] === id));

  return (
    <svg
      className={s.system}
      viewBox="0 0 720 440"
      role="img"
      aria-label="System diagram: customer apps and admin dashboards call a REST API, which connects to auth, the database, payments and maps."
      onPointerLeave={() => setFocus(null)}
    >
      <g className={s.wires}>
        {edges.map((e, i) => {
          const d = wire(byId[e[0]], byId[e[1]]);
          return (
            <g key={e.join("-")} data-dim={touches(e) ? undefined : ""} className={s.wireGroup}>
              <path d={d} pathLength={1} className={s.wire} style={{ "--k": i } as CSSProperties} />
              {/* A request travelling the wire; deterministic cadence, staggered per wire. */}
              <rect
                className={s.packet}
                width={7}
                height={7}
                x={-3.5}
                y={-3.5}
                style={{ offsetPath: `path("${d}")`, "--k": i } as CSSProperties}
              />
            </g>
          );
        })}
      </g>

      {nodes.map((n, i) => (
        <g
          key={n.id}
          className={s.node}
          data-dim={linked(n.id) ? undefined : ""}
          data-focus={focus === n.id ? "" : undefined}
          style={{ "--k": i } as CSSProperties}
          onPointerEnter={() => setFocus(n.id)}
        >
          <rect x={n.x} y={n.y} width={n.w} height={H} pathLength={1} className={s.box} />
          <text x={n.x + 14} y={n.y + 27} className={s.nodeTitle}>
            {n.title}
          </text>
          <text x={n.x + 14} y={n.y + 47} className={s.nodeMeta}>
            {n.meta}
          </text>
        </g>
      ))}
    </svg>
  );
}
