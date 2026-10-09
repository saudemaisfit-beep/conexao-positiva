import "server-only";
import type { FaqItem, TitledText } from "./services";

/**
 * Textos da página do Método C.E.N.T.R.O.
 * - Nomes e descrições dos pilares: briefing (src/content/centro.ts).
 * - Restantes textos: PROPOSTA PARA APROVAÇÃO pela Conexão Positiva / autor(a) do método.
 *   Não incluem citações, dados biográficos nem resultados quantificados.
 */
export const metodoCopy = {
  what: {
    title: "O que é o Método C.E.N.T.R.O.",
    paragraphs: [
      "O Método C.E.N.T.R.O. é a metodologia própria da Conexão Positiva para o desenvolvimento de pessoas, líderes e equipas. Organiza o crescimento pessoal e profissional em seis pilares: Consciência, Equilíbrio, Nutrição, Tempo, Respiração e Orientação.",
      "Cada pilar trabalha uma dimensão diferente, mas todos partem do mesmo princípio: o desenvolvimento sustentável começa dentro de cada pessoa e reflete-se depois na forma como trabalha, decide e se relaciona.",
    ],
  },
  why: {
    title: "Porque foi criado",
    text: "Muitas iniciativas de desenvolvimento ficam pela motivação do momento. O Método C.E.N.T.R.O. foi pensado para ir mais fundo: dar às pessoas uma estrutura simples para compreenderem o que sentem e precisam, cuidarem do seu equilíbrio e transformarem essa consciência em decisões e ações no dia a dia.",
  },
  audience: [
    {
      title: "Pessoas",
      text: "Que querem mais consciência, equilíbrio e direção na vida pessoal e profissional.",
    },
    {
      title: "Líderes",
      text: "Que procuram liderar com presença, clareza e cuidado com as pessoas.",
    },
    {
      title: "Equipas",
      text: "Que querem trabalhar melhor em conjunto e gerir a pressão com equilíbrio.",
    },
    {
      title: "Organizações",
      text: "Que querem uma base comum para o desenvolvimento e o bem-estar das suas pessoas.",
    },
  ] satisfies TitledText[],
  /** Exemplos de práticas por pilar (proposta). */
  practices: {
    consciencia: [
      "Reconhecer emoções e reações em momentos exigentes",
      "Clarificar necessidades e objetivos pessoais",
      "Perceber o impacto do próprio comportamento nos outros",
    ],
    equilibrio: [
      "Identificar o que dá e o que retira energia",
      "Definir limites saudáveis entre trabalho e vida pessoal",
      "Criar rotinas de recuperação",
    ],
    nutricao: [
      "Rever hábitos que influenciam a energia e a disposição",
      "Fazer escolhas mais conscientes no dia a dia",
      "Cuidar do que alimenta também a mente e as relações",
    ],
    tempo: [
      "Distinguir o urgente do importante",
      "Organizar prioridades com intenção",
      "Proteger tempo para o que mais importa",
    ],
    respiracao: [
      "Usar a respiração para recuperar a calma e o foco",
      "Preparar conversas e momentos de pressão",
      "Criar pequenas pausas conscientes ao longo do dia",
    ],
    orientacao: [
      "Transformar a reflexão em objetivos concretos",
      "Tomar decisões alinhadas com o que é importante",
      "Definir próximos passos e acompanhar o progresso",
    ],
  } as Record<string, string[]>,
  steps: [
    {
      title: "Ponto de partida",
      text: "Um momento inicial de consciência sobre onde a pessoa ou a equipa está hoje.",
    },
    {
      title: "Trabalho por pilares",
      text: "Sessões dedicadas aos pilares mais relevantes para cada contexto.",
    },
    {
      title: "Prática no dia a dia",
      text: "Exercícios simples para aplicar entre sessões, no trabalho e na vida pessoal.",
    },
    {
      title: "Integração e direção",
      text: "Revisão do caminho feito e definição dos próximos passos.",
    },
  ] satisfies TitledText[],
  paths: {
    individual: {
      title: "Aplicação individual",
      text: "Para quem quer desenvolver-se com mais consciência e equilíbrio. O método é aplicado em workshops, formações e eventos abertos ao público.",
      cta: "Ver próximos eventos",
      href: "/eventos",
    },
    corporate: {
      title: "Aplicação corporativa",
      text: "Para organizações que querem levar o método às suas equipas e lideranças, através de programas, palestras, formações e experiências desenhadas à medida.",
      cta: "Solicitar proposta",
    },
  },
  results: [
    {
      title: "Mais autoconsciência",
      text: "Pessoas que compreendem melhor as suas emoções, necessidades e reações.",
    },
    {
      title: "Maior equilíbrio",
      text: "Ferramentas para gerir a energia, o stress e as prioridades.",
    },
    {
      title: "Hábitos mais conscientes",
      text: "Escolhas do dia a dia mais alinhadas com o bem-estar.",
    },
    {
      title: "Foco e presença",
      text: "Práticas simples para estar presente nos momentos que importam.",
    },
    { title: "Direção clara", text: "Objetivos e decisões ligados ao que é realmente importante." },
    {
      title: "Uma linguagem comum",
      text: "Equipas com uma base partilhada para falar de desenvolvimento e bem-estar.",
    },
  ] satisfies TitledText[],
  faq: [
    {
      question: "É preciso trabalhar todos os pilares?",
      answer:
        "Não necessariamente. Os seis pilares formam um todo, mas cada programa dá mais destaque aos que fazem mais sentido para a pessoa, a equipa ou a organização.",
    },
    {
      question: "O método pode ser aplicado em qualquer organização?",
      answer:
        "Sim. A linguagem, os exemplos e os formatos são adaptados ao contexto, à dimensão e aos objetivos de cada organização.",
    },
    {
      question: "Como posso experimentar o método a título individual?",
      answer:
        "Através dos workshops, formações e eventos abertos ao público. Consulte a agenda para ver as próximas datas.",
    },
    {
      question: "O método substitui acompanhamento médico ou psicológico?",
      answer:
        "Não. O Método C.E.N.T.R.O. é uma metodologia de desenvolvimento humano e não substitui acompanhamento médico ou psicológico quando ele é necessário.",
    },
  ] satisfies FaqItem[],
};
