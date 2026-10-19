import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEditorialImage } from "@/content/provisional-images";
import { EditorialPhoto } from "@/components/common/editorial-photo";
import { getOffer, isOfferAvailable, offers } from "@/content/offers";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { FormPageHeader } from "@/components/sections/forms/form-page-header";
import { ButtonLink } from "@/components/ui/button";
import { formatKz } from "@/lib/format";
import { noIndex } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string; oferta: string }>;
}

export function generateStaticParams() {
  return offers.map((offer) => ({ oferta: offer.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, oferta } = await params;
  const offer = getOffer(oferta);
  if (!offer) return {};
  const t = await getTranslations({ locale, namespace: "Checkout" });
  return { title: t("metaTitle", { offer: offer.name }), robots: noIndex };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale, oferta } = await params;
  setRequestLocale(locale);
  const offer = getOffer(oferta);
  if (!offer) notFound();

  const t = await getTranslations("Checkout");
  const tm = await getTranslations("Metodo");
  const free = offer.priceKz === 0;
  const available = isOfferAvailable(offer);
  const image = getEditorialImage(`/metodo-centro/comprar/${offer.id}`);

  return (
    <div data-brand="luciana">
      <FormPageHeader
        compact
        eyebrow={offer.name}
        title={free ? t("freeTitle") : t("title")}
        lead={free ? t("freeLead") : t("lead")}
        breadcrumbs={[
          { label: tm("breadcrumb"), href: "/metodo-centro" },
          { label: t("breadcrumb"), href: `/metodo-centro/comprar/${offer.id}` },
        ]}
      />
      <section aria-labelledby="page-title" className="pt-10 pb-(--space-section) md:pt-14">
        <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <aside
            aria-labelledby="checkout-summary"
            className="flex min-w-0 flex-col gap-5 self-start rounded-sm border border-border bg-surface p-5 md:p-7 lg:sticky lg:top-28 lg:order-2"
          >
            {image && <EditorialPhoto image={image} sizes="(min-width: 1024px) 33vw, 100vw" />}
            <h2 id="checkout-summary" className="text-h4 font-bold">
              {t("summary")}
            </h2>
            <p className="font-semibold">{offer.name}</p>
            <p className="text-small text-muted">{offer.summary}</p>
            {offer.features.length > 0 && (
              <ul className="flex flex-col gap-2 text-small">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      strokeWidth={2.5}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
              <span className="font-semibold">{t("total")}</span>
              <span className="font-display text-h3 font-extrabold">
                {free ? tm("offers.free") : formatKz(offer.priceKz)}
              </span>
            </p>
            {offer.example && <p className="text-small text-muted">{tm("offers.example")}</p>}
          </aside>
          <div className="min-w-0 rounded-sm border border-border bg-surface-raised p-5 md:p-10">
            {available ? (
              <CheckoutForm offerId={offer.id} free={free} />
            ) : (
              <div className="flex flex-col items-start gap-5">
                <p className="text-lead">{t("unavailable")}</p>
                <ButtonLink href="/contactos">{t("contact")}</ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
