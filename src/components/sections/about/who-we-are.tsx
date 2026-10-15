import { Building2, Landmark, User, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { aboutCopy } from "@/content/about";
import { Section } from "@/components/layout/section";
import { EditorialPhoto } from "@/components/common/editorial-photo";
import { provisionalImages } from "@/content/provisional-images";

const audienceIcons = [User, Building2, Users, Landmark];

export async function WhoWeAre() {
  const t = await getTranslations("About.who");
  const audiences = (t.raw("audiences") as string[]).map((label, index) => ({
    label,
    icon: audienceIcons[index] ?? Users,
  }));
  return (
    <Section tone="alt" aria-labelledby="who-title">
      <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-20">
        <div className="flex reveal flex-col gap-5">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="who-title" className="text-h2 font-bold">
            {t("title")}
          </h2>
          {aboutCopy.who.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-[68ch] text-body-lg text-muted">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <EditorialPhoto image={provisionalImages.mentoring} />
          <ul
            className="sm:grid-cols-2 grid reveal grid-cols-1 gap-3"
            aria-label={t("audiencesLabel")}
          >
            {audiences.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 border-t border-border py-4">
                <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <span className="font-display text-h4 font-bold">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
