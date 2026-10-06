import type { ContactKind } from "@/content/identity";

interface ContactLinkProps {
  label: string;
  href: string;
  kind: ContactKind;
  mark?: boolean;
}

/** One contact route. Files open in a new tab and download with a clean name. */
export function ContactLink({ label, href, kind, mark = false }: ContactLinkProps) {
  if (kind === "mail") return <a href={href}>{label}</a>;
  const suffix = mark ? (kind === "file" ? " ↓" : " ↗") : "";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      download={kind === "file" ? "" : undefined}
      aria-label={kind === "file" ? `${label} (PDF, AI/ML resume)` : `${label} (opens in a new tab)`}
    >
      {label}
      {suffix}
    </a>
  );
}
