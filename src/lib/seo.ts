import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageSeo {
  /** Título da página (o layout acrescenta "| Conexão Positiva"). */
  title: string;
  description: string;
  /** Caminho canónico, sem domínio nem parâmetros (ex.: "/eventos"). */
  path: string;
  /** Título absoluto (sem o sufixo da marca), ex.: Home. */
  absoluteTitle?: boolean;
  article?: { publishedTime: string; modifiedTime?: string; authors: string[]; section?: string };
}

/** Endereço da imagem de partilha gerada para um caminho do site (ver src/app/og/route.tsx). */
export const ogImageUrl = (path: string) => `/og?path=${encodeURIComponent(path)}`;

/**
 * Metadados completos de uma página: título, descrição, endereço canónico, Open Graph
 * (WhatsApp, LinkedIn, Facebook) e Twitter/X, com a imagem de partilha da própria página.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  article,
}: PageSeo): Metadata {
  const image = { url: ogImageUrl(path), width: 1200, height: 630, alt: title };
  const shareTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "pt_AO",
      images: [image],
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: article.authors,
            section: article.section,
          }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image] },
  };
}

/** Páginas que não devem aparecer nos motores de busca (confirmações, inscrições). */
export const noIndex: Metadata["robots"] = { index: false, follow: true };
