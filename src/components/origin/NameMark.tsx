import { forwardRef } from "react";
import { T, reveal } from "@/lib/origin/timeline";
import s from "./Origin.module.css";

interface NameMarkProps {
  name: string;
  className?: string;
}

/**
 * The name, rendered once as real text. On desktop it is one line; on mobile
 * each word is a line. Every visual line carries its uppercase text and a
 * baseline marker so the canvas can re-draw it as a point cloud in place.
 */
export const NameMark = forwardRef<HTMLHeadingElement, NameMarkProps>(function NameMark(
  { name, className },
  ref,
) {
  const words = name.split(" ");
  return (
    <h1 ref={ref} id="origin-name" className={className}>
      <span className="sr-only">{name}</span>
      <span className={s.nameDesktop} data-name-line={name.toUpperCase()} aria-hidden="true">
        <span data-baseline className={s.baseline} />
        <span className={s.rise} data-reveal style={reveal(T.name, "rise", 950)}>
          {name}
        </span>
      </span>
      <span className={s.nameMobile} aria-hidden="true">
        {words.map((w, i) => (
          <span key={w} className={s.nameMobileLine} data-name-line={w.toUpperCase()}>
            <span data-baseline className={s.baseline} />
            <span className={s.rise} data-reveal style={reveal(T.name + i * 110, "rise", 950)}>
              {w}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
});
