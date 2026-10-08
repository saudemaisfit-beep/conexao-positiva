import { getTranslations } from "next-intl/server";
import { aboutCopy } from "@/content/about";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { FeatureList } from "@/components/sections/feature-list";

/** Valores: grelha editorial sem números (a ordem não tem significado). */
export async function ValuesList() {
  const t = await getTranslations("About.values");
  const values = aboutCopy.values.items.map((value) => ({ title: value.name, text: value.text }));
  return (
    <Section aria-labelledby="values-title">
      <div className="container-site">
        <SectionHeader id="values-title" eyebrow={t("eyebrow")} title={t("title")} />
        <FeatureList items={values} />
      </div>
    </Section>
  );
}
