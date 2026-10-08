/**
 * Configuração institucional provisória.
 * A partir da fase de CMS, estes dados passam a vir de `siteSettings` no Sanity.
 * Valores `null` significam "ainda não fornecido": os componentes não os mostram.
 */
export type SocialNetwork = "Instagram" | "LinkedIn" | "Facebook" | "YouTube";

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  contact: {
    phone: string | null;
    email: string | null;
    location: string | null;
  };
  whatsapp: {
    number: string | null;
    message: string;
  };
  social: { network: SocialNetwork; url: string }[];
}

export const siteConfig: SiteConfig = {
  name: "Conexão Positiva",
  tagline: "Pessoas melhores constroem equipas melhores.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    phone: null,
    email: null,
    location: null,
  },
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
    message: "Olá! Gostaria de saber mais sobre as soluções da Conexão Positiva.",
  },
  social: [],
};

export function whatsappHref(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
