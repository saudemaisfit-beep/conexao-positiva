import { getTranslations } from "next-intl/server";
import { provisionalImages } from "@/content/provisional-images";
import { EditorialPhoto } from "@/components/common/editorial-photo";
import { Section } from "@/components/layout/section";
import { TextLink } from "@/components/ui/text-link";

export async function AboutIntro() {
  const t = await getTranslations("Home.about");
  const journey = t.raw("journey") as string[];

  return (
    <Section tone="alt" aria-labelledby="about-title">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <EditorialPhoto
            image={provisionalImages.training}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="reveal"
          />
          <div className="flex reveal flex-col items-start gap-5">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2
              id="about-title"
              className="max-w-[18ch] text-h1 leading-[1.12] font-bold tracking-[-0.035em]"
            >
              {t("title")}
            </h2>
            <p className="max-w-xl text-lead text-muted">{t("text")}</p>
            <TextLink href="/sobre">{t("cta")}</TextLink>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 md:mt-16">
          <p className="mb-6 text-caption font-semibold tracking-[0.12em] text-muted uppercase">
            {t("journeyTitle")}
          </p>
          <ol className="sm:grid-cols-2 grid gap-x-8 gap-y-5 lg:grid-cols-5">
            {journey.map((step, index) => (
              <li key={step} className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="text-caption font-semibold text-primary tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-h4 font-semibold">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
