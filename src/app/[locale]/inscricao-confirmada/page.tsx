import { CalendarPlus } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEvent } from "@/content/events";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { Confirmation, ExploreLinks } from "@/components/sections/forms/confirmation";
import { EventSummary } from "@/components/sections/forms/event-summary";

interface PageProps {
  params: Promise<{ locale: string }>;
  // Só o slug do evento e o tipo de inscrição: nenhum dado pessoal no URL.
  searchParams: Promise<{ evento?: string | string[]; lista?: string | string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Confirmation" });
  return { title: t("registration.metaTitle"), robots: { index: false } };
}

export default async function RegistrationConfirmedPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Confirmation");
  const tr = await getTranslations("Registration");
  const query = await searchParams;
  const slug = typeof query.evento === "string" ? query.evento : "";
  const waitlist = query.lista === "1";
  const event = slug ? await getEvent(slug) : null;

  return (
    <Confirmation
      title={waitlist ? t("registration.waitlistTitle") : t("registration.title")}
      text={
        event
          ? waitlist
            ? t("registration.waitlistText")
            : t("registration.text")
          : t("registration.unknown")
      }
    >
      {event && (
        <div className="flex flex-col gap-6 rounded-xl bg-surface p-6 md:p-8">
          <EventSummary event={event} title={tr("summary")} />
          <div className="flex flex-col gap-3 md:flex-row">
            {!waitlist && (
              <a href={`/api/calendario/${event.slug}`} download className={buttonVariants()}>
                <CalendarPlus aria-hidden="true" />
                {t("registration.calendar")}
              </a>
            )}
            <ButtonLink href={`/eventos/${event.slug}`} variant="secondary">
              {t("registration.share")}
            </ButtonLink>
          </div>
        </div>
      )}
      <ExploreLinks
        title={t("explore")}
        links={[
          { label: t("links.events"), href: "/eventos" },
          { label: t("links.insights"), href: "/insights" },
        ]}
      />
    </Confirmation>
  );
}
