"use client";

import { useTranslations } from "next-intl";
import type { CaseCategory, CaseStudySummary } from "@/content/types";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { FilterChips } from "@/components/ui/filter-chips";
import { cn } from "@/lib/cn";
import { useUrlSearch } from "@/lib/use-url-search";

const CATEGORIES: CaseCategory[] = [
  "team-building",
  "formacao",
  "workshop",
  "evento",
  "lideranca",
  "bem-estar",
];

/**
 * Portefólio com filtro por tipo. O filtro vive no URL (?categoria=lideranca), pode ser
 * partilhado e fica no histórico. Só aparecem os tipos com pelo menos uma experiência.
 */
export function ExperiencesBrowser({ studies }: { studies: CaseStudySummary[] }) {
  const { params, navigate } = useUrlSearch();
  const requested = params.get("categoria");
  const category = CATEGORIES.find((item) => item === requested) ?? null;

  const select = (value: CaseCategory | null) => {
    navigate(new URLSearchParams(value ? { categoria: value } : {}));
  };

  return <ExperiencesView studies={studies} category={category} onSelect={select} />;
}

/** Vista sem estado próprio: o servidor desenha-a sem filtro e é reaproveitada na hidratação. */
export function ExperiencesView({
  studies,
  category: requested = null,
  onSelect,
}: {
  studies: CaseStudySummary[];
  category?: CaseCategory | null;
  onSelect?: (value: CaseCategory | null) => void;
}) {
  const t = useTranslations("Experiences");
  const available = CATEGORIES.filter((item) => studies.some((study) => study.category === item));
  const category = available.find((item) => item === requested) ?? null;
  const visible = category ? studies.filter((study) => study.category === category) : studies;
  const select = (value: CaseCategory | null) => onSelect?.(value);

  return (
    <div className="flex flex-col gap-10">
      {available.length > 1 && (
        <div className="flex flex-col gap-4">
          <FilterChips
            label={t("filters.category")}
            options={[
              { value: null, label: t("filters.all") },
              ...available.map((item) => ({ value: item, label: t(`categories.${item}`) })),
            ]}
            value={category}
            onChange={select}
          />
          <p aria-live="polite" className="text-small text-muted">
            {t("filters.results", { count: visible.length })}
          </p>
        </div>
      )}

      <h2 className="sr-only">{t("filters.listTitle")}</h2>
      {/* Grelha de 2 colunas com a segunda desfasada (ritmo editorial sem alterar a ordem de leitura). */}
      <ul
        className={cn(
          "grid gap-x-6 gap-y-8 md:grid-cols-2 md:gap-y-14",
          visible.length > 1 && "md:pb-10",
        )}
      >
        {visible.map((study, index) => (
          <li key={study.slug} className={cn(index % 2 === 1 && "md:translate-y-10")}>
            <CaseStudyCard
              study={study}
              ratio={index % 4 === 0 || index % 4 === 3 ? "aspect-[16/11]" : "aspect-[16/9]"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
