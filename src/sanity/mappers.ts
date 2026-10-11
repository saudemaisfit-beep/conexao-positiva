import type {
  Article,
  ArticleBlock,
  ArticleCategory,
  CaseCategory,
  CaseStudy,
  ContentImage,
  EventCategory,
  EventDetail,
  EventStatus,
  TeamMember,
  Testimonial,
} from "@/content/types";

/** Formas devolvidas pelas consultas (campos opcionais: o CMS pode ter documentos incompletos). */
export interface RawImage {
  alt?: string | null;
  src?: string | null;
  width?: number | null;
  height?: number | null;
}
export interface RawPerson {
  name?: string | null;
  role?: string | null;
  bio?: string | null;
  linkedin?: string | null;
  photo?: RawImage | null;
}
export interface RawTestimonial {
  quote?: string | null;
  name?: string | null;
  role?: string | null;
  company?: string | null;
  services?: string[] | null;
  featured?: boolean | null;
  authorized?: boolean | null;
  photo?: RawImage | null;
}
export interface RawBodyBlock {
  _type: string;
  style?: string | null;
  listItem?: string | null;
  plain?: string | null;
  title?: string | null;
  text?: string | null;
  caption?: string | null;
  alt?: string | null;
  src?: string | null;
  width?: number | null;
  height?: number | null;
}

export const present = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/** Imagem só é usada com ficheiro e texto alternativo. */
export function toImage(raw: RawImage | null | undefined): ContentImage | undefined {
  if (!raw?.src) return undefined;
  return {
    src: raw.src,
    alt: raw.alt ?? "",
    width: raw.width ?? 1600,
    height: raw.height ?? 1000,
  };
}

export const toImages = (raw: (RawImage | null)[] | null | undefined) =>
  (raw ?? []).map(toImage).filter(present);

/** Texto com parágrafos separados por linha em branco → lista de parágrafos. */
export function toParagraphs(text: string | null | undefined) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export function toPerson(raw: RawPerson | null | undefined): TeamMember | null {
  if (!raw?.name || !raw.role) return null;
  return {
    name: raw.name,
    role: raw.role,
    bio: raw.bio ?? undefined,
    photo: toImage(raw.photo),
    linkedin: raw.linkedin ?? undefined,
  };
}

/** Testemunhos sem autorização nunca chegam às páginas. */
export function toTestimonial(raw: RawTestimonial | null | undefined): Testimonial | null {
  if (!raw?.authorized || !raw.quote || !raw.name) return null;
  return {
    quote: raw.quote,
    name: raw.name,
    role: raw.role ?? "",
    company: raw.company ?? "",
    photo: toImage(raw.photo),
  };
}

/** Portable Text → blocos do corpo do artigo (listas consecutivas agrupadas). */
export function toArticleBody(raw: RawBodyBlock[] | null | undefined): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  for (const block of raw ?? []) {
    if (block._type === "block") {
      const text = block.plain?.trim();
      if (!text) continue;
      if (block.listItem) {
        const ordered = block.listItem === "number";
        const last = blocks.at(-1);
        if (last?.type === "list" && last.ordered === ordered) last.items.push(text);
        else blocks.push({ type: "list", ordered, items: [text] });
      } else if (block.style === "h2" || block.style === "h3") {
        blocks.push({ type: "heading", level: block.style === "h2" ? 2 : 3, text });
      } else if (block.style === "blockquote") {
        blocks.push({ type: "quote", text });
      } else {
        blocks.push({ type: "paragraph", text });
      }
    } else if (block._type === "articleImage") {
      const image = toImage(block);
      if (image) blocks.push({ type: "image", image, caption: block.caption ?? undefined });
    } else if (block._type === "callout" && block.text) {
      blocks.push({ type: "callout", title: block.title ?? undefined, text: block.text });
    }
  }
  return blocks;
}

const oneOf = <T extends string>(values: readonly T[], value: string | null | undefined) =>
  values.find((item) => item === value);

const EVENT_CATEGORIES: EventCategory[] = ["workshop", "formacao", "palestra", "experiencia"];
const EVENT_STATUSES: EventStatus[] = ["aberto", "ultimas-vagas", "esgotado", "encerrado"];
const CASE_CATEGORIES: CaseCategory[] = [
  "team-building",
  "formacao",
  "workshop",
  "evento",
  "lideranca",
  "bem-estar",
];
const ARTICLE_CATEGORIES: ArticleCategory[] = [
  "lideranca",
  "equipas",
  "bem-estar",
  "metodo-centro",
  "desenvolvimento-pessoal",
];

export interface RawEvent {
  slug?: string | null;
  title?: string | null;
  category?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  location?: string | null;
  priceKz?: number | null;
  capacity?: number | null;
  status?: string | null;
  summary?: string | null;
  description?: string | null;
  program?: { time?: string | null; activity?: string | null }[] | null;
  facilitator?: RawPerson | null;
  faq?: { question?: string | null; answer?: string | null }[] | null;
  image?: RawImage | null;
  gallery?: (RawImage | null)[] | null;
}

/** Documentos incompletos (rascunhos antigos, campos em falta) são ignorados em vez de partir a página. */
export function toEvent(raw: RawEvent): EventDetail | null {
  const category = oneOf(EVENT_CATEGORIES, raw.category);
  const status = oneOf(EVENT_STATUSES, raw.status);
  if (!raw.slug || !raw.title || !raw.startsAt || !raw.location || !raw.summary) return null;
  if (!category || !status) return null;
  const facilitator = toPerson(raw.facilitator);
  return {
    slug: raw.slug,
    title: raw.title,
    category,
    startsAt: raw.startsAt,
    endsAt: raw.endsAt ?? undefined,
    location: raw.location,
    priceKz: raw.priceKz ?? null,
    status,
    image: toImage(raw.image),
    summary: raw.summary,
    description: toParagraphs(raw.description),
    program: (raw.program ?? []).flatMap((item) =>
      item.time && item.activity ? [{ time: item.time, activity: item.activity }] : [],
    ),
    facilitator: facilitator
      ? {
          name: facilitator.name,
          role: facilitator.role,
          bio: facilitator.bio,
          photo: facilitator.photo,
        }
      : undefined,
    capacity: raw.capacity ?? null,
    // Vagas restantes: calculadas com as inscrições da base de dados (src/content/events.ts).
    spotsLeft: null,
    gallery: toImages(raw.gallery),
    faq: (raw.faq ?? []).flatMap((item) =>
      item.question && item.answer ? [{ question: item.question, answer: item.answer }] : [],
    ),
  };
}

export interface RawCaseStudy {
  slug?: string | null;
  title?: string | null;
  client?: string | null;
  category?: string | null;
  objective?: string | null;
  services?: string[] | null;
  sector?: string | null;
  participants?: number | null;
  format?: string | null;
  period?: string | null;
  location?: string | null;
  challenge?: string | null;
  solution?: string | null;
  results?: { value?: string | null; text?: string | null }[] | null;
  video?: { url?: string | null; title?: string | null } | null;
  testimonial?: RawTestimonial | null;
  image?: RawImage | null;
  gallery?: (RawImage | null)[] | null;
}

export function toCaseStudy(raw: RawCaseStudy): CaseStudy | null {
  const category = oneOf(CASE_CATEGORIES, raw.category);
  if (!raw.slug || !raw.title || !raw.objective || !category) return null;
  return {
    slug: raw.slug,
    title: raw.title,
    client: raw.client?.trim() || null,
    category,
    objective: raw.objective,
    services: raw.services ?? [],
    image: toImage(raw.image),
    sector: raw.sector ?? undefined,
    participants: raw.participants ?? undefined,
    format: raw.format ?? undefined,
    period: raw.period ?? undefined,
    location: raw.location ?? undefined,
    challenge: toParagraphs(raw.challenge),
    solution: toParagraphs(raw.solution),
    results: (raw.results ?? []).flatMap((result) =>
      result.text ? [{ value: result.value ?? undefined, text: result.text }] : [],
    ),
    gallery: toImages(raw.gallery),
    video: raw.video?.url ? { url: raw.video.url, title: raw.video.title || raw.title } : undefined,
    testimonial: toTestimonial(raw.testimonial) ?? undefined,
  };
}

export interface RawArticle {
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  author?: RawPerson | null;
  image?: RawImage | null;
  body?: RawBodyBlock[] | null;
}

export function toArticle(raw: RawArticle): Article | null {
  const category = oneOf(ARTICLE_CATEGORIES, raw.category);
  const author = toPerson(raw.author);
  if (!raw.slug || !raw.title || !raw.excerpt || !raw.publishedAt || !category || !author) {
    return null;
  }
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    category,
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt ?? undefined,
    image: toImage(raw.image),
    author: { name: author.name, role: author.role, bio: author.bio, photo: author.photo },
    body: toArticleBody(raw.body),
  };
}
