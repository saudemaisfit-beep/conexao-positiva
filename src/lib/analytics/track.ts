type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Evento de analytics (GA4). Sem consentimento o gtag não existe e nada é enviado.
 * Eventos definidos na Fase 1: generate_lead (proposta, contacto), sign_up (inscrição),
 * contact_whatsapp. Nunca enviar dados pessoais nos parâmetros.
 */
export function track(name: string, params: GtagParams = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}
