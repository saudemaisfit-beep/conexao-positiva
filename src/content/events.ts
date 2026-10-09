import "server-only";
import type { EventDetail, EventSummary } from "./types";

/**
 * Eventos. Até à ligação ao CMS não há eventos reais publicados: a lista está vazia e a
 * agenda mostra o estado vazio. Com CONTENT_PREVIEW=1 devolve exemplos [Exemplo].
 */
export async function getEvents(now = new Date()): Promise<EventDetail[]> {
  if (process.env.CONTENT_PREVIEW === "1") {
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
