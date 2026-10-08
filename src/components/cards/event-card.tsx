import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import type { EventSummary } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatDay, formatKz, formatMonthShort, formatTime } from "@/lib/format";
import { MediaFrame } from "./media-frame";

const statusClass = {
  "ultimas-vagas": "bg-accent-soft text-accent-strong",
  esgotado: "bg-surface text-muted",
  encerrado: "bg-surface text-muted",
} as const;

export function EventCard({ event }: { event: EventSummary }) {
  const t = useTranslations("Home.events");
  const open = event.status === "aberto" || event.status === "ultimas-vagas";
  const href = `/eventos/${event.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface-raised transition-shadow duration-(--duration-base) hover:shadow-md">
      <MediaFrame
        image={event.image}
        icon={CalendarDays}
        ratio="aspect-[16/9]"
        sizes="(min-width: 1024px) 380px, 100vw"
      />
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">{t(`category.${event.category}`)}</span>
          {event.status !== "aberto" && (
            <span
              className={cn(
                "rounded-full px-3 py-1 text-caption font-semibold",
                statusClass[event.status],
              )}
            >
              {t(`status.${event.status}`)}
            </span>
          )}
        </div>
        <div className="flex items-start gap-4">
          <time
            dateTime={event.startsAt}
            className="flex w-14 shrink-0 flex-col items-center rounded-sm border border-border py-2"
          >
            <span className="font-display text-h3 leading-none font-extrabold tabular-nums">
              {formatDay(event.startsAt)}
            </span>
            <span className="mt-1 text-caption font-semibold tracking-[0.08em] text-muted uppercase">
              {formatMonthShort(event.startsAt)}
            </span>
          </time>
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="text-h4 font-bold">
              <Link href={href} className="hover:text-primary">
                {event.title}
              </Link>
            </h3>
            <ul className="flex flex-col gap-1 text-small text-muted">
              <li className="flex items-center gap-2">
                <Clock aria-hidden="true" className="size-4 shrink-0" />
                {formatTime(event.startsAt)}
                {event.endsAt && `–${formatTime(event.endsAt)}`}
              </li>
              <li className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                {event.location}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="font-semibold tabular-nums">
            {event.priceKz === null ? t("free") : formatKz(event.priceKz)}
          </span>
          <Link
            href={open ? `${href}/inscricao` : href}
            aria-label={`${open ? t("register") : t("view")}: ${event.title}`}
            className={buttonVariants({ variant: open ? "primary" : "secondary", size: "sm" })}
          >
            {open ? t("register") : t("view")}
          </Link>
        </div>
      </div>
    </article>
  );
}
