import "server-only";

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

/** Janela fixa em memória (por instância do servidor). */
function memoryLimit(key: string, limit: number, windowMs: number, now: number) {
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    if (windows.size > 10_000) {
      for (const [entry, value] of windows) if (value.resetAt <= now) windows.delete(entry);
    }
    return { allowed: true };
  }
  current.count += 1;
  return { allowed: current.count <= limit };
}

/**
 * Limite de pedidos por chave (ex.: "proposta:IP"): 5 envios em 10 minutos por defeito.
 * Com Upstash Redis configurado, o contador é partilhado por todas as instâncias da Vercel;
 * se o Upstash falhar, usa o contador em memória (nunca bloqueia pessoas por causa de uma falha).
 */
export async function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1_000) {
  const now = Date.now();
  if (upstashUrl && upstashToken) {
    try {
      const redisKey = `cp:rl:${key}`;
      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${upstashToken}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", redisKey],
          ["PEXPIRE", redisKey, String(windowMs), "NX"],
        ]),
        signal: AbortSignal.timeout(2_000),
      });
      if (!response.ok) throw new Error(`Upstash respondeu ${response.status}`);
      const [incr] = (await response.json()) as { result?: number }[];
      if (typeof incr?.result === "number") return { allowed: incr.result <= limit };
    } catch (error) {
      console.error("[rate-limit] Upstash indisponível; a usar o limite em memória", error);
    }
  }
  return memoryLimit(key, limit, windowMs, now);
}
