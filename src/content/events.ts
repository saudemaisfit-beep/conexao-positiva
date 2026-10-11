import "server-only";
import { isDatabaseConfigured } from "@/lib/db/client";
import { confirmedRegistrations } from "@/lib/db/submissions";
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
    return withAvailability((raw ?? []).map(toEvent).filter(present));
  }
  if (source === "preview") {
    const { exampleEvents } = await import("./fixtures");
    return withAvailability(exampleEvents(now));
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

/**
 * Vagas restantes e estado automático a partir das inscrições confirmadas:
 * "Últimas vagas" com 10 % ou menos da lotação; "Esgotado" (lista de espera) sem vagas.
 * Um estado marcado no CMS como "Encerrado" ou "Esgotado" nunca é reaberto automaticamente.
 */
export function applyAvailability(event: EventDetail, confirmed: number): EventDetail {
  if (!event.capacity) return event;
  const spotsLeft = Math.max(0, event.capacity - confirmed);
  let status = event.status;
  if (status === "aberto" || status === "ultimas-vagas") {
    if (spotsLeft === 0) status = "esgotado";
    else if (spotsLeft <= Math.max(1, Math.ceil(event.capacity * 0.1))) status = "ultimas-vagas";
  }
  return { ...event, spotsLeft, status };
}

async function withAvailability(events: EventDetail[]) {
  const limited = events.filter((event) => event.capacity);
  if (!isDatabaseConfigured || limited.length === 0) return events;
  try {
    const counts = await confirmedRegistrations(limited.map((event) => event.slug));
    return events.map((event) => applyAvailability(event, counts.get(event.slug) ?? 0));
  } catch (error) {
    // Sem contagem, a página mostra o evento sem vagas; a inscrição confirma sempre no servidor.
    console.error("[eventos] não foi possível obter as vagas", error);
    return events;
  }
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
