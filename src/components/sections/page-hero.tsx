import Image from "next/image";
import type { ReactNode } from "react";
import { stockUrl, type StockPhoto } from "@/content/stock-photos";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/common/breadcrumbs";
import { Aurora } from "@/components/common/aurora";
import { NetworkCanvas } from "@/components/common/network-canvas-lazy";
import { NetworkGraphic } from "@/components/common/network-graphic";
import { cn } from "@/lib/cn";
import { PhotoCredit } from "@/components/common/photo-credit";

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
  /** Fotografia de fundo (ilustrativa), com véu escuro para manter o contraste do texto. */
  photo?: StockPhoto;
}

/**
 * Hero das páginas interiores, sobre fundo escuro com aurora e rede de pontos (azul-noite;
 * marsala profundo na sub-marca do Método): breadcrumbs, eyebrow, h1 e introdução.
 * Botões em `actions`: usar as variantes "glow" e "glass".
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  aside,
  actions,
  asideOnMobile = false,
  photo,
}: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      data-surface="inverse"
      className="relative isolate overflow-hidden bg-inverse text-on-inverse"
    >
      {photo ? (
        <>
          <Image
            src={stockUrl(photo, 1920)}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-r from-inverse via-[color-mix(in_srgb,var(--color-inverse)_85%,transparent)] to-[color-mix(in_srgb,var(--color-inverse)_45%,transparent)]"
          />
        </>
      ) : (
        <>
          <Aurora />
          <NetworkCanvas className="opacity-40" />
        </>
      )}
      <div className="container-site grid grid-cols-1 items-center gap-10 pt-6 pb-16 md:pt-8 md:pb-24 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-16 lg:pb-28">
        <div className="flex flex-col gap-5">
          <Breadcrumbs items={breadcrumbs} />
          <p className="mt-4 eyebrow animate-rise-in md:mt-8">{eyebrow}</p>
          <h1
            id="page-title"
            className="max-w-4xl animate-rise-in text-h1 font-normal"
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
        {(aside || !photo) && (
          <div
            className={cn(
              "relative mx-auto w-full max-w-[22rem] lg:block",
              asideOnMobile ? "max-w-[15rem] lg:max-w-[22rem]" : "hidden",
            )}
          >
            {aside ?? <NetworkGraphic className="relative w-full text-brand-on-inverse" />}
          </div>
        )}
      </div>
      {photo && <PhotoCredit photo={photo} className="absolute right-4 bottom-3" />}
    </section>
  );
}
