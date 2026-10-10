import "server-only";

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/**
 * Limite de pedidos por chave (ex.: "proposta:IP") numa janela fixa.
 * Versão em memória: protege cada instância do servidor. Na Fase 14 passa a usar o
 * Upstash Redis para um limite partilhado por todas as instâncias da Vercel.
 */
export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1_000, now = Date.now()) {
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
