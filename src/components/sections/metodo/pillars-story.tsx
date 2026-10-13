import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { centroPillars } from "@/content/centro";
import { metodoCopy } from "@/content/metodo";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { CentroOrbitArt } from "../centro-orbit-art";
import { PillarIndex } from "./pillar-index";
import { PillarsOrbit } from "./pillars-orbit";

/**
 * Os seis pilares em scroll storytelling, com âncoras partilháveis (#consciencia…).
 * Desktop: órbita fixa que roda até ao pilar visível. Mobile: índice fixo em faixa e a
 * animação de cada pilar junto à letra.
 */
export async function PillarsStory({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** Conteúdo depois dos pilares (ex.: frase de fecho da landing). */
  children?: ReactNode;
} = {}) {
  const t = await getTranslations("Metodo.pillars");
  const tc = await getTranslations("Home.centro");
  const indexItems = centroPillars.map(({ slug, letter, name }) => ({ slug, letter, name }));

  return (
    <Section tone="inverse" aria-labelledby="pillars-title">
      <div className="container-site">
        <SectionHeader
          id="pillars-title"
          eyebrow={eyebrow ?? t("eyebrow")}
          title={title ?? t("title")}
          lead={lead}
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <PillarIndex items={indexItems} />
          <div className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
            <PillarsOrbit />
          </div>
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
                  <div className="flex items-center gap-6 md:flex-col md:items-start">
                    <span
                      aria-hidden="true"
                      className="text-glow-gradient font-display text-[clamp(5rem,12vw,9rem)] leading-[0.85] font-extrabold tracking-[-0.04em]"
                    >
                      {pillar.letter}
                    </span>
                    <div
                      data-animate="true"
                      className="centro-orbit grid size-24 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 p-4 text-glow lg:hidden"
                    >
                      <CentroOrbitArt
                        slug={pillar.slug}
                        breatheIn={tc("breatheIn")}
                        breatheOut={tc("breatheOut")}
                      />
                    </div>
                  </div>
                  <div className="flex reveal flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-glow text-on-glow">
                        <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
                      </span>
                      <h3 id={`${pillar.slug}-title`} className="text-h2 font-normal">
                        {pillar.name}
                      </h3>
                    </div>
                    <p className="max-w-[60ch] text-lead text-muted">{pillar.description}</p>
                    {practices.length > 0 && (
                      <div className="glass flex flex-col gap-3 rounded-lg p-5 md:p-6">
                        <h4 className="text-caption font-semibold tracking-[0.12em] text-muted uppercase">
                          {t("practice")}
                        </h4>
                        <ul className="flex flex-col gap-2">
                          {practices.map((practice) => (
                            <li key={practice} className="flex items-start gap-3">
                              <Check
                                aria-hidden="true"
                                className="mt-1 size-4 shrink-0 text-glow"
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
        {children}
      </div>
    </Section>
  );
}
