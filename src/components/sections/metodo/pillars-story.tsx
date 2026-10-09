import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { centroPillars } from "@/content/centro";
import { metodoCopy } from "@/content/metodo";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { PillarIndex } from "./pillar-index";

/** Os seis pilares em scroll storytelling, com âncoras partilháveis (#consciencia…). */
export async function PillarsStory() {
  const t = await getTranslations("Metodo.pillars");
  const indexItems = centroPillars.map(({ slug, letter, name }) => ({ slug, letter, name }));

  return (
    <Section aria-labelledby="pillars-title">
      <div className="container-site">
        <SectionHeader id="pillars-title" eyebrow={t("eyebrow")} title={t("title")} />
        <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
          <PillarIndex items={indexItems} />
          <div className="flex flex-col">
            {centroPillars.map((pillar) => {
              const Icon = pillar.icon;
              const practices = metodoCopy.practices[pillar.slug] ?? [];
              return (
                <article
                  key={pillar.slug}
                  id={pillar.slug}
                  aria-labelledby={`${pillar.slug}-title`}
                  className="grid scroll-mt-36 gap-6 border-b border-border py-12 first:pt-4 last:border-b-0 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10 lg:scroll-mt-28 lg:py-16"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-[clamp(5rem,12vw,9rem)] leading-[0.85] font-extrabold tracking-[-0.04em] text-primary-soft"
                  >
                    {pillar.letter}
                  </span>
                  <div className="flex reveal flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
                        <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
                      </span>
                      <h3 id={`${pillar.slug}-title`} className="text-h2 font-bold">
                        {pillar.name}
                      </h3>
                    </div>
                    <p className="max-w-[60ch] text-lead text-muted">{pillar.description}</p>
                    {practices.length > 0 && (
                      <div className="flex flex-col gap-3 rounded-lg bg-surface p-5 md:p-6">
                        <h4 className="text-caption font-semibold tracking-[0.12em] text-muted uppercase">
                          {t("practice")}
                        </h4>
                        <ul className="flex flex-col gap-2">
                          {practices.map((practice) => (
                            <li key={practice} className="flex items-start gap-3">
                              <Check
                                aria-hidden="true"
                                className="mt-1 size-4 shrink-0 text-primary"
                                strokeWidth={2.5}
                              />
                              <span>{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
