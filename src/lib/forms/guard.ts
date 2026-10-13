import "server-only";
import type { z } from "zod";
import { clientIp } from "@/lib/security/client-ip";
import { rateLimit } from "@/lib/security/rate-limit";
import { looksLikeSpam } from "@/lib/security/spam";
import { verifyTurnstile } from "@/lib/security/turnstile";
import type { FormResult } from "./schemas";

export type Kind = "contacto" | "proposta" | "inscricao" | "compra";

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
export async function guard<S extends z.ZodType>(
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

export async function safely(kind: Kind, run: () => Promise<FormResult>): Promise<FormResult> {
  try {
    return await run();
  } catch (error) {
    console.error(`[formulários] falha no envio: ${kind}`, String(error));
    return { ok: false, error: "server" };
  }
}
