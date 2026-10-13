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
  featured = false,
}: {
  article: ArticleSummary;
  showImage?: boolean;
  /** Destaque: imagem e texto lado a lado a partir de 1024 px. */
  featured?: boolean;
}) {
  const t = useTranslations("Insights");
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface-raised transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-lg has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
        featured && "lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]",
      )}
    >
      <MediaFrame
        image={article.image}
        icon={BookOpen}
        ratio={featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]" : "aspect-[16/10]"}
        sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 380px, 100vw"}
        className={cn(!showImage && "max-md:hidden")}
      />
      <div
        className={cn(
          "flex flex-1 flex-col gap-2 p-5 md:p-6",
          featured && "gap-3 lg:justify-center lg:p-10",
        )}
      >
        <p className="eyebrow">{t(`categories.${article.category}.name`)}</p>
        <h3 className={cn("font-bold", featured ? "text-h3" : "text-h4")}>
          <Link
            href={`/insights/${article.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {article.title}
          </Link>
        </h3>
        <p className={cn("text-muted", featured ? "line-clamp-3" : "line-clamp-2 text-small")}>
          {article.excerpt}
        </p>
        <p
          className={cn("mt-auto pt-2 text-caption text-muted tabular-nums", featured && "lg:mt-0")}
        >
          <time dateTime={article.publishedAt}>{formatLongDate(article.publishedAt)}</time>
          {" · "}
          {t("readingTime", { minutes: article.readingMinutes })}
        </p>
      </div>
    </article>
  );
}
