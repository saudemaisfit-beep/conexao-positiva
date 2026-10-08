import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { NetworkGraphic } from "@/components/common/network-graphic";
import { ButtonLink, arrowClassName } from "@/components/ui/button";

export async function HomeHero() {
  const t = await getTranslations("Home.hero");
  const lines = [t("line1"), t("line2"), t("line3")];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-site grid items-center gap-10 pt-10 pb-16 md:pt-16 md:pb-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pt-12 lg:pb-24">
        <div className="flex flex-col gap-6">
          <p className="eyebrow animate-rise-in">{t("eyebrow")}</p>
          <h1
            id="hero-title"
            className="text-display font-extrabold lg:text-[clamp(3.25rem,1.6rem+2.6vw,4.25rem)]"
          >
            {lines.map((line, index) => (
              <span
                key={line}
                className="block animate-rise-in"
                style={{ animationDelay: `${80 + index * 120}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p
            className="max-w-xl animate-rise-in text-lead text-muted"
            style={{ animationDelay: "480ms" }}
          >
            {t("lead")}
          </p>
          <div
            className="mt-2 flex animate-rise-in flex-col gap-3 md:flex-row"
            style={{ animationDelay: "600ms" }}
          >
            <ButtonLink href="/solucoes" size="lg">
              {t("primary")}
              <ArrowRight aria-hidden="true" className={arrowClassName} />
            </ButtonLink>
            <ButtonLink href={proposalHref} variant="secondary" size="lg">
              {t("secondary")}
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-[30rem] md:block">
          <div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-full bg-primary-soft blur-3xl"
          />
          <NetworkGraphic className="relative w-full" />
        </div>
      </div>
    </section>
  );
}
