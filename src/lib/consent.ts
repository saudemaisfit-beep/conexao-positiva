/**
 * Consentimento de cookies: modelo e (de)serialização do cookie de escolhas.
 * Incrementar CONSENT_VERSION quando as categorias mudarem, para voltar a pedir consentimento.
 */
export const CONSENT_COOKIE = "cp_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 6 meses

export interface ConsentState {
  version: number;
  analytics: boolean;
  updatedAt: string;
}

export function createConsent(analytics: boolean): ConsentState {
  return { version: CONSENT_VERSION, analytics, updatedAt: new Date().toISOString() };
}

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(decodeURIComponent(raw));
    if (
      typeof value === "object" &&
      value !== null &&
      "version" in value &&
      "analytics" in value &&
      "updatedAt" in value &&
      value.version === CONSENT_VERSION &&
      typeof value.analytics === "boolean" &&
      typeof value.updatedAt === "string"
    ) {
      return { version: value.version, analytics: value.analytics, updatedAt: value.updatedAt };
    }
  } catch {
    // Cookie corrompido ou de outra versão: tratado como ausência de escolha.
  }
  return null;
}

export function readConsentCookie(cookieHeader: string): ConsentState | null {
  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(entry?.slice(CONSENT_COOKIE.length + 1));
}

export function serializeConsentCookie(consent: ConsentState, secure: boolean) {
  const attributes = [
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}`,
    "Path=/",
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];
  if (secure) attributes.push("Secure");
  return attributes.join("; ");
}
