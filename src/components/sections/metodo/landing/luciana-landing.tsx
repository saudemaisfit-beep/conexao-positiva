import {
  Battery,
  BookOpen,
  Calendar,
  Check,
  CircleAlert,
  Clock,
  Cloud,
  Compass,
  Download,
  Gift,
  Heart,
  MapPin,
  Quote,
  Repeat,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { getOffer, isOfferAvailable, offers, type Offer } from "@/content/offers";
import { landing } from "@/content/metodo-landing";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { formatKz } from "@/lib/format";
import heroPhoto from "../../../../../public/images/metodo-centro/luciana-machado-hero.jpg";
import portrait from "../../../../../public/images/metodo-centro/luciana-machado-retrato.jpg";
import { Countdown } from "./countdown";

/**
 * Landing do Método C.E.N.T.R.O. (Luciana Machado) com a identidade dela: carvão, dourado e areia,
 * títulos em Manrope e texto em Inter. Usar dentro de [data-brand="luciana"].
 * Regras de contraste: dourado (glow) só sobre carvão ou com texto carvão; texto dourado sobre
 * fundos claros usa o dourado escuro (text-accent).
 */

// ---------- Peças comuns ----------
const container = "container-site";
const h2Class =
  "max-w-[26ch] font-display text-h2 leading-[1.18] font-semibold tracking-[-0.025em] text-balance";

function Badge({
  children,
  icon,
  tone = "accent",
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "accent" | "alert" | "light";
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-small font-semibold tracking-[0.08em] uppercase",
        tone === "accent" && "border-2 border-glow/50 bg-glow/15 text-accent",
        tone === "alert" && "border border-error/30 bg-error-soft text-error",
        tone === "light" && "bg-white/25 text-text",
      )}
    >
      {icon}
      {children}
    </p>
  );
}

const priceLabel = (offer: Offer) => (offer.priceKz === 0 ? "Gratuito" : formatKz(offer.priceKz));

function BuyLink({
  offer,
  label,
  variant = "dark",
  className,
}: {
  offer: Offer;
  label: string;
  variant?: "dark" | "gold";
  className?: string;
}) {
  if (!isOfferAvailable(offer)) {
    return (
      <p className={cn("text-small font-semibold text-muted", className)}>Disponível em breve</p>
    );
  }
  return (
    <Link
      href={`/metodo-centro/comprar/${offer.id}`}
      aria-describedby={`offer-${offer.id}`}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-8 py-4 font-semibold transition-opacity hover:opacity-90",
        variant === "dark" ? "bg-primary text-on-primary" : "bg-glow text-on-glow",
        className,
      )}
    >
      {label}
    </Link>
  );
}

// ---------- 1. Hero ----------
export function LandingHero() {
  const { hero } = landing;
  return (
    <section
      aria-labelledby="page-title"
      data-surface="inverse"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-inverse text-white"
    >
      <Image
        src={heroPhoto}
        alt=""
        priority
        fetchPriority="high"
        placeholder="blur"
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[72%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-[rgb(0_0_0/0.85)] via-[rgb(0_0_0/0.65)] to-[rgb(0_0_0/0.35)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-transparent to-[rgb(0_0_0/0.3)]"
      />
      <div className={cn(container, "py-12 md:py-20")}>
        <div className="flex max-w-3xl flex-col items-start gap-5 lg:gap-6">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-glow/60 bg-[rgb(0_0_0/0.3)] px-5 py-2.5 text-small font-semibold tracking-[0.08em] text-white uppercase backdrop-blur-md">
            <Sparkles aria-hidden="true" className="size-4 text-glow" />
            {hero.badge}
          </p>
          <h1
            id="page-title"
            className="max-w-[18ch] font-display text-h1 leading-[1.1] font-bold tracking-[-0.035em]"
          >
            {hero.titleStart}
            <br />
            <span className="text-glow">{hero.titleAccent}</span>
          </h1>
          <p className="max-w-[52ch] text-lead text-white/90">{hero.lead}</p>
          <p className="font-semibold text-glow md:text-lg">✓ {hero.promise}</p>
          <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
            <a
              href="#guia"
              className="inline-flex min-h-14 items-center justify-center rounded-sm bg-glow px-7 py-4 text-body font-semibold text-on-glow shadow-xl transition-transform hover:scale-[1.03]"
            >
              {hero.primary}
            </a>
            <a
              href="#bilhetes"
              className="inline-flex min-h-14 items-center justify-center rounded-sm border-2 border-white/80 bg-white/10 px-7 py-4 text-body font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-text"
            >
              {hero.secondary}
            </a>
          </div>
          <div className="mt-4 flex flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-white md:text-lg">{hero.proof}</p>
              <p className="flex items-center gap-2 text-small text-white/85">
                <span aria-hidden="true" className="text-lg text-glow">
                  ★★★★★
                </span>
                {hero.rating}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- 2. Números ----------
const statIcons = [Users, Star, Heart, TrendingUp];

export function LandingStats() {
  const { stats } = landing;
  return (
    <section
      aria-labelledby="stats-title"
      data-surface="inverse"
      className="bg-inverse py-20 text-white"
    >
      <div className={container}>
        <div className="mb-14 text-center">
          <h2 id="stats-title" className={h2Class}>
            {stats.title}
          </h2>
          <p className="mt-4 text-lg text-on-inverse-muted">{stats.lead}</p>
        </div>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {stats.items.map((stat, index) => {
            const Icon = statIcons[index] ?? Star;
            return (
              <li
                key={stat.label}
                className="flex flex-col items-center gap-2 border border-white/20 bg-white/10 p-8 text-center"
              >
                <Icon aria-hidden="true" className="mb-2 size-11 text-glow" strokeWidth={1.5} />
                <p className="font-display text-[2.25rem] leading-tight font-bold">{stat.value}</p>
                <p className="text-lg font-semibold text-glow">{stat.label}</p>
                <p className="text-small text-on-inverse-muted">{stat.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ---------- 3. Sinais ----------
const painIcons = [Battery, Cloud, Compass, Repeat];

export function LandingPains() {
  const { pains } = landing;
  return (
    <section
      aria-labelledby="pains-title"
      className="bg-linear-to-b from-white via-background to-white py-24"
    >
      <div className={container}>
        <div className="mx-auto mb-14 flex max-w-4xl flex-col items-center gap-6 text-center">
          <Badge tone="alert" icon={<X aria-hidden="true" className="size-5" />}>
            {pains.badge}
          </Badge>
          <h2 id="pains-title" className={h2Class}>
            {pains.titleStart}
            <br />
            <span className="text-accent">{pains.titleAccent}</span>
          </h2>
          <p className="max-w-[65ch] text-lead text-muted">{pains.lead}</p>
        </div>
        <ul className="mb-12 grid gap-6 md:grid-cols-2">
          {pains.items.map((item, index) => {
            const Icon = painIcons[index] ?? Repeat;
            return (
              <li
                key={item.title}
                className="group flex items-start gap-6 border-2 border-border bg-white p-8 transition-all hover:border-glow hover:shadow-xl"
              >
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-error-soft text-error transition-colors group-hover:bg-glow/15 group-hover:text-accent">
                  <Icon aria-hidden="true" className="size-8" strokeWidth={1.5} />
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-h3 font-semibold">{item.title}</h3>
                  <p className="leading-relaxed text-muted">{item.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mx-auto max-w-4xl rounded-sm border-l-4 border-glow bg-linear-to-r from-glow/15 to-glow/5 p-8 text-center">
          <p className="mb-4 text-h3 font-semibold">{pains.closingTitle}</p>
          <p className="mb-6 max-w-[65ch] text-lead text-muted">{pains.closingText}</p>
          <p className="inline-flex items-center gap-2 font-semibold text-accent">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
            {pains.closingHint}
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------- 4. Guia gratuito ----------
export function LandingGuide() {
  const { guide } = landing;
  const offer = getOffer("guia-regressar-ao-centro");
  if (!offer) return null;
  const available = isOfferAvailable(offer);
  return (
    <section
      id="guia"
      aria-labelledby="guide-title"
      className="scroll-mt-20 bg-linear-to-b from-white via-background to-white py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-(--space-gutter) md:px-6">
        <div className="grid overflow-hidden rounded-sm bg-white shadow-2xl lg:grid-cols-2">
          <div className="flex flex-col gap-6 bg-linear-to-br from-glow to-[color-mix(in_srgb,var(--color-glow)_80%,white)] p-8 text-text md:p-12">
            <Badge tone="light" icon={<Gift aria-hidden="true" className="size-5" />}>
              {guide.badge}
            </Badge>
            <h2
              id="guide-title"
              className="max-w-[24ch] font-display text-h2 leading-tight font-semibold tracking-[-0.025em]"
            >
              {guide.title}
            </h2>
            <p className="text-lead">{guide.lead}</p>
            <div className="flex flex-col gap-3">
              <h3 className="text-h4 font-semibold">{guide.listTitle}</h3>
              <ul className="flex flex-col gap-3">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-0.5 size-6 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-auto border-t border-text/20 pt-6 text-small">{guide.bonus}</p>
          </div>
          <div className="flex flex-col gap-6 p-8 md:p-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-glow/15 text-accent">
                <Download aria-hidden="true" className="size-10" />
              </span>
              <h3 id={`offer-${offer.id}`} className="text-h3 font-semibold">
                {guide.formTitle}
              </h3>
              <p className="text-muted">{guide.formLead}</p>
            </div>
            {available ? (
              <CheckoutForm offerId={offer.id} free />
            ) : (
              <p className="text-center font-semibold text-muted">Disponível em breve</p>
            )}
            <p className="flex items-center gap-2 text-small text-muted">
              <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-accent" />
              Os seus dados são tratados só para enviar o guia e nunca são vendidos a terceiros.
            </p>
            <p className="border-t border-border pt-6 text-center text-small font-semibold text-accent">
              {guide.proof}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- 5. A criadora ----------
export function LandingAbout() {
  const { about } = landing;
  return (
    <section id="sobre" aria-labelledby="about-title" className="bg-white py-16 md:py-24">
      <div className={cn(container, "grid items-center gap-16 lg:grid-cols-2")}>
        <div className="relative mb-10 lg:order-2 lg:mb-0">
          <div className="relative mx-auto aspect-4/5 w-full max-w-md lg:mr-0 lg:ml-auto lg:max-w-lg">
            <Image
              src={portrait}
              alt="Luciana Machado, criadora do Método C.E.N.T.R.O."
              placeholder="blur"
              fill
              sizes="(min-width: 1024px) 32rem, (min-width: 768px) 28rem, 100vw"
              className="object-cover shadow-2xl"
            />
            <span
              aria-hidden="true"
              className="absolute -right-6 -bottom-6 -z-10 hidden size-full border-2 border-glow md:block"
            />
            <span
              aria-hidden="true"
              className="absolute -top-4 -left-4 hidden size-24 border-t-4 border-l-4 border-glow/40 md:block"
            />
          </div>
          <div
            data-surface="inverse"
            className="relative mt-6 w-full max-w-sm border-t-4 border-glow bg-inverse p-6 text-white shadow-2xl md:absolute md:-bottom-8 md:-left-4 md:mt-0 md:max-w-xs md:p-8"
          >
            <p className="mb-2 font-display text-[2.5rem] leading-none font-bold text-glow">
              {about.years}
            </p>
            <p className="leading-relaxed">{about.yearsLabel}</p>
          </div>
        </div>
        <div className="flex flex-col gap-8 lg:order-1">
          <div className="flex flex-col items-start gap-6">
            <Badge>{about.badge}</Badge>
            <h2 id="about-title" className={h2Class}>
              {about.name}
            </h2>
            <span aria-hidden="true" className="h-1.5 w-24 bg-glow" />
          </div>
          <blockquote className="border-l-4 border-glow py-2 pl-6 text-lead font-medium italic">
            <p>“{about.quote}”</p>
          </blockquote>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <p>
              <strong className="text-text">{about.highlight}</strong>
            </p>
            <p>{about.origin}</p>
          </div>
          <dl className="grid gap-6 border-t-2 border-glow/30 pt-8 md:grid-cols-3 md:gap-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2">
                <dt className="text-small font-semibold tracking-wide text-muted uppercase">
                  {stat.label}
                </dt>
                <dd className="font-display text-h3 leading-tight font-semibold text-accent">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/** Frase de fecho da secção dos pilares (dentro da secção escura da órbita). */
export function MethodClosing() {
  const { method } = landing;
  return (
    <div className="mt-16 text-center">
      <div className="inline-block rounded-sm border border-white/20 bg-white/10 p-8">
        <p className="mb-3 text-h3 font-semibold">{method.closingStrong}</p>
        <p className="text-xl text-glow">{method.closingAccent}</p>
      </div>
    </div>
  );
}

// ---------- Conteúdo do site com a identidade da landing ----------
export function LandingHeader({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center gap-5 text-center">
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <h2 id={id} className={h2Class}>
        {title}
      </h2>
      {lead && <p className="max-w-[65ch] text-lead text-muted">{lead}</p>}
    </div>
  );
}

export function LandingWhat({
  what,
  why,
}: {
  what: { title: string; paragraphs: string[] };
  why: { title: string; text: string };
}) {
  return (
    <section aria-labelledby="what-title" className="bg-background py-16 md:py-24">
      <div className={cn(container, "grid gap-12 lg:grid-cols-2 lg:gap-20")}>
        <div className="flex flex-col gap-6">
          <h2 id="what-title" className={h2Class}>
            {what.title}
          </h2>
          <span aria-hidden="true" className="h-1.5 w-24 bg-glow" />
          {what.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-5 self-start border-t-4 border-glow bg-white p-8 shadow-xl md:p-12">
          <h2 className="font-display text-h3 leading-tight font-semibold">{why.title}</h2>
          <p className="text-lg leading-relaxed text-muted">{why.text}</p>
        </div>
      </div>
    </section>
  );
}

export function LandingSteps({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: readonly { title: string; text: string }[];
}) {
  return (
    <section aria-labelledby="steps-title" className="bg-white py-16 md:py-24">
      <div className={container}>
        <LandingHeader id="steps-title" eyebrow={eyebrow} title={title} />
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col gap-3 border-t border-border pt-6"
            >
              <span
                aria-hidden="true"
                className="mb-3 font-display text-[2.5rem] leading-none text-accent tabular-nums"
              >
                {index + 1}
              </span>
              <h3 className="mt-2 text-h4 font-semibold">{step.title}</h3>
              <p className="text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function LandingAudience({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: readonly { title: string; text: string }[];
}) {
  return (
    <section aria-labelledby="audience-title" className="bg-background py-16 md:py-24">
      <div className={container}>
        <LandingHeader id="audience-title" eyebrow={eyebrow} title={title} />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.title} className="flex flex-col gap-3 border-t border-border pt-6">
              <h3 className="font-display text-h3 leading-tight font-semibold">{item.title}</h3>
              <p className="text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------- Testemunhos ----------
export function LandingTestimonials() {
  const { testimonials } = landing;
  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-linear-to-b from-background to-white py-24"
    >
      <div className={container}>
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 id="testimonials-title" className={h2Class}>
            {testimonials.title}
          </h2>
          <p className="text-muted">{testimonials.note}</p>
        </div>
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.items.map((item) => (
            <li key={item.text.slice(0, 24)}>
              <figure className="flex h-full flex-col border-t-4 border-glow bg-white p-8 shadow-xl">
                <Quote aria-hidden="true" className="mb-4 size-10 text-glow/60" />
                <p aria-hidden="true" className="mb-4 text-xl text-accent">
                  ★★★★★
                </p>
                <blockquote className="mb-6 flex-1 leading-relaxed text-muted italic">
                  <p>“{item.text}”</p>
                </blockquote>
                <figcaption className="border-t border-border pt-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-small text-muted">{item.role}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-center text-lg font-semibold text-accent">
          {testimonials.closing}
        </p>
      </div>
    </section>
  );
}

// ---------- Benefícios ----------
export function LandingBenefits() {
  const { benefits } = landing;
  return (
    <section
      aria-labelledby="benefits-title"
      data-surface="inverse"
      className="bg-inverse py-20 text-white"
    >
      <div className="mx-auto w-full max-w-4xl px-(--space-gutter) text-center md:px-6">
        <h2 id="benefits-title" className={cn(h2Class, "mb-12")}>
          {benefits.title}
        </h2>
        <ul className="flex flex-col gap-5">
          {benefits.items.map((item) => (
            <li key={item} className="flex items-center gap-4 bg-white/10 p-6 text-left">
              <span className="grid size-8 shrink-0 place-items-center bg-glow text-on-glow">
                <Check aria-hidden="true" className="size-5" strokeWidth={2.5} />
              </span>
              <span className="text-lg">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------- Urgência ----------
export function LandingUrgency() {
  const { urgency } = landing;
  const premium = getOffer("encontro-plano-premium");
  return (
    <section
      aria-labelledby="urgency-title"
      className="bg-linear-to-r from-glow to-[color-mix(in_srgb,var(--color-glow)_80%,white)] py-16 text-text"
    >
      <div className={container}>
        <div className="grid items-center gap-10 rounded-sm border-2 border-white/40 bg-white/15 p-6 md:p-8 lg:grid-cols-2 lg:gap-12 lg:p-12">
          <div className="flex flex-col gap-6">
            <p className="inline-flex items-center gap-2 self-start rounded-full bg-error px-4 py-2 text-small font-semibold text-white uppercase">
              <CircleAlert aria-hidden="true" className="size-5" />
              {urgency.badge}
            </p>
            <h2
              id="urgency-title"
              className="max-w-[24ch] font-display text-h2 leading-tight font-semibold tracking-[-0.025em]"
            >
              {urgency.title}
            </h2>
            <p className="flex items-center gap-3 text-lg font-semibold md:text-xl">
              <Users aria-hidden="true" className="size-6 shrink-0" />
              {urgency.spots}
            </p>
            <p className="flex items-center gap-3 text-lead">
              <Clock aria-hidden="true" className="size-6 shrink-0" />
              {urgency.deadline ? urgency.deadlineLabel : urgency.noDeadline}
            </p>
            {urgency.deadline && <Countdown deadline={urgency.deadline} />}
            <a
              href="#bilhetes"
              className="inline-flex min-h-14 items-center justify-center rounded-sm bg-primary px-8 py-5 text-lg font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              {urgency.cta}
            </a>
            <p className="text-center text-small">✓ {urgency.guarantee}</p>
          </div>
          <div className="flex flex-col gap-5 rounded-sm border border-white/40 bg-white/30 p-6 md:p-8">
            <h3 className="text-h3 font-semibold">{urgency.includedTitle}</h3>
            <ul className="flex flex-col gap-3">
              {urgency.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg">
                  <Check aria-hidden="true" className="mt-1 size-5 shrink-0" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {premium && (
              <div className="mt-2 flex flex-col gap-1 border-t border-text/20 pt-6">
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-lg">
                    <span className="sr-only">Preço de referência: </span>
                    <s>[Exemplo] {formatKz(urgency.referencePriceKz)}</s>
                  </span>
                  <span className="font-display text-[2rem] font-bold">
                    <span className="sr-only">Preço atual: </span>
                    {formatKz(premium.priceKz)}
                  </span>
                </p>
                <p className="text-small">
                  [Exemplo] Poupe {formatKz(urgency.referencePriceKz - premium.priceKz)} hoje
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Evento ----------
export function LandingEvent() {
  const { event } = landing;
  const facts = [
    { icon: Calendar, label: "Data", value: event.date },
    { icon: MapPin, label: "Local", value: event.place },
    { icon: Users, label: "Lugares", value: event.seats },
  ];
  return (
    <section id="evento" aria-labelledby="event-title" className="bg-primary-soft/40 py-20">
      <div className="mx-auto w-full max-w-5xl px-(--space-gutter) md:px-6">
        <div className="border border-border bg-white p-6 md:p-8 lg:p-12">
          <div className="mb-12 flex flex-col gap-4 text-center">
            <h2 id="event-title" className={h2Class}>
              {event.title}
            </h2>
            <p className="max-w-[65ch] text-lead text-muted">{event.lead}</p>
          </div>
          <ul className="mb-12 grid gap-8 md:grid-cols-3">
            {facts.map((fact) => (
              <li key={fact.label} className="flex flex-col items-center gap-3 text-center">
                <span className="grid size-12 place-items-center bg-glow/15 text-accent">
                  <fact.icon aria-hidden="true" className="size-6" />
                </span>
                <span className="text-small text-muted">{fact.label}</span>
                <span className="text-lg">{fact.value}</span>
              </li>
            ))}
          </ul>
          <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-6">
            <h3 className="text-center text-h3 font-semibold">{event.listTitle}</h3>
            <ul className="flex flex-col gap-3 text-muted">
              {event.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <a
              href="#bilhetes"
              className="inline-flex min-h-12 items-center justify-center bg-primary px-12 py-4 text-lg text-on-primary transition-opacity hover:opacity-90"
            >
              {event.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Bilhetes ----------
export function LandingPricing() {
  const { pricing } = landing;
  const plans = offers.filter((offer) => offer.kind === "bilhete");
  return (
    <section
      id="bilhetes"
      aria-labelledby="pricing-title"
      className="scroll-mt-20 bg-surface py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-(--space-gutter) md:px-6">
        <div className="mb-14 flex flex-col gap-4 text-center">
          <h2 id="pricing-title" className={h2Class}>
            {pricing.title}
          </h2>
          <p className="max-w-[65ch] text-lead text-muted">{pricing.lead}</p>
          <p className="text-small text-muted">[Exemplo] Preços e condições por confirmar.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.id}
              aria-labelledby={`offer-${plan.id}`}
              className={cn(
                "relative flex flex-col border-2 bg-white p-6 md:p-8 lg:p-10",
                plan.highlight
                  ? "border-glow"
                  : "border-border transition-colors hover:border-glow",
              )}
            >
              {plan.highlight && (
                <p className="absolute top-4 right-4 bg-glow px-4 py-1 text-small font-bold text-on-glow">
                  Recomendado
                </p>
              )}
              <div
                className={cn(
                  "mb-8 flex flex-col gap-2 text-center",
                  plan.highlight && "pt-8 md:pt-0",
                )}
              >
                <h3 id={`offer-${plan.id}`} className="text-h3 font-semibold">
                  {plan.label}
                </h3>
                <p className="font-display text-[clamp(2.25rem,2rem+1vw,3rem)] text-accent">
                  {priceLabel(plan)}
                </p>
                <p className="text-muted">{plan.summary}</p>
              </div>
              <ul className="mb-8 flex flex-col gap-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
              <BuyLink
                offer={plan}
                label={plan.highlight ? "Adquirir bilhete Premium" : "Adquirir bilhete"}
                variant={plan.highlight ? "gold" : "dark"}
                className="mt-auto w-full"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- E-books ----------
export function LandingProducts() {
  const { products } = landing;
  const guide = getOffer("guia-regressar-ao-centro");
  const ebooks = offers.filter((offer) => offer.kind === "ebook");
  return (
    <section aria-labelledby="products-title" className="bg-white py-20">
      <div className={container}>
        <h2 id="products-title" className={cn(h2Class, "mb-14 text-center")}>
          {products.title}
        </h2>
        {guide && (
          <div className="mb-16">
            <h3 className="mb-8 text-center text-h3 font-semibold">{products.free}</h3>
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 bg-surface p-8 md:flex-row">
              <span className="grid h-40 w-32 shrink-0 place-items-center bg-glow/30 text-accent">
                <BookOpen aria-hidden="true" className="size-12" />
              </span>
              <div className="flex-1 text-center md:text-left">
                <h4 className="mb-2 text-xl">{guide.label}</h4>
                <p className="text-muted">{guide.summary}</p>
              </div>
              <a
                href="#guia"
                className="inline-flex min-h-12 shrink-0 items-center gap-2 bg-primary px-6 py-3 text-on-primary transition-opacity hover:opacity-90"
              >
                <Download aria-hidden="true" className="size-5" />
                Descarregar
              </a>
            </div>
          </div>
        )}
        <h3 className="mb-8 text-center text-h3 font-semibold">{products.premium}</h3>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {ebooks.map((book) => (
            <article
              key={book.id}
              aria-labelledby={`offer-${book.id}`}
              className="flex flex-col border-2 border-border bg-white p-8 transition-colors hover:border-glow"
            >
              <span className="mb-6 grid h-64 w-full place-items-center bg-glow/20 text-accent">
                <BookOpen aria-hidden="true" className="size-16" />
              </span>
              <h4 id={`offer-${book.id}`} className="mb-3 text-xl">
                {book.label}
              </h4>
              <p className="mb-6 text-muted">{book.summary}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                <p className="flex flex-col">
                  <span className="font-display text-[1.875rem] text-accent">
                    {priceLabel(book)}
                  </span>
                  {book.example && <span className="text-caption text-muted">[Exemplo]</span>}
                </p>
                {isOfferAvailable(book) ? (
                  <Link
                    href={`/metodo-centro/comprar/${book.id}`}
                    aria-describedby={`offer-${book.id}`}
                    className="inline-flex min-h-12 items-center gap-2 bg-primary px-6 py-3 text-on-primary transition-opacity hover:opacity-90"
                  >
                    <ShoppingCart aria-hidden="true" className="size-5" />
                    Comprar
                  </Link>
                ) : (
                  <p className="text-small font-semibold text-muted">Disponível em breve</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Aplicação individual ou corporativa ----------
export function LandingPaths({
  eyebrow,
  title,
  individual,
  corporate,
  corporateHref,
}: {
  eyebrow: string;
  title: string;
  individual: { title: string; text: string; cta: string };
  corporate: { title: string; text: string; cta: string };
  corporateHref: { pathname: string; query: Record<string, string> };
}) {
  return (
    <section aria-labelledby="paths-title" className="bg-background py-16 md:py-24">
      <div className={container}>
        <LandingHeader id="paths-title" eyebrow={eyebrow} title={title} />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4 border-2 border-border bg-white p-8 md:p-10">
            <h3 className="font-display text-h3 leading-tight font-semibold">{individual.title}</h3>
            <p className="flex-1 text-lg text-muted">{individual.text}</p>
            <a
              href="#bilhetes"
              className="inline-flex min-h-12 items-center justify-center self-start bg-primary px-8 py-3 text-on-primary transition-opacity hover:opacity-90"
            >
              Ver bilhetes e e-books
            </a>
          </div>
          <div
            data-surface="inverse"
            className="flex flex-col gap-4 border-t-4 border-glow bg-inverse p-8 text-white md:p-10"
          >
            <h3 className="font-display text-h3 leading-tight font-semibold">{corporate.title}</h3>
            <p className="flex-1 text-lg text-on-inverse-muted">{corporate.text}</p>
            <Link
              href={corporateHref}
              className="inline-flex min-h-12 items-center justify-center self-start bg-glow px-8 py-3 font-semibold text-on-glow transition-opacity hover:opacity-90"
            >
              {corporate.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Apelo final ----------
export function LandingFinal() {
  const { final } = landing;
  return (
    <section
      aria-labelledby="final-title"
      data-surface="inverse"
      className="bg-inverse py-32 text-white"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-(--space-gutter) text-center md:px-6">
        <h2
          id="final-title"
          className="font-display text-h2 leading-tight font-semibold tracking-[-0.025em]"
        >
          {final.titleStart}
          <br />
          {final.titleEnd}
        </h2>
        <p className="max-w-[52ch] text-lead text-white/90">{final.text}</p>
        <a
          href="#guia"
          className="inline-flex min-h-14 items-center justify-center bg-glow px-12 py-5 text-lg font-semibold text-on-glow transition-opacity hover:opacity-90"
        >
          {final.cta}
        </a>
      </div>
    </section>
  );
}
