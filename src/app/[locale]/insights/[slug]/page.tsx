import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { articleCategories } from "@/content/insight-categories";
import { getArticle, getArticles, getRelatedArticles, readingMinutes } from "@/content/insights";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/components/cards/article-card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ArticleBody } from "@/components/sections/insights/article-body";
import { ShareLinks } from "@/components/sections/insights/share-links";
import { SectionHeader } from "@/components/ui/section-header";
import { formatLongDate } from "@/lib/format";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getArticles()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getArticle(slug);
  if (!article) notFound();

  const t = await getTranslations("Insights");
  const category = t(`categories.${article.category}.name`);
  const ctaHref =
    articleCategories.find((item) => item.slug === article.category)?.cta ?? "/solucoes";
  const related = await getRelatedArticles(article);
  const url = new URL(`/insights/${article.slug}`, siteConfig.url).toString();
  const minutes = readingMinutes(article);

  return (
    <>
      <article aria-labelledby="page-title">
        <header className="container-site flex flex-col gap-5 pt-6 pb-10 md:pt-8 md:pb-14">
          <Breadcrumbs
            items={[
              { label: t("breadcrumb"), href: "/insights" },
              { label: category, href: `/insights/categoria/${article.category}` },
              { label: article.title, href: `/insights/${article.slug}` },
            ]}
          />
          <div className="mt-4 flex max-w-4xl flex-col gap-5 md:mt-8">
            <Link
              href={`/insights/categoria/${article.category}`}
              className="eyebrow self-start hover:text-primary"
            >
              {category}
            </Link>
            <h1 id="page-title" className="animate-rise-in text-h1 font-extrabold text-balance">
              {article.title}
            </h1>
            <p className="max-w-2xl text-lead text-muted">{article.excerpt}</p>
            <div className="mt-2 flex items-center gap-3">
              <PersonAvatar
                name={article.author.name}
                photo={article.author.photo}
                sizes="48px"
                className="size-12 shrink-0 rounded-full [&>span]:text-body"
              />
              <p className="flex flex-col text-small">
                <span className="font-semibold">
                  {t("article.by", { name: article.author.name })}
                </span>
                <span className="text-muted tabular-nums">
                  <time dateTime={article.publishedAt}>{formatLongDate(article.publishedAt)}</time>
                  {" · "}
                  {t("readingTime", { minutes })}
                </span>
              </p>
            </div>
          </div>
        </header>

        {article.image && (
          <div className="container-site">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl md:aspect-[21/9]">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                fill
                priority
                sizes="(min-width: 1280px) 75rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="container-site grid gap-12 pt-10 pb-(--space-section) md:pt-14 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
          <div className="flex flex-col gap-14">
            <ArticleBody blocks={article.body} />
            {article.updatedAt && (
              <p className="text-small text-muted">
                {t("article.updated", { date: formatLongDate(article.updatedAt) })}
              </p>
            )}
            <aside
              aria-labelledby="author-title"
              className="flex max-w-[68ch] flex-col gap-5 rounded-xl bg-surface p-6 md:flex-row md:p-8"
            >
              <PersonAvatar
                name={article.author.name}
                photo={article.author.photo}
                sizes="80px"
                className="size-20 shrink-0 rounded-full"
              />
              <div className="flex flex-col gap-1">
                <h2 id="author-title" className="eyebrow">
                  {t("article.aboutAuthor")}
                </h2>
                <p className="text-h4 font-bold">{article.author.name}</p>
                <p className="text-small font-semibold text-primary">{article.author.role}</p>
                {article.author.bio && <p className="mt-2 text-muted">{article.author.bio}</p>}
              </div>
            </aside>
          </div>
          <div className="lg:order-first lg:col-start-2 lg:row-start-1">
            <div className="lg:sticky lg:top-28">
              <ShareLinks url={url} title={article.title} />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <Section tone="alt" aria-labelledby="related-title">
          <div className="container-site">
            <SectionHeader id="related-title" title={t("article.related")} />
            <ul className="grid gap-5 md:grid-cols-3">
              {related.map((item, index) => (
                <li key={item.slug} className="reveal">
                  <ArticleCard article={item} showImage={index === 0} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <CtaBanner
        id="article-cta-title"
        title={t(`categories.${article.category}.ctaTitle`)}
        text={t("article.ctaText")}
        primary={{ label: t(`categories.${article.category}.ctaLabel`), href: ctaHref }}
        secondary={{ label: t("article.ctaSecondary"), href: proposalHref }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt ?? article.publishedAt,
          author: { "@type": "Person", name: article.author.name, jobTitle: article.author.role },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: { "@type": "ImageObject", url: new URL("/icon.png", siteConfig.url).toString() },
          },
          mainEntityOfPage: url,
          articleSection: category,
          timeRequired: `PT${minutes}M`,
          ...(article.image
            ? { image: new URL(article.image.src, siteConfig.url).toString() }
            : {}),
          inLanguage: "pt-AO",
        }}
      />
    </>
  );
}
