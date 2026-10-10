import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InsightsIndex } from "@/components/sections/insights/insights-index";
import { PageHero } from "@/components/sections/page-hero";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Insights" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/insights" },
  };
}

export default async function InsightsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Insights");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        lead={t("hero.lead")}
        breadcrumbs={[{ label: t("breadcrumb"), href: "/insights" }]}
      />
      <InsightsIndex category={null} label={t("hero.title")} />
    </>
  );
}
