import "server-only";
import { present, toPerson, type RawPerson } from "@/sanity/mappers";
import { sanityFetch } from "@/sanity/fetch";
import { aboutQuery, tags } from "@/sanity/queries";
import { contentSource } from "./source";
import type { AboutContent } from "./types";

interface RawAbout {
  history?: { year?: string | null; title?: string | null; text?: string | null }[] | null;
  founder?: RawPerson | null;
  team?: (RawPerson | null)[] | null;
}

/**
 * Textos institucionais da página Sobre.
 * - `source: "briefing"`: escritos a partir dos factos fornecidos pela Conexão Positiva.
 * - `source: "proposta"`: redação proposta pela equipa de conteúdo, a aprovar antes do lançamento.
 * Passam para o singleton `aboutPage` do CMS na Fase 13.
 */
export const aboutCopy = {
  who: {
    source: "briefing",
    paragraphs: [
      "A Conexão Positiva é uma empresa de desenvolvimento humano, formação, eventos e experiências corporativas. Trabalhamos com pessoas, empresas, organizações e instituições que querem crescer de forma consciente e sustentada.",
      "Desenhamos palestras, formações, workshops, team building, programas de liderança e de bem-estar, sempre a partir da realidade de cada equipa. Na base de tudo está o Método C.E.N.T.R.O., a nossa metodologia própria para desenvolver pessoas de dentro para fora.",
    ],
  },
  purpose: {
    source: "briefing",
    statement: "Conectar pessoas. Fortalecer equipas. Potencializar resultados.",
  },
  mission: {
    source: "proposta",
    text: "Criar experiências de desenvolvimento humano que ajudem pessoas, líderes e equipas a ganhar consciência, equilíbrio e direção, com impacto real no trabalho e na vida.",
  },
  vision: {
    source: "proposta",
    text: "Ser a parceira de referência das organizações que acreditam que pessoas melhores constroem equipas melhores, e equipas melhores constroem organizações mais fortes.",
  },
  values: {
    source: "proposta",
    items: [
      { name: "Pessoas primeiro", text: "Cada experiência começa por ouvir quem a vai viver." },
      {
        name: "Consciência",
        text: "Mudança duradoura nasce de compreender comportamentos, emoções e escolhas.",
      },
      {
        name: "Conexão",
        text: "Relações de confiança tornam as equipas mais fortes do que a soma das partes.",
      },
      {
        name: "Integridade",
        text: "Dizemos o que fazemos e fazemos o que dizemos, com clareza e respeito.",
      },
      {
        name: "Compromisso com resultados",
        text: "Desenvolvimento humano que se traduz em mudanças visíveis no dia a dia.",
      },
    ],
  },
  approach: {
    source: "briefing",
    steps: [
      {
        name: "Conexão",
        text: "Criamos um espaço de confiança onde as pessoas se sentem à vontade para participar.",
      },
      {
        name: "Consciência",
        text: "Ajudamos a reconhecer comportamentos, emoções, necessidades e objetivos.",
      },
      {
        name: "Desenvolvimento",
        text: "Praticamos novas competências, hábitos e formas de trabalhar em conjunto.",
      },
      {
        name: "Transformação",
        text: "Integramos o que foi aprendido na rotina das pessoas e das equipas.",
      },
      {
        name: "Resultados",
        text: "Pessoas mais conscientes e equipas mais fortes, com impacto na organização.",
      },
    ],
  },
} as const;

/**
 * Conteúdo factual (história, fundador(a), equipa): só com dados reais.
 * Vazio até ser fornecido; com CONTENT_PREVIEW=1 devolve exemplos [Exemplo].
 */
export async function getAboutContent(): Promise<AboutContent> {
  const source = contentSource();
  if (source === "sanity") {
    const raw = await sanityFetch<RawAbout | null>(aboutQuery, [...tags.about]);
    return {
      history: (raw?.history ?? []).flatMap((item) =>
        item.year && item.title && item.text
          ? [{ year: item.year, title: item.title, text: item.text }]
          : [],
      ),
      founder: toPerson(raw?.founder),
      team: (raw?.team ?? []).map(toPerson).filter(present),
    };
  }
  if (source === "preview") {
    const { exampleAboutContent } = await import("./fixtures");
    return exampleAboutContent();
  }
  return { history: [], founder: null, team: [] };
}
