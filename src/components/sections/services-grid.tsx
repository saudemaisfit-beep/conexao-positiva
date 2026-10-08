import { getTranslations } from "next-intl/server";
import { services } from "@/config/navigation";
import { ServiceCard } from "@/components/cards/service-card";
import { Section } from "@/components/layout/section";
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
        <ul className="grid gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
          {services.map((service) => (
            <li key={service.slug} className="reveal">
              <ServiceCard service={service} moreLabel={t("more")} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
