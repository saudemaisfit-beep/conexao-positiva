import { getTranslations } from "next-intl/server";
import type { TeamMember } from "@/content/types";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";

export async function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;
  const t = await getTranslations("About.team");
  const tf = await getTranslations("About.founder");
  return (
    <Section tone="alt" aria-labelledby="team-title">
      <div className="container-site">
        <SectionHeader id="team-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {members.map((member) => (
            <li key={member.name} className="flex reveal flex-col gap-3">
              <PersonAvatar
                name={member.name}
                photo={member.photo}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-[4/5] rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{member.name}</span>
                <span className="text-small text-muted">{member.role}</span>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tf("linkedin", { name: member.name })}
                    className="mt-1 inline-flex min-h-11 items-center text-small font-semibold text-primary underline underline-offset-4"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
