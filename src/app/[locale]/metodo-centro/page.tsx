import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { landing } from "@/content/metodo-landing";
import { metodoCopy } from "@/content/metodo";
import { Faq } from "@/components/sections/faq";
import {
  LandingAbout,
  LandingAudience,
  LandingBenefits,
  LandingEvent,
  LandingFinal,
  LandingGuide,
  LandingHero,
  LandingPains,
  LandingPaths,
  LandingPricing,
  LandingProducts,
  LandingStats,
  LandingSteps,
  LandingTestimonials,
  LandingUrgency,
  LandingWhat,
  MethodClosing,
} from "@/components/sections/metodo/landing/luciana-landing";
import { PillarsStory } from "@/components/sections/metodo/pillars-story";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metodo" });
  return pageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/metodo-centro",
  });
}

/**
 * Página do Método C.E.N.T.R.O. com a identidade da landing de Luciana Machado
 * (data-brand="luciana"): as secções da landing, os seis pilares em órbita e o conteúdo
 * institucional do método (o que é, como funciona, para quem, aplicação, perguntas).
 */
export default async function MetodoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metodo");
  const proposal = { pathname: proposalHref, query: { servico: "metodo-centro" } };

  return (
    <div data-brand="luciana">
      <LandingHero />
      <LandingStats />
      <LandingPains />
      <LandingGuide />
      <LandingAbout />
      <LandingWhat what={metodoCopy.what} why={metodoCopy.why} />
      <PillarsStory
        eyebrow={landing.method.eyebrow}
        title={landing.method.title}
        lead={landing.method.lead}
      >
        <MethodClosing />
      </PillarsStory>
      <LandingSteps
        eyebrow={t("steps.eyebrow")}
        title={t("steps.title")}
        steps={metodoCopy.steps}
      />
      <LandingAudience
        eyebrow={t("audience.eyebrow")}
        title={t("audience.title")}
        items={metodoCopy.audience}
      />
      <LandingTestimonials />
      <LandingBenefits />
      <LandingUrgency />
      <LandingEvent />
      <LandingPricing />
      <LandingProducts />
      <LandingPaths
        eyebrow={t("paths.eyebrow")}
        title={t("paths.title")}
        individual={metodoCopy.paths.individual}
        corporate={metodoCopy.paths.corporate}
        corporateHref={proposal}
      />
      <Faq items={metodoCopy.faq} />
      <LandingFinal />
    </div>
  );
}
