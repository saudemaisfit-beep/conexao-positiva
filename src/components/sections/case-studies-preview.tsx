import { getTranslations } from "next-intl/server";
import type { CaseStudySummary } from "@/content/types";
import { CaseStudyCard } from "@/components/cards/case-study-card";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { TextLink } from "@/components/ui/text-link";

export async function CaseStudiesPreview({ studies }: { studies: CaseStudySummary[] }) {
  if (studies.length === 0) return null;
  const t = await getTranslations("Home.cases");
  const [featured, ...rest] = studies.slice(0, 3);

  return (
    <Section aria-labelledby="cases-title">
      <div className="container-site">
        <SectionHeader
          id="cases-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          action={<TextLink href="/experiencias">{t("all")}</TextLink>}
        />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {featured && (
            <div className="reveal">
              <CaseStudyCard study={featured} featured />
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid gap-5">
              {rest.map((study) => (
                <div key={study.slug} className="reveal">
                  <CaseStudyCard study={study} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
