import { CalendarX } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { proposalHref } from "@/config/navigation";
import { getEvents, isPastEvent, toSummary } from "@/content/events";
import { Section } from "@/components/layout/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { EventsBrowser } from "@/components/sections/events/events-browser";
import { PageHero } from "@/components/sections/page-hero";
import { ButtonLink } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Revalida de hora a hora: eventos que já decorreram passam para "Passados".
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Events" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/eventos" },
  };
}

export default async function EventsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Events");
  const now = new Date();
  const events = (await getEvents(now)).map((event) => ({
    ...toSummary(event),
    past: isPastEvent(event, now),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        lead={t("hero.lead")}
        breadcrumbs={[{ label: t("breadcrumb"), href: "/eventos" }]}
      />
      <Section aria-label={t("hero.title")} className="pt-0 md:pt-0">
        <div className="container-site">
          {events.length === 0 ? (
            <div className="flex flex-col items-start gap-5 rounded-xl bg-surface p-8 md:p-12">
              <span className="grid size-14 place-items-center rounded-full bg-surface-raised text-primary">
                <CalendarX aria-hidden="true" className="size-6" strokeWidth={1.75} />
              </span>
              <h2 className="text-h3 font-bold">{t("empty.title")}</h2>
              <p className="max-w-xl text-muted">{t("empty.text")}</p>
              <ButtonLink href="/contactos" variant="secondary">
                {t("empty.cta")}
              </ButtonLink>
            </div>
          ) : (
            <Suspense>
              <EventsBrowser events={events} />
            </Suspense>
          )}
        </div>
      </Section>
      <CtaBanner
        id="events-cta-title"
        title={t("cta.title")}
        text={t("cta.text")}
        primary={{ label: t("cta.primary"), href: proposalHref }}
      />
    </>
  );
}
