import { ArrowRight } from "lucide-react";
import type { ServiceNavItem } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { arrowClassName } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function ServiceCard({
  service,
  moreLabel,
}: {
  service: ServiceNavItem;
  moreLabel: string;
}) {
  const Icon = service.icon;
  return (
    <article className="group relative flex h-full gap-4 rounded-lg border border-border bg-surface-raised p-5 transition-[box-shadow,border-color] duration-(--duration-base) ease-out hover:border-transparent hover:shadow-md has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus md:flex-col md:gap-6 md:p-7">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition-colors duration-(--duration-base) group-hover:bg-primary group-hover:text-on-primary md:size-14">
        <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
      </span>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-h4 font-bold">
          <Link
            href={`/solucoes/${service.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-lg"
          >
            {service.name}
          </Link>
        </h3>
        <p className="text-small text-muted">{service.summary}</p>
        <span
          aria-hidden="true"
          className="mt-auto hidden items-center gap-1.5 pt-3 text-small font-semibold text-primary md:inline-flex"
        >
          {moreLabel}
          <ArrowRight className={cn("size-4", arrowClassName)} />
        </span>
      </div>
    </article>
  );
}
