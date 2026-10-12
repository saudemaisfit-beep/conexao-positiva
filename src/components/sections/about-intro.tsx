import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { TextLink } from "@/components/ui/text-link";

export async function AboutIntro() {
  const t = await getTranslations("Home.about");
  const journey = t.raw("journey") as string[];

  return (
    <Section tone="alt" aria-labelledby="about-title">
      <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-20">
        <div className="flex reveal flex-col gap-5">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="about-title" className="text-h1 font-extrabold">
            {t("title")}
          </h2>
          <p className="max-w-xl text-lead text-muted">{t("text")}</p>
          <TextLink href="/sobre" className="self-start">
            {t("cta")}
          </TextLink>
        </div>

        <figure className="reveal rounded-xl bg-surface-raised p-6 shadow-sm md:p-10">
          <figcaption className="text-caption font-semibold tracking-[0.12em] text-muted uppercase">
            {t("journeyTitle")}
          </figcaption>
          <ol className="mt-6 flex flex-col">
            {journey.map((step, index) => {
              const last = index === journey.length - 1;
              return (
                <li key={step} className="relative flex items-center gap-4 pb-6 last:pb-0">
                  {!last && (
                    <span
                      aria-hidden="true"
                      className="absolute top-6 left-[0.6875rem] h-full w-0.5 bg-secondary-soft"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={
                      last
                        ? "relative size-6 shrink-0 rounded-full bg-primary ring-4 ring-primary-soft"
                        : "relative size-6 shrink-0 rounded-full border-2 border-secondary bg-surface-raised"
                    }
                  />
                  <span
                    className={
                      last
                        ? "font-display text-h3 font-bold text-primary"
                        : "font-display text-h4 font-bold"
                    }
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>
        </figure>
      </div>
    </Section>
  );
}
