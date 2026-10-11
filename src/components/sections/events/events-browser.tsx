"use client";

import { useTranslations } from "next-intl";
import type { EventCategory, EventSummary } from "@/content/types";
import { EventCard } from "@/components/cards/event-card";
import { Button } from "@/components/ui/button";
import { chipClass } from "@/components/ui/chip";
import { FilterChips } from "@/components/ui/filter-chips";
import { cn } from "@/lib/cn";
import { useUrlSearch } from "@/lib/use-url-search";

export interface BrowsableEvent extends EventSummary {
  past: boolean;
}

const CATEGORIES: EventCategory[] = ["workshop", "formacao", "palestra", "experiencia"];

type Period = "proximos" | "passados";
type Update = (next: { filtro?: string | null; categoria?: string | null }) => void;

/**
 * Agenda com filtros Próximos/Passados + categoria. O estado vive no URL
 * (?filtro=passados&categoria=workshop): pode ser partilhado e cada mudança fica no histórico ("voltar").
 */
export function EventsBrowser({ events }: { events: BrowsableEvent[] }) {
  const { params, navigate } = useUrlSearch();

  const period: Period = params.get("filtro") === "passados" ? "passados" : "proximos";
  const requested = params.get("categoria");
  const category = CATEGORIES.find((item) => item === requested) ?? null;

  const update: Update = (next) => {
    const query = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) query.set(key, value);
      else query.delete(key);
    }
    navigate(query);
  };

  return <EventsView events={events} period={period} category={category} onUpdate={update} />;
}

/**
 * Vista da agenda sem estado próprio. O servidor desenha-a com o filtro por defeito: a lista
 * está no HTML inicial e é reaproveitada na hidratação (sem saltos de layout nem LCP tardio).
 */
export function EventsView({
  events,
  period = "proximos",
  category = null,
  onUpdate,
}: {
  events: BrowsableEvent[];
  period?: Period;
  category?: EventCategory | null;
  onUpdate?: Update;
}) {
  const t = useTranslations("Events.filters");
  const tc = useTranslations("Events.categories");
  const update: Update = (next) => onUpdate?.(next);

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
          <FilterChips
            label={t("category")}
            options={[
              { value: null, label: t("all") },
              ...available.map((item) => ({ value: item, label: tc(item) })),
            ]}
            value={category}
            onChange={(value) => update({ categoria: value })}
          />
        )}
      </div>

      <h2 className="sr-only">{t("listTitle")}</h2>
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
