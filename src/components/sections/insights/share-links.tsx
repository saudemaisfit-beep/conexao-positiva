"use client";

import { Check, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/cn";

const pill =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong bg-surface-raised px-4 text-small font-semibold transition-colors duration-(--duration-instant) hover:border-primary hover:text-primary";

/** Partilha por ligações diretas (sem scripts nem cookies das redes sociais). */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const t = useTranslations("Insights.article");
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const encodedUrl = encodeURIComponent(url);
  const networks = [
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="eyebrow">{t("share")}</p>
      <ul className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
        {networks.map((network) => (
          <li key={network.name}>
            <a
              href={network.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("shareOn", { network: network.name })}
              className={pill}
            >
              {network.name}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} className={cn(pill, "cursor-pointer")}>
            {status === "copied" ? (
              <Check aria-hidden="true" className="size-4 text-success" />
            ) : (
              <Link2 aria-hidden="true" className="size-4" />
            )}
            {t("copyLink")}
          </button>
        </li>
      </ul>
      <p aria-live="polite" className="min-h-5 text-small text-muted">
        {status === "copied" ? t("copied") : status === "failed" ? t("copyFailed") : ""}
      </p>
    </div>
  );
}
