import { CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import type { EventDetail } from "@/content/types";
import { formatKz, formatLongDate, formatTime } from "@/lib/format";

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="contents">
        <span className="mt-0.5 text-primary">{icon}</span>
        <span className="sr-only">{label}</span>
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Resumo fixo do evento nas páginas de inscrição e de confirmação. */
export async function EventSummary({ event, title }: { event: EventDetail; title: string }) {
  const t = await getTranslations("Events.detail");
  const time = `${formatTime(event.startsAt)}${event.endsAt ? `–${formatTime(event.endsAt)}` : ""}`;
  return (
    <div className="flex flex-col gap-5">
      {event.image && (
        <Image
          src={event.image.src}
          alt={event.image.alt}
          width={event.image.width}
          height={event.image.height}
          sizes="(min-width: 1024px) 24rem, 100vw"
          className="aspect-[16/9] rounded-lg object-cover"
        />
      )}
      <div className="flex flex-col gap-1">
        <p className="eyebrow">{title}</p>
        <p className="text-h4 font-bold">{event.title}</p>
      </div>
      <dl className="flex flex-col gap-3 text-small">
        <Row icon={<CalendarDays aria-hidden="true" className="size-4" />} label={t("date")}>
          <time dateTime={event.startsAt}>{formatLongDate(event.startsAt)}</time>
        </Row>
        <Row icon={<Clock aria-hidden="true" className="size-4" />} label={t("time")}>
          {time}
        </Row>
        <Row icon={<MapPin aria-hidden="true" className="size-4" />} label={t("location")}>
          {event.location}
        </Row>
        <Row icon={<Ticket aria-hidden="true" className="size-4" />} label={t("price")}>
          {event.priceKz === null ? t("free") : formatKz(event.priceKz)}
        </Row>
        {event.spotsLeft !== undefined && event.spotsLeft !== null && (
          <Row icon={<Users aria-hidden="true" className="size-4" />} label={t("spots")}>
            {t("spotsLeft", { count: event.spotsLeft })}
          </Row>
        )}
      </dl>
      {event.priceKz !== null && <p className="text-small text-muted">{t("paidNote")}</p>}
    </div>
  );
}
