import { useTranslations } from "next-intl";
import type { Ref } from "react";
import type { ArticleSummary } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/components/cards/article-card";
import { buttonVariants } from "@/components/ui/button";

export const ARTICLES_PAGE_SIZE = 6;

/** Paginação acumulada: página 2 mostra os primeiros 12 artigos depois do destaque. */
export function paginate(articles: ArticleSummary[], requested: number) {
  const [featured, ...rest] = articles;
  const pages = Math.max(1, Math.ceil(rest.length / ARTICLES_PAGE_SIZE));
  const page = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), pages) : 1;
  return { featured, visible: rest.slice(0, page * ARTICLES_PAGE_SIZE), page, pages, rest };
}

/**
 * Artigo mais recente em destaque + grelha + "Carregar mais".
 * "Carregar mais" é uma ligação real (?pagina=2): funciona sem JavaScript e pode ser partilhada.
 */
export function ArticleGrid({
  articles,
  page: requested,
  basePath,
  listRef,
}: {
  articles: ArticleSummary[];
  page: number;
  basePath: string;
  listRef?: Ref<HTMLUListElement>;
}) {
  const t = useTranslations("Insights");
  const { featured, visible, page, pages, rest } = paginate(articles, requested);
  if (!featured) return null;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="sr-only">{t("featured")}</h2>
        <ArticleCard article={featured} featured />
      </div>

      {visible.length > 0 && (
        <ul ref={listRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <li key={article.slug}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      )}

      {rest.length > ARTICLES_PAGE_SIZE && (
        <div className="flex flex-col items-center gap-4">
          <p aria-live="polite" className="text-small text-muted">
            {t("showing", { shown: visible.length + 1, total: articles.length })}
          </p>
          {page < pages && (
            <Link
              href={{ pathname: basePath, query: { pagina: String(page + 1) } }}
              scroll={false}
              className={buttonVariants({ variant: "secondary" })}
            >
              {t("loadMore")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
