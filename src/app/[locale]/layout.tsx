import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { OrganizationJsonLd } from "@/components/common/organization-json-ld";
import { SiteContactsProvider } from "@/components/common/site-contacts";
import { SkipLink } from "@/components/common/skip-link";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/config/site";
import { getSiteContacts } from "@/content/site";
import { routing } from "@/i18n/routing";
import { inter, manrope } from "../fonts";
import "../globals.css";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#faf8f3",
  viewportFit: "cover",
};

export async function generateMetadata({
  params,
}: Omit<LayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
    description: t("metaDescription"),
    applicationName: siteConfig.name,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const contacts = await getSiteContacts();

  return (
    <html
      lang={locale === "pt" ? "pt-AO" : locale}
      className={`${manrope.variable} ${inter.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <ConsentProvider>
            <SiteContactsProvider value={contacts}>
              <SkipLink />
              <Header />
              <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <Footer />
              <WhatsAppButton />
              <CookieBanner />
              <OrganizationJsonLd contacts={contacts} />
            </SiteContactsProvider>
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
