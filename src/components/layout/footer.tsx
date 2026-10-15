import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { legalNav, mainNav, proposalHref, services } from "@/config/navigation";
import { siteConfig, whatsappHref } from "@/config/site";
import { getSiteContacts } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { ButtonLink, arrowClassName } from "@/components/ui/button";
import { ManageCookiesButton } from "@/components/consent/manage-cookies-button";
import { cn } from "@/lib/cn";
import symbol from "../../../public/brand/conexao-positiva/conexao-positiva-simbolo.png";

const footerLink =
  "text-small text-on-inverse-muted transition-colors duration-(--duration-instant) hover:text-on-inverse";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Navigation");
  const tc = await getTranslations("Common");
  const contacts = await getSiteContacts();
  const { phone, email, location } = contacts.contact;
  const whatsapp = contacts.whatsapp.number;

  return (
    <footer
      data-surface="inverse"
      className="bg-inverse pt-16 pb-24 text-on-inverse md:pt-20 lg:pb-10"
    >
      <div className="container-site">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr] lg:gap-10">
          <div className="col-span-2 flex flex-col gap-5 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-3 self-start rounded-sm font-display text-h4 font-extrabold"
            >
              <Image src={symbol} alt="" width={44} height={44} className="size-11" />
              {siteConfig.name}
            </Link>
            <p className="max-w-xs text-small text-on-inverse-muted">{t("tagline")}</p>
            <p className="max-w-xs text-caption text-on-inverse-muted">
              As fotografias assinaladas como ilustrativas são provisórias e geradas por IA.
            </p>
            {contacts.social.length > 0 && (
              <ul aria-label={t("social")} className="flex flex-wrap gap-x-5 gap-y-2">
                {contacts.social.map((item) => (
                  <li key={item.network}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerLink}
                    >
                      {item.network}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FooterColumn title={t("navigation")}>
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={footerLink}>
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t("solutions")}>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/solucoes/${service.slug}`} className={footerLink}>
                  {service.name}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <h2 className="text-caption font-semibold tracking-[0.12em] text-on-inverse-muted uppercase">
              {t("contact")}
            </h2>
            <p className="text-small text-on-inverse-muted">{t("contactIntro")}</p>
            {(phone || email || whatsapp || location) && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-small">
                {phone && (
                  <ContactItem label={t("phone")}>
                    <a href={`tel:${phone}`} className={footerLink}>
                      {phone}
                    </a>
                  </ContactItem>
                )}
                {email && (
                  <ContactItem label={t("email")}>
                    <a href={`mailto:${email}`} className={cn(footerLink, "break-all")}>
                      {email}
                    </a>
                  </ContactItem>
                )}
                {whatsapp && (
                  <ContactItem label={t("whatsapp")}>
                    <a
                      href={whatsappHref(whatsapp, contacts.whatsapp.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="whatsapp"
                      className={footerLink}
                    >
                      +{whatsapp}
                    </a>
                  </ContactItem>
                )}
                {location && <ContactItem label={t("location")}>{location}</ContactItem>}
              </dl>
            )}
            <ButtonLink
              href={proposalHref}
              variant="inverse-outline"
              size="sm"
              className="self-start"
            >
              {tc("requestProposal")}
              <ArrowRight aria-hidden="true" className={arrowClassName} />
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-caption text-on-inverse-muted md:flex-row md:items-center md:justify-between lg:pr-20">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-6 items-center hover:text-on-inverse"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <ManageCookiesButton className="inline-flex min-h-6 cursor-pointer items-center hover:text-on-inverse" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-caption font-semibold tracking-[0.12em] text-on-inverse-muted uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function ContactItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-on-inverse-muted">{label}</dt>
      <dd>{children}</dd>
    </>
  );
}
