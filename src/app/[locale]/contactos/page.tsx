import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { proposalHref } from "@/config/navigation";
import { whatsappHref } from "@/config/site";
import { getSiteContacts } from "@/content/site";
import { ContactForm } from "@/components/forms/contact-form";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/sections/page-hero";
import { ButtonLink, arrowClassName } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return pageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/contactos",
  });
}

function Channel({
  icon,
  label,
  href,
  value,
  external = false,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
  value: string;
  external?: boolean;
}) {
  const body = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-caption font-semibold tracking-[0.08em] text-muted uppercase">
          {label}
        </span>
        <span className="font-semibold break-words">{value}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex items-center gap-4 rounded-lg border border-border bg-surface-raised p-4 transition-colors duration-(--duration-instant) hover:border-primary"
        >
          {body}
        </a>
      ) : (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-raised p-4">
          {body}
        </div>
      )}
    </li>
  );
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const contacts = await getSiteContacts();
  const { phone, email, location } = contacts.contact;
  const whatsapp = contacts.whatsapp.number;
  const hasChannels = Boolean(phone || email || location || whatsapp || contacts.social.length);

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        lead={t("hero.lead")}
        breadcrumbs={[{ label: t("breadcrumb"), href: "/contactos" }]}
      />
      <Section className="pt-0 md:pt-0">
        <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-h3 font-bold">{t("channels")}</h2>
            {hasChannels ? (
              <ul className="flex flex-col gap-3">
                {whatsapp && (
                  <Channel
                    icon={<MessageCircle aria-hidden="true" className="size-5" />}
                    label={t("whatsapp")}
                    value={t("whatsappAction")}
                    href={whatsappHref(whatsapp, contacts.whatsapp.message)}
                    external
                  />
                )}
                {phone && (
                  <Channel
                    icon={<Phone aria-hidden="true" className="size-5" />}
                    label={t("phone")}
                    value={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                  />
                )}
                {email && (
                  <Channel
                    icon={<Mail aria-hidden="true" className="size-5" />}
                    label={t("email")}
                    value={email}
                    href={`mailto:${email}`}
                  />
                )}
                {location && (
                  <Channel
                    icon={<MapPin aria-hidden="true" className="size-5" />}
                    label={t("location")}
                    value={location}
                  />
                )}
                {contacts.social.map((item) => (
                  <Channel
                    key={item.network}
                    icon={<ArrowRight aria-hidden="true" className="size-5" />}
                    label={t("social")}
                    value={item.network}
                    href={item.url}
                    external
                  />
                ))}
              </ul>
            ) : (
              <p className="rounded-lg bg-surface p-6 text-muted">{t("noChannels")}</p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-h3 font-bold">{t("formTitle")}</h2>
            <ContactForm />
          </div>
        </div>
        <div className="container-site mt-16 md:mt-20">
          <div
            data-surface="inverse"
            className="flex flex-col gap-4 rounded-xl bg-inverse p-6 text-on-inverse md:flex-row md:items-center md:justify-between md:gap-10 md:p-10"
          >
            <div className="flex max-w-2xl flex-col gap-2">
              <h2 className="text-h3 font-bold">{t("proposal.title")}</h2>
              <p className="text-on-inverse-muted">{t("proposal.text")}</p>
            </div>
            <ButtonLink
              href={proposalHref}
              variant="inverse"
              className="shrink-0 self-start md:self-center"
            >
              {t("proposal.cta")}
              <ArrowRight aria-hidden="true" className={arrowClassName} />
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
