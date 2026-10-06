import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/work/CaseStudy";
import { engineering } from "@/content/engineering";

interface Props {
  params: Promise<{ slug: string }>;
}

const systems = engineering.systems;

export function generateStaticParams() {
  return systems.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sys = systems.find((s) => s.id === slug);
  if (!sys) return { title: "Case study" };
  return {
    title: `${sys.name} — Case study`,
    description: `${sys.summary} My role: ${sys.roleNote.toLowerCase()}, at Endless Invo.`,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = systems.findIndex((s) => s.id === slug);
  if (index < 0) notFound();
  return <CaseStudy sys={systems[index]} next={systems[(index + 1) % systems.length]} />;
}
