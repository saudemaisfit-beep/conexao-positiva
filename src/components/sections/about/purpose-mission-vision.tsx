import { getTranslations } from "next-intl/server";
import { aboutCopy } from "@/content/about";
import { Section } from "@/components/layout/section";

export async function PurposeMissionVision() {
  const t = await getTranslations("About.purpose");
  return (
    <Section tone="inverse" aria-labelledby="purpose-title">
      <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
        <div className="flex reveal flex-col gap-5">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="purpose-title" className="text-h1 font-extrabold">
            {aboutCopy.purpose.statement.split(". ").map((part, index, all) => (
              <span key={part} className="block">
                {part}
                {index < all.length - 1 ? "." : ""}
              </span>
            ))}
          </h2>
        </div>
        <div className="flex flex-col divide-y divide-white/15">
          {[
            { title: t("missionTitle"), text: aboutCopy.mission.text },
            { title: t("visionTitle"), text: aboutCopy.vision.text },
          ].map((block) => (
            <div key={block.title} className="flex reveal flex-col gap-3 py-8 first:pt-0 last:pb-0">
              <h3 className="text-h4 font-bold text-brand-on-inverse">{block.title}</h3>
              <p className="text-lead text-on-inverse-muted">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
