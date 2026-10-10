import "server-only";
import { getCaseStudies, toCaseSummary } from "./cases";
import { getEvents, isPastEvent, toSummary } from "./events";
import { getArticleSummaries } from "./insights";
import { getClientLogos, getImpactStats, getTestimonials } from "./proof";
import { contentSource } from "./source";
import type { HomeContent } from "./types";

/**
 * Conteúdo dinâmico da Home, publicado no Sanity. Sem CMS as coleções ficam vazias e as
 * secções correspondentes não são mostradas. Com CONTENT_PREVIEW=1 (sem Sanity) devolve
 * exemplos marcados como [Exemplo] para rever o design.
 */
export async function getHomeContent(now = new Date()): Promise<HomeContent> {
  const events = (await getEvents(now)).map(toSummary);
  const caseStudies = (await getCaseStudies()).slice(0, 3).map(toCaseSummary);
  const articles = (await getArticleSummaries()).slice(0, 3);
  const source = contentSource();
  if (source === "preview") {
    const { exampleHomeContent } = await import("./fixtures");
    return { ...exampleHomeContent(now), events, caseStudies, articles };
  }
  if (source === "none") {
    return { stats: [], clients: [], testimonials: [], events, caseStudies, articles };
  }

  const [stats, clients, testimonials] = await Promise.all([
    getImpactStats(),
    getClientLogos(),
    getTestimonials({ home: true }),
  ]);
  return { stats, clients, testimonials: testimonials.slice(0, 6), events, caseStudies, articles };
}

/** Eventos futuros e com inscrições ainda relevantes, por ordem de data. */
export function upcomingEvents(events: HomeContent["events"], now: Date, limit = 3) {
  return events
    .filter((event) => !isPastEvent(event, now))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, limit);
}
