import type { Metadata } from "next";
import { ContactSheet } from "@/components/contact/ContactSheet";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description: "Email, résumés, LinkedIn and GitHub for Muhammad Suleman — AI/ML engineer, open to AI engineering roles.",
};

export default function ContactPage() {
  return <ContactSheet />;
}
