import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { metodoCopy } from "@/content/metodo";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Faq } from "@/components/sections/faq";
import { FeatureList } from "@/components/sections/feature-list";
import { ApplicationPaths } from "@/components/sections/metodo/application-paths";
import {
  BenefitsSection,
  ClosingSection,
  CreatorSection,
  OffersSection,
  SignsSection,
} from "@/components/sections/metodo/landing-sections";
import { PillarsStory } from "@/components/sections/metodo/pillars-story";
import { PageHero } from "@/components/sections/page-hero";
import { StepsList } from "@/components/sections/steps-list";
import { ButtonLink, arrowClassName } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import logo from "../../../../public/brand/metodo-centro/metodo-centro-logo.png";
import heroPhoto from "../../../../public/images/metodo-centro/luciana-machado-hero.jpg";

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

export default async function MetodoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metodo");
  const proposal = { pathname: proposalHref, query: { servico: "metodo-centro" } };

  return (
    <div data-brand="metodo">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        lead={t("hero.lead")}
        breadcrumbs={[{ label: t("breadcrumb"), href: "/metodo-centro" }]}
        asideOnMobile
        actions={
          <>
            <ButtonLink href="#participar" size="lg" variant="glow">
              {t("hero.offers")}
              <ArrowRight aria-hidden="true" className={arrowClassName} />
            </ButtonLink>
            <ButtonLink href={proposal} variant="glass" size="lg">
              {t("hero.primary")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={heroPhoto}
                alt={t("hero.photoAlt")}
                priority
                fetchPriority="high"
                placeholder="blur"
                sizes="(min-width: 1024px) 34rem, (min-width: 768px) 60vw, 100vw"
                className="aspect-4/3 h-auto w-full object-cover object-[75%_center]"
              />
            </div>
            <div className="absolute -bottom-5 left-5 w-32 rounded-xl bg-white p-3 shadow-lg md:w-40">
              <Image src={logo} alt={t("hero.logoAlt")} sizes="10rem" className="h-auto w-full" />
            </div>
          </div>
        }
      />

      <SignsSection />

      <Section tone="alt" aria-labelledby="what-title">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex reveal flex-col gap-5">
            <h2 id="what-title" className="text-h2 font-bold">
              {metodoCopy.what.title}
            </h2>
            {metodoCopy.what.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="max-w-[60ch] text-body-lg text-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex reveal flex-col gap-5 rounded-xl bg-surface-raised p-7 shadow-sm md:p-10">
            <h2 className="text-h3 font-bold">{metodoCopy.why.title}</h2>
            <p className="text-body-lg text-muted">{metodoCopy.why.text}</p>
          </div>
        </div>
      </Section>

      <CreatorSection />

      <Section aria-labelledby="audience-title">
        <div className="container-site">
          <SectionHeader
            id="audience-title"
            eyebrow={t("audience.eyebrow")}
            title={t("audience.title")}
          />
          <FeatureList items={metodoCopy.audience} variant="card" />
        </div>
      </Section>

      <PillarsStory />

      <Section tone="alt" aria-labelledby="steps-title">
        <div className="container-site">
          <SectionHeader id="steps-title" eyebrow={t("steps.eyebrow")} title={t("steps.title")} />
          <StepsList steps={metodoCopy.steps} />
        </div>
      </Section>

      <BenefitsSection />

      <ApplicationPaths />

      <OffersSection />

      <Section tone="alt" aria-labelledby="results-title">
        <div className="container-site">
          <SectionHeader
            id="results-title"
            eyebrow={t("results.eyebrow")}
            title={t("results.title")}
          />
          <FeatureList items={metodoCopy.results} />
        </div>
      </Section>

      <Faq items={metodoCopy.faq} />

      <ClosingSection />

      <CtaBanner
        id="metodo-cta-title"
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: `${proposalHref}?servico=metodo-centro` }}
        secondary={{ label: t("cta.secondary"), href: "/contactos" }}
      />
    </div>
  );
}
