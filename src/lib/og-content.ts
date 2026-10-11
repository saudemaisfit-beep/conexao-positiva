import "server-only";
import { getTranslations } from "next-intl/server";
import { services } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getCaseStudy } from "@/content/cases";
import { getEvent } from "@/content/events";
import { isArticleCategory } from "@/content/insight-categories";
import { getArticle } from "@/content/insights";
import { getServiceDetail } from "@/content/services";
import { formatLongDate } from "@/lib/format";

export interface OgContent {
  eyebrow: string;
  title: string;
  /** "metodo" usa a identidade marsala do Método C.E.N.T.R.O. */
  brand: "conexao" | "metodo";
}

/** Páginas fixas: caminho → namespace das mensagens (metaTitle / hero). */
const STATIC_PAGES: Record<string, string> = {
  "/sobre": "About",
  "/solucoes": "Solutions",
  "/metodo-centro": "Metodo",
  "/eventos": "Events",
  "/experiencias": "Experiences",
  "/insights": "Insights",
  "/contactos": "Contact",
  "/solicitar-proposta": "Proposal",
};

const LEGAL_PAGES: Record<string, string> = {
  "/politica-de-privacidade": "Política de Privacidade",
  "/politica-de-cookies": "Política de Cookies",
  "/termos-e-condicoes": "Termos e Condições",
};

/**
 * Texto da imagem de partilha de um caminho do site. Só aceita caminhos conhecidos e lê o
 * título do conteúdo real (nunca texto vindo do pedido): não é possível gerar imagens com
 * frases arbitrárias no domínio da marca. Caminhos desconhecidos → imagem geral.
 */
export async function resolveOgContent(path: string): Promise<OgContent> {
  const fallback: OgContent = {
    eyebrow: siteConfig.name,
    title: siteConfig.tagline,
    brand: "conexao",
  };
  if (!/^\/[a-z0-9/-]{0,160}$/.test(path)) return fallback;
  const [section, slug, extra] = path.split("/").filter(Boolean);
  const t = await getTranslations({ locale: "pt" });

  if (!section) return fallback;
  if (LEGAL_PAGES[path])
    return { eyebrow: siteConfig.name, title: LEGAL_PAGES[path]!, brand: "conexao" };
  if (!slug && STATIC_PAGES[path]) {
    const namespace = STATIC_PAGES[path]!;
    return {
      eyebrow: siteConfig.name,
      title: t(`${namespace}.metaTitle`),
      brand: namespace === "Metodo" ? "metodo" : "conexao",
    };
  }
  if (!slug || (extra && section !== "insights")) return fallback;

  switch (section) {
    case "solucoes": {
      const service = services.find((item) => item.slug === slug);
      const detail = getServiceDetail(slug);
      return service
        ? {
            eyebrow: t("Solutions.metaTitle"),
            title: detail?.lead ?? service.name,
            brand: "conexao",
          }
        : fallback;
    }
    case "eventos": {
      const event = await getEvent(slug);
      return event
        ? {
            eyebrow: `${t("Events.metaTitle")} · ${formatLongDate(event.startsAt)}`,
            title: event.title,
            brand: "conexao",
          }
        : fallback;
    }
    case "experiencias": {
      const study = await getCaseStudy(slug);
      return study
        ? { eyebrow: t("Experiences.metaTitle"), title: study.title, brand: "conexao" }
        : fallback;
    }
    case "insights": {
      if (slug === "categoria" && extra && isArticleCategory(extra)) {
        return {
          eyebrow: t("Insights.metaTitle"),
          title: t(`Insights.categories.${extra}.name`),
          brand: "conexao",
        };
      }
      const article = extra ? null : await getArticle(slug);
      return article
        ? {
            eyebrow: `${t("Insights.metaTitle")} · ${t(`Insights.categories.${article.category}.name`)}`,
            title: article.title,
            brand: article.category === "metodo-centro" ? "metodo" : "conexao",
          }
        : fallback;
    }
    default:
      return fallback;
  }
}
