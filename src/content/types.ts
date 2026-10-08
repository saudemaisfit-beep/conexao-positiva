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

export interface CaseStudySummary {
  slug: string;
  title: string;
  client: string | null; // null = cliente confidencial
  category: string;
  objective: string;
  image?: ContentImage;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO 8601
  readingMinutes: number;
  image?: ContentImage;
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
