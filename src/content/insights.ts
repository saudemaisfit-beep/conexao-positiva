import "server-only";
import type { Article, ArticleBlock, ArticleCategory, ArticleSummary } from "./types";

/**
 * Artigos (Insights). Até à ligação ao CMS não há artigos publicados: a lista está vazia e a
 * página mostra o estado vazio. Com CONTENT_PREVIEW=1 devolve exemplos [Exemplo].
 * Ordem: mais recente primeiro.
 */
export async function getArticles(): Promise<Article[]> {
  let articles: Article[] = [];
  if (process.env.CONTENT_PREVIEW === "1") {
    const { exampleArticles } = await import("./fixtures");
    articles = exampleArticles(new Date());
  }
  return articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((article) => article.slug === slug) ?? null;
}

export async function getArticleSummaries(category?: ArticleCategory) {
  return (await getArticles())
    .filter((article) => !category || article.category === category)
    .map(toArticleSummary);
}

/** Relacionados: mesma categoria primeiro, depois os mais recentes. */
export async function getRelatedArticles(article: Article, limit = 3) {
  return (await getArticles())
    .filter((other) => other.slug !== article.slug)
    .map((other, order) => ({ other, order, same: other.category === article.category }))
    .sort((a, b) => Number(b.same) - Number(a.same) || a.order - b.order)
    .slice(0, limit)
    .map(({ other }) => toArticleSummary(other));
}

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case "list":
      return block.items.join(" ");
    case "image":
      return block.caption ?? "";
    case "callout":
      return `${block.title ?? ""} ${block.text}`;
    default:
      return block.text;
  }
}

/** Tempo de leitura a 200 palavras por minuto (mínimo 1). */
export function readingMinutes(article: Pick<Article, "title" | "excerpt" | "body">) {
  const text = [article.title, article.excerpt, ...article.body.map(blockText)].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function toArticleSummary(article: Article): ArticleSummary {
  const { slug, title, excerpt, category, publishedAt, image } = article;
  return {
    slug,
    title,
    excerpt,
    category,
    publishedAt,
    image,
    readingMinutes: readingMinutes(article),
  };
}
