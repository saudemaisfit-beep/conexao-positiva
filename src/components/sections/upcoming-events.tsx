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
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.slug} className="reveal">
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
