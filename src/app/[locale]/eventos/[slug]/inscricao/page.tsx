import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEvent, getEvents, registrationState } from "@/content/events";
import { RegistrationForm } from "@/components/forms/registration-form";
import { FormPageHeader } from "@/components/sections/forms/form-page-header";
import { EventSummary } from "@/components/sections/forms/event-summary";
import { ButtonLink } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// O estado das inscrições é revisto de hora a hora e confirmado no servidor em cada envio.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getEvents()).map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  const t = await getTranslations({ locale, namespace: "Registration" });
  return { title: t("metaTitle", { event: event.title }), robots: noIndex };
}

export default async function RegistrationPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const event = await getEvent(slug);
  if (!event) notFound();

  const t = await getTranslations("Registration");
  const te = await getTranslations("Events");
  const state = registrationState(event, new Date());
  const open = state === "aberto" || state === "lista-de-espera";
  const waitlist = state === "lista-de-espera";

  return (
    <>
      <FormPageHeader
        eyebrow={event.title}
        title={waitlist ? t("waitlistTitle") : t("title")}
        lead={open ? (waitlist ? t("waitlistLead") : t("lead")) : t("unavailable.title")}
        breadcrumbs={[
          { label: te("breadcrumb"), href: "/eventos" },
          { label: event.title, href: `/eventos/${event.slug}` },
          { label: t("breadcrumb"), href: `/eventos/${event.slug}/inscricao` },
        ]}
      />
      <section aria-labelledby="page-title" className="pb-(--space-section)">
        <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <aside
            aria-label={t("summary")}
            className="self-start rounded-xl bg-surface p-6 md:p-8 lg:sticky lg:top-28 lg:order-2"
          >
            <EventSummary event={event} title={t("summary")} />
          </aside>
          <div className="rounded-xl border border-border bg-surface-raised p-5 md:p-10">
            {open ? (
              <RegistrationForm eventSlug={event.slug} waitlist={waitlist} />
            ) : (
              <div className="flex flex-col items-start gap-5">
                <p className="text-lead">
                  {state === "passado" ? t("unavailable.past") : t("unavailable.closed")}
                </p>
                <div className="flex flex-col gap-3 md:flex-row">
                  <ButtonLink href="/eventos">{t("unavailable.cta")}</ButtonLink>
                  <ButtonLink href={`/eventos/${event.slug}`} variant="secondary">
                    {t("backToEvent")}
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
