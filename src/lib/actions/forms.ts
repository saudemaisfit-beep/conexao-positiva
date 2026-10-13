"use server";

import { revalidateTag } from "next/cache";
import { getEvent, registrationState } from "@/content/events";
import { REGISTRATIONS_TAG } from "@/lib/db/submissions";
import { deliverContact, deliverProposal, deliverRegistration } from "@/lib/forms/delivery";
import {
  contactSchema,
  proposalSchema,
  registrationSchema,
  type FormResult,
} from "@/lib/forms/schemas";
import { guard, safely } from "@/lib/forms/guard";

export async function submitContact(input: unknown): Promise<FormResult> {
  const success = "/mensagem-enviada";
  const checked = await guard("contacto", contactSchema, input, success);
  if ("result" in checked) return checked.result;
  return safely("contacto", async () =>
    (await deliverContact(checked.data)) === "ok"
      ? { ok: true, redirectTo: success }
      : { ok: false, error: "unavailable" },
  );
}

export async function submitProposal(input: unknown): Promise<FormResult> {
  const success = "/proposta-recebida";
  const checked = await guard("proposta", proposalSchema, input, success);
  if ("result" in checked) return checked.result;
  return safely("proposta", async () =>
    (await deliverProposal(checked.data)) === "ok"
      ? { ok: true, redirectTo: success }
      : { ok: false, error: "unavailable" },
  );
}

export async function submitRegistration(input: unknown): Promise<FormResult> {
  const slug = String((input as { eventSlug?: unknown } | null)?.eventSlug ?? "");
  const success = `/inscricao-confirmada?evento=${encodeURIComponent(slug)}`;
  const checked = await guard("inscricao", registrationSchema, input, success);
  if ("result" in checked) return checked.result;

  return safely("inscricao", async () => {
    // O evento é confirmado no servidor: não basta o browser dizer que as inscrições estão abertas.
    const event = await getEvent(checked.data.eventSlug);
    const state = event ? registrationState(event, new Date()) : "encerrado";
    if (!event || (state !== "aberto" && state !== "lista-de-espera")) {
      return { ok: false, error: "closed" };
    }

    const outcome = await deliverRegistration(event, checked.data);
    if (outcome === "unavailable") return { ok: false, error: "unavailable" };
    if (outcome === "duplicada") return { ok: false, error: "duplicate" };
    // Atualiza as vagas mostradas nas páginas do evento.
    revalidateTag(REGISTRATIONS_TAG, { expire: 0 });
    return {
      ok: true,
      redirectTo: outcome === "lista-de-espera" ? `${success}&lista=1` : success,
    };
  });
}
