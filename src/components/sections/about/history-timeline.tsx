import { getTranslations } from "next-intl/server";
import type { Milestone } from "@/content/types";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";

/** Marcos reais da história. Sem marcos fornecidos, a secção não aparece. */
export async function HistoryTimeline({ milestones }: { milestones: Milestone[] }) {
  if (milestones.length === 0) return null;
  const t = await getTranslations("About.history");
  return (
    <Section aria-labelledby="history-title">
      <div className="container-site">
        <SectionHeader id="history-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ol className="grid gap-0 lg:grid-cols-4 lg:gap-8">
          {milestones.map((milestone) => (
            <li
              key={`${milestone.year}-${milestone.title}`}
              className="relative flex reveal flex-col gap-2 border-l-2 border-secondary-soft pb-10 pl-7 last:pb-0 lg:border-t-2 lg:border-l-0 lg:pt-8 lg:pb-0 lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-1 -left-[0.5625rem] size-4 rounded-full border-2 border-secondary bg-background lg:-top-[0.5625rem] lg:left-0"
              />
              <span className="font-display text-h3 font-extrabold text-primary tabular-nums">
                {milestone.year}
              </span>
              <span className="text-h4 font-bold">{milestone.title}</span>
              <span className="text-small text-muted">{milestone.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
