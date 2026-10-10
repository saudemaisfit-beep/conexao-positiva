import { siteConfig } from "@/config/site";
import { getEvent } from "@/content/events";
import { buildIcs } from "@/lib/calendar/ics";

export const revalidate = 3600;

/** /api/calendario/[slug] → ficheiro .ics do evento (sem dados pessoais). */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return new Response("Evento não encontrado.", { status: 404 });

  const url = new URL(`/eventos/${event.slug}`, siteConfig.url).toString();
  const body = buildIcs({
    uid: `${event.slug}@${new URL(siteConfig.url).hostname}`,
    title: event.title,
    description: event.summary,
    location: event.location,
    url,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
