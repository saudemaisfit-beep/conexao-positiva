import { ArrowRight, BatteryLow, Check, CircleHelp, Layers, Repeat } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getOffer, isOfferAvailable, offers, type Offer, type OfferKind } from "@/content/offers";
import { metodoCopy } from "@/content/metodo";
import { Section } from "@/components/layout/section";
import { TestimonialsShowcase } from "@/components/sections/testimonials";
import { ButtonLink, arrowClassName } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/cn";
import { formatKz } from "@/lib/format";
import portrait from "../../../../public/images/metodo-centro/luciana-machado-retrato.jpg";

/**
 * Secções da página do Método C.E.N.T.R.O. vindas da landing page de Luciana Machado
 * (sinais, criadora, benefícios, testemunhos, ofertas e apelo final), no design do site.
 */

const signIcons = [BatteryLow, CircleHelp, Layers, Repeat];

export async function SignsSection() {
  const t = await getTranslations("Metodo.signs");
  const { signs } = metodoCopy;
  return (
    <Section aria-labelledby="signs-title">
      <div className="container-site">
        <SectionHeader
          id="signs-title"
          eyebrow={t("eyebrow")}
          title={signs.title}
          lead={signs.lead}
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
          {signs.items.map((item, index) => {
            const Icon = signIcons[index] ?? Repeat;
            return (
              <li
                key={item.title}
                className="flex reveal gap-5 rounded-xl border border-border bg-surface-raised p-6 md:p-7"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h4 font-bold">{item.title}</h3>
                  <p className="text-muted">{item.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 max-w-3xl border-l-4 border-primary pl-5 text-lead font-semibold">
          {signs.closing}
        </p>
      </div>
    </Section>
  );
}

export async function CreatorSection() {
  const t = await getTranslations("Metodo");
  const { creator } = metodoCopy;
  return (
    <Section tone="alt" aria-labelledby="creator-title">
      <div className="container-site grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={portrait}
              alt={t("hero.photoAlt")}
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 28rem, 100vw"
              placeholder="blur"
              className="aspect-4/5 h-auto w-full object-cover"
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute -right-4 -bottom-4 -z-10 hidden size-full rounded-2xl border-2 border-primary/40 md:block"
          />
        </div>
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{t("creator.eyebrow")}</p>
          <div className="flex flex-col gap-1">
            <h2 id="creator-title" className="text-h1 font-extrabold">
              {creator.name}
            </h2>
            <p className="font-semibold text-primary">{creator.role}</p>
          </div>
          <blockquote className="border-l-4 border-primary pl-5 font-display text-h4 leading-snug font-bold">
            <p>“{creator.quote}”</p>
          </blockquote>
          {creator.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-[60ch] text-body-lg text-muted">
              {paragraph}
            </p>
          ))}
          <dl className="sm:grid-cols-3 grid grid-cols-1 gap-4 border-t border-border pt-6">
            {creator.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1">
                <dt className="text-small text-muted">{stat.label}</dt>
                <dd className="font-display text-h3 font-extrabold text-primary">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

export async function BenefitsSection() {
  const t = await getTranslations("Metodo");
  const { benefits, testimonials } = metodoCopy;
  return (
    <>
      <Section tone="inverse" aria-labelledby="benefits-title">
        <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">{t("benefits.eyebrow")}</p>
            <h2 id="benefits-title" className="text-h2 font-bold">
              {benefits.title}
            </h2>
          </div>
          <ul className="flex flex-col gap-4">
            {benefits.items.map((item) => (
              <li key={item} className="glass flex reveal items-start gap-4 rounded-xl p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-glow text-on-glow">
                  <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
                </span>
                <span className="text-body-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section aria-labelledby="metodo-testimonials-title">
        <div className="container-site">
          <SectionHeader
            id="metodo-testimonials-title"
            eyebrow={t("testimonials.eyebrow")}
            title={t("testimonials.title")}
          />
          <TestimonialsShowcase
            testimonials={testimonials.map((item) => ({ ...item, company: "" }))}
          />
        </div>
      </Section>
    </>
  );
}

const groupOrder: OfferKind[] = ["bilhete", "ebook", "guia"];

function OfferCard({ offer, labels }: { offer: Offer; labels: Record<string, string> }) {
  const available = isOfferAvailable(offer);
  const free = offer.priceKz === 0;
  return (
    <article
      data-surface={offer.highlight ? "inverse" : undefined}
      aria-labelledby={`offer-${offer.id}`}
      className={cn(
        "relative flex flex-col gap-5 rounded-2xl p-6 md:p-8",
        offer.highlight
          ? "bg-inverse text-on-inverse shadow-lg"
          : "border border-border bg-surface-raised",
      )}
    >
      {offer.highlight && (
        <span className="self-start rounded-full bg-glow px-3 py-1 text-caption font-bold tracking-[0.08em] text-on-glow uppercase">
          {labels.recommended}
        </span>
      )}
      <div className="flex flex-col gap-2">
        <h3 id={`offer-${offer.id}`} className="text-h4 font-bold">
          {offer.name}
        </h3>
        <p className="text-muted">{offer.summary}</p>
      </div>
      <p className="flex flex-col gap-1">
        <span className="font-display text-h2 font-extrabold">
          {free ? labels.free : formatKz(offer.priceKz)}
        </span>
        {offer.example && <span className="text-small text-muted">{labels.example}</span>}
      </p>
      {offer.features.length > 0 && (
        <ul className="flex flex-col gap-2">
          {offer.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check
                aria-hidden="true"
                className={cn(
                  "mt-1 size-4 shrink-0",
                  offer.highlight ? "text-glow" : "text-primary",
                )}
                strokeWidth={2.5}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-2">
        {available ? (
          <ButtonLink
            href={`/metodo-centro/comprar/${offer.id}`}
            variant={offer.highlight ? "glow" : "primary"}
            className="w-full"
            aria-describedby={`offer-${offer.id}`}
          >
            {free ? labels.request : labels.buy}
            <ArrowRight aria-hidden="true" className={arrowClassName} />
          </ButtonLink>
        ) : (
          <p className="text-small font-semibold text-muted">{labels.soon}</p>
        )}
      </div>
    </article>
  );
}

export async function OffersSection() {
  const t = await getTranslations("Metodo.offers");
  const labels = {
    recommended: t("recommended"),
    free: t("free"),
    example: t("example"),
    buy: t("buy"),
    request: t("request"),
    soon: t("soon"),
  };
  return (
    <Section id="participar" aria-labelledby="offers-title" className="scroll-mt-24">
      <div className="container-site">
        <SectionHeader
          id="offers-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
        />
        <div className="flex flex-col gap-14">
          {groupOrder.map((kind) => {
            const group = offers.filter((offer) => offer.kind === kind);
            if (group.length === 0) return null;
            return (
              <div key={kind} className="flex flex-col gap-6">
                <h3 className="text-h3 font-bold">{t(`groups.${kind}`)}</h3>
                <div
                  className={cn("grid gap-6", group.length > 1 ? "md:grid-cols-2" : "md:max-w-2xl")}
                >
                  {group.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} labels={labels} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export async function ClosingSection() {
  const t = await getTranslations("Metodo.closing");
  const { closing } = metodoCopy;
  const guide = getOffer("guia-regressar-ao-centro");
  return (
    <Section tone="inverse" aria-labelledby="closing-title">
      <div className="container-site flex max-w-3xl flex-col items-start gap-6">
        <h2 id="closing-title" className="text-h1 font-extrabold text-balance">
          {closing.title}
        </h2>
        <p className="text-lead text-on-inverse-muted">{closing.text}</p>
        <div className="flex flex-col gap-3 md:flex-row">
          {guide && isOfferAvailable(guide) && (
            <ButtonLink href={`/metodo-centro/comprar/${guide.id}`} variant="glow" size="lg">
              {t("primary")}
              <ArrowRight aria-hidden="true" className={arrowClassName} />
            </ButtonLink>
          )}
          <ButtonLink href="#participar" variant="glass" size="lg">
            {t("secondary")}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
