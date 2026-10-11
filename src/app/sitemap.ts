import type { MetadataRoute } from "next";
import { services } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getCaseStudies } from "@/content/cases";
import { getEvents } from "@/content/events";
import { articleCategories } from "@/content/insight-categories";
import { getArticles } from "@/content/insights";

// Atualizado de hora a hora (e quando o CMS publica, através das etiquetas de cache).
export const revalidate = 3600;

/**
 * Mapa do site para os motores de busca: só páginas públicas e indexáveis (sem confirmações,
 * inscrições, Studio ou API). Conteúdo de exemplo nunca entra em produção.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const [events, studies, articles] = await Promise.all([
    getEvents(),
    getCaseStudies(),
    getArticles(),
  ]);
  const usedCategories = articleCategories.filter((category) =>
    articles.some((article) => article.category === category.slug),
  );

  const fixed: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/sobre"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/solucoes"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/metodo-centro"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/eventos"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/experiencias"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/insights"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/contactos"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/solicitar-proposta"), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/politica-de-privacidade"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/politica-de-cookies"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/termos-e-condicoes"), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...fixed,
    ...services.map((service) => ({
      url: url(`/solucoes/${service.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...events.map((event) => ({
      url: url(`/eventos/${event.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...studies.map((study) => ({
      url: url(`/experiencias/${study.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...usedCategories.map((category) => ({
      url: url(`/insights/categoria/${category.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...articles.map((article) => ({
      url: url(`/insights/${article.slug}`),
      lastModified: article.updatedAt ?? article.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
