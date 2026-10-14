import type { ContentImage } from "./types";

/** Fotografia ilustrativa provisória; não representa clientes ou eventos reais. */
export const provisionalImages = {
  collaboration: {
    src: "/images/provisorias/colaboracao.webp",
    alt: "Imagem ilustrativa gerada por IA: profissionais a colaborar numa reunião.",
    width: 1536,
    height: 1024,
    provisional: true,
  },
  training: {
    src: "/images/provisorias/formacao.webp",
    alt: "Imagem ilustrativa gerada por IA: facilitadora e participantes numa formação.",
    width: 1536,
    height: 1024,
    provisional: true,
  },
  wellbeing: {
    src: "/images/provisorias/bem-estar.webp",
    alt: "Imagem ilustrativa gerada por IA: grupo numa pausa de bem-estar ao ar livre.",
    width: 1536,
    height: 1024,
    provisional: true,
  },
  talks: {
    src: "/images/provisorias/palestra.webp",
    alt: "Fotografia ilustrativa: oradora durante uma palestra, com a audiência em primeiro plano.",
    width: 1536,
    height: 1024,
    provisional: true,
  },
  outdoor: {
    src: "/images/provisorias/equipa.webp",
    alt: "Fotografia ilustrativa: participantes numa atividade de equipa ao ar livre.",
    width: 1536,
    height: 1024,
    provisional: true,
  },
  mentoring: {
    src: "/images/provisorias/mentoria.webp",
    alt: "Fotografia ilustrativa: dois profissionais numa conversa de mentoria.",
    width: 1536,
    height: 1024,
    provisional: true,
  },
} satisfies Record<string, ContentImage>;

export const serviceImages: Record<string, ContentImage> = {
  palestras: provisionalImages.talks,
  formacoes: provisionalImages.training,
  workshops: provisionalImages.training,
  "team-building": provisionalImages.outdoor,
  "desenvolvimento-de-lideranca": provisionalImages.mentoring,
  "desenvolvimento-de-equipas": provisionalImages.collaboration,
  "bem-estar-corporativo": provisionalImages.wellbeing,
  "eventos-corporativos": provisionalImages.talks,
};

const pageImages: Record<string, ContentImage> = {
  "/sobre": provisionalImages.outdoor,
  "/solucoes": provisionalImages.training,
  "/eventos": provisionalImages.talks,
  "/experiencias": provisionalImages.outdoor,
  "/insights": provisionalImages.mentoring,
  "/contactos": provisionalImages.mentoring,
  "/solicitar-proposta": provisionalImages.collaboration,
};

const categoryImages: Record<string, ContentImage> = {
  lideranca: provisionalImages.mentoring,
  equipas: provisionalImages.collaboration,
  "bem-estar": provisionalImages.wellbeing,
  "metodo-centro": provisionalImages.wellbeing,
  "desenvolvimento-pessoal": provisionalImages.training,
};

/** Páginas legais e confirmações mantêm uma apresentação sem fotografia. */
export function getEditorialImage(path: string): ContentImage | undefined {
  if (Object.hasOwn(pageImages, path)) return pageImages[path];
  if (path.startsWith("/solucoes/")) {
    const slug = path.slice("/solucoes/".length);
    return Object.hasOwn(serviceImages, slug) ? serviceImages[slug] : undefined;
  }
  if (path.startsWith("/insights/categoria/")) {
    const slug = path.slice("/insights/categoria/".length);
    return Object.hasOwn(categoryImages, slug) ? categoryImages[slug] : undefined;
  }
  if (path.startsWith("/metodo-centro/comprar/")) {
    return path.includes("/encontro-") ? provisionalImages.talks : provisionalImages.wellbeing;
  }
  return undefined;
}
