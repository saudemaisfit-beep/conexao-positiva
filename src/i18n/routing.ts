import { defineRouting } from "next-intl/routing";

// Português sem prefixo (/sobre). Para acrescentar inglês: incluir "en" em locales,
// criar messages/en.json e traduzir os segmentos de URL com `pathnames`.
export const routing = defineRouting({
  locales: ["pt"],
  defaultLocale: "pt",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
