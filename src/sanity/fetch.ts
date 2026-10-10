import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { isSanityConfigured, sanityApiVersion, sanityDataset, sanityProjectId } from "./env";

const client = isSanityConfigured
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      // CDN para leitura pública; a revalidação por etiquetas garante conteúdo atualizado.
      useCdn: true,
      perspective: "published",
    })
  : null;

/**
 * Consulta GROQ com cache do Next.js. As etiquetas (tipos de documento) são invalidadas
 * pelo webhook /api/revalidate quando a equipa publica no Studio; a revalidação de hora a
 * hora é a rede de segurança. Em caso de erro, a exceção mantém a última versão da página.
 */
export async function sanityFetch<T>(query: string, tags: string[], params: QueryParams = {}) {
  if (!client) return null;
  return client.fetch<T>(query, params, { next: { revalidate: 3600, tags } });
}
