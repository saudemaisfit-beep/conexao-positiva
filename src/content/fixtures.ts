import "server-only";
import type { HomeContent } from "./types";

/**
 * EXEMPLOS PARA REVISÃO DE DESIGN — nunca usados em produção.
 * Só são carregados com CONTENT_PREVIEW=1 (ver src/content/home.ts). Todos os textos estão
 * marcados com [Exemplo] e não representam clientes, pessoas, números ou eventos reais.
 */
export function exampleHomeContent(now: Date): HomeContent {
  const inDays = (days: number, hour: number) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() + days);
    date.setUTCHours(hour - 1, 0, 0, 0); // hora de Luanda (UTC+1)
    return date.toISOString();
  };

  return {
    stats: [
      { value: "[000]", label: "[Exemplo] Empresas atendidas" },
      { value: "[0 000]", label: "[Exemplo] Pessoas impactadas" },
      { value: "[000]", label: "[Exemplo] Formações realizadas" },
      { value: "[00]", label: "[Exemplo] Anos de experiência" },
    ],
    clients: Array.from({ length: 6 }, (_, index) => ({ name: `[Exemplo] Cliente ${index + 1}` })),
    testimonials: [
      {
        quote:
          "[Exemplo] Texto de um testemunho real, com autorização de publicação. Duas a quatro frases sobre a experiência vivida pela equipa.",
        name: "[Exemplo] Nome",
        role: "Cargo",
        company: "Empresa",
      },
      {
        quote: "[Exemplo] Testemunho curto sobre um workshop ou formação.",
        name: "[Exemplo] Nome",
        role: "Cargo",
        company: "Empresa",
      },
      {
        quote: "[Exemplo] Testemunho curto sobre uma palestra ou evento.",
        name: "[Exemplo] Nome",
        role: "Cargo",
        company: "Empresa",
      },
    ],
    events: [
      {
        slug: "exemplo-workshop",
        title: "[Exemplo] Workshop de gestão consciente do tempo",
        category: "workshop",
        startsAt: inDays(12, 9),
        endsAt: inDays(12, 13),
        location: "[Local]",
        priceKz: 25000,
        status: "aberto",
      },
      {
        slug: "exemplo-formacao",
        title: "[Exemplo] Formação em liderança",
        category: "formacao",
        startsAt: inDays(26, 9),
        location: "[Local]",
        priceKz: null,
        status: "ultimas-vagas",
      },
      {
        slug: "exemplo-palestra",
        title: "[Exemplo] Palestra sobre bem-estar no trabalho",
        category: "palestra",
        startsAt: inDays(40, 18),
        location: "[Local]",
        priceKz: 10000,
        status: "aberto",
      },
    ],
    caseStudies: [
      {
        slug: "exemplo-team-building",
        title: "[Exemplo] Team building para uma equipa comercial",
        client: null,
        category: "Team Building",
        objective: "Fortalecer comunicação e colaboração.",
      },
      {
        slug: "exemplo-lideranca",
        title: "[Exemplo] Programa de liderança",
        client: "[Cliente]",
        category: "Liderança",
        objective: "Preparar novos líderes de equipa.",
      },
      {
        slug: "exemplo-bem-estar",
        title: "[Exemplo] Programa de bem-estar",
        client: "[Cliente]",
        category: "Bem-estar",
        objective: "Reduzir o stress e melhorar o equilíbrio.",
      },
    ],
    articles: [
      {
        slug: "exemplo-artigo-1",
        title: "[Exemplo] Como criar conversas mais conscientes na equipa",
        excerpt: "[Exemplo] Introdução curta do artigo, com até duas linhas.",
        category: "Equipas",
        publishedAt: inDays(-3, 10),
        readingMinutes: 5,
      },
      {
        slug: "exemplo-artigo-2",
        title: "[Exemplo] Respiração como ferramenta de foco",
        excerpt: "[Exemplo] Introdução curta do artigo, com até duas linhas.",
        category: "Método C.E.N.T.R.O.",
        publishedAt: inDays(-10, 10),
        readingMinutes: 4,
      },
      {
        slug: "exemplo-artigo-3",
        title: "[Exemplo] O papel do líder no bem-estar da equipa",
        excerpt: "[Exemplo] Introdução curta do artigo, com até duas linhas.",
        category: "Liderança",
        publishedAt: inDays(-18, 10),
        readingMinutes: 6,
      },
    ],
  };
}
