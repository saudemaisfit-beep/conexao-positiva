import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { services } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { ServiceCard } from "@/components/cards/service-card";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { TextLink } from "@/components/ui/text-link";

const featuredSlugs = ["team-building", "formacoes", "desenvolvimento-de-lideranca"];

/** A Home apresenta três entradas visuais; as restantes soluções continuam a um clique. */
export async function ServicesGrid() {
  const t = await getTranslations("Home.services");
  const featured = featuredSlugs.flatMap((slug) =>
    services.filter((service) => service.slug === slug),
  );
  const remaining = services.filter((service) => !featuredSlugs.includes(service.slug));
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
        <ul className="grid gap-7 md:grid-cols-3">
          {featured.map((service) => (
            <li key={service.slug} className="min-w-0 reveal">
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
        <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
          {remaining.map((service) => (
            <li key={service.slug} className="border-b border-border">
              <Link
                href={`/solucoes/${service.slug}`}
                className="group flex min-h-20 items-center justify-between gap-5 py-5 font-display text-h4 font-semibold transition-colors hover:text-primary"
              >
                {service.name}
                <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
