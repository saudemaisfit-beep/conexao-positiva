"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useConsent } from "./consent-provider";

/** Aviso de cookies não bloqueante + painel de preferências. Aceitar e Rejeitar têm o mesmo peso. */
export function CookieBanner() {
  const t = useTranslations("Consent");
  const { consent, preferencesOpen, setPreferencesOpen, save } = useConsent();
  // Também no servidor (consent === undefined): o aviso vem no HTML e é pintado logo, em vez de
  // aparecer só depois da hidratação. Quem já escolheu não o vê: o script do <head> marca
  // <html data-consent> antes da primeira pintura e o CSS esconde-o.
  const showBanner = !consent && !preferencesOpen;

  useEffect(() => {
    // Cookie antigo ou inválido: a marca do <head> não se aplica e o aviso volta a aparecer.
    if (consent === null) delete document.documentElement.dataset.consent;
  }, [consent]);

  return (
    <>
      {showBanner && (
        <section
          aria-labelledby="consent-title"
          data-consent-banner=""
          className="fixed inset-x-0 bottom-0 z-(--z-toast) animate-rise-in p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:inset-x-auto md:right-4 md:bottom-4 md:max-w-md md:p-0"
        >
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface-raised p-5 shadow-lg">
            <div className="flex flex-col gap-2">
              <h2 id="consent-title" className="text-h4 font-bold">
                {t("title")}
              </h2>
              <p className="text-small text-muted">
                {t("description")}{" "}
                <Link
                  href="/politica-de-cookies"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  {t("learnMore")}
                </Link>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="max-md:min-h-11"
                onClick={() => save(true)}
              >
                {t("accept")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="max-md:min-h-11"
                onClick={() => save(false)}
              >
                {t("reject")}
              </Button>
              <Button
                variant="link"
                size="sm"
                className="col-span-2 justify-self-center max-md:min-h-11 max-md:px-3"
                onClick={() => setPreferencesOpen(true)}
              >
                {t("customize")}
              </Button>
            </div>
          </div>
        </section>
      )}
      <ConsentPreferences open={preferencesOpen} onOpenChange={setPreferencesOpen} />
    </>
  );
}

function ConsentPreferences({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Consent");
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-modal) animate-fade-in bg-primary-strong/50" />
        <Dialog.Content className="fixed inset-x-3 bottom-3 z-(--z-modal) max-h-[calc(100dvh-1.5rem)] animate-rise-in overflow-y-auto rounded-lg bg-surface-raised p-6 shadow-lg md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2">
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-h3 font-bold">{t("preferencesTitle")}</Dialog.Title>
            <Dialog.Close
              aria-label={t("close")}
              className="grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-surface"
            >
              <X aria-hidden="true" className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-small text-muted">
            {t("description")}
          </Dialog.Description>
          {/* Montado só com o painel aberto: o estado inicial reflete sempre a escolha guardada. */}
          <PreferencesForm />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PreferencesForm() {
  const t = useTranslations("Consent");
  const { consent, save } = useConsent();
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const analyticsId = useId();

  return (
    <>
      <ul className="mt-6 flex flex-col divide-y divide-border border-y border-border">
        <li className="flex items-start justify-between gap-4 py-4">
          <div>
            <p className="font-semibold">{t("necessaryTitle")}</p>
            <p className="text-small text-muted">{t("necessaryDescription")}</p>
          </div>
          <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-caption font-semibold text-muted">
            {t("alwaysOn")}
          </span>
        </li>
        <li className="flex items-start justify-between gap-4 py-4">
          <div>
            <label htmlFor={analyticsId} className="font-semibold">
              {t("analyticsTitle")}
            </label>
            <p className="text-small text-muted">{t("analyticsDescription")}</p>
          </div>
          <input
            id={analyticsId}
            type="checkbox"
            role="switch"
            checked={analytics}
            onChange={(event) => setAnalytics(event.target.checked)}
            className="relative mt-1 h-7 w-12 shrink-0 cursor-pointer appearance-none rounded-full bg-border-strong transition-colors duration-(--duration-fast) before:absolute before:top-1 before:left-1 before:size-5 before:rounded-full before:bg-white before:shadow-sm before:transition-transform before:duration-(--duration-fast) checked:bg-primary checked:before:translate-x-5"
          />
        </li>
      </ul>

      <div className="mt-6 grid gap-2 md:grid-cols-2">
        <Button variant="secondary" onClick={() => save(false)}>
          {t("reject")}
        </Button>
        <Button onClick={() => save(analytics)}>{t("save")}</Button>
      </div>
    </>
  );
}
