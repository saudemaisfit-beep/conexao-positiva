"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import type { EventCategory, EventSummary } from "@/content/types";
import { usePathname, useRouter } from "@/i18n/navigation";
import { EventCard } from "@/components/cards/event-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface BrowsableEvent extends EventSummary {
  past: boolean;
}

const CATEGORIES: EventCategory[] = ["workshop", "formacao", "palestra", "experiencia"];

const chipClass =
  "inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border px-5 text-small font-semibold transition-colors duration-(--duration-instant)";

/**
 * Agenda com filtros Próximos/Passados + categoria. O estado vive no URL
 * (?filtro=passados&categoria=workshop): pode ser partilhado e cada mudança fica no histórico ("voltar").
 */
export function EventsBrowser({ events }: { events: BrowsableEvent[] }) {
  const t = useTranslations("Events.filters");
  const tc = useTranslations("Events.categories");
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const period = params.get("filtro") === "passados" ? "passados" : "proximos";
  const requested = params.get("categoria");
  const category = CATEGORIES.find((item) => item === requested) ?? null;

  const inPeriod = events
    .filter((event) => (period === "passados" ? event.past : !event.past))
    .sort((a, b) =>
      period === "passados"
        ? b.startsAt.localeCompare(a.startsAt)
        : a.startsAt.localeCompare(b.startsAt),
    );
  const available = CATEGORIES.filter((item) => inPeriod.some((event) => event.category === item));
  const visible = category ? inPeriod.filter((event) => event.category === category) : inPeriod;
  const showFeatured = period === "proximos" && !category;
  const featured = showFeatured ? visible[0] : undefined;
  const rest = showFeatured ? visible.slice(1) : visible;
  period === "proximos" && !category ? visible : [undefined, ...visible];

  const update = (next: { filtro?: string | null; categoria?: string | null }) => {
    const query = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) query.set(key, value);
      else query.delete(key);
    }
    const search = query.toString();
    router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label={t("period")}
          className="inline-flex self-start rounded-full border border-border bg-surface-raised p-1"
        >
          {(["proximos", "passados"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={period === value}
              onClick={() =>
                update({ filtro: value === "passados" ? "passados" : null, categoria: null })
              }
              className={cn(
                chipClass,
                "border-transparent",
                period === value ? "bg-primary text-on-primary" : "text-text hover:text-primary",
              )}
            >
              {value === "passados" ? t("past") : t("upcoming")}
            </button>
          ))}
        </div>
        {available.length > 1 && (
          <div
            role="group"
            aria-label={t("category")}
            className="-mx-(--space-gutter) flex gap-2 overflow-x-auto px-(--space-gutter) pb-1 md:mx-0 md:px-0"
          >
            {[null, ...available].map((value) => (
              <button
                key={value ?? "todos"}
                type="button"
                aria-pressed={category === value}
                onClick={() => update({ categoria: value })}
                className={cn(
                  chipClass,
                  category === value
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border-strong bg-surface-raised text-text hover:border-primary hover:text-primary",
                )}
              >
                {value ? tc(value) : t("all")}
              </button>
            ))}
          </div>
        )}
      </div>

      <p aria-live="polite" className="text-small text-muted">
        {t("results", { count: visible.length })}
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-border-strong p-8">
          <p className="font-semibold">{t("noResults")}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => update({ filtro: null, categoria: null })}
          >
            {t("reset")}
          </Button>
        </div>
      ) : (
        <>
          {featured && <EventCard event={featured} past={featured.past} featured />}
          {rest.length > 0 && (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((event) => (
                <li key={event.slug}>
                  <EventCard event={event} past={event.past} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
