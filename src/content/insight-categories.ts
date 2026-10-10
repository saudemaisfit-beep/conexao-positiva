import type { ArticleCategory } from "./types";

/**
 * Categorias editoriais. Nome e descrição estão em messages/pt.json (Insights.categories).
 * `cta` liga cada categoria à solução mais próxima (chamada no fim de cada artigo).
 */
export const articleCategories: { slug: ArticleCategory; cta: string }[] = [
  { slug: "lideranca", cta: "/solucoes/desenvolvimento-de-lideranca" },
  { slug: "equipas", cta: "/solucoes/desenvolvimento-de-equipas" },
  { slug: "bem-estar", cta: "/solucoes/bem-estar-corporativo" },
  { slug: "metodo-centro", cta: "/metodo-centro" },
  { slug: "desenvolvimento-pessoal", cta: "/solucoes/formacoes" },
];

export function isArticleCategory(value: string): value is ArticleCategory {
  return articleCategories.some((category) => category.slug === value);
}
