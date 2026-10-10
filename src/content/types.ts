/**
 * Modelos de conteúdo usados pelas páginas. Na fase de CMS são preenchidos a partir do Sanity;
 * até lá, `src/content/home.ts` devolve coleções vazias (ou exemplos em modo de pré-visualização).
 */

export interface ContentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ImpactStat {
  value: string;
  label: string;
}

export interface ClientLogo {
  name: string;
  logo?: ContentImage;
  url?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: ContentImage;
}

export type EventCategory = "workshop" | "formacao" | "palestra" | "experiencia";
export type EventStatus = "aberto" | "ultimas-vagas" | "esgotado" | "encerrado";

export interface EventSummary {
  slug: string;
  title: string;
  category: EventCategory;
  startsAt: string; // ISO 8601
  endsAt?: string;
  location: string;
  priceKz: number | null; // null = gratuito
  status: EventStatus;
  image?: ContentImage;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface EventDetail extends EventSummary {
  summary: string;
  description: string[];
  program: { time: string; activity: string }[];
  facilitator?: { name: string; role: string; bio?: string; photo?: ContentImage };
  /** Vagas restantes (vêm da base de dados de inscrições a partir da Fase 14). */
  spotsLeft?: number | null;
  gallery: ContentImage[];
  faq: FaqItem[];
}

/** Tipos de experiência (filtros de /experiencias). */
export type CaseCategory =
  "team-building" | "formacao" | "workshop" | "evento" | "lideranca" | "bem-estar";

export interface CaseStudySummary {
  slug: string;
  title: string;
  client: string | null; // null = cliente confidencial (sem autorização para publicar o nome)
  category: CaseCategory;
  /** Objetivo numa frase (card e introdução da página). */
  objective: string;
  /** Slugs de serviços (src/config/navigation.ts) usados nesta experiência. */
  services: string[];
  image?: ContentImage;
}

export interface CaseResult {
  /** Só números reais e verificáveis; sem valor, o resultado é qualitativo. */
  value?: string;
  text: string;
}

export interface CaseVideo {
  /** URL do YouTube ou do Vimeo. */
  url: string;
  title: string;
}

export interface CaseStudy extends CaseStudySummary {
  sector?: string;
  participants?: number;
  format?: string;
  /** Texto livre, ex.: "Março de 2025". */
  period?: string;
  location?: string;
  challenge: string[];
  solution: string[];
  results: CaseResult[];
  gallery: ContentImage[];
  video?: CaseVideo;
  testimonial?: Testimonial;
}

/** Categorias editoriais de /insights (ver src/content/insight-categories.ts). */
export type ArticleCategory =
  "lideranca" | "equipas" | "bem-estar" | "metodo-centro" | "desenvolvimento-pessoal";

export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string; // ISO 8601
  readingMinutes: number;
  image?: ContentImage;
}

/**
 * Blocos do corpo do artigo. Na Fase 13 correspondem ao Portable Text do Sanity
 * (blocos de texto, listas e tipos personalizados "quote", "image" e "callout").
 */
export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; image: ContentImage; caption?: string }
  | { type: "callout"; title?: string; text: string };

export interface ArticleAuthor {
  name: string;
  role: string;
  bio?: string;
  photo?: ContentImage;
}

export interface Article extends Omit<ArticleSummary, "readingMinutes"> {
  updatedAt?: string;
  author: ArticleAuthor;
  body: ArticleBlock[];
}

export interface Milestone {
  year: string;
  title: string;
  text: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photo?: ContentImage;
  linkedin?: string;
}

export interface AboutContent {
  history: Milestone[];
  founder: TeamMember | null;
  team: TeamMember[];
}

export interface HomeContent {
  stats: ImpactStat[];
  clients: ClientLogo[];
  testimonials: Testimonial[];
  events: EventSummary[];
  caseStudies: CaseStudySummary[];
  articles: ArticleSummary[];
}
