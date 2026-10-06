import type { Metadata } from "next";
import { SheetStub } from "@/components/sheet/SheetStub";

export const metadata: Metadata = { title: "Lab" };

export default function Page() {
  return <SheetStub no="03" code="Scratch" title="Lab" note="This sheet is still being drawn." />;
}
