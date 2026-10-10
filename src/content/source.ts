import "server-only";
import { isSanityConfigured } from "@/sanity/env";

/**
 * Origem do conteúdo:
 * - "sanity": projeto Sanity configurado (produção);
 * - "preview": CONTENT_PREVIEW=1 sem Sanity (exemplos [Exemplo] para rever o design);
 * - "none": sem CMS: as secções dinâmicas ficam vazias e não aparecem.
 */
export function contentSource(): "sanity" | "preview" | "none" {
  if (isSanityConfigured) return "sanity";
  if (process.env.CONTENT_PREVIEW === "1") return "preview";
  return "none";
}
