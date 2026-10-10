"use client";

import { createContext, useContext, type ReactNode } from "react";
import { siteConfig, type SiteContacts } from "@/config/site";

const SiteContactsContext = createContext<SiteContacts>({
  contact: siteConfig.contact,
  whatsapp: siteConfig.whatsapp,
  social: siteConfig.social,
});

/** Disponibiliza aos componentes de cliente os contactos lidos do CMS no layout. */
export function SiteContactsProvider({
  value,
  children,
}: {
  value: SiteContacts;
  children: ReactNode;
}) {
  return <SiteContactsContext value={value}>{children}</SiteContactsContext>;
}

export const useSiteContacts = () => useContext(SiteContactsContext);
