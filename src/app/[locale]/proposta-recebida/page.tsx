import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Confirmation, ExploreLinks } from "@/components/sections/forms/confirmation";
import { NextSteps } from "@/components/sections/forms/next-steps";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Confirmation" });
  return { title: t("proposal.metaTitle"), robots: noIndex };
}

export default async function ProposalReceivedPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Confirmation");
  return (
    <Confirmation title={t("proposal.title")} text={t("proposal.text")}>
      <div className="rounded-xl bg-surface p-6 md:p-8">
        <NextSteps />
      </div>
      <ExploreLinks
        title={t("explore")}
        links={[
          { label: t("links.experiences"), href: "/experiencias" },
          { label: t("links.metodo"), href: "/metodo-centro" },
        ]}
      />
    </Confirmation>
  );
}
