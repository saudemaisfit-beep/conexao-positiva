import { ArrowRight, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CaseStudySummary } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { MediaFrame } from "./media-frame";

export function CaseStudyCard({
  study,
  featured = false,
  ratio,
}: {
  study: CaseStudySummary;
  featured?: boolean;
  /** Proporção da imagem (por defeito 16:10 em destaque e 16:9 nos restantes). */
  ratio?: string;
}) {
  const t = useTranslations("Experiences");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface-raised transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-lg has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus">
      <MediaFrame
        image={study.image}
        icon={Briefcase}
        ratio={ratio ?? (featured ? "aspect-[16/10]" : "aspect-[16/9]")}
        sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
      />
      <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
        <p className="eyebrow">
          {t(`categories.${study.category}`)} · {study.client ?? t("confidential")}
        </p>
        <h3 className={cn("font-bold", featured ? "text-h3" : "text-h4")}>
          <Link
            href={`/experiencias/${study.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {study.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-small text-muted">{study.objective}</p>
        <span
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-small font-semibold text-primary"
        >
          {t("more")}
          <ArrowRight className="size-4 transition-transform duration-(--duration-fast) group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
