"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface InViewProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Fraction of the element that must be visible before it settles in. */
  threshold?: number;
  id?: string;
}

/**
 * Marks its element with `data-inview` the first time it scrolls into view.
 * All motion is CSS keyed off that attribute (see globals.css, [data-settle]),
 * so content is fully visible without JS and under reduced motion.
 */
export function InView({ as: Tag = "div", className, children, threshold = 0.18, id }: InViewProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.inview = "";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.inview = "";
          io.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} className={className} id={id} data-observe="">
      {children}
    </Tag>
  );
}
