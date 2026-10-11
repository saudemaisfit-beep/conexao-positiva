import "server-only";
import type { ContactData, ProposalData, RegistrationData } from "@/lib/forms/schemas";
import { rest } from "./client";

/** Etiqueta de cache das contagens de vagas (invalidada após cada inscrição). */
export const REGISTRATIONS_TAG = "registrations";

export async function insertContactMessage(data: ContactData) {
  await rest("contact_messages", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      consent_at: new Date().toISOString(),
    },
  });
}

export async function insertProposalRequest(data: ProposalData) {
  await rest("proposal_requests", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      name: data.name,
      company: data.company,
      role: data.role,
      email: data.email,
      phone: data.phone,
      service: data.service,
      participants: data.participants,
      location: data.location,
      preferred_date: data.dateUndecided ? null : data.date,
      date_undecided: data.dateUndecided,
      objective: data.objective,
      budget: data.budget ?? null,
      details: data.details,
      consent_at: new Date().toISOString(),
    },
  });
}

export type RegistrationOutcome = "confirmada" | "lista-de-espera" | "duplicada";

/** Inscrição atómica (função SQL register_for_event): decide vaga ou lista de espera. */
export async function registerForEvent(
  event: { slug: string; title: string; startsAt: string; capacity: number | null },
  data: RegistrationData,
): Promise<RegistrationOutcome> {
  const rows = await rest<{ registration_id: string | null; result: RegistrationOutcome }[]>(
    "rpc/register_for_event",
    {
      method: "POST",
      body: {
        p_event_slug: event.slug,
        p_event_title: event.title,
        p_event_starts_at: event.startsAt,
        p_capacity: event.capacity,
        p_first_name: data.firstName,
        p_last_name: data.lastName,
        p_email: data.email,
        p_phone: data.phone,
        p_company: data.company,
        p_role: data.role,
        p_notes: data.notes,
      },
    },
  );
  const result = rows[0]?.result;
  if (!result) throw new Error("Resposta inesperada de register_for_event.");
  return result;
}

/** Inscrições confirmadas por evento (cache de 1 h, invalidada a cada inscrição). */
export async function confirmedRegistrations(slugs: string[]) {
  if (slugs.length === 0) return new Map<string, number>();
  // GET (função "stable"): pode ser guardado na cache do Next.js. Slugs só têm [a-z0-9-].
  const list = slugs.filter((slug) => /^[a-z0-9-]+$/.test(slug)).join(",");
  const rows = await rest<{ event_slug: string; confirmed: number }[]>(
    `rpc/event_registration_counts?p_event_slugs=${encodeURIComponent(`{${list}}`)}`,
    { next: { revalidate: 3600, tags: [REGISTRATIONS_TAG] } },
  );
  return new Map(rows.map((row) => [row.event_slug, row.confirmed]));
}
