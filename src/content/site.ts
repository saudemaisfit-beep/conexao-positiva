import "server-only";
import { siteConfig, type SiteContacts, type SocialNetwork } from "@/config/site";
import { sanityFetch } from "@/sanity/fetch";
import { siteSettingsQuery, tags } from "@/sanity/queries";

interface RawSettings {
  phone?: string | null;
  email?: string | null;
  location?: string | null;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
  social?: { network?: string | null; url?: string | null }[] | null;
}

const NETWORKS: SocialNetwork[] = ["Instagram", "LinkedIn", "Facebook", "YouTube"];

/**
 * Contactos institucionais: "Definições do site" no Sanity; sem CMS (ou campo vazio), os
 * valores de src/config/site.ts e das variáveis de ambiente.
 */
export async function getSiteContacts(): Promise<SiteContacts> {
  const defaults: SiteContacts = {
    contact: siteConfig.contact,
    whatsapp: siteConfig.whatsapp,
    social: siteConfig.social,
  };
  const raw = await sanityFetch<RawSettings | null>(siteSettingsQuery, [...tags.settings]);
  if (!raw) return defaults;
  const social = (raw.social ?? []).flatMap((item) => {
    const network = NETWORKS.find((name) => name === item.network);
    return network && item.url ? [{ network, url: item.url }] : [];
  });
  return {
    contact: {
      phone: raw.phone?.trim() || defaults.contact.phone,
      email: raw.email?.trim() || defaults.contact.email,
      location: raw.location?.trim() || defaults.contact.location,
    },
    whatsapp: {
      number: raw.whatsappNumber?.replace(/\D/g, "") || defaults.whatsapp.number,
      message: raw.whatsappMessage?.trim() || defaults.whatsapp.message,
    },
    social: social.length > 0 ? social : defaults.social,
  };
}
