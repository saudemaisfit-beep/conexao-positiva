import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import type { EventSummary, ImpactStat } from "@/content/types";
import { HeroSlideshow } from "./hero-slideshow";
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
    <HeroSlideshow>
      <div className="relative container-site grid min-h-[38rem] grid-cols-1 items-center gap-10 pt-16 pb-12 md:min-h-[42rem] md:pt-24 md:pb-20 lg:grid-cols-[minmax(0,8fr)_minmax(0,3fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="eyebrow text-white">{t("eyebrow")}</p>
          <h1
            id="hero-title"
            className="max-w-[18ch] text-[clamp(2.125rem,5.5vw,4.75rem)] leading-[1.08] font-extrabold tracking-[-0.04em]"
          >
            {lines.map((line, index) => (
              <span
                key={line}
                className="block animate-rise-in"
                style={{ animationDelay: `${80 + index * 120}ms` }}
              >
                {index === lines.length - 1 ? <span className="text-white">{line}</span> : line}
              </span>
            ))}
          </h1>
          <p className="max-w-[48ch] text-lead text-white/90">{t("lead")}</p>
          <div className="sm:flex-row sm:flex-wrap mt-2 flex flex-col gap-3">
            <ButtonLink href="/solucoes" size="lg" variant="glow">
              {t("primary")}
              <ArrowRight aria-hidden="true" className={arrowClassName} />
            </ButtonLink>
            <ButtonLink href={proposalHref} variant="glass" size="lg">
              {t("secondary")}
            </ButtonLink>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4 self-end">
          {nextEvent && (
            <Link
              href={`/eventos/${nextEvent.slug}`}
              className="group bg-black/55 flex items-center gap-4 rounded-xl border border-white/30 p-5 transition-transform duration-(--duration-base) ease-out hover:-translate-y-1 max-lg:order-last"
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
                <div
                  key={stat.label}
                  className="bg-black/55 flex flex-col-reverse gap-1 rounded-xl border border-white/30 p-5"
                >
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
    </HeroSlideshow>
  );
}
