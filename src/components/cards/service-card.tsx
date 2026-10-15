import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ServiceNavItem } from "@/config/navigation";
import { serviceImages } from "@/content/provisional-images";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ServiceCardVariant = "default" | "featured" | "wide";

/** Soluções apresentadas através de fotografia e texto, com um único link por cartão. */
export function ServiceCard({
  service,
  variant = "default",
  className,
}: {
  service: ServiceNavItem;
  moreLabel?: string;
  variant?: ServiceCardVariant;
  className?: string;
}) {
  const featured = variant === "featured";
  const image = Object.hasOwn(serviceImages, service.slug)
    ? serviceImages[service.slug]
    : undefined;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-surface-raised has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
        variant === "wide" && "md:grid md:grid-cols-2",
        className,
      )}
    >
      {image && (
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden bg-surface",
            featured && "flex-1 md:min-h-80",
            variant === "wide" && "md:aspect-auto md:min-h-48",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={
              featured || variant === "wide"
                ? "(min-width: 1024px) 50vw, 100vw"
                : "(min-width: 1024px) 25vw, 100vw"
            }
            className="object-cover transition-transform duration-(--duration-slow) group-hover:scale-[1.025]"
          />
          <span className="absolute right-3 bottom-3 rounded-sm bg-inverse px-2 py-1 text-caption text-on-inverse">
            Fotografia ilustrativa
          </span>
        </div>
      )}
      <div className="flex flex-col gap-3 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className={cn("font-bold", featured ? "text-h3" : "text-h4")}>
            <Link
              href={`/solucoes/${service.slug}`}
              className="outline-none after:absolute after:inset-0"
            >
              {service.name}
            </Link>
          </h3>
          <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
        </div>
        <p className="max-w-[50ch] text-small text-muted">{service.summary}</p>
      </div>
    </article>
  );
}
