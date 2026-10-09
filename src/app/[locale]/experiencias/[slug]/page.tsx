import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { proposalHref, services } from "@/config/navigation";
import { getCaseStudies, getCaseStudy, getRelatedCaseStudies } from "@/content/cases";
import { Link } from "@/i18n/navigation";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { TestimonialPerson } from "@/components/cards/testimonial-person";
import { Gallery } from "@/components/common/gallery";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { VideoEmbed } from "@/components/sections/experiences/video-embed";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { parseVideoUrl } from "@/lib/video";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCaseStudies()).map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.objective,
    alternates: { canonical: `/experiencias/${study.slug}` },
  };
}

/** Bloco narrativo: título à esquerda, texto à direita (empilhado no mobile). */
function Chapter({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="grid reveal gap-4 border-t border-border pt-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-10 md:pt-10"
    >
      <h2 id={id} className="text-h3 font-bold">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

export default async function ExperiencePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const t = await getTranslations("Experiences");
  const related = await getRelatedCaseStudies(study);
  const video = study.video ? parseVideoUrl(study.video.url) : null;
  const usedServices = services.filter((service) => study.services.includes(service.slug));
  const proposal = usedServices[0]
    ? `${proposalHref}?servico=${usedServices[0].slug}`
    : proposalHref;

  // Ficha: só os campos preenchidos.
  const facts: { label: string; value: ReactNode }[] = [
    { label: t("detail.client"), value: study.client ?? t("confidential") },
    ...(study.sector ? [{ label: t("detail.sector"), value: study.sector }] : []),
    ...(usedServices.length > 0
      ? [
          {
            label: t("detail.services"),
            value: (
              <ul className="flex flex-col">
                {usedServices.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/solucoes/${service.slug}`}
                      className="underline decoration-border-strong underline-offset-4 hover:text-primary hover:decoration-primary"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    ...(study.participants
      ? [
          {
            label: t("detail.participants"),
            value: t("detail.participantsCount", { count: study.participants }),
          },
        ]
      : []),
    ...(study.format ? [{ label: t("detail.format"), value: study.format }] : []),
    ...(study.period ? [{ label: t("detail.period"), value: study.period }] : []),
    ...(study.location ? [{ label: t("detail.location"), value: study.location }] : []),
  ];

  return (
    <>
      <PageHero
        eyebrow={t(`categories.${study.category}`)}
        title={study.title}
        breadcrumbs={[
          { label: t("breadcrumb"), href: "/experiencias" },
          { label: study.title, href: `/experiencias/${study.slug}` },
        ]}
      />

      {study.image && (
        <div className="container-site -mt-4 mb-4 md:-mt-8">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl md:aspect-[21/9]">
            <Image
              src={study.image.src}
              alt={study.image.alt}
              fill
              priority
              sizes="(min-width: 1280px) 75rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <Section aria-label={t("detail.facts")} className="pt-0 md:pt-0">
        <div className="container-site flex flex-col gap-16 md:gap-20">
          <div className="rounded-xl bg-surface p-6 md:p-8">
            <h2 className="sr-only">{t("detail.facts")}</h2>
            <dl className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="text-caption font-semibold tracking-[0.08em] text-muted uppercase">
                    {fact.label}
                  </dt>
                  <dd className="font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-12 md:gap-16">
            <Chapter id="challenge-title" title={t("detail.challenge")}>
              {study.challenge.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="max-w-[68ch] text-body-lg text-muted">
                  {paragraph}
                </p>
              ))}
            </Chapter>
            <Chapter id="objective-title" title={t("detail.objective")}>
              <p className="max-w-[40ch] font-display text-h3 leading-snug font-bold text-balance">
                {study.objective}
              </p>
            </Chapter>
            <Chapter id="solution-title" title={t("detail.solution")}>
              {study.solution.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="max-w-[68ch] text-body-lg text-muted">
                  {paragraph}
                </p>
              ))}
            </Chapter>
            {(video || study.gallery.length > 0) && (
              <Chapter
                id="media-title"
                title={
                  video && study.gallery.length === 0 ? t("detail.video") : t("detail.gallery")
                }
              >
                {video && study.video && <VideoEmbed source={video} title={study.video.title} />}
                {study.gallery.length > 0 && <Gallery images={study.gallery} />}
              </Chapter>
            )}
          </div>
        </div>
      </Section>

      {study.results.length > 0 && (
        <Section tone="inverse" aria-labelledby="results-title">
          <div className="container-site">
            <SectionHeader id="results-title" title={t("detail.results")} />
            <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {study.results.map((result) => (
                <li
                  key={result.text}
                  className="flex reveal flex-col gap-3 border-t border-on-inverse/20 pt-6"
                >
                  {result.value ? (
                    <span className="font-display text-display leading-none font-extrabold text-brand-on-inverse">
                      {result.value}
                    </span>
                  ) : (
                    <CheckCircle2
                      aria-hidden="true"
                      className="size-7 text-brand-on-inverse"
                      strokeWidth={1.75}
                    />
                  )}
                  <p className="text-body-lg text-on-inverse-muted">{result.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {study.testimonial && (
        <Section aria-labelledby="testimonial-title">
          <div className="container-site">
            <h2 id="testimonial-title" className="sr-only">
              {t("detail.testimonial")}
            </h2>
            <figure className="flex max-w-4xl reveal flex-col gap-8">
              <span aria-hidden="true" className="h-1 w-16 rounded-full bg-accent" />
              <blockquote className="font-display text-h3 leading-snug font-bold tracking-[-0.015em] md:text-h2">
                <p>“{study.testimonial.quote}”</p>
              </blockquote>
              <figcaption>
                <TestimonialPerson testimonial={study.testimonial} />
              </figcaption>
            </figure>
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section tone="alt" aria-labelledby="related-title">
          <div className="container-site">
            <SectionHeader id="related-title" title={t("detail.related")} />
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug} className="reveal">
                  <CaseStudyCard study={item} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <CtaBanner
        id="experience-cta-title"
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: proposal }}
        secondary={{ label: t("cta.secondary"), href: "/contactos" }}
      />
    </>
  );
}
