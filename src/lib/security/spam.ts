import "server-only";

/** Tempo mínimo de preenchimento: uma pessoa não preenche um formulário em menos de 3 s. */
const MIN_FILL_MS = 3_000;
/** Formulários abertos há mais de 24 h são tratados como suspeitos (reenvios automáticos). */
const MAX_AGE_MS = 24 * 60 * 60 * 1_000;

/**
 * Sinais de robô: campo-isco preenchido ou tempo de preenchimento impossível.
 * A Fase 14 acrescenta a verificação Cloudflare Turnstile.
 */
export function looksLikeSpam(input: { website?: string; startedAt?: number }, now = Date.now()) {
  if (input.website) return true;
  if (typeof input.startedAt !== "number") return true;
  const elapsed = now - input.startedAt;
  return elapsed < MIN_FILL_MS || elapsed > MAX_AGE_MS;
}
