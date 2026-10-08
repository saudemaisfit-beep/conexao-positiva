"use client";

import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { siteConfig, whatsappHref } from "@/config/site";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/** Páginas de formulário: no mobile o botão fica escondido para não cobrir campos nem o envio. */
const FORM_PAGES = [/^\/solicitar-proposta$/, /^\/contactos$/, /^\/eventos\/[^/]+\/inscricao$/];

export function WhatsAppButton() {
  const t = useTranslations("WhatsApp");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const number = siteConfig.whatsapp.number;

  useEffect(() => {
    const show = () => setVisible(true);
    const timer = window.setTimeout(show, 1000);
    window.addEventListener("scroll", show, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", show);
    };
  }, []);

  if (!number) return null;
  const onFormPage = FORM_PAGES.some((pattern) => pattern.test(pathname));

  return (
    <a
      href={whatsappHref(number, siteConfig.whatsapp.message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      data-track="whatsapp"
      className={cn(
        "fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-(--z-floating) grid size-14 place-items-center rounded-full bg-primary text-on-primary shadow-lg transition-[opacity,transform,background-color] duration-(--duration-base) ease-out hover:bg-primary-hover md:right-6 md:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        onFormPage && "max-lg:hidden",
      )}
    >
      <MessageCircle aria-hidden="true" className="size-6" strokeWidth={1.75} />
    </a>
  );
}
