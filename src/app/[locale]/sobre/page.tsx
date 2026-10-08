import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { getAboutContent } from "@/content/about";
import { ApproachSteps } from "@/components/sections/about/approach-steps";
import { FounderFeature } from "@/components/sections/about/founder-feature";
import { HistoryTimeline } from "@/components/sections/about/history-timeline";
import { PurposeMissionVision } from "@/components/sections/about/purpose-mission-vision";
import { TeamGrid } from "@/components/sections/about/team-grid";
import { ValuesList } from "@/components/sections/about/values-list";
import { WhoWeAre } from "@/components/sections/about/who-we-are";
import { CtaBanner } from "@/components/sections/cta-banner";
import { PageHero } from "@/components/sections/page-hero";
import { PullQuote } from "@/components/sections/pull-quote";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const content = await getAboutContent();

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        lead={t("hero.lead")}
        breadcrumbs={[{ label: t("breadcrumb"), href: "/sobre" }]}
      />
      <WhoWeAre />
      <HistoryTimeline milestones={content.history} />
      <PullQuote quote={t("quote")} />
      <PurposeMissionVision />
      <ValuesList />
      <ApproachSteps />
      <FounderFeature founder={content.founder} />
      <TeamGrid members={content.team} />
      <CtaBanner
        id="about-cta-title"
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: proposalHref }}
        secondary={{ label: t("cta.secondary"), href: "/contactos" }}
      />
    </>
  );
}
