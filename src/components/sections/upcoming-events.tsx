import { getTranslations } from "next-intl/server";
import type { EventSummary } from "@/content/types";
import { EventCard } from "@/components/cards/event-card";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { TextLink } from "@/components/ui/text-link";

export async function UpcomingEvents({ events }: { events: EventSummary[] }) {
  if (events.length === 0) return null;
  const t = await getTranslations("Home.events");
  return (
    <Section aria-labelledby="events-title">
      <div className="container-site">
        <SectionHeader
          id="events-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          action={<TextLink href="/eventos">{t("all")}</TextLink>}
        />
        <ul className="grid gap-6 md:grid-cols-2">
          {events.slice(0, 3).map((event, index) => (
            <li key={event.slug} className={index === 0 ? "reveal md:col-span-2" : "reveal"}>
              <EventCard event={event} featured={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
