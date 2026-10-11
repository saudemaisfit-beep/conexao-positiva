"use client";

import { useEffect, useRef } from "react";

interface TurnstileApi {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
let scriptPromise: Promise<void> | null = null;

/** O script do Cloudflare só é carregado em páginas com formulário e quando há chave. */
function loadScript() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile não carregou"));
    };
    document.head.append(script);
  });
  return scriptPromise;
}

/**
 * Verificação anti-robô (Cloudflare Turnstile). Normalmente invisível; só mostra uma caixa
 * quando o Cloudflare precisa de confirmação. O token é validado no servidor.
 * `resetKey` muda depois de cada tentativa de envio (cada token só pode ser usado uma vez).
 */
export function Turnstile({
  onToken,
  resetKey,
  label,
}: {
  onToken: (token: string) => void;
  resetKey: number;
  label: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const callback = useRef(onToken);

  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile) return;
        widget.current = window.turnstile.render(container.current, {
          sitekey: siteKey,
          language: "pt",
          appearance: "interaction-only",
          callback: (token: string) => callback.current(token),
          "expired-callback": () => callback.current(""),
          "error-callback": () => callback.current(""),
        });
      })
      .catch(() => {
        // Sem script (bloqueado ou sem rede): o servidor recusa o envio com uma mensagem clara.
      });
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && widget.current) {
      callback.current("");
      window.turnstile?.reset(widget.current);
    }
  }, [resetKey]);

  if (!siteKey) return null;
  return <div ref={container} aria-label={label} className="empty:hidden" />;
}
