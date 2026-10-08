import { getTranslations } from "next-intl/server";
import { aboutCopy } from "@/content/about";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { StepsList } from "@/components/sections/steps-list";

/** Abordagem: sequência real de cinco momentos, por isso numerada. */
export async function ApproachSteps() {
  const t = await getTranslations("About.approach");
  const steps = aboutCopy.approach.steps.map((step) => ({ title: step.name, text: step.text }));
  return (
    <Section tone="alt" aria-labelledby="approach-title">
      <div className="container-site">
        <SectionHeader
          id="approach-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
        />
        <StepsList steps={steps} columns={5} />
      </div>
    </Section>
  );
}
