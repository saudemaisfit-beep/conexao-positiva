/**
 * Ofertas do Método C.E.N.T.R.O. vendidas no site (bilhetes do encontro, e-books e guia
 * gratuito). Os PREÇOS são sempre lidos daqui no servidor: o browser nunca indica o valor.
 *
 * `example: true` = nome, preço ou condições POR CONFIRMAR pela Conexão Positiva (vieram da
 * landing page de referência). Estas ofertas aparecem com a etiqueta [Exemplo] e, em produção,
 * não podem ser compradas até serem confirmadas (passar a `example: false`).
 */
export type OfferKind = "bilhete" | "ebook" | "guia";

export interface Offer {
  id: string;
  kind: OfferKind;
  name: string;
  summary: string;
  /** Preço em kwanzas (inteiro). 0 = gratuito (pedido sem pagamento). */
  priceKz: number;
  features: string[];
  example: boolean;
  /** Oferta em destaque na grelha (ex.: plano recomendado). */
  highlight?: boolean;
}

export const offers: Offer[] = [
  {
    id: "guia-regressar-ao-centro",
    kind: "guia",
    name: "Guia gratuito “Regressar ao Centro”",
    summary:
      "Os sinais de desconexão emocional e um primeiro passo prático para recuperar o equilíbrio interior.",
    priceKz: 0,
    features: [
      "Os sinais que indicam que está a viver no automático",
      "Um exercício de 10 minutos para clareza mental",
      "Como criar limites saudáveis sem culpa",
      "Como recuperar a energia emocional",
      "Plano de ação prático para os primeiros 30 dias",
    ],
    example: true,
  },
  {
    id: "encontro-plano-normal",
    kind: "bilhete",
    name: "Encontro Método C.E.N.T.R.O. · Plano Normal",
    summary: "Acesso integral ao encontro presencial.",
    priceKz: 40_000,
    features: [
      "Acesso integral a todas as sessões do encontro",
      "Material de apoio digital",
      "Certificado de participação",
      "Coffee break incluído",
    ],
    example: true,
  },
  {
    id: "encontro-plano-premium",
    kind: "bilhete",
    name: "Encontro Método C.E.N.T.R.O. · Plano Premium",
    summary: "A experiência completa, com acompanhamento individual.",
    priceKz: 75_000,
    features: [
      "Tudo o que inclui o Plano Normal",
      "Sessão individual de 30 minutos com Luciana Machado",
      "Workbook físico",
      "Acesso ao grupo de acompanhamento durante 3 meses",
    ],
    example: true,
    highlight: true,
  },
  {
    id: "ebook-metodo-centro-completo",
    kind: "ebook",
    name: "E-book “Método C.E.N.T.R.O. Completo”",
    summary: "O guia aprofundado com as práticas, ferramentas e exercícios dos seis pilares.",
    priceKz: 15_000,
    features: [],
    example: true,
  },
  {
    id: "ebook-praticas-diarias",
    kind: "ebook",
    name: "E-book “Práticas Diárias de Equilíbrio”",
    summary: "Exercícios práticos para integrar no dia a dia e manter o equilíbrio.",
    priceKz: 8_000,
    features: [],
    example: true,
  },
];

export const getOffer = (id: string) => offers.find((offer) => offer.id === id);

/**
 * Pode ser pedida/comprada agora? Em produção, só ofertas confirmadas (sem [Exemplo]);
 * em desenvolvimento e nos testes (FORMS_DRY_RUN=1) todas, para se poder ensaiar o fluxo.
 */
export function isOfferAvailable(offer: Offer) {
  if (!offer.example) return true;
  return process.env.NODE_ENV !== "production" || process.env.FORMS_DRY_RUN === "1";
}
