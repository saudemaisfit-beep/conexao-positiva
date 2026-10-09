import "server-only";
import type { CaseStudy, CaseStudySummary } from "./types";

/**
 * Experiências (portefólio). Só são publicadas experiências reais, com autorização do cliente
 * para o nome, fotografias, números e testemunho. Até à ligação ao CMS a lista está vazia e a
 * página mostra o estado vazio. Com CONTENT_PREVIEW=1 devolve exemplos [Exemplo].
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (process.env.CONTENT_PREVIEW === "1") {
    const { exampleCaseStudies } = await import("./fixtures");
    return exampleCaseStudies();
  }
  return [];
}

export async function getCaseStudy(slug: string) {
  return (await getCaseStudies()).find((study) => study.slug === slug) ?? null;
}

/** Resumo serializável para cards e componentes de cliente. */
export function toCaseSummary(study: CaseStudy): CaseStudySummary {
  const { slug, title, client, category, objective, services, image } = study;
  return { slug, title, client, category, objective, services, image };
}

/** Experiências com este serviço. */
export async function getCaseStudiesForService(service: string, limit = 3) {
  return (await getCaseStudies())
    .filter((study) => study.services.includes(service))
    .slice(0, limit)
    .map(toCaseSummary);
}

/** Relacionadas: primeiro o mesmo tipo e serviços em comum; depois completa com as restantes. */
export async function getRelatedCaseStudies(study: CaseStudy, limit = 3) {
  const score = (other: CaseStudy) =>
    (other.category === study.category ? 2 : 0) +
    other.services.filter((service) => study.services.includes(service)).length;
  return (await getCaseStudies())
    .filter((other) => other.slug !== study.slug)
    .map((other, order) => ({ other, order, score: score(other) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map(({ other }) => toCaseSummary(other));
}
