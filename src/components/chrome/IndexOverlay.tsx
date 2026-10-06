"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { contactLinks, identity } from "@/content/identity";
import { sheets } from "@/content/sheets";
import { ContactLink } from "./ContactLink";
import s from "./SheetChrome.module.css";

interface IndexOverlayProps {
  open: boolean;
  onClose: () => void;
  currentId: string;
}

/** Mobile sheet index — every sheet and every contact route, one tap away. */
export function IndexOverlay({ open, onClose, currentId }: IndexOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="sheet-index"
      className={s.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Sheet index"
    >
      <div className={s.overlayTop}>
        <span>Index</span>
        <button ref={closeRef} type="button" onClick={onClose} className={s.overlayClose}>
          Close
        </button>
      </div>
      <ol className={s.overlayList}>
        {sheets.map((x) => (
          <li key={x.id}>
            <Link href={x.href} aria-current={x.id === currentId ? "page" : undefined} onClick={onClose}>
              <span className={s.overlayNo}>{x.no}</span>
              <span className={s.overlayLabel}>{x.label}</span>
              <span className={s.overlayCode}>{x.code}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className={s.overlayContact}>
        <p className={s.overlayStatus}>
          <span className={s.statusDot} aria-hidden="true" />
          {identity.status}
        </p>
        <ul>
          {contactLinks.map((l) => (
            <li key={l.label}>
              <ContactLink {...l} mark />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
