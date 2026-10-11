import { getTranslations } from "next-intl/server";
import type { TeamMember } from "@/content/types";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Section } from "@/components/layout/section";

export async function FounderFeature({ founder }: { founder: TeamMember | null }) {
  if (!founder) return null;
  const t = await getTranslations("About.founder");
  return (
    <Section aria-labelledby="founder-title">
      <div className="container-site grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center lg:gap-20">
        <PersonAvatar
          name={founder.name}
          photo={founder.photo}
          sizes="(min-width: 768px) 40vw, 100vw"
          className="aspect-[4/5] reveal rounded-xl"
        />
        <div className="flex reveal flex-col gap-4">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="founder-title" className="text-h2 font-bold">
            {founder.name}
          </h2>
          <p className="font-semibold text-primary">{founder.role}</p>
          {founder.bio && <p className="max-w-[68ch] text-body-lg text-muted">{founder.bio}</p>}
          {founder.linkedin && (
            <a
              href={founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("linkedin", { name: founder.name })}
              className="inline-flex min-h-11 items-center self-start font-semibold text-primary underline underline-offset-4"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
