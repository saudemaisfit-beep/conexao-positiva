import "server-only";

const secret = process.env.TURNSTILE_SECRET_KEY;

/** Turnstile ativo quando as duas chaves existem (a pública mostra o widget, a secreta valida). */
export const isTurnstileEnabled = Boolean(secret && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

/**
 * Valida no servidor o token do Cloudflare Turnstile (anti-robô, sem puzzles na maioria dos
 * casos). Sem configuração, a verificação é ignorada e ficam o campo-isco, o tempo mínimo
 * e o limite de pedidos.
 */
export async function verifyTurnstile(token: string | undefined, ip: string) {
  if (!isTurnstileEnabled || !secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "desconhecido") body.set("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5_000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("[turnstile] falha na verificação", error);
    return false;
  }
}
