import { getTranslations } from "next-intl/server";
import { centroPillars } from "@/content/centro";
import { ButtonLink } from "@/components/ui/button";

/** Faixa de ligação ao Método C.E.N.T.R.O., com a identidade marsala. */
export async function CentroTeaser() {
  const t = await getTranslations("Solutions.centro");
  return (
    <section aria-labelledby="centro-teaser-title" data-brand="metodo" className="section-spacing">
      <div className="container-site">
        <div
          data-surface="inverse"
          className="grid gap-10 rounded-xl bg-inverse px-6 py-12 text-on-inverse md:px-12 md:py-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center"
        >
          <div className="flex reveal flex-col gap-4">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 id="centro-teaser-title" className="text-h2 font-normal">
              {t("title")}
            </h2>
            <p className="text-lead text-on-inverse-muted">{t("text")}</p>
            <ButtonLink href="/metodo-centro" variant="inverse" className="mt-2 self-start">
              {t("cta")}
            </ButtonLink>
          </div>
          <p
            aria-hidden="true"
            className="flex reveal justify-between font-display text-[clamp(3rem,9vw,7rem)] leading-none font-extrabold tracking-[-0.03em]"
          >
            {centroPillars.map((pillar) => (
              <span key={pillar.slug}>{pillar.letter}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
