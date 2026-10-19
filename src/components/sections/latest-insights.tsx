import { getTranslations } from "next-intl/server";
import type { ArticleSummary } from "@/content/types";
import { ArticleCard } from "@/components/cards/article-card";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { TextLink } from "@/components/ui/text-link";

export async function LatestInsights({ articles }: { articles: ArticleSummary[] }) {
  if (articles.length === 0) return null;
  const t = await getTranslations("Home.insights");
  const latest = [...articles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);
  return (
    <Section tone="alt" aria-labelledby="insights-title">
      <div className="container-site">
        <SectionHeader
          id="insights-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          action={<TextLink href="/insights">{t("all")}</TextLink>}
        />
        <div className="grid gap-7 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {latest[0] && <ArticleCard article={latest[0]} />}
          {latest.length > 1 && (
            <ul className="flex flex-col gap-7">
              {latest.slice(1).map((article) => (
                <li key={article.slug} className="min-w-0 reveal">
                  <ArticleCard article={article} compact />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
