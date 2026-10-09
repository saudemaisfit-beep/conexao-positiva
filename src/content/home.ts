import "server-only";
import { getCaseStudies, toCaseSummary } from "./cases";
import { getEvents, isPastEvent, toSummary } from "./events";
import type { HomeContent } from "./types";

/**
 * Conteúdo dinâmico da Home. Até à ligação ao CMS (Fase 13) não há conteúdo real publicado,
 * por isso as coleções estão vazias e as secções correspondentes não são mostradas.
 * Com CONTENT_PREVIEW=1 (apenas em desenvolvimento ou pré-visualização), devolve exemplos
 * marcados como [Exemplo] para rever o design.
 */
export async function getHomeContent(now = new Date()): Promise<HomeContent> {
  const events = (await getEvents(now)).map(toSummary);
  const caseStudies = (await getCaseStudies()).slice(0, 3).map(toCaseSummary);
  if (process.env.CONTENT_PREVIEW === "1") {
    const { exampleHomeContent } = await import("./fixtures");
    return { ...exampleHomeContent(now), events, caseStudies };
  }

  return { stats: [], clients: [], testimonials: [], events, caseStudies, articles: [] };
}

/** Eventos futuros e com inscrições ainda relevantes, por ordem de data. */
export function upcomingEvents(events: HomeContent["events"], now: Date, limit = 3) {
  return events
    .filter((event) => !isPastEvent(event, now))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, limit);
}
