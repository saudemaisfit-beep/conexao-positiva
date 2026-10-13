"use client";

import { Copy, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { simulatePayment } from "@/lib/actions/checkout";
import { Button, buttonVariants } from "@/components/ui/button";

/** Valor com botão "Copiar" (entidade, referência). O estado é anunciado aos leitores de ecrã. */
export function CopyValue({ value }: { value: string }) {
  const t = useTranslations("Order");
  const [copied, setCopied] = useState(false);
  return (
    <span className="flex flex-wrap items-center gap-3">
      <span className="font-display text-h3 font-extrabold tracking-wide tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value.replace(/\s/g, ""));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            // Sem acesso à área de transferência: o valor continua visível para copiar à mão.
          }
        }}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-small font-semibold hover:bg-primary-soft"
      >
        <Copy aria-hidden="true" className="size-4" />
        <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
      </button>
    </span>
  );
}

/** Ações do pedido pendente: atualizar o estado, pagar no fornecedor ou simular (teste). */
export function OrderActions({
  orderId,
  token,
  redirectUrl,
  testMode,
}: {
  orderId: string;
  token: string;
  redirectUrl?: string;
  testMode: boolean;
}) {
  const t = useTranslations("Order");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row">
        {redirectUrl && (
          <a href={redirectUrl} rel="noopener noreferrer" className={buttonVariants()}>
            {t("redirect")}
          </a>
        )}
        <Button variant="secondary" onClick={() => router.refresh()}>
          <RefreshCw aria-hidden="true" className="size-4" />
          {t("refresh")}
        </Button>
      </div>
      {testMode && (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-4">
          <p className="text-small text-muted">{t("test")}</p>
          <Button
            variant="secondary"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await simulatePayment(orderId, token);
                router.refresh();
              })
            }
          >
            {t("simulate")}
          </Button>
        </div>
      )}
    </div>
  );
}
