"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useConsent } from "./consent-provider";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Remove os cookies do Google Analytics quando o consentimento é retirado. */
function clearGaCookies() {
  const domain = window.location.hostname.replace(/^www\./, "");
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (name && (name === "_ga" || name.startsWith("_ga_"))) {
      for (const scope of ["", `; domain=.${domain}`, `; domain=${domain}`]) {
        document.cookie = `${name}=; max-age=0; path=/${scope}`;
      }
    }
  }
}

/**
 * Google Analytics 4 com consentimento. O script da Google só é pedido DEPOIS de a pessoa
 * aceitar as estatísticas (antes disso não há qualquer pedido a terceiros) e só se existir
 * NEXT_PUBLIC_GA_ID. Consent Mode v2: publicidade sempre recusada; estatísticas conforme a
 * escolha. Páginas vistas enviadas a cada navegação.
 */
export function Analytics() {
  const { consent } = useConsent();
  const pathname = usePathname();
  const loaded = useRef(false);
  const granted = Boolean(GA_ID && consent?.analytics);

  useEffect(() => {
    if (!GA_ID) return;
    if (!granted) {
      if (loaded.current) {
        window.gtag?.("consent", "update", { analytics_storage: "denied" });
        clearGaCookies();
      }
      return;
    }
    if (!loaded.current) {
      loaded.current = true;
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params -- formato exigido pelo gtag.js
        window.dataLayer!.push(arguments);
      };
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "granted",
      });
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: false });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
      document.head.append(script);
    } else {
      window.gtag?.("consent", "update", { analytics_storage: "granted" });
    }
  }, [granted]);

  useEffect(() => {
    if (granted) {
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [granted, pathname]);

  return null;
}
