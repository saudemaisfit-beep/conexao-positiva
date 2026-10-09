import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { metodoCopy } from "@/content/metodo";
import { Section } from "@/components/layout/section";
import { ButtonLink, arrowClassName } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

export async function ApplicationPaths() {
  const t = await getTranslations("Metodo.paths");
  const { individual, corporate } = metodoCopy.paths;
  return (
    <Section aria-labelledby="paths-title">
      <div className="container-site">
        <SectionHeader id="paths-title" eyebrow={t("eyebrow")} title={t("title")} />
        <div className="grid gap-5 md:grid-cols-2">
          <article className="flex reveal flex-col gap-4 rounded-xl border border-border bg-surface-raised p-7 md:p-10">
            <h3 className="text-h3 font-bold">{individual.title}</h3>
            <p className="text-muted">{individual.text}</p>
            <ButtonLink href={individual.href} variant="secondary" className="mt-auto self-start">
              {individual.cta}
            </ButtonLink>
          </article>
          <article
            data-surface="inverse"
            className="flex reveal flex-col gap-4 rounded-xl bg-inverse p-7 text-on-inverse md:p-10"
          >
            <h3 className="text-h3 font-bold">{corporate.title}</h3>
            <p className="text-on-inverse-muted">{corporate.text}</p>
            <ButtonLink
              href={{ pathname: proposalHref, query: { servico: "metodo-centro" } }}
              variant="inverse"
              className="mt-auto self-start"
            >
              {corporate.cta}
              <ArrowRight aria-hidden="true" className={arrowClassName} />
            </ButtonLink>
          </article>
        </div>
      </div>
    </Section>
  );
}
