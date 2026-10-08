import { getTranslations } from "next-intl/server";
import type { ImpactStat } from "@/content/types";
import { Section } from "@/components/layout/section";

/** Indicadores de impacto: só os publicados no CMS. Sem números reais, a secção não aparece. */
export async function ImpactStats({ stats }: { stats: ImpactStat[] }) {
  if (stats.length === 0) return null;
  const t = await getTranslations("Home.impact");
  return (
    <Section tone="alt" aria-labelledby="impact-title" className="py-16 md:py-20">
      <div className="container-site">
        <h2 id="impact-title" className="sr-only">
          {t("title")}
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex reveal flex-col-reverse gap-2 border-l-2 border-secondary pl-5"
            >
              <dt className="text-small text-muted">{stat.label}</dt>
              <dd className="font-display text-h1 font-extrabold text-primary tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
