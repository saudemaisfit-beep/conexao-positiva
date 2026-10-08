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
        <ul className="grid gap-5 md:grid-cols-3">
          {latest.map((article, index) => (
            <li key={article.slug} className="reveal">
              {/* No mobile, só o primeiro artigo mostra imagem (menos scroll). */}
              <ArticleCard article={article} showImage={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
