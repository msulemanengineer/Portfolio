import Link from "next/link";
import s from "./SheetStub.module.css";

interface SheetStubProps {
  no: string;
  code: string;
  title: string;
  note: string;
}

/** Placeholder for sheets not yet drawn. Replaced sprint by sprint. */
export function SheetStub({ no, code, title, note }: SheetStubProps) {
  return (
    <section className={s.root} aria-labelledby="stub-title">
      <p className={s.kicker}>
        Sheet {no} — {code}
      </p>
      <h1 id="stub-title" className={s.title}>
        {title}
      </h1>
      <p className={s.note}>{note}</p>
      <Link href="/" className={s.back}>
        ← Back to the origin
      </Link>
    </section>
  );
}
