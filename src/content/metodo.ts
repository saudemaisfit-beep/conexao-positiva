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
  /**
   * Secções vindas da landing page de Luciana Machado (outubro de 2026). Textos adaptados a uma
   * linguagem neutra; números e testemunhos são [Exemplo] até haver dados reais e autorização.
   */
  signs: {
    title: "Consegue dar conta de tudo, mas sente-se cansado(a) por dentro?",
    lead: "Estes são os sinais mais comuns de desconexão interior:",
    items: [
      {
        title: "Exaustão emocional",
        text: "Um cansaço profundo que não passa, mesmo depois de descansar. A energia simplesmente não volta.",
      },
      {
        title: "Falta de clareza",
        text: "As decisões mais simples parecem difíceis. Tudo parece confuso, pesado e sem direção.",
      },
      {
        title: "Sobrecarga constante",
        text: "Está sempre a fazer alguma coisa, mas nunca sente que avança. Tudo é urgente, tudo é prioritário.",
      },
      {
        title: "Modo automático",
        text: "Os dias repetem-se: acordar, fazer, dormir. Sem estar verdadeiramente presente em nada.",
      },
    ] satisfies TitledText[],
    closing:
      "Se se reconhece em dois ou mais destes sinais, o Método C.E.N.T.R.O. foi criado para si.",
  },
  creator: {
    name: "Luciana Machado",
    role: "Criadora do Método C.E.N.T.R.O.",
    quote:
      "Passei anos a observar o mesmo padrão repetir-se: pessoas incrivelmente capazes por fora, completamente esgotadas por dentro.",
    paragraphs: [
      "Ao longo do seu percurso de acompanhamento pessoal, Luciana Machado encontrou muitas vezes a mesma realidade: pessoas fortes, resilientes e aparentemente no controlo da sua vida, mas profundamente sobrecarregadas.",
      "Pessoas que davam conta de tudo, exceto de si mesmas. Foi desta constatação que nasceu o Método C.E.N.T.R.O.: um sistema prático para reorganizar a vida interior, recuperar o equilíbrio e voltar a sentir-se inteiro(a).",
    ],
    /** [Exemplo] até a Conexão Positiva confirmar os valores. */
    stats: [
      { value: "[Exemplo] 8+", label: "anos de experiência em acompanhamento pessoal" },
      { value: "[Exemplo] 500+", label: "pessoas acompanhadas" },
      { value: "[Exemplo] 4,9/5", label: "avaliação média" },
    ],
  },
  benefits: {
    title: "O que pode mudar na sua vida",
    items: [
      "Clareza mental para tomar decisões com confiança",
      "Menos ansiedade e sobrecarga emocional",
      "Uma vida reorganizada com mais equilíbrio",
      "Reconexão com o seu propósito e os seus valores",
      "Uma direção pessoal clara e sustentável",
    ],
  },
  /** [Exemplo]: testemunhos ilustrativos da landing, sem autorização confirmada. */
  testimonials: [
    {
      quote:
        "Estava completamente esgotada. O Método C.E.N.T.R.O. devolveu-me a clareza que pensava ter perdido. Hoje acordo com propósito e durmo em paz.",
      name: "[Exemplo] Nome da participante",
      role: "Empresária",
    },
    {
      quote:
        "Passei anos a cuidar de todos menos de mim. Aprendi que cuidar de mim não é egoísmo. Transformou a minha forma de viver.",
      name: "[Exemplo] Nome da participante",
      role: "Gestora",
    },
    {
      quote:
        "Finalmente saí do piloto automático. Aprendi a dizer não sem culpa e a dar prioridade ao que realmente importa.",
      name: "[Exemplo] Nome da participante",
      role: "Advogada",
    },
  ],
  closing: {
    title: "Pode continuar a cuidar de tudo e esquecer-se de si.",
    text: "Ou pode decidir, hoje, regressar ao seu centro.",
  },
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
