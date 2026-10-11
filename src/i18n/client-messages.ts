import type { AbstractIntlMessages } from "next-intl";

/**
 * Textos usados por componentes que correm no browser (e pelos componentes de servidor que
 * eles importam, como os cards). Só estes seguem para o cliente; os restantes ficam no
 * servidor. Ao criar um componente de cliente com um namespace novo, acrescentá-lo aqui
 * (um texto em falta aparece como erro na consola e nos testes).
 */
const CLIENT_NAMESPACES = [
  "Common",
  "Navigation",
  "Footer",
  "WhatsApp",
  "Consent",
  "Forms",
  "Contact.submit",
  "Proposal",
  "Registration",
  "Home.events",
  "Home.centro",
  "Home.testimonials",
  "Metodo.pillars",
  "Events.filters",
  "Events.categories",
  "Experiences",
  "Insights",
] as const;

export function pickClientMessages(messages: AbstractIntlMessages) {
  const picked: AbstractIntlMessages = {};
  for (const path of CLIENT_NAMESPACES) {
    const keys = path.split(".");
    let source: unknown = messages;
    let target = picked;
    keys.forEach((key, index) => {
      source = (source as AbstractIntlMessages | undefined)?.[key];
      if (source === undefined) return;
      if (index === keys.length - 1) target[key] = source as AbstractIntlMessages;
      else target = (target[key] ??= {}) as AbstractIntlMessages;
    });
  }
  return picked;
}
