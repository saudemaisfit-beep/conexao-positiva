import { getTranslations } from "next-intl/server";
import { aboutCopy } from "@/content/about";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";

/** Valores: grelha editorial sem números (a ordem não tem significado). */
export async function ValuesList() {
  const t = await getTranslations("About.values");
  return (
    <Section aria-labelledby="values-title">
      <div className="container-site">
        <SectionHeader id="values-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {aboutCopy.values.items.map((value) => (
            <li
              key={value.name}
              className="flex reveal flex-col gap-2 border-t-2 border-secondary pt-5"
            >
              <h3 className="text-h4 font-bold">{value.name}</h3>
              <p className="text-muted">{value.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
