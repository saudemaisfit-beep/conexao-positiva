import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { articleCategories } from "@/content/insight-categories";
import { getArticleSummaries } from "@/content/insights";
import type { ArticleCategory } from "@/content/types";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { ArticleList } from "./article-list";
import { CategoryNav } from "./category-nav";

/** Corpo partilhado de /insights e /insights/categoria/[slug]. */
export async function InsightsIndex({
  category,
  label,
}: {
  category: ArticleCategory | null;
  label: string;
}) {
  const t = await getTranslations("Insights");
  const basePath = category ? `/insights/categoria/${category}` : "/insights";
  const all = await getArticleSummaries();
  const articles = category ? all.filter((article) => article.category === category) : all;
  const available = articleCategories
    .map((item) => item.slug)
    .filter((slug) => all.some((article) => article.category === slug));

  return (
    <Section aria-label={label} className="pt-0 md:pt-0">
      <div className="container-site flex flex-col gap-10">
        {all.length === 0 ? (
          <div className="flex flex-col items-start gap-5 rounded-xl bg-surface p-8 md:p-12">
            <span className="grid size-14 place-items-center rounded-full bg-surface-raised text-primary">
              <BookOpen aria-hidden="true" className="size-6" strokeWidth={1.75} />
            </span>
            <h2 className="max-w-2xl text-h3 font-bold">{t("empty.title")}</h2>
            <p className="max-w-xl text-muted">{t("empty.text")}</p>
            <ButtonLink href="/solucoes" variant="secondary">
              {t("empty.cta")}
            </ButtonLink>
          </div>
        ) : (
          <>
            {available.length > 1 && <CategoryNav categories={available} active={category} />}
            {articles.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border-strong p-8 font-semibold">
                {t("emptyCategory")}
              </p>
            ) : (
              <ArticleList articles={articles} basePath={basePath} />
            )}
          </>
        )}
      </div>
    </Section>
  );
}
