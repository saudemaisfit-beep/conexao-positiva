import {
  CalendarHeart,
  Compass,
  GraduationCap,
  Handshake,
  Leaf,
  Mic,
  PencilRuler,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavKey =
  "about" | "solutions" | "method" | "events" | "experiences" | "insights" | "contact";

export const mainNav: { key: NavKey; href: string }[] = [
  { key: "about", href: "/sobre" },
  { key: "solutions", href: "/solucoes" },
  { key: "method", href: "/metodo-centro" },
  { key: "events", href: "/eventos" },
  { key: "experiences", href: "/experiencias" },
  { key: "insights", href: "/insights" },
  { key: "contact", href: "/contactos" },
];

export const legalNav = [
  { key: "privacy", href: "/politica-de-privacidade" },
  { key: "cookies", href: "/politica-de-cookies" },
  { key: "terms", href: "/termos-e-condicoes" },
] as const;

export const proposalHref = "/solicitar-proposta";

/**
 * Serviços: lista provisória para a navegação. Na fase de CMS passa a vir do Sanity (`service`).
 */
export interface ServiceNavItem {
  slug: string;
  name: string;
  summary: string;
  icon: LucideIcon;
}

export const services: ServiceNavItem[] = [
  {
    slug: "palestras",
    name: "Palestras",
    summary: "Momentos de inspiração que abrem conversas importantes.",
    icon: Mic,
  },
  {
    slug: "formacoes",
    name: "Formações",
    summary: "Competências desenvolvidas com aplicação prática.",
    icon: GraduationCap,
  },
  {
    slug: "workshops",
    name: "Workshops",
    summary: "Sessões participativas para experimentar e agir.",
    icon: PencilRuler,
  },
  {
    slug: "team-building",
    name: "Team Building",
    summary: "Confiança, comunicação e colaboração em equipa.",
    icon: Users,
  },
  {
    slug: "desenvolvimento-de-lideranca",
    name: "Desenvolvimento de Liderança",
    summary: "Líderes com clareza, presença e propósito.",
    icon: Compass,
  },
  {
    slug: "desenvolvimento-de-equipas",
    name: "Desenvolvimento de Equipas",
    summary: "Equipas mais alinhadas e eficazes.",
    icon: Handshake,
  },
  {
    slug: "bem-estar-corporativo",
    name: "Bem-estar Corporativo",
    summary: "Equilíbrio físico, mental e emocional no trabalho.",
    icon: Leaf,
  },
  {
    slug: "eventos-corporativos",
    name: "Eventos Corporativos",
    summary: "Encontros que ligam pessoas, cultura e propósito.",
    icon: CalendarHeart,
  },
];
