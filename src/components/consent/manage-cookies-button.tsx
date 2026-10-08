"use client";

import { useTranslations } from "next-intl";
import { useConsent } from "./consent-provider";

export function ManageCookiesButton({ className }: { className?: string }) {
  const t = useTranslations("Footer");
  const { setPreferencesOpen } = useConsent();
  return (
    <button type="button" className={className} onClick={() => setPreferencesOpen(true)}>
      {t("manageCookies")}
    </button>
  );
}
