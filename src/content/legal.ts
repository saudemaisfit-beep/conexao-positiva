/**
 * Páginas legais — TEXTO-BASE PARA VALIDAÇÃO JURÍDICA.
 * Descreve o que o site faz de facto (formulários, prestadores, cookies, prazos D6). Os campos
 * entre [ ] têm de ser preenchidos pela Conexão Positiva e o texto validado por um jurista
 * (Lei n.º 22/11 — Proteção de Dados Pessoais, decisão D5) antes de o site ser publicado.
 * Quando estiver validado, mudar `reviewed` para true (o aviso de revisão deixa de aparecer).
 */

export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  after?: string[];
}

export interface LegalDocument {
  slug: "politica-de-privacidade" | "politica-de-cookies" | "termos-e-condicoes";
  title: string;
  description: string;
  updatedAt: string; // ISO 8601
  reviewed: boolean;
  intro: string;
  sections: LegalSection[];
}

const company =
  "[Denominação social da Conexão Positiva], NIF [número], com sede em [morada completa]";
const privacyEmail = "[e-mail para assuntos de privacidade]";

export const legalDocuments: LegalDocument[] = [
  {
    slug: "politica-de-privacidade",
    title: "Política de Privacidade",
    description:
      "Como a Conexão Positiva recolhe, usa e protege os dados pessoais enviados através deste site.",
    updatedAt: "2026-10-11",
    reviewed: false,
    intro:
      "Esta política explica que dados pessoais recolhemos através deste site, para que os usamos, com quem os partilhamos, durante quanto tempo os guardamos e como pode exercer os seus direitos, nos termos da Lei n.º 22/11, de 17 de junho (Lei da Proteção de Dados Pessoais).",
    sections: [
      {
        id: "responsavel",
        title: "1. Quem é o responsável pelo tratamento",
        paragraphs: [
          `O responsável pelo tratamento dos dados pessoais é ${company}.`,
          `Para qualquer questão sobre privacidade pode escrever para ${privacyEmail}.`,
        ],
      },
      {
        id: "dados",
        title: "2. Que dados recolhemos",
        paragraphs: ["Só recolhemos os dados que nos envia através dos formulários do site:"],
        list: [
          "Contacto: nome, empresa (opcional), e-mail, telefone (opcional), assunto e mensagem.",
          "Pedido de proposta: nome, empresa, cargo, e-mail, telefone e as informações sobre o projeto (serviço, número de participantes, local, data prevista, objetivo, orçamento e notas).",
          "Inscrição em eventos: nome, sobrenome, e-mail, telefone, empresa e cargo (opcionais) e observações (opcional).",
          "Dados técnicos: o endereço IP é usado no momento do envio para proteger os formulários contra abusos e não fica guardado com o seu pedido.",
        ],
        after: [
          "Estatísticas de visitas (Google Analytics) só são recolhidas se der consentimento no aviso de cookies.",
        ],
      },
      {
        id: "finalidades",
        title: "3. Para que usamos os dados e com que fundamento",
        list: [
          "Responder a mensagens e preparar propostas: com base no seu consentimento e em diligências pré-contratuais pedidas por si.",
          "Gerir inscrições, lista de espera e comunicações sobre o evento (incluindo instruções de pagamento, quando aplicável): execução do pedido de inscrição.",
          "Proteger o site e os formulários contra spam e abusos: interesse legítimo na segurança do serviço.",
          "Medir a utilização do site: apenas com o seu consentimento, que pode retirar a qualquer momento.",
        ],
        after: [
          "Não usamos os seus dados para decisões automatizadas nem os vendemos a terceiros.",
        ],
      },
      {
        id: "partilha",
        title: "4. Com quem partilhamos os dados",
        paragraphs: [
          "Recorremos a prestadores de serviços que tratam dados por nossa conta e segundo as nossas instruções:",
        ],
        list: [
          "Hostinger: alojamento do site e envio de e-mails.",
          "Supabase: base de dados onde ficam guardados os pedidos e as inscrições (servidores na União Europeia).",
          "Cloudflare (Turnstile): verificação de que o envio de um formulário é feito por uma pessoa.",
          "Google (Google Analytics): estatísticas de visitas, apenas com o seu consentimento.",
        ],
        after: [
          "Os conteúdos do site são geridos no Sanity, que não recebe dados dos formulários.",
        ],
      },
      {
        id: "transferencias",
        title: "5. Transferências para fora de Angola",
        paragraphs: [
          "Alguns prestadores alojam dados fora de Angola, nomeadamente na União Europeia. Estas transferências são feitas nos termos da Lei n.º 22/11 e, quando aplicável, mediante notificação ou autorização da Agência de Proteção de Dados (APD). [Validar com o jurista o enquadramento aplicável.]",
        ],
      },
      {
        id: "conservacao",
        title: "6. Durante quanto tempo guardamos os dados",
        list: [
          "Mensagens de contacto e pedidos de proposta: 24 meses após o envio.",
          "Inscrições em eventos: 12 meses após a data do evento.",
          "Preferências de cookies: 6 meses.",
        ],
        after: [
          "Findos estes prazos, os dados são apagados automaticamente, salvo obrigação legal de conservação.",
        ],
      },
      {
        id: "direitos",
        title: "7. Os seus direitos",
        paragraphs: [
          `Pode pedir o acesso, a retificação ou a eliminação dos seus dados, opor-se ao tratamento e retirar o consentimento a qualquer momento, escrevendo para ${privacyEmail}. Respondemos no prazo legal.`,
          "Tem também o direito de apresentar reclamação junto da Agência de Proteção de Dados (APD).",
        ],
      },
      {
        id: "seguranca",
        title: "8. Segurança",
        paragraphs: [
          "As comunicações com o site são cifradas (HTTPS). Os dados ficam numa base de dados sem acesso público, acessível apenas pelo servidor do site e por pessoas autorizadas da equipa.",
        ],
      },
      {
        id: "alteracoes",
        title: "9. Alterações a esta política",
        paragraphs: [
          "Podemos atualizar esta política. A data da última atualização está indicada no topo da página.",
        ],
      },
    ],
  },
  {
    slug: "politica-de-cookies",
    title: "Política de Cookies",
    description:
      "Que cookies e tecnologias semelhantes usa o site da Conexão Positiva e como os pode gerir.",
    updatedAt: "2026-10-11",
    reviewed: false,
    intro:
      'Cookies são pequenos ficheiros guardados no seu navegador. Usamos apenas os necessários para o site funcionar e, se aceitar, cookies de estatística. Pode mudar a sua escolha a qualquer momento em "Gerir cookies", no rodapé.',
    sections: [
      {
        id: "necessarios",
        title: "1. Necessários (sempre ativos)",
        list: [
          "cp_consent: guarda a sua escolha sobre cookies. Duração: 6 meses.",
          "Cloudflare Turnstile: verificação de segurança nos formulários; pode guardar informação técnica temporária para distinguir pessoas de robôs.",
        ],
      },
      {
        id: "estatistica",
        title: "2. Estatística (só com consentimento)",
        list: [
          "Google Analytics (_ga, _ga_*): mede visitas e páginas mais vistas, de forma agregada. Duração: até 2 anos. Só é carregado se aceitar.",
        ],
      },
      {
        id: "outras",
        title: "3. Outras tecnologias",
        list: [
          "Rascunho dos formulários: o que escreve num formulário fica guardado no seu navegador (sessionStorage) até fechar o separador ou enviar, para não perder o texto. Não é enviado para nós antes de carregar em enviar.",
          "Vídeos do YouTube e do Vimeo: só são carregados quando carrega no botão de reprodução; a partir daí, esses serviços podem usar os seus próprios cookies.",
        ],
      },
      {
        id: "gerir",
        title: "4. Como gerir",
        paragraphs: [
          'Use "Gerir cookies" no rodapé para alterar a sua escolha. Também pode apagar ou bloquear cookies nas definições do seu navegador; alguns elementos do site podem deixar de funcionar.',
        ],
      },
    ],
  },
  {
    slug: "termos-e-condicoes",
    title: "Termos e Condições",
    description:
      "Condições de utilização do site da Conexão Positiva, pedidos de proposta e inscrições em eventos.",
    updatedAt: "2026-10-11",
    reviewed: false,
    intro: `Estes termos regulam a utilização do site da Conexão Positiva, propriedade de ${company}. Ao usar o site, aceita estas condições.`,
    sections: [
      {
        id: "utilizacao",
        title: "1. Utilização do site",
        paragraphs: [
          "Compromete-se a usar o site de forma lícita, a fornecer informação verdadeira nos formulários e a não tentar perturbar o seu funcionamento.",
        ],
      },
      {
        id: "conteudos",
        title: "2. Conteúdos e propriedade intelectual",
        paragraphs: [
          "Os textos, imagens, logótipos e o Método C.E.N.T.R.O. são propriedade da Conexão Positiva ou usados com autorização. Não podem ser reproduzidos para fins comerciais sem autorização escrita.",
        ],
      },
      {
        id: "propostas",
        title: "3. Pedidos de proposta",
        paragraphs: [
          "Um pedido de proposta não constitui contrato nem compromisso de qualquer das partes. As condições de cada serviço são definidas na proposta enviada e aceite por escrito.",
        ],
      },
      {
        id: "eventos",
        title: "4. Inscrições em eventos",
        list: [
          "A inscrição reserva um lugar, sujeito às vagas disponíveis. Quando o evento está esgotado, a inscrição fica em lista de espera e avisamos se abrir uma vaga.",
          "Nos eventos pagos, as instruções de pagamento são enviadas por e-mail; a vaga fica confirmada após o pagamento, nos termos indicados nesse e-mail. [Definir prazos de pagamento e política de cancelamento e reembolso.]",
          "A Conexão Positiva pode alterar ou cancelar um evento por motivos alheios à sua vontade, informando os inscritos com a maior antecedência possível.",
        ],
      },
      {
        id: "responsabilidade",
        title: "5. Responsabilidade",
        paragraphs: [
          "Procuramos manter a informação do site correta e atualizada, mas ela não substitui o aconselhamento profissional adequado a cada caso. O site pode conter ligações para sites de terceiros, pelos quais não somos responsáveis.",
        ],
      },
      {
        id: "lei",
        title: "6. Lei aplicável",
        paragraphs: [
          "Estes termos regem-se pela lei da República de Angola. [Indicar o foro competente, a validar com o jurista.]",
        ],
      },
    ],
  },
];

export const getLegalDocument = (slug: LegalDocument["slug"]) =>
  legalDocuments.find((document) => document.slug === slug)!;
