import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref, services } from "@/config/navigation";
import { ServiceCard } from "@/components/cards/service-card";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { PageHero } from "@/components/sections/page-hero";
import { AudiencePaths } from "@/components/sections/solutions/audience-paths";
import { CentroTeaser } from "@/components/sections/solutions/centro-teaser";
import { StepsList } from "@/components/sections/steps-list";
import { SectionHeader } from "@/components/ui/section-header";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Solutions" });
  return pageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/solucoes",
  });
}

export default async function SolutionsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Solutions");
  const tHome = await getTranslations("Home.services");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        lead={t("hero.lead")}
        breadcrumbs={[{ label: t("breadcrumb"), href: "/solucoes" }]}
      />
      <AudiencePaths />
      <Section aria-labelledby="all-title">
        <div className="container-site">
          <SectionHeader id="all-title" eyebrow={t("all.eyebrow")} title={t("all.title")} />
          <ul className="grid gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
            {services.map((service) => (
              <li key={service.slug} className="reveal">
                <ServiceCard service={service} moreLabel={tHome("more")} />
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section tone="alt" aria-labelledby="process-title">
        <div className="container-site">
          <SectionHeader
            id="process-title"
            eyebrow={t("process.eyebrow")}
            title={t("process.title")}
          />
          <StepsList steps={t.raw("process.steps") as { title: string; text: string }[]} />
        </div>
      </Section>
      <CentroTeaser />
      <CtaBanner
        id="solutions-cta-title"
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: proposalHref }}
        secondary={{ label: t("cta.secondary"), href: "/contactos" }}
      />
    </>
  );
}
