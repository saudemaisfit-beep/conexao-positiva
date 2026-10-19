import type { Metadata } from "next";
import { homeImages } from "@/content/provisional-images";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { getHomeContent, upcomingEvents } from "@/content/home";
import { AboutIntro } from "@/components/sections/about-intro";
import { CaseStudiesPreview } from "@/components/sections/case-studies-preview";
import { CentroSection } from "@/components/sections/centro-section";
import { ClientLogos } from "@/components/sections/client-logos";
import { CtaBanner } from "@/components/sections/cta-banner";
import { HomeHero } from "@/components/sections/home-hero";
import { ImpactStats } from "@/components/sections/impact-stats";
import { LatestInsights } from "@/components/sections/latest-insights";
import { ServicesGrid } from "@/components/sections/services-grid";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { UpcomingEvents } from "@/components/sections/upcoming-events";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Revalida de hora a hora: os eventos passados saem da secção "Próximos eventos".
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return pageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/",
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home.cta");
  const now = new Date();
  const content = await getHomeContent(now);
  const nextEvents = upcomingEvents(content.events, now);

  return (
    <>
      <HomeHero nextEvent={nextEvents[0] ?? null} stats={content.stats} />
      <AboutIntro />
      <ServicesGrid />
      <CentroSection />
      <CaseStudiesPreview studies={content.caseStudies} />
      <ImpactStats stats={content.stats} />
      <ClientLogos clients={content.clients} />
      <TestimonialsSection testimonials={content.testimonials} />
      <UpcomingEvents events={nextEvents} />
      <LatestInsights articles={content.articles} />
      <CtaBanner
        id="cta-title"
        image={homeImages.contact}
        title={t("title")}
        text={t("text")}
        primary={{ label: t("primary"), href: proposalHref }}
        secondary={{ label: t("secondary"), href: "/contactos" }}
      />
    </>
  );
}
