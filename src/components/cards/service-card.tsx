import { ArrowUpRight } from "lucide-react";
import type { ServiceNavItem } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ServiceCardVariant = "default" | "featured" | "wide";

/**
 * Cartão de solução. Na grelha bento: "featured" (escuro, 2×2), "wide" (2×1, gradiente suave)
 * e "default". O cartão inteiro é clicável (link no título, alargado com ::after).
 */
export function ServiceCard({
  service,
  variant = "default",
  className,
}: {
  service: ServiceNavItem;
  /** Mantido por compatibilidade: o cartão inteiro já é o link. */
  moreLabel?: string;
  variant?: ServiceCardVariant;
  className?: string;
}) {
  const Icon = service.icon;
  const featured = variant === "featured";
  return (
    <article
      data-surface={featured ? "inverse" : undefined}
      className={cn(
        "group relative isolate flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-out hover:-translate-y-1 hover:shadow-lg has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus md:p-7",
        featured
          ? "bg-inverse text-on-inverse md:min-h-[24rem]"
          : "border border-border bg-surface-raised hover:border-transparent",
        variant === "wide" && "bg-linear-to-br from-primary-soft to-surface-raised to-70%",
        className,
      )}
    >
      {featured && (
        <span
          aria-hidden="true"
          className="absolute -right-1/4 -bottom-1/3 -z-10 aspect-square w-4/5 rounded-full bg-[radial-gradient(circle,var(--color-glow)_0%,transparent_65%)] opacity-60 transition-transform duration-(--duration-slow) ease-out group-hover:scale-110"
        />
      )}
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-lg transition-colors duration-(--duration-base)",
          featured
            ? "glass text-glow"
            : "bg-primary-soft text-primary group-hover:bg-primary group-hover:text-on-primary",
        )}
      >
        <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-6 right-6 grid size-9 place-items-center rounded-full border transition-colors duration-(--duration-base) md:top-7 md:right-7",
          featured
            ? "border-white/25 text-on-inverse group-hover:border-glow group-hover:bg-glow group-hover:text-on-glow"
            : "border-border text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary",
        )}
      >
        <ArrowUpRight className="size-4" />
      </span>
      <div className="mt-auto flex flex-col gap-2 pt-4">
        <h3 className={cn("font-bold", featured ? "text-h2" : "text-h4")}>
          <Link
            href={`/solucoes/${service.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-xl"
          >
            {service.name}
          </Link>
        </h3>
        <p className={cn("text-muted", featured ? "max-w-sm text-lead" : "text-small")}>
          {service.summary}
        </p>
      </div>
    </article>
  );
}
