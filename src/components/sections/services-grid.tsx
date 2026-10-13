import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { ServicesBento } from "@/components/sections/services-bento";
import { SectionHeader } from "@/components/ui/section-header";
import { TextLink } from "@/components/ui/text-link";

export async function ServicesGrid() {
  const t = await getTranslations("Home.services");
  return (
    <Section aria-labelledby="services-title">
      <div className="container-site">
        <SectionHeader
          id="services-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
          action={<TextLink href="/solucoes">{t("all")}</TextLink>}
        />
        <ServicesBento moreLabel={t("more")} />
      </div>
    </Section>
  );
}
