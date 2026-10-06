/**
 * The site is one drawing set. Every route is a numbered sheet;
 * `tone` decides whether the sheet is drawn on paper or on carbon.
 */
export type SheetTone = "paper" | "carbon";

export interface Sheet {
  id: string;
  no: string;
  href: string;
  label: string;
  code: string;
  tone: SheetTone;
}

export const sheets: readonly Sheet[] = [
  { id: "origin", no: "00", href: "/", label: "Origin", code: "Origin", tone: "paper" },
  { id: "engineering", no: "01", href: "/engineering", label: "Engineering", code: "Written", tone: "paper" },
  { id: "intelligence", no: "02", href: "/intelligence", label: "Intelligence", code: "Learned", tone: "carbon" },
  { id: "lab", no: "03", href: "/lab", label: "Lab", code: "Scratch", tone: "carbon" },
  { id: "about", no: "04", href: "/about", label: "About", code: "Margin", tone: "paper" },
];

const contactSheet: Sheet = {
  id: "contact",
  no: "—",
  href: "/contact",
  label: "Contact",
  code: "Title block",
  tone: "paper",
};

export const lastSheetNo = sheets[sheets.length - 1].no;

export function sheetFor(pathname: string): Sheet {
  if (pathname.startsWith("/contact")) return contactSheet;
  // Case studies are drawn on the Engineering sheet.
  if (pathname.startsWith("/work")) return sheets[1];
  return (
    sheets.find((s) => s.href !== "/" && pathname.startsWith(s.href)) ?? sheets[0]
  );
}
