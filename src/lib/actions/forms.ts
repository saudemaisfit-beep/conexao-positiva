"use server";

import type { z } from "zod";
import { getEvent, registrationState } from "@/content/events";
import { deliverSubmission, type Submission } from "@/lib/forms/delivery";
import {
  contactSchema,
  proposalSchema,
  registrationSchema,
  type FormResult,
} from "@/lib/forms/schemas";
import { clientIp } from "@/lib/security/client-ip";
import { rateLimit } from "@/lib/security/rate-limit";
import { looksLikeSpam } from "@/lib/security/spam";

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
 * Passos comuns: anti-spam, limite de pedidos e validação no servidor (nunca confiar só
 * na validação do browser). Robôs recebem uma resposta de sucesso falsa, para não aprenderem
 * a contornar a proteção.
 */
async function guard<S extends z.ZodType>(
  kind: Submission["kind"],
  schema: S,
  input: unknown,
  successPath: string,
): Promise<{ result: FormResult } | { data: z.output<S> }> {
  const raw = (input ?? {}) as { website?: string; startedAt?: number };
  if (looksLikeSpam(raw)) return { result: { ok: true, redirectTo: successPath } };

  const ip = await clientIp();
  if (!rateLimit(`${kind}:${ip}`).allowed) return { result: { ok: false, error: "rate-limit" } };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { result: { ok: false, error: "validation", fieldErrors: fieldErrors(parsed.error) } };
  }
  return { data: parsed.data };
}

async function deliver(submission: Submission, successPath: string): Promise<FormResult> {
  try {
    const status = await deliverSubmission(submission);
    return status === "ok"
      ? { ok: true, redirectTo: successPath }
      : { ok: false, error: "unavailable" };
  } catch (error) {
    console.error(`[formulários] falha no envio: ${submission.kind}`, error);
    return { ok: false, error: "server" };
  }
}

export async function submitContact(input: unknown): Promise<FormResult> {
  const success = "/mensagem-enviada";
  const checked = await guard("contacto", contactSchema, input, success);
  if ("result" in checked) return checked.result;
  return deliver({ kind: "contacto", data: checked.data }, success);
}

export async function submitProposal(input: unknown): Promise<FormResult> {
  const success = "/proposta-recebida";
  const checked = await guard("proposta", proposalSchema, input, success);
  if ("result" in checked) return checked.result;
  return deliver({ kind: "proposta", data: checked.data }, success);
}

export async function submitRegistration(input: unknown): Promise<FormResult> {
  const slug = String((input as { eventSlug?: unknown } | null)?.eventSlug ?? "");
  const success = `/inscricao-confirmada?evento=${encodeURIComponent(slug)}`;
  const checked = await guard("inscricao", registrationSchema, input, success);
  if ("result" in checked) return checked.result;

  // O evento é confirmado no servidor: não basta o browser dizer que as inscrições estão abertas.
  const event = await getEvent(checked.data.eventSlug);
  const state = event ? registrationState(event, new Date()) : "encerrado";
  if (state !== "aberto" && state !== "lista-de-espera") return { ok: false, error: "closed" };

  const waitlist = state === "lista-de-espera";
  return deliver(
    { kind: "inscricao", data: { ...checked.data, waitlist } },
    waitlist ? `${success}&lista=1` : success,
  );
}
