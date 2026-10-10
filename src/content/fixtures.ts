import "server-only";
import type {
  AboutContent,
  Article,
  ArticleCategory,
  CaseStudy,
  EventDetail,
  HomeContent,
} from "./types";

/**
 * EXEMPLOS PARA REVISÃO DE DESIGN — nunca usados em produção.
 * Só são carregados com CONTENT_PREVIEW=1 (ver src/content/home.ts). Todos os textos estão
 * marcados com [Exemplo] e não representam clientes, pessoas, números ou eventos reais.
 */
export function exampleHomeContent(now: Date): HomeContent {
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
    articles: [],
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

export function exampleArticles(now: Date): Article[] {
  const daysAgo = (days: number) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - days);
    date.setUTCHours(9, 0, 0, 0);
    return date.toISOString();
  };
  const author = {
    name: "[Exemplo] Nome do autor",
    role: "Cargo na Conexão Positiva",
    bio: "[Exemplo] Duas frases sobre o percurso e a área de trabalho do autor.",
  };
  const paragraph = (text: string) => ({ type: "paragraph" as const, text });
  const filler =
    "[Exemplo] Parágrafo de desenvolvimento com uma ideia por parágrafo, frases curtas e exemplos concretos do dia a dia das equipas em Angola. O texto real é escrito ou aprovado pela Conexão Positiva antes de ser publicado.";

  const short = (
    slug: string,
    title: string,
    category: ArticleCategory,
    days: number,
  ): Article => ({
    slug,
    title,
    excerpt: "[Exemplo] Introdução curta do artigo, com uma ou duas frases que resumem a ideia.",
    category,
    publishedAt: daysAgo(days),
    author,
    body: [paragraph(filler), paragraph(filler), paragraph(filler)],
  });

  return [
    {
      slug: "exemplo-conversas-conscientes",
      title: "[Exemplo] Como criar conversas mais conscientes na equipa",
      excerpt:
        "[Exemplo] Pequenas mudanças na forma como falamos e ouvimos podem mudar o clima de uma equipa. Três práticas para começar esta semana.",
      category: "equipas",
      publishedAt: daysAgo(3),
      author,
      body: [
        paragraph(
          "[Exemplo] Parágrafo de abertura que apresenta o problema: reuniões em que todos falam e poucos se sentem ouvidos, mensagens mal interpretadas, decisões que ninguém assume.",
        ),
        paragraph(filler),
        { type: "heading", level: 2, text: "[Exemplo] Porque é que as conversas falham" },
        paragraph(filler),
        {
          type: "list",
          ordered: false,
          items: [
            "[Exemplo] Falamos para responder, não para compreender.",
            "[Exemplo] Assumimos intenções em vez de perguntar.",
            "[Exemplo] Evitamos temas difíceis até se tornarem conflitos.",
          ],
        },
        {
          type: "quote",
          text: "[Exemplo] Uma frase marcante, de um autor real e citado corretamente.",
          cite: "[Autor da citação]",
        },
        { type: "heading", level: 2, text: "[Exemplo] Três práticas para começar" },
        { type: "heading", level: 3, text: "[Exemplo] 1. Abrir a reunião com uma pergunta" },
        paragraph(filler),
        { type: "heading", level: 3, text: "[Exemplo] 2. Confirmar o que ouviu" },
        paragraph(filler),
        { type: "heading", level: 3, text: "[Exemplo] 3. Fechar com compromissos claros" },
        {
          type: "list",
          ordered: true,
          items: [
            "[Exemplo] O que foi decidido.",
            "[Exemplo] Quem faz o quê.",
            "[Exemplo] Até quando.",
          ],
        },
        {
          type: "callout",
          title: "[Exemplo] Experimente esta semana",
          text: "[Exemplo] Um exercício prático e curto que o leitor pode aplicar de imediato com a sua equipa.",
        },
        paragraph(filler),
      ],
    },
    short(
      "exemplo-respiracao-foco",
      "[Exemplo] Respiração como ferramenta de foco",
      "metodo-centro",
      10,
    ),
    short(
      "exemplo-lider-bem-estar",
      "[Exemplo] O papel do líder no bem-estar da equipa",
      "lideranca",
      18,
    ),
    short(
      "exemplo-pausas-conscientes",
      "[Exemplo] Pausas conscientes num dia exigente",
      "bem-estar",
      25,
    ),
    short("exemplo-feedback", "[Exemplo] Dar feedback sem perder a ligação", "lideranca", 33),
    short(
      "exemplo-proposito",
      "[Exemplo] Encontrar propósito no trabalho de todos os dias",
      "desenvolvimento-pessoal",
      41,
    ),
    short(
      "exemplo-confianca",
      "[Exemplo] Confiança: o que a constrói e o que a destrói",
      "equipas",
      49,
    ),
    short("exemplo-tempo", "[Exemplo] Gerir o tempo a partir das prioridades", "metodo-centro", 57),
    short(
      "exemplo-novos-lideres",
      "[Exemplo] Os primeiros 90 dias de um novo líder",
      "lideranca",
      65,
    ),
    short("exemplo-sono-energia", "[Exemplo] Sono, energia e desempenho", "bem-estar", 73),
  ];
}
