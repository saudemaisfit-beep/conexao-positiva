import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { articleCategories, isArticleCategory } from "@/content/insight-categories";
import { InsightsIndex } from "@/components/sections/insights/insights-index";
import { PageHero } from "@/components/sections/page-hero";
import { stockPhotos } from "@/content/stock-photos";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return articleCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isArticleCategory(slug)) return {};
  const t = await getTranslations({ locale, namespace: "Insights" });
  return pageMetadata({
    title: `${t(`categories.${slug}.name`)} · ${t("metaTitle")}`,
    description: t(`categories.${slug}.description`),
    path: `/insights/categoria/${slug}`,
  });
}

export default async function InsightsCategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isArticleCategory(slug)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Insights");
  const name = t(`categories.${slug}.name`);

  return (
    <>
      <PageHero
        photo={stockPhotos[`cat-${slug}`]}
        eyebrow={t("hero.eyebrow")}
        title={name}
        lead={t(`categories.${slug}.description`)}
        breadcrumbs={[
          { label: t("breadcrumb"), href: "/insights" },
          { label: name, href: `/insights/categoria/${slug}` },
        ]}
      />
      <InsightsIndex category={slug} />
    </>
  );
}
