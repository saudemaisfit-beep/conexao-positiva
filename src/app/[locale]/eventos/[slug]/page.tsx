import { CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { getEvent, getEvents, isPastEvent, registrationState, toSummary } from "@/content/events";
import type { EventDetail } from "@/content/types";
import { EventCard } from "@/components/cards/event-card";
import { Gallery } from "@/components/common/gallery";
import { JsonLd } from "@/components/common/json-ld";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Section } from "@/components/layout/section";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { formatKz, formatLongDate, formatTime } from "@/lib/format";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getEvents()).map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return pageMetadata({
    title: event.title,
    description: event.summary,
    path: `/eventos/${event.slug}`,
  });
}

function RegistrationAction({
  event,
  now,
  className,
}: {
  event: EventDetail;
  now: Date;
  className?: string;
}) {
  return <RegistrationButton event={event} now={now} className={className} />;
}

async function RegistrationButton({
  event,
  now,
  className,
}: {
  event: EventDetail;
  now: Date;
  className?: string;
}) {
  const t = await getTranslations("Events.detail");
  const state = registrationState(event, now);
  if (state === "passado" || state === "encerrado") {
    return (
      <p
        className={`rounded-full bg-surface px-5 py-3 text-center text-small font-semibold text-muted ${className ?? ""}`}
      >
        {state === "passado" ? t("past") : t("closed")}
      </p>
    );
  }
  return (
    <ButtonLink
      href={`/eventos/${event.slug}/inscricao`}
      variant={state === "lista-de-espera" ? "secondary" : "primary"}
      size="lg"
      className={className}
    >
      {state === "lista-de-espera" ? t("waitlist") : t("register")}
    </ButtonLink>
  );
}

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-9 flex-col justify-center pl-12">
      <dt className="text-caption font-semibold tracking-[0.08em] text-muted uppercase">
        <span className="absolute top-0 left-0 grid size-9 place-items-center rounded-full bg-primary-soft text-primary">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  );
}

export default async function EventPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const now = new Date();
  const event = await getEvent(slug, now);
  if (!event) notFound();

  const t = await getTranslations("Events");
  const tc = await getTranslations("Home.events");
  const past = isPastEvent(event, now);
  const price = event.priceKz === null ? t("detail.free") : formatKz(event.priceKz);
  const time = `${formatTime(event.startsAt)}${event.endsAt ? `–${formatTime(event.endsAt)}` : ""}`;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
  const others = (await getEvents(now))
    .filter((item) => item.slug !== event.slug && !isPastEvent(item, now))
    .slice(0, 3)
    .map(toSummary);
  const url = new URL(`/eventos/${event.slug}`, siteConfig.url).toString();

  const facts = (
    <dl className="flex flex-col gap-4">
      <Fact icon={<CalendarDays aria-hidden="true" className="size-4" />} label={t("detail.date")}>
        <time dateTime={event.startsAt}>{formatLongDate(event.startsAt)}</time>
      </Fact>
      <Fact icon={<Clock aria-hidden="true" className="size-4" />} label={t("detail.time")}>
        {time}
      </Fact>
      <Fact icon={<MapPin aria-hidden="true" className="size-4" />} label={t("detail.location")}>
        {event.location}{" "}
        <a
          href={mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-small font-semibold text-primary underline underline-offset-2"
        >
          {t("detail.map")}
        </a>
      </Fact>
      {!past && event.spotsLeft !== undefined && event.spotsLeft !== null && (
        <Fact icon={<Users aria-hidden="true" className="size-4" />} label={t("detail.spots")}>
          {t("detail.spotsLeft", { count: event.spotsLeft })}
        </Fact>
      )}
      <Fact icon={<Ticket aria-hidden="true" className="size-4" />} label={t("detail.price")}>
        {price}
      </Fact>
    </dl>
  );

  return (
    <>
      <PageHero
        eyebrow={tc(`category.${event.category}`)}
        title={event.title}
        lead={event.summary}
        breadcrumbs={[
          { label: t("breadcrumb"), href: "/eventos" },
          { label: event.title, href: `/eventos/${event.slug}` },
        ]}
        actions={<RegistrationAction event={event} now={now} />}
        aside={
          event.image ? (
            <Image
              src={event.image.src}
              alt={event.image.alt}
              width={event.image.width}
              height={event.image.height}
              sizes="22rem"
              className="rounded-xl object-cover"
            />
          ) : undefined
        }
      />

      <Section aria-label={t("detail.about")} className="pt-0 md:pt-0">
        <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <aside
            aria-label={t("detail.facts")}
            className="flex flex-col gap-6 self-start rounded-xl border border-border bg-surface-raised p-6 lg:sticky lg:top-28 lg:order-2 lg:p-8"
          >
            <h2 className="text-h4 font-bold">{t("detail.facts")}</h2>
            {facts}
            <RegistrationAction event={event} now={now} className="hidden w-full lg:inline-flex" />
            {!past && event.priceKz !== null && (
              <p className="text-small text-muted">{t("detail.paidNote")}</p>
            )}
          </aside>

          <div className="flex flex-col gap-14">
            <div className="flex flex-col gap-4">
              <h2 className="text-h2 font-bold">{t("detail.about")}</h2>
              {event.description.map((paragraph) => (
                <p key={paragraph.slice(0, 30)} className="max-w-[68ch] text-body-lg text-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            {event.program.length > 0 && (
              <div className="flex flex-col gap-5">
                <h2 className="text-h2 font-bold">{t("detail.program")}</h2>
                <ol className="flex flex-col border-t border-border">
                  {event.program.map((item) => (
                    <li
                      key={`${item.time}-${item.activity}`}
                      className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 border-b border-border py-4"
                    >
                      <span className="font-semibold text-primary tabular-nums">{item.time}</span>
                      <span>{item.activity}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {event.facilitator && (
              <div className="flex flex-col gap-5">
                <h2 className="text-h2 font-bold">{t("detail.facilitator")}</h2>
                <div className="flex flex-col gap-5 rounded-xl bg-surface p-6 md:flex-row md:items-center">
                  <PersonAvatar
                    name={event.facilitator.name}
                    photo={event.facilitator.photo}
                    sizes="96px"
                    className="size-24 shrink-0 rounded-full"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-h4 font-bold">{event.facilitator.name}</p>
                    <p className="text-small font-semibold text-primary">
                      {event.facilitator.role}
                    </p>
                    {event.facilitator.bio && (
                      <p className="mt-2 text-muted">{event.facilitator.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {event.gallery.length > 0 && (
              <div className="flex flex-col gap-5">
                <h2 className="text-h2 font-bold">{t("detail.gallery")}</h2>
                <Gallery images={event.gallery} />
              </div>
            )}
          </div>
        </div>
      </Section>

      <Faq items={event.faq} />

      {others.length > 0 && (
        <Section tone="alt" aria-labelledby="other-events-title">
          <div className="container-site">
            <SectionHeader id="other-events-title" title={t("detail.others")} />
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <EventCard event={item} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* Barra fixa de inscrição no mobile (só para eventos futuros) */}
      {!past && (
        <>
          <div className="fixed inset-x-0 bottom-0 z-(--z-sticky) flex items-center justify-between gap-4 border-t border-border bg-surface-raised px-(--space-gutter) py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
            <div className="flex min-w-0 flex-col text-small">
              <span className="truncate font-semibold">{formatLongDate(event.startsAt)}</span>
              <span className="text-muted">{price}</span>
            </div>
            <RegistrationAction event={event} now={now} className="shrink-0 px-5" />
          </div>
          <div aria-hidden="true" className="h-20 lg:hidden" />
        </>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.summary,
          startDate: event.startsAt,
          ...(event.endsAt ? { endDate: event.endsAt } : {}),
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: event.location, address: event.location },
          organizer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          url,
          ...(event.image ? { image: new URL(event.image.src, siteConfig.url).toString() } : {}),
          offers: {
            "@type": "Offer",
            url: `${url}/inscricao`,
            price: event.priceKz ?? 0,
            priceCurrency: "AOA",
            availability:
              event.status === "esgotado"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
          },
        }}
      />
    </>
  );
}
