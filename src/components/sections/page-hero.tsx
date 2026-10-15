import type { ReactNode } from "react";
import type { ContentImage } from "@/content/types";
import { getEditorialImage } from "@/content/provisional-images";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/common/breadcrumbs";
import { EditorialPhoto } from "@/components/common/editorial-photo";
import { cn } from "@/lib/cn";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  breadcrumbs: BreadcrumbItem[];
  image?: ContentImage;
  aside?: ReactNode;
  actions?: ReactNode;
  asideOnMobile?: boolean;
}

/** Cabeçalho editorial com fotografia contextual e espaço para leitura. */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  image,
  aside,
  actions,
  asideOnMobile = false,
}: PageHeroProps) {
  const photo = image ?? (!aside ? getEditorialImage(breadcrumbs.at(-1)?.href ?? "") : undefined);
  const hasVisual = Boolean(photo || aside);
  return (
    <section aria-labelledby="page-title" className="border-b border-border bg-background">
      <div
        className={cn(
          "container-site grid grid-cols-1 items-center gap-10 pt-7 pb-12 md:pt-10 md:pb-20 lg:gap-16",
          hasVisual && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
        )}
      >
        <div className="flex flex-col gap-5">
          <Breadcrumbs items={breadcrumbs} />
          {eyebrow && <p className="mt-5 eyebrow md:mt-8">{eyebrow}</p>}
          <h1
            id="page-title"
            className="max-w-4xl text-h1 font-extrabold lg:text-[clamp(2.125rem,3.5vw,3rem)]"
          >
            {title}
          </h1>
          {lead && <p className="max-w-2xl text-lead text-muted">{lead}</p>}
          {actions && <div className="mt-3 flex flex-col gap-3 md:flex-row">{actions}</div>}
        </div>
        {photo ? (
          <EditorialPhoto image={photo} priority />
        ) : aside ? (
          <div className={cn("relative w-full", !asideOnMobile && "hidden lg:block")}>{aside}</div>
        ) : null}
      </div>
    </section>
  );
}
