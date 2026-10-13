import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Analytics } from "@/components/consent/analytics";
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
import { pickClientMessages } from "@/i18n/client-messages";
import { routing } from "@/i18n/routing";
import { CONSENT_COOKIE } from "@/lib/consent";
import { inter, manrope, montserrat, playfair } from "../fonts";
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
  // Só os textos usados no browser (os restantes ficam no servidor).
  const messages = pickClientMessages(await getMessages());

  return (
    <html
      lang={locale === "pt" ? "pt-AO" : locale}
      className={`${manrope.variable} ${inter.variable} ${playfair.variable} ${montserrat.variable}`}
      // O script abaixo pode acrescentar data-consent antes da hidratação.
      suppressHydrationWarning
    >
      <head>
        {/* Marca quem já escolheu as preferências de cookies, antes da primeira pintura. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(/(?:^|;\\s*)${CONSENT_COOKIE}=/.test(document.cookie))document.documentElement.dataset.consent="1"}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider messages={messages}>
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
              <Analytics />
              <OrganizationJsonLd contacts={contacts} />
            </SiteContactsProvider>
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
