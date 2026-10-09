import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref, services } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getServiceDetail, getServiceRelated, serviceDetails } from "@/content/services";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { ServiceCard } from "@/components/cards/service-card";
import { JsonLd } from "@/components/common/json-ld";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Faq } from "@/components/sections/faq";
import { FeatureList } from "@/components/sections/feature-list";
import { PageHero } from "@/components/sections/page-hero";
import { AudienceFormats } from "@/components/sections/solutions/audience-formats";
import { StepsList } from "@/components/sections/steps-list";
import { TestimonialsShowcase } from "@/components/sections/testimonials";
import { ButtonLink, arrowClassName } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetails.map((service) => ({ slug: service.slug }));
}

function findService(slug: string) {
  const nav = services.find((service) => service.slug === slug);
  const detail = getServiceDetail(slug);
  return nav && detail ? { ...nav, ...detail } : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return { title: service.name, description: service.lead };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = findService(slug);
  if (!service) notFound();

  const t = await getTranslations("Solutions");
  const tHome = await getTranslations("Home.services");
  const related = await getServiceRelated(slug);
  const Icon = service.icon;
  const proposal = { pathname: proposalHref, query: { servico: service.slug } };
  const others = services.filter((item) => item.slug !== service.slug).slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={t("breadcrumb")}
        title={service.name}
        lead={service.lead}
        breadcrumbs={[
          { label: t("breadcrumb"), href: "/solucoes" },
          { label: service.name, href: `/solucoes/${service.slug}` },
        ]}
        actions={
          <ButtonLink href={proposal} size="lg">
            {t("service.requestProposal")}
            <ArrowRight aria-hidden="true" className={arrowClassName} />
          </ButtonLink>
        }
        aside={
          <div className="relative grid aspect-square place-items-center">
            <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-primary-soft" />
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-[6px] border-secondary/40"
            />
            <Icon aria-hidden="true" className="relative size-28 text-primary" strokeWidth={1.25} />
          </div>
        }
      />

      <Section tone="alt" aria-labelledby="intro-title" className="py-14 md:py-20">
        <div className="container-site grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
          <p id="intro-title" className="eyebrow self-start">
            {t("service.introEyebrow")}
          </p>
          <p className="max-w-[60ch] reveal text-h4 leading-relaxed font-medium">{service.intro}</p>
        </div>
      </Section>

      <Section aria-labelledby="problems-title">
        <div className="container-site">
          <SectionHeader
            id="problems-title"
            eyebrow={t("service.problemsEyebrow")}
            title={t("service.problemsTitle")}
          />
          <FeatureList items={service.problems} variant="card" />
        </div>
      </Section>

      <Section tone="alt" aria-labelledby="steps-title">
        <div className="container-site">
          <SectionHeader
            id="steps-title"
            eyebrow={t("service.stepsEyebrow")}
            title={t("service.stepsTitle")}
          />
          <StepsList steps={service.steps} />
        </div>
      </Section>

      <Section aria-labelledby="benefits-title">
        <div className="container-site">
          <SectionHeader
            id="benefits-title"
            eyebrow={t("service.benefitsEyebrow")}
            title={t("service.benefitsTitle")}
          />
          <FeatureList items={service.benefits} />
        </div>
      </Section>

      <AudienceFormats
        audienceTitle={t("service.audienceTitle")}
        audience={service.audience}
        formatsTitle={t("service.formatsTitle")}
        formats={service.formats}
      />

      {related.caseStudies.length > 0 && (
        <Section tone="alt" aria-labelledby="related-cases-title">
          <div className="container-site">
            <SectionHeader id="related-cases-title" title={t("service.casesTitle")} />
            <ul className="grid gap-5 md:grid-cols-2">
              {related.caseStudies.map((study) => (
                <li key={study.slug} className="reveal">
                  <CaseStudyCard study={study} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {related.testimonials.length > 0 && (
        <Section aria-labelledby="service-testimonials-title">
          <div className="container-site">
            <SectionHeader id="service-testimonials-title" title={t("service.testimonialsTitle")} />
            <TestimonialsShowcase testimonials={related.testimonials} />
          </div>
        </Section>
      )}

      <Faq items={service.faq} />

      <Section tone="alt" aria-labelledby="other-title">
        <div className="container-site">
          <SectionHeader id="other-title" title={t("service.otherTitle")} />
          <ul className="grid gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
            {others.map((item) => (
              <li key={item.slug}>
                <ServiceCard service={item} moreLabel={tHome("more")} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBanner
        id="service-cta-title"
        title={t("service.ctaTitle")}
        text={t("service.ctaText")}
        primary={{
          label: t("service.requestProposal"),
          href: `${proposalHref}?servico=${service.slug}`,
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.lead,
          serviceType: service.name,
          url: new URL(`/solucoes/${service.slug}`, siteConfig.url).toString(),
          provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        }}
      />
    </>
  );
}
