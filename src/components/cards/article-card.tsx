import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ArticleSummary } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/format";
import { MediaFrame } from "./media-frame";

export function ArticleCard({
  article,
  showImage = true,
}: {
  article: ArticleSummary;
  showImage?: boolean;
}) {
  const t = useTranslations("Home.insights");
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface-raised transition-shadow duration-(--duration-base) hover:shadow-md has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus">
      <MediaFrame
        image={article.image}
        icon={BookOpen}
        ratio="aspect-[16/10]"
        sizes="(min-width: 1024px) 380px, 100vw"
        className={cn(!showImage && "max-md:hidden")}
      />
      <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
        <p className="eyebrow">{article.category}</p>
        <h3 className="text-h4 font-bold">
          <Link
            href={`/insights/${article.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-small text-muted">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-caption text-muted tabular-nums">
          <time dateTime={article.publishedAt}>{formatLongDate(article.publishedAt)}</time>
          {" · "}
          {t("readingTime", { minutes: article.readingMinutes })}
        </p>
      </div>
    </article>
  );
}
