import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import type { EventSummary, ImpactStat } from "@/content/types";
import { provisionalImages } from "@/content/provisional-images";
import { Link } from "@/i18n/navigation";
import { formatDay, formatMonthShort } from "@/lib/format";
import { ButtonLink, arrowClassName } from "@/components/ui/button";

interface HomeHeroProps {
  /** Próximo evento com inscrições (cartão de vidro); nada aparece sem eventos. */
  nextEvent?: EventSummary | null;
  /** Até dois números de impacto publicados no CMS. */
  stats?: ImpactStat[];
}

/** Hero da Home: fotografia ilustrativa, fundo de marca e prova social publicada. */
export async function HomeHero({ nextEvent, stats = [] }: HomeHeroProps) {
  const t = await getTranslations("Home.hero");
  const te = await getTranslations("Home.events");
  const lines = [t("line1"), t("line2"), t("line3")];
  const shownStats = stats.slice(0, 2);

  return (
    <section
      aria-labelledby="hero-title"
      data-surface="inverse"
      className="relative isolate overflow-hidden bg-inverse text-on-inverse"
    >
      <div className="container-site grid grid-cols-1 items-center gap-12 pt-12 pb-20 md:pt-20 md:pb-28 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pt-20 lg:pb-32">
        <div className="flex flex-col gap-6">
          <p className="eyebrow animate-rise-in">{t("eyebrow")}</p>
          <h1
            id="hero-title"
            className="text-display font-extrabold lg:text-[clamp(3.25rem,1.6rem+2.6vw,4.5rem)]"
          >
            {lines.map((line, index) => (
              <span
                key={line}
                className="block animate-rise-in"
                style={{ animationDelay: `${80 + index * 120}ms` }}
              >
                {index === lines.length - 1 ? (
                  <span className="text-brand-on-inverse">{line}</span>
                ) : (
                  line
                )}
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
            className="mt-3 flex animate-rise-in flex-col gap-3 md:flex-row"
            style={{ animationDelay: "600ms" }}
          >
            <ButtonLink href="/solucoes" size="lg" variant="glow">
              {t("primary")}
              <ArrowRight aria-hidden="true" className={arrowClassName} />
            </ButtonLink>
            <ButtonLink href={proposalHref} variant="glass" size="lg">
              {t("secondary")}
            </ButtonLink>
          </div>
        </div>

        <div
          className="contents lg:flex lg:animate-rise-in lg:flex-col lg:gap-4"
          style={{ animationDelay: "320ms" }}
        >
          <figure className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/20 max-lg:order-first lg:aspect-[4/3]">
            <Image
              src={provisionalImages.collaboration.src}
              alt={provisionalImages.collaboration.alt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              priority
              className="object-cover"
            />
            <figcaption className="absolute right-3 bottom-3 rounded-full bg-inverse px-3 py-1 text-caption font-medium text-on-inverse">
              Fotografia ilustrativa
            </figcaption>
          </figure>
          {nextEvent && (
            <Link
              href={`/eventos/${nextEvent.slug}`}
              className="glass group flex items-center gap-4 rounded-xl p-5 transition-transform duration-(--duration-base) ease-out hover:-translate-y-1 max-lg:order-last"
            >
              <span className="grid w-16 shrink-0 place-items-center rounded-lg bg-glow py-2 font-display text-on-glow">
                <span className="text-[1.625rem] leading-none font-extrabold">
                  {formatDay(nextEvent.startsAt)}
                </span>
                <span className="text-caption font-bold tracking-[0.1em] uppercase">
                  {formatMonthShort(nextEvent.startsAt)}
                </span>
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-caption tracking-[0.12em] text-muted uppercase">
                  {t("nextEvent")} · {te(`category.${nextEvent.category}`)}
                </span>
                <span className="font-display text-h4 font-bold">{nextEvent.title}</span>
              </span>
            </Link>
          )}
          {shownStats.length > 0 && (
            <dl className="grid grid-cols-2 gap-4 max-lg:order-last">
              {shownStats.map((stat) => (
                <div key={stat.label} className="glass flex flex-col-reverse gap-1 rounded-xl p-5">
                  <dt className="text-small text-muted">{stat.label}</dt>
                  <dd className="font-display text-[1.75rem] leading-none font-extrabold whitespace-nowrap md:text-[2.25rem]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
