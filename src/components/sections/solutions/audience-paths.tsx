import { getTranslations } from "next-intl/server";
import { services } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";

interface Path {
  title: string;
  text: string;
  slugs: string[];
}

/** Entradas por público: cada uma sugere as soluções mais indicadas. */
export async function AudiencePaths() {
  const t = await getTranslations("Solutions.paths");
  const paths = t.raw("items") as Path[];
  return (
    <Section tone="alt" aria-labelledby="paths-title">
      <div className="container-site">
        <SectionHeader id="paths-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="grid gap-4 md:grid-cols-3">
          {paths.map((path) => (
            <li
              key={path.title}
              className="flex reveal flex-col gap-4 border-t border-border-strong pt-6 md:pr-6"
            >
              <h3 className="text-h3 font-bold">{path.title}</h3>
              <p className="text-muted">{path.text}</p>
              <ul className="flex flex-col border-t border-border pt-3">
                {path.slugs.map((slug) => {
                  const service = services.find((item) => item.slug === slug);
                  if (!service) return null;
                  const Icon = service.icon;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/solucoes/${slug}`}
                        className="flex min-h-11 items-center gap-3 rounded-sm font-semibold text-primary hover:underline"
                      >
                        <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
                        {service.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
