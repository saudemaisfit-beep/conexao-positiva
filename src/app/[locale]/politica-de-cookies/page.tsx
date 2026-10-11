import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getLegalDocument } from "@/content/legal";
import { LegalPage } from "@/components/sections/legal/legal-page";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const document = getLegalDocument("politica-de-cookies");

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: document.title,
    description: document.description,
    path: "/politica-de-cookies",
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage document={document} />;
}
