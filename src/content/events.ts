import "server-only";
import { present, toEvent, type RawEvent } from "@/sanity/mappers";
import { sanityFetch } from "@/sanity/fetch";
import { eventsQuery, tags } from "@/sanity/queries";
import { contentSource } from "./source";
import type { EventDetail, EventSummary } from "./types";

/**
 * Eventos publicados no Sanity. Sem CMS configurado a lista está vazia e a agenda mostra o
 * estado vazio; com CONTENT_PREVIEW=1 (sem Sanity) devolve exemplos [Exemplo].
 */
export async function getEvents(now = new Date()): Promise<EventDetail[]> {
  const source = contentSource();
  if (source === "sanity") {
    const raw = await sanityFetch<RawEvent[]>(eventsQuery, [...tags.events]);
    return (raw ?? []).map(toEvent).filter(present);
  }
  if (source === "preview") {
    const { exampleEvents } = await import("./fixtures");
    return exampleEvents(now);
  }
  return [];
}

export async function getEvent(slug: string, now = new Date()) {
  const events = await getEvents(now);
  return events.find((event) => event.slug === slug) ?? null;
}

export function isPastEvent(event: EventSummary, now: Date) {
  return new Date(event.endsAt ?? event.startsAt).getTime() < now.getTime();
}

/** Aceita inscrições: futuro e com vagas (ou lista de espera, se esgotado). */
export function registrationState(event: EventSummary, now: Date) {
  if (isPastEvent(event, now)) return "passado" as const;
  if (event.status === "encerrado") return "encerrado" as const;
  if (event.status === "esgotado") return "lista-de-espera" as const;
  return "aberto" as const;
}

/** Resumo serializável para componentes de cliente (sem conteúdo longo). */
export function toSummary(event: EventDetail): EventSummary {
  const { slug, title, category, startsAt, endsAt, location, priceKz, status, image } = event;
  return { slug, title, category, startsAt, endsAt, location, priceKz, status, image };
}
