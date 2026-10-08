import { getTranslations } from "next-intl/server";
import { aboutCopy } from "@/content/about";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";

/** Abordagem: sequência real de cinco momentos, por isso numerada. */
export async function ApproachSteps() {
  const t = await getTranslations("About.approach");
  return (
    <Section tone="alt" aria-labelledby="approach-title">
      <div className="container-site">
        <SectionHeader
          id="approach-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
        />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {aboutCopy.approach.steps.map((step, index) => (
            <li
              key={step.name}
              className="relative flex reveal flex-col gap-3 rounded-lg bg-surface-raised p-6 shadow-sm"
            >
              <span className="font-display text-small font-extrabold text-secondary-strong tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h4 font-bold">{step.name}</h3>
              <p className="text-small text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
