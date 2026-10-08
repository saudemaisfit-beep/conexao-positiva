import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { ButtonLink, arrowClassName } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return { title: { absolute: t("metaTitle") }, description: t("metaDescription") };
}

// Home provisória: a página completa é construída na Fase 5.
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <Section>
      <div className="container-site flex flex-col gap-6">
        <h1 className="max-w-4xl text-display font-extrabold">{t("title")}</h1>
        <p className="max-w-2xl text-lead text-muted">{t("lead")}</p>
        <div className="flex flex-col gap-3 md:flex-row">
          <ButtonLink href="/solucoes" size="lg">
            {t("discoverSolutions")}
            <ArrowRight aria-hidden="true" className={arrowClassName} />
          </ButtonLink>
          <ButtonLink href={proposalHref} variant="secondary" size="lg">
            {t("requestProposal")}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
