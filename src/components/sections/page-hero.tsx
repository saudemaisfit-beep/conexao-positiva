import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/common/breadcrumbs";
import { NetworkGraphic } from "@/components/common/network-graphic";
import { cn } from "@/lib/cn";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  breadcrumbs: BreadcrumbItem[];
  /** Conteúdo visual à direita (fotografia, logótipo…). Por defeito, o motivo da rede. */
  aside?: ReactNode;
  actions?: ReactNode;
  /** Mostra o conteúdo lateral também no mobile (por baixo do texto). */
  asideOnMobile?: boolean;
}

/** Hero das páginas interiores: breadcrumbs, eyebrow, h1 e introdução. */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  aside,
  actions,
  asideOnMobile = false,
}: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden">
      <div className="container-site grid items-center gap-10 pt-6 pb-14 md:pt-8 md:pb-20 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-16 lg:pb-24">
        <div className="flex flex-col gap-5">
          <Breadcrumbs items={breadcrumbs} />
          <p className="mt-4 eyebrow animate-rise-in md:mt-8">{eyebrow}</p>
          <h1
            id="page-title"
            className="max-w-4xl animate-rise-in text-h1 font-extrabold"
            style={{ animationDelay: "80ms" }}
          >
            {title}
          </h1>
          {lead && (
            <p
              className="max-w-2xl animate-rise-in text-lead text-muted"
              style={{ animationDelay: "160ms" }}
            >
              {lead}
            </p>
          )}
          {actions && (
            <div
              className="mt-3 flex animate-rise-in flex-col gap-3 md:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              {actions}
            </div>
          )}
        </div>
        <div
          className={cn(
            "relative mx-auto w-full max-w-[22rem] lg:block",
            asideOnMobile ? "max-w-[15rem] lg:max-w-[22rem]" : "hidden",
          )}
        >
          {aside ?? (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-[10%] rounded-full bg-primary-soft blur-3xl"
              />
              <NetworkGraphic className="relative w-full" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
