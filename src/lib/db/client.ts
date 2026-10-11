import "server-only";

/**
 * Acesso ao Supabase (PostgREST) só no servidor, com a chave secreta (service_role).
 * Sem SDK: pedidos `fetch` simples, com tempo limite. A chave NUNCA tem o prefixo
 * NEXT_PUBLIC_ e nunca chega ao browser.
 */
const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SECRET_KEY;

export const isDatabaseConfigured = Boolean(url && key);

export class DatabaseError extends Error {
  constructor(
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(`Supabase respondeu ${status}${code ? ` (${code})` : ""}`);
  }
}

interface RestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  /** Cache do Next.js para leituras (ex.: contagem de vagas). Escritas nunca são guardadas. */
  next?: { revalidate: number; tags: string[] };
  prefer?: string;
}

export async function rest<T>(path: string, options: RestOptions = {}): Promise<T> {
  if (!url || !key) throw new Error("Supabase não configurado.");
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  // Chaves antigas (JWT) também seguem no cabeçalho Authorization.
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  if (options.prefer) headers.Prefer = options.prefer;

  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(8_000),
    ...(options.next ? { next: options.next } : {}),
  });
  if (!response.ok) {
    // O corpo do erro pode repetir dados enviados: só o código entra nos registos.
    const code = await response
      .json()
      .then((body: { code?: string }) => body.code)
      .catch(() => undefined);
    throw new DatabaseError(response.status, code);
  }
  if (response.status === 201 || response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
