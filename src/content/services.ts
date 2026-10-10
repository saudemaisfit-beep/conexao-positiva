import "server-only";

/**
 * Conteúdo detalhado das páginas de serviço.
 * TODOS OS TEXTOS SÃO PROPOSTA PARA APROVAÇÃO (redigidos a partir do briefing):
 * não incluem números, durações, preços ou promessas de resultados. Passam para o
 * documento `service` do CMS na Fase 13.
 * Nome, resumo e ícone de cada serviço vivem em `src/config/navigation.ts` (usados no menu).
 */

export interface TitledText {
  title: string;
  text: string;
}

export type { FaqItem } from "./types";
import { getCaseStudiesForService } from "./cases";
import { getTestimonials } from "./proof";
import { contentSource } from "./source";
import type { FaqItem } from "./types";

export interface ServiceDetail {
  slug: string;
  lead: string;
  intro: string;
  problems: TitledText[];
  steps: TitledText[];
  benefits: TitledText[];
  audience: string[];
  formats: string[];
  faq: FaqItem[];
}

const sharedFaq: FaqItem[] = [
  {
    question: "O conteúdo pode ser adaptado à nossa organização?",
    answer:
      "Sim. Cada proposta começa por uma conversa sobre o contexto, os objetivos e as pessoas envolvidas. O conteúdo, o formato e a linguagem são ajustados a partir daí.",
  },
  {
    question: "Quanto custa?",
    answer:
      "O investimento depende do formato, da duração, do número de participantes e do local. Envie um pedido de proposta com esses dados e preparamos uma proposta à medida.",
  },
];

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "palestras",
    lead: "Momentos de inspiração e reflexão que abrem conversas importantes dentro das equipas.",
    intro:
      "Uma palestra bem preparada pode mudar a forma como uma equipa olha para o trabalho, para os colegas e para si própria. Desenhamos cada palestra a partir do momento da sua organização, com linguagem próxima, exemplos reais e espaço para a reflexão.",
    problems: [
      {
        title: "Equipas desmotivadas",
        text: "Quando a rotina pesa e falta energia para os desafios do dia a dia.",
      },
      {
        title: "Momentos de mudança",
        text: "Reestruturações, novos objetivos ou novas lideranças que precisam de ser bem comunicados.",
      },
      {
        title: "Eventos sem impacto",
        text: "Encontros internos que juntam pessoas, mas não deixam uma mensagem que fique.",
      },
    ],
    steps: [
      {
        title: "Conversa inicial",
        text: "Percebemos o público, o momento da organização e a mensagem que quer deixar.",
      },
      {
        title: "Desenho da palestra",
        text: "Construímos o conteúdo, os exemplos e os momentos de interação.",
      },
      { title: "Palestra", text: "Uma apresentação próxima, prática e adaptada à audiência." },
      { title: "Continuidade", text: "Sugerimos como manter a conversa viva depois do evento." },
    ],
    benefits: [
      {
        title: "Reflexão partilhada",
        text: "Uma linguagem comum para falar de temas importantes.",
      },
      {
        title: "Energia renovada",
        text: "Motivação para retomar os desafios com outra perspetiva.",
      },
      { title: "Mensagem clara", text: "Um tema central que a equipa reconhece e lembra." },
      { title: "Ligação ao dia a dia", text: "Exemplos e propostas aplicáveis ao trabalho real." },
    ],
    audience: [
      "Convenções, encontros anuais e eventos internos",
      "Equipas em momentos de mudança",
      "Organizações que querem abrir uma conversa sobre bem-estar, liderança ou colaboração",
    ],
    formats: [
      "Presencial ou online",
      "Palestra única ou ciclo de palestras",
      "Pequenos grupos ou grandes audiências",
    ],
    faq: [
      {
        question: "Que temas podem ser abordados?",
        answer:
          "Liderança, comunicação, colaboração, bem-estar, gestão do tempo e os pilares do Método C.E.N.T.R.O., entre outros. O tema é definido consigo.",
      },
      ...sharedFaq,
    ],
  },
  {
    slug: "formacoes",
    lead: "Programas estruturados para desenvolver competências com aplicação prática no trabalho.",
    intro:
      "As nossas formações combinam conteúdo, prática e reflexão. O objetivo é que cada participante saia com ferramentas que consegue usar no dia seguinte, e não apenas com teoria.",
    problems: [
      {
        title: "Competências em falta",
        text: "Lacunas em comunicação, liderança ou organização que afetam o desempenho.",
      },
      {
        title: "Formação sem aplicação",
        text: "Conteúdos que ficam na sala e não chegam à rotina das equipas.",
      },
      {
        title: "Crescimento interno",
        text: "Pessoas com potencial que precisam de preparação para novas responsabilidades.",
      },
    ],
    steps: [
      {
        title: "Diagnóstico",
        text: "Identificamos as competências a desenvolver e o perfil dos participantes.",
      },
      {
        title: "Programa à medida",
        text: "Definimos objetivos, conteúdos, exercícios e materiais.",
      },
      { title: "Formação", text: "Sessões práticas, com casos reais e participação ativa." },
      {
        title: "Aplicação",
        text: "Propomos atividades para integrar o que foi aprendido no trabalho.",
      },
    ],
    benefits: [
      {
        title: "Competências práticas",
        text: "Ferramentas que os participantes conseguem aplicar de imediato.",
      },
      {
        title: "Linguagem comum",
        text: "Uma forma partilhada de trabalhar e de falar sobre os desafios.",
      },
      { title: "Confiança", text: "Pessoas mais seguras nas suas responsabilidades." },
      {
        title: "Conteúdo à medida",
        text: "Exemplos e exercícios ligados à realidade da organização.",
      },
    ],
    audience: [
      "Equipas que precisam de desenvolver competências específicas",
      "Novos líderes e quadros em crescimento",
      "Departamentos de Recursos Humanos com planos de formação",
    ],
    formats: [
      "Presencial, online ou híbrido",
      "Sessão única ou programa em vários módulos",
      "Turmas fechadas para a sua organização ou formações abertas",
    ],
    faq: [
      {
        question: "As formações incluem materiais?",
        answer:
          "Sim. Cada formação inclui os materiais de apoio definidos no programa, ajustados ao tema e aos participantes.",
      },
      ...sharedFaq,
    ],
  },
  {
    slug: "workshops",
    lead: "Sessões práticas e participativas para experimentar, refletir e agir.",
    intro:
      "Um workshop é um espaço para fazer, não só para ouvir. Trabalhamos com exercícios, dinâmicas e conversas guiadas que ajudam as pessoas a experimentar novas formas de pensar e de trabalhar em conjunto.",
    problems: [
      {
        title: "Ideias que não avançam",
        text: "Equipas com vontade de mudar, mas sem um momento para parar e pensar em conjunto.",
      },
      {
        title: "Pouca participação",
        text: "Reuniões em que poucas pessoas falam e muitas ficam de fora.",
      },
      {
        title: "Temas difíceis",
        text: "Assuntos como stress, conflitos ou prioridades que pedem um espaço seguro.",
      },
    ],
    steps: [
      { title: "Objetivo", text: "Definimos consigo o que a equipa deve levar do workshop." },
      {
        title: "Desenho da experiência",
        text: "Escolhemos dinâmicas, exercícios e momentos de reflexão.",
      },
      { title: "Workshop", text: "Facilitação próxima, com participação de todos." },
      { title: "Compromissos", text: "Cada pessoa ou equipa sai com próximos passos concretos." },
    ],
    benefits: [
      { title: "Participação real", text: "Todas as pessoas têm voz e espaço." },
      { title: "Aprendizagem pela prática", text: "O que se experimenta fica mais tempo." },
      { title: "Clareza", text: "Ideias organizadas e prioridades definidas." },
      { title: "Próximos passos", text: "Compromissos concretos para aplicar depois da sessão." },
    ],
    audience: [
      "Equipas que querem trabalhar um tema específico",
      "Líderes que procuram envolver as suas equipas",
      "Pessoas que querem desenvolver-se em formato aberto",
    ],
    formats: [
      "Presencial ou online",
      "Workshop fechado para a organização ou aberto ao público",
      "Sessão curta ou dia completo",
    ],
    faq: [
      {
        question: "Qual a diferença entre um workshop e uma formação?",
        answer:
          "A formação desenvolve competências de forma estruturada, muitas vezes em vários módulos. O workshop é mais curto e participativo, centrado num tema ou desafio concreto.",
      },
      ...sharedFaq,
    ],
  },
  {
    slug: "team-building",
    lead: "Experiências que fortalecem a confiança, a comunicação e a colaboração.",
    intro:
      "Team building não é só diversão. Desenhamos experiências com objetivo: cada atividade é pensada para trabalhar a confiança, a comunicação e a forma como a equipa colabora, e termina com uma reflexão sobre o que foi vivido.",
    problems: [
      {
        title: "Equipas novas ou em mudança",
        text: "Pessoas que ainda não se conhecem bem ou que passaram a trabalhar juntas.",
      },
      {
        title: "Comunicação difícil",
        text: "Ruído, mal-entendidos ou pouca partilha entre pessoas e áreas.",
      },
      {
        title: "Pouca colaboração",
        text: "Cada um no seu canto, com dificuldade em trabalhar como equipa.",
      },
    ],
    steps: [
      {
        title: "Conversa inicial",
        text: "Percebemos a equipa, o momento e o objetivo da experiência.",
      },
      {
        title: "Desenho da experiência",
        text: "Escolhemos atividades, local e momentos de reflexão.",
      },
      { title: "Experiência", text: "Atividades facilitadas, com envolvimento de todos." },
      { title: "Reflexão final", text: "Ligamos o que aconteceu ao dia a dia da equipa." },
    ],
    benefits: [
      {
        title: "Confiança",
        text: "Pessoas que se conhecem melhor e confiam mais umas nas outras.",
      },
      { title: "Comunicação", text: "Novas formas de ouvir, falar e dar feedback." },
      { title: "Colaboração", text: "Mais vontade e mais facilidade em trabalhar em conjunto." },
      { title: "Memória partilhada", text: "Uma experiência que a equipa reconhece como sua." },
    ],
    audience: [
      "Equipas novas ou que mudaram de composição",
      "Áreas que precisam de colaborar melhor",
      "Organizações que querem celebrar e ao mesmo tempo desenvolver",
    ],
    formats: [
      "Atividades em sala ou ao ar livre",
      "Meio dia, dia completo ou programa à medida",
      "Equipas pequenas ou grandes grupos",
    ],
    faq: [
      {
        question: "As atividades exigem preparação física?",
        answer:
          "Não necessariamente. As atividades são escolhidas de acordo com o perfil do grupo, para que todas as pessoas possam participar.",
      },
      ...sharedFaq,
    ],
  },
  {
    slug: "desenvolvimento-de-lideranca",
    lead: "Apoio a líderes para conduzir pessoas com clareza, presença e propósito.",
    intro:
      "Liderar pessoas é uma das responsabilidades mais exigentes numa organização. Trabalhamos com líderes, novos e experientes, para desenvolverem autoconsciência, comunicação e a capacidade de criar equipas confiantes e comprometidas.",
    problems: [
      {
        title: "Novos líderes",
        text: "Pessoas promovidas pela competência técnica que agora lideram equipas.",
      },
      {
        title: "Desgaste da liderança",
        text: "Líderes sobrecarregados, com pouco tempo para as pessoas.",
      },
      {
        title: "Equipas desalinhadas",
        text: "Falta de clareza sobre prioridades, papéis e direção.",
      },
    ],
    steps: [
      {
        title: "Diagnóstico",
        text: "Percebemos os desafios de liderança e o contexto da organização.",
      },
      {
        title: "Programa",
        text: "Definimos sessões, temas e práticas, com base no Método C.E.N.T.R.O.",
      },
      { title: "Desenvolvimento", text: "Sessões de grupo e momentos de reflexão individual." },
      { title: "Acompanhamento", text: "Apoio à aplicação no dia a dia da liderança." },
    ],
    benefits: [
      {
        title: "Autoconsciência",
        text: "Líderes que conhecem melhor o seu estilo e o seu impacto.",
      },
      { title: "Comunicação clara", text: "Conversas, feedback e decisões mais claras." },
      { title: "Equilíbrio", text: "Uma liderança mais sustentável para o líder e para a equipa." },
      { title: "Direção", text: "Equipas que percebem para onde vão e porquê." },
    ],
    audience: [
      "Novos líderes e chefias intermédias",
      "Equipas de gestão e direção",
      "Organizações a preparar futuros líderes",
    ],
    formats: [
      "Programas em vários módulos",
      "Sessões de grupo e momentos individuais",
      "Presencial, online ou híbrido",
    ],
    faq: [
      {
        question: "O programa usa o Método C.E.N.T.R.O.?",
        answer:
          "Sim, os pilares do método (Consciência, Equilíbrio, Nutrição, Tempo, Respiração e Orientação) servem de base ao desenvolvimento dos líderes, adaptados ao contexto de cada organização.",
      },
      ...sharedFaq,
    ],
  },
  {
    slug: "desenvolvimento-de-equipas",
    lead: "Processos para equipas mais alinhadas, comunicativas e eficazes.",
    intro:
      "Uma equipa forte não acontece por acaso. Acompanhamos equipas para clarificar objetivos, papéis e formas de trabalhar, e para criar uma cultura de confiança e responsabilidade partilhada.",
    problems: [
      {
        title: "Falta de alinhamento",
        text: "Objetivos pouco claros ou entendidos de forma diferente.",
      },
      { title: "Conflitos", text: "Tensões que se acumulam e afetam o trabalho e o ambiente." },
      { title: "Baixa eficácia", text: "Muito esforço com resultados abaixo do esperado." },
    ],
    steps: [
      {
        title: "Diagnóstico da equipa",
        text: "Ouvimos a equipa e o líder para perceber a situação atual.",
      },
      {
        title: "Plano de desenvolvimento",
        text: "Definimos prioridades e o formato do acompanhamento.",
      },
      {
        title: "Sessões com a equipa",
        text: "Workshops e conversas facilitadas sobre os temas definidos.",
      },
      { title: "Revisão", text: "Avaliamos o caminho feito e os próximos passos." },
    ],
    benefits: [
      { title: "Alinhamento", text: "Objetivos e papéis claros para todos." },
      { title: "Confiança", text: "Um ambiente onde é seguro falar e discordar." },
      { title: "Responsabilidade partilhada", text: "Compromissos assumidos pela equipa." },
      { title: "Eficácia", text: "Melhores formas de trabalhar em conjunto." },
    ],
    audience: [
      "Equipas em crescimento ou reorganização",
      "Equipas com desafios de comunicação ou conflito",
      "Equipas de direção que querem trabalhar melhor em conjunto",
    ],
    formats: [
      "Processo com várias sessões",
      "Presencial ou híbrido",
      "Equipas completas, com o respetivo líder",
    ],
    faq: [
      {
        question: "Qual a diferença para o team building?",
        answer:
          "O team building é uma experiência pontual. O desenvolvimento de equipas é um processo ao longo do tempo, com diagnóstico, sessões e revisão.",
      },
      ...sharedFaq,
    ],
  },
  {
    slug: "bem-estar-corporativo",
    lead: "Programas que cuidam do equilíbrio físico, mental e emocional das pessoas.",
    intro:
      "O bem-estar das pessoas tem impacto direto na forma como trabalham e se relacionam. Criamos programas de bem-estar com base nos pilares do Método C.E.N.T.R.O., que ajudam as pessoas a cuidar de si com consciência e equilíbrio.",
    problems: [
      { title: "Stress e cansaço", text: "Ritmos intensos que deixam as pessoas esgotadas." },
      {
        title: "Desequilíbrio",
        text: "Dificuldade em conciliar trabalho, vida pessoal e saúde emocional.",
      },
      {
        title: "Hábitos pouco saudáveis",
        text: "Rotinas que afetam a energia, o foco e a disposição.",
      },
    ],
    steps: [
      { title: "Escuta", text: "Percebemos as necessidades das pessoas e da organização." },
      {
        title: "Programa",
        text: "Escolhemos temas e formatos: sessões, workshops, momentos práticos.",
      },
      {
        title: "Implementação",
        text: "Atividades regulares ou pontuais, adaptadas à rotina da empresa.",
      },
      { title: "Continuidade", text: "Propostas simples para manter os hábitos no dia a dia." },
    ],
    benefits: [
      {
        title: "Mais equilíbrio",
        text: "Pessoas com ferramentas para gerir a energia e o stress.",
      },
      {
        title: "Foco e presença",
        text: "Práticas como a respiração consciente para momentos exigentes.",
      },
      { title: "Hábitos saudáveis", text: "Escolhas mais conscientes no trabalho e fora dele." },
      { title: "Cultura de cuidado", text: "Uma organização que mostra que as pessoas importam." },
    ],
    audience: [
      "Organizações que querem investir no bem-estar das pessoas",
      "Equipas sob pressão ou em períodos exigentes",
      "Departamentos de Recursos Humanos com programas de qualidade de vida",
    ],
    formats: [
      "Programa contínuo ou ações pontuais",
      "Presencial ou online",
      "Sessões curtas ou workshops",
    ],
    faq: [
      {
        question: "Os programas substituem acompanhamento clínico?",
        answer:
          "Não. Os programas de bem-estar promovem hábitos e práticas de equilíbrio, mas não substituem acompanhamento médico ou psicológico quando ele é necessário.",
      },
      ...sharedFaq,
    ],
  },
  {
    slug: "eventos-corporativos",
    lead: "Encontros desenhados para ligar pessoas, cultura e propósito.",
    intro:
      "Um evento corporativo é uma oportunidade para reforçar a cultura e o sentido de pertença. Ajudamos a desenhar encontros com uma intenção clara, que combinam conteúdo, experiência e celebração.",
    problems: [
      {
        title: "Eventos repetitivos",
        text: "Encontros que seguem sempre o mesmo formato e perdem impacto.",
      },
      { title: "Mensagem dispersa", text: "Muitas atividades sem uma ideia central que as ligue." },
      { title: "Pouco envolvimento", text: "Participantes que assistem, mas não se envolvem." },
    ],
    steps: [
      { title: "Intenção", text: "Definimos consigo o objetivo e a mensagem do evento." },
      { title: "Conceito", text: "Desenhamos o programa, os momentos e as experiências." },
      { title: "Realização", text: "Facilitamos os momentos de desenvolvimento e interação." },
      { title: "Fecho", text: "Ajudamos a dar continuidade à mensagem depois do evento." },
    ],
    benefits: [
      { title: "Intenção clara", text: "Um evento com uma mensagem que fica." },
      { title: "Envolvimento", text: "Participantes ativos, não apenas espectadores." },
      { title: "Cultura", text: "Reforço dos valores e do sentido de pertença." },
      { title: "Celebração", text: "Momentos para reconhecer o caminho feito." },
    ],
    audience: [
      "Encontros anuais e convenções",
      "Lançamentos de novos ciclos, projetos ou estratégias",
      "Celebrações e momentos de reconhecimento",
    ],
    formats: [
      "Evento de meio dia, dia completo ou vários dias",
      "Presencial",
      "Conteúdo integrado no seu evento ou evento completo",
    ],
    faq: [
      {
        question: "Tratam também da logística do evento?",
        answer:
          "O nosso foco é o conteúdo e a experiência. Na proposta definimos consigo o que fica a nosso cargo e o que é assegurado pela sua equipa ou por outros parceiros.",
      },
      ...sharedFaq,
    ],
  },
];

export function getServiceDetail(slug: string) {
  return serviceDetails.find((service) => service.slug === slug) ?? null;
}

/**
 * Experiências e testemunhos ligados a um serviço. Vazios até haver conteúdo real (CMS);
 * com CONTENT_PREVIEW=1 devolve exemplos [Exemplo].
 */
export async function getServiceRelated(slug: string) {
  const caseStudies = await getCaseStudiesForService(slug);
  if (contentSource() === "sanity") {
    return { caseStudies, testimonials: (await getTestimonials({ service: slug })).slice(0, 3) };
  }
  if (contentSource() === "preview") {
    const { exampleHomeContent } = await import("./fixtures");
    return {
      caseStudies,
      testimonials: exampleHomeContent(new Date()).testimonials.slice(0, 2),
    };
  }
  return { caseStudies, testimonials: [] };
}
