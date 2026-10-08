"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  createConsent,
  readConsentCookie,
  serializeConsentCookie,
  type ConsentState,
} from "@/lib/consent";

interface ConsentContextValue {
  /** `undefined` no servidor e antes da hidratação; `null` = ainda sem escolha. */
  consent: ConsentState | null | undefined;
  preferencesOpen: boolean;
  setPreferencesOpen: (open: boolean) => void;
  save: (analytics: boolean) => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export const CONSENT_CHANGE_EVENT = "cp:consent-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const cookies = useSyncExternalStore(
    subscribe,
    () => document.cookie,
    () => null,
  );
  const consent = useMemo(
    () => (cookies === null ? undefined : readConsentCookie(cookies)),
    [cookies],
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const save = useCallback((analytics: boolean) => {
    const next = createConsent(analytics);
    document.cookie = serializeConsentCookie(next, window.location.protocol === "https:");
    setPreferencesOpen(false);
    window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: next }));
  }, []);

  const value = useMemo(
    () => ({ consent, preferencesOpen, setPreferencesOpen, save }),
    [consent, preferencesOpen, save],
  );

  return <ConsentContext value={value}>{children}</ConsentContext>;
}

export function useConsent() {
  const context = use(ConsentContext);
  if (!context) throw new Error("useConsent tem de ser usado dentro de <ConsentProvider>.");
  return context;
}
