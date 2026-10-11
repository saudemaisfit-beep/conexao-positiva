import { FolderOpen } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { getCaseStudies, toCaseSummary } from "@/content/cases";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ExperiencesBrowser } from "@/components/sections/experiences/experiences-browser";
import { PageHero } from "@/components/sections/page-hero";
import { ButtonLink } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Experiences" });
  return pageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/experiencias",
  });
}

export default async function ExperiencesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Experiences");
  const studies = (await getCaseStudies()).map(toCaseSummary);

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        lead={t("hero.lead")}
        breadcrumbs={[{ label: t("breadcrumb"), href: "/experiencias" }]}
      />
      <Section aria-label={t("hero.title")} className="pt-0 md:pt-0">
        <div className="container-site">
          {studies.length === 0 ? (
            <div className="flex flex-col items-start gap-5 rounded-xl bg-surface p-8 md:p-12">
              <span className="grid size-14 place-items-center rounded-full bg-surface-raised text-primary">
                <FolderOpen aria-hidden="true" className="size-6" strokeWidth={1.75} />
              </span>
              <h2 className="max-w-2xl text-h3 font-bold">{t("empty.title")}</h2>
              <p className="max-w-xl text-muted">{t("empty.text")}</p>
              <div className="flex flex-col gap-3 md:flex-row">
                <ButtonLink href={proposalHref}>{t("empty.primary")}</ButtonLink>
                <ButtonLink href="/solucoes" variant="secondary">
                  {t("empty.secondary")}
                </ButtonLink>
              </div>
            </div>
          ) : (
            <ExperiencesBrowser studies={studies} />
          )}
        </div>
      </Section>
      {studies.length > 0 && (
        <CtaBanner
          id="experiences-cta-title"
          title={t("cta.title")}
          text={t("cta.text")}
          primary={{ label: t("cta.primary"), href: proposalHref }}
          secondary={{ label: t("cta.secondary"), href: "/contactos" }}
        />
      )}
    </>
  );
}
