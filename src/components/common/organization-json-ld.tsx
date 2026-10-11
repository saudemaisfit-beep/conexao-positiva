import type { SiteContacts } from "@/config/site";
import { siteConfig } from "@/config/site";
import { JsonLd } from "./json-ld";

/**
 * Organization + WebSite (Schema.org) em todas as páginas. Só dados reais: contactos e redes
 * sociais aparecem apenas quando estão preenchidos nas Definições do site.
 */
export function OrganizationJsonLd({ contacts }: { contacts: SiteContacts }) {
  const { phone, email } = contacts.contact;
  const organizationId = `${siteConfig.url}/#organizacao`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": organizationId,
            name: siteConfig.name,
            url: siteConfig.url,
            logo: new URL("/icon.png", siteConfig.url).toString(),
            slogan: siteConfig.tagline,
            areaServed: { "@type": "Country", name: "Angola" },
            ...(contacts.social.length > 0
              ? { sameAs: contacts.social.map((item) => item.url) }
              : {}),
            ...(phone || email
              ? {
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    availableLanguage: "Portuguese",
                    ...(phone ? { telephone: phone } : {}),
                    ...(email ? { email } : {}),
                  },
                }
              : {}),
          },
          {
            "@type": "WebSite",
            "@id": `${siteConfig.url}/#website`,
            name: siteConfig.name,
            url: siteConfig.url,
            inLanguage: "pt-AO",
            publisher: { "@id": organizationId },
          },
        ],
      }}
    />
  );
}
