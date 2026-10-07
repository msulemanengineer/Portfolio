/**
 * Static export writes route-segment prefetch files as `x/__next.seg/__PAGE__.txt`,
 * while the client requests `x/__next.seg.__PAGE__.txt`. Add the flat copies so
 * client-side navigation prefetches work on any static host (Netlify, etc.).
 */
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

let copied = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(dir, name, full, name);
    walk(full);
  }
}
function flatten(parent, prefix, dir, _) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) flatten(parent, `${prefix}.${name}`, full);
    else {
      copyFileSync(full, join(parent, `${prefix}.${name}`));
      copied++;
    }
  }
}
walk("out");
console.log(`flatten-segments: ${copied} prefetch files`);
