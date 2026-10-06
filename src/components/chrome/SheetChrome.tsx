"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { contactLinks, identity } from "@/content/identity";
import { sheetFor, sheets } from "@/content/sheets";
import { T, reveal } from "@/lib/origin/timeline";
import { ContactLink } from "./ContactLink";
import { IndexOverlay } from "./IndexOverlay";
import s from "./SheetChrome.module.css";

/**
 * Persistent across every route: the drawing frame, the sheet index and the
 * title strip. Because it never unmounts, moving between sheets feels like
 * moving across one drawing rather than loading a new page.
 */
export function SheetChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const sheet = sheetFor(pathname);
  const [indexOpen, setIndexOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.tone = sheet.tone;
    document.documentElement.dataset.sheet = sheet.id;
  }, [sheet.tone, sheet.id]);

  useEffect(() => setIndexOpen(false), [pathname]);

  // 0–4 jump between sheets.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable='true']")) return;
      const target = sheets.find((x) => Number(x.no) === Number(e.key));
      if (target && /^[0-9]$/.test(e.key)) router.push(target.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <>
      <a href="#main" className={s.skipLink}>
        Skip to content
      </a>

      <div className={s.frame} aria-hidden="true" data-reveal style={reveal(T.frame, "appear", 500)} />

      <header className={s.top} data-reveal style={reveal(T.frame + 100, "appear", 500)}>
        <Link href="/" className={s.sheetLabel} aria-label={`Sheet ${sheet.no}, ${sheet.label}. Go to origin`}>
          <span className={s.sheetNo}>Sheet {sheet.no}</span>
          <span className={s.sheetCode}>{sheet.code}</span>
        </Link>
        <nav aria-label="Sheets" className={s.index}>
          <ol>
            {sheets.map((x) => (
              <li key={x.id}>
                <Link href={x.href} aria-current={x.id === sheet.id ? "page" : undefined} className={s.indexLink}>
                  <span className={s.indexNo}>{x.no}</span>
                  {x.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <button
          type="button"
          className={s.indexButton}
          aria-expanded={indexOpen}
          aria-controls="sheet-index"
          onClick={() => setIndexOpen(true)}
        >
          Index
        </button>
      </header>

      <main id="main">{children}</main>

      <footer className={s.strip} data-reveal style={reveal(T.chrome, "appear", 600)}>
        <dl className={s.cells}>
          <div className={s.cell}>
            <dt>Drawn by</dt>
            <dd>
              {identity.name}
              <span className={s.discipline}> — {identity.discipline}</span>
            </dd>
          </div>
          <div className={`${s.cell} ${s.cellStatus}`}>
            <dt>Status</dt>
            <dd>
              <span className={s.statusDot} aria-hidden="true" />
              {identity.status}
            </dd>
          </div>
          <div className={`${s.cell} ${s.cellContact}`}>
            <dt>Contact</dt>
            <dd className={s.contact}>
              {contactLinks.map((l) => (
                <ContactLink key={l.label} {...l} />
              ))}
            </dd>
          </div>
        </dl>
      </footer>

      <IndexOverlay open={indexOpen} onClose={() => setIndexOpen(false)} currentId={sheet.id} />
    </>
  );
}
