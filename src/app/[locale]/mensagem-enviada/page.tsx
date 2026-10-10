import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Confirmation, ExploreLinks } from "@/components/sections/forms/confirmation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Confirmation" });
  return { title: t("message.metaTitle"), robots: { index: false } };
}

export default async function MessageSentPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Confirmation");
  return (
    <Confirmation title={t("message.title")} text={t("message.text")}>
      <ExploreLinks
        title={t("explore")}
        links={[
          { label: t("links.insights"), href: "/insights" },
          { label: t("links.events"), href: "/eventos" },
        ]}
      />
    </Confirmation>
  );
}
