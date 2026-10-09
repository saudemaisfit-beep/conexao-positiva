import "server-only";
import type { AboutContent, CaseStudy, EventDetail, HomeContent } from "./types";

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
    events: exampleEvents(now),
    caseStudies: [],
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

export function exampleAboutContent(): AboutContent {
  return {
    history: [
      {
        year: "[Ano]",
        title: "[Exemplo] Fundação",
        text: "[Exemplo] Uma frase sobre o início da Conexão Positiva.",
      },
      {
        year: "[Ano]",
        title: "[Exemplo] Primeiros programas",
        text: "[Exemplo] Uma frase sobre os primeiros projetos com empresas.",
      },
      {
        year: "[Ano]",
        title: "[Exemplo] Método C.E.N.T.R.O.",
        text: "[Exemplo] Uma frase sobre a criação do método.",
      },
      {
        year: "[Ano]",
        title: "[Exemplo] Hoje",
        text: "[Exemplo] Uma frase sobre o momento atual.",
      },
    ],
    founder: {
      name: "[Exemplo] Nome do(a) fundador(a)",
      role: "Fundador(a)",
      bio: "[Exemplo] Biografia real a fornecer: percurso, formação e o que motivou a criação da Conexão Positiva e do Método C.E.N.T.R.O.",
    },
    team: Array.from({ length: 4 }, (_, index) => ({
      name: `[Exemplo] Pessoa ${index + 1}`,
      role: "Cargo",
    })),
  };
}

const exampleFaq = [
  {
    question: "[Exemplo] É preciso experiência prévia?",
    answer: "[Exemplo] Resposta real a fornecer pela Conexão Positiva.",
  },
  {
    question: "[Exemplo] Recebo certificado de participação?",
    answer: "[Exemplo] Resposta real a fornecer pela Conexão Positiva.",
  },
];

export function exampleEvents(now: Date): EventDetail[] {
  const at = (days: number, hour: number) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() + days);
    date.setUTCHours(hour - 1, 0, 0, 0); // hora de Luanda (UTC+1)
    return date.toISOString();
  };
  const base = {
    summary: "[Exemplo] Uma frase que apresenta o evento e o que os participantes vão viver.",
    description: [
      "[Exemplo] Descrição real do evento: objetivo, temas e o que os participantes vão levar.",
      "[Exemplo] Segundo parágrafo com a abordagem e o formato da sessão.",
    ],
    program: [
      { time: "09:00", activity: "[Exemplo] Acolhimento" },
      { time: "09:30", activity: "[Exemplo] Primeiro momento" },
      { time: "11:00", activity: "[Exemplo] Pausa" },
      { time: "11:15", activity: "[Exemplo] Prática em grupo" },
      { time: "12:45", activity: "[Exemplo] Encerramento" },
    ],
    facilitator: {
      name: "[Exemplo] Nome do(a) facilitador(a)",
      role: "Facilitador(a)",
      bio: "[Exemplo] Biografia curta real a fornecer.",
    },
    gallery: [],
    faq: exampleFaq,
  };
  return [
    {
      ...base,
      slug: "exemplo-workshop",
      title: "[Exemplo] Workshop de gestão consciente do tempo",
      category: "workshop",
      startsAt: at(12, 9),
      endsAt: at(12, 13),
      location: "[Local]",
      priceKz: 25000,
      status: "aberto",
      spotsLeft: 14,
    },
    {
      ...base,
      slug: "exemplo-formacao",
      title: "[Exemplo] Formação em liderança",
      category: "formacao",
      startsAt: at(26, 9),
      endsAt: at(26, 17),
      location: "[Local]",
      priceKz: null,
      status: "ultimas-vagas",
      spotsLeft: 3,
    },
    {
      ...base,
      slug: "exemplo-palestra",
      title: "[Exemplo] Palestra sobre bem-estar no trabalho",
      category: "palestra",
      startsAt: at(40, 18),
      endsAt: at(40, 20),
      location: "[Local]",
      priceKz: 10000,
      status: "esgotado",
      spotsLeft: 0,
    },
    {
      ...base,
      slug: "exemplo-experiencia-passada",
      title: "[Exemplo] Experiência Método C.E.N.T.R.O.",
      category: "experiencia",
      startsAt: at(-20, 9),
      endsAt: at(-20, 13),
      location: "[Local]",
      priceKz: 15000,
      status: "encerrado",
    },
    {
      ...base,
      slug: "exemplo-workshop-passado",
      title: "[Exemplo] Workshop de respiração consciente",
      category: "workshop",
      startsAt: at(-45, 10),
      location: "[Local]",
      priceKz: null,
      status: "encerrado",
    },
  ];
}

export function exampleCaseStudies(): CaseStudy[] {
  const testimonial = {
    quote:
      "[Exemplo] Testemunho real de quem participou, com autorização de publicação. Duas a três frases sobre o que mudou na equipa.",
    name: "[Exemplo] Nome",
    role: "Cargo",
    company: "Empresa",
  };

  return [
    {
      slug: "exemplo-team-building-equipa-comercial",
      title: "[Exemplo] Um dia fora do escritório para reaproximar a equipa comercial",
      client: null,
      category: "team-building",
      objective: "[Exemplo] Fortalecer a comunicação e a colaboração entre equipas regionais.",
      services: ["team-building", "desenvolvimento-de-equipas"],
      sector: "[Exemplo] Setor",
      participants: 0,
      format: "Presencial",
      period: "[Mês e ano]",
      location: "[Local]",
      challenge: [
        "[Exemplo] Descrição do contexto e do desafio que a organização enfrentava, nas palavras do cliente. Dois a três parágrafos curtos.",
        "[Exemplo] O que já tinha sido tentado e porque era importante agir naquele momento.",
      ],
      solution: [
        "[Exemplo] Como a experiência foi desenhada: diagnóstico, atividades, facilitação e momentos de reflexão.",
        "[Exemplo] Como os participantes foram envolvidos e como o trabalho continuou depois do dia.",
      ],
      results: [
        { text: "[Exemplo] Resultado qualitativo descrito pelo cliente." },
        { text: "[Exemplo] Mudança observada na forma como a equipa trabalha." },
        { text: "[Exemplo] Compromissos assumidos pela equipa no final." },
      ],
      gallery: [],
      video: {
        url: "https://www.youtube.com/watch?v=EXEMPLO0000",
        title: "[Exemplo] Vídeo da experiência",
      },
      testimonial,
    },
    {
      slug: "exemplo-programa-de-lideranca",
      title: "[Exemplo] Programa de liderança para novos chefes de equipa",
      client: "[Cliente]",
      category: "lideranca",
      objective: "[Exemplo] Preparar novos líderes para conduzir equipas com confiança.",
      services: ["desenvolvimento-de-lideranca", "formacoes"],
      sector: "[Exemplo] Setor",
      participants: 0,
      format: "Híbrido",
      period: "[Período]",
      challenge: ["[Exemplo] Descrição do desafio da organização."],
      solution: ["[Exemplo] Descrição do programa desenhado."],
      results: [
        { value: "[00 %]", text: "[Exemplo] Indicador real, medido e autorizado pelo cliente." },
        { value: "[00]", text: "[Exemplo] Outro indicador real." },
        { text: "[Exemplo] Resultado qualitativo." },
      ],
      gallery: [],
      testimonial,
    },
    {
      slug: "exemplo-programa-de-bem-estar",
      title: "[Exemplo] Programa de bem-estar com o Método C.E.N.T.R.O.",
      client: "[Cliente]",
      category: "bem-estar",
      objective: "[Exemplo] Reduzir o stress e criar hábitos de equilíbrio no trabalho.",
      services: ["bem-estar-corporativo"],
      format: "Presencial",
      challenge: ["[Exemplo] Descrição do desafio da organização."],
      solution: ["[Exemplo] Descrição das sessões e práticas."],
      results: [{ text: "[Exemplo] Resultado qualitativo." }],
      gallery: [],
    },
    {
      slug: "exemplo-workshop-comunicacao",
      title: "[Exemplo] Workshop de comunicação consciente",
      client: null,
      category: "workshop",
      objective: "[Exemplo] Criar conversas mais claras e respeitosas na equipa.",
      services: ["workshops", "desenvolvimento-de-equipas"],
      challenge: ["[Exemplo] Descrição do desafio da organização."],
      solution: ["[Exemplo] Descrição do workshop."],
      results: [{ text: "[Exemplo] Resultado qualitativo." }],
      gallery: [],
    },
    {
      slug: "exemplo-encontro-anual",
      title: "[Exemplo] Encontro anual de colaboradores",
      client: "[Cliente]",
      category: "evento",
      objective: "[Exemplo] Alinhar a equipa em torno dos objetivos do novo ano.",
      services: ["eventos-corporativos", "palestras"],
      challenge: ["[Exemplo] Descrição do desafio da organização."],
      solution: ["[Exemplo] Descrição do evento."],
      results: [{ text: "[Exemplo] Resultado qualitativo." }],
      gallery: [],
    },
  ];
}
