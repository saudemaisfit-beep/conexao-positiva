"use server";

import { revalidateTag } from "next/cache";
import type { z } from "zod";
import { getEvent, registrationState } from "@/content/events";
import { REGISTRATIONS_TAG } from "@/lib/db/submissions";
import { deliverContact, deliverProposal, deliverRegistration } from "@/lib/forms/delivery";
import {
  contactSchema,
  proposalSchema,
  registrationSchema,
  type FormResult,
} from "@/lib/forms/schemas";
import { clientIp } from "@/lib/security/client-ip";
import { rateLimit } from "@/lib/security/rate-limit";
import { looksLikeSpam } from "@/lib/security/spam";
import { verifyTurnstile } from "@/lib/security/turnstile";

type Kind = "contacto" | "proposta" | "inscricao";

/** Primeiro erro de cada campo, para mostrar junto do campo no formulário. */
function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] ??= issue.message;
  }
  return errors;
}

/**
 * Passos comuns, por ordem: anti-spam (campo-isco e tempo), limite de pedidos, Turnstile e
 * validação no servidor (nunca confiar só no browser). Robôs evidentes recebem um sucesso
 * falso, para não aprenderem a contornar a proteção.
 */
async function guard<S extends z.ZodType>(
  kind: Kind,
  schema: S,
  input: unknown,
  successPath: string,
): Promise<{ result: FormResult } | { data: z.output<S> }> {
  const raw = (input ?? {}) as { website?: string; startedAt?: number; turnstileToken?: unknown };
  if (looksLikeSpam(raw)) return { result: { ok: true, redirectTo: successPath } };

  const ip = await clientIp();
  if (!(await rateLimit(`${kind}:${ip}`)).allowed) {
    return { result: { ok: false, error: "rate-limit" } };
  }
  const token = typeof raw.turnstileToken === "string" ? raw.turnstileToken : undefined;
  if (!(await verifyTurnstile(token, ip))) return { result: { ok: false, error: "verification" } };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { result: { ok: false, error: "validation", fieldErrors: fieldErrors(parsed.error) } };
  }
  return { data: parsed.data };
}

async function safely(kind: Kind, run: () => Promise<FormResult>): Promise<FormResult> {
  try {
    return await run();
  } catch (error) {
    console.error(`[formulários] falha no envio: ${kind}`, String(error));
    return { ok: false, error: "server" };
  }
}

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
