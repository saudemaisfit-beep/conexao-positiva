import { Briefcase } from "lucide-react";
import type { CaseStudySummary } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { MediaFrame } from "./media-frame";

export function CaseStudyCard({
  study,
  confidentialLabel,
  featured = false,
}: {
  study: CaseStudySummary;
  confidentialLabel: string;
  featured?: boolean;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface-raised transition-shadow duration-(--duration-base) hover:shadow-md has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus">
      <MediaFrame
        image={study.image}
        icon={Briefcase}
        ratio={featured ? "aspect-[16/10]" : "aspect-[16/9]"}
        sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
      />
      <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
        <p className="eyebrow">
          {study.category} · {study.client ?? confidentialLabel}
        </p>
        <h3 className={featured ? "text-h3 font-bold" : "text-h4 font-bold"}>
          <Link
            href={`/experiencias/${study.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {study.title}
          </Link>
        </h3>
        <p className="text-small text-muted">{study.objective}</p>
      </div>
    </article>
  );
}
