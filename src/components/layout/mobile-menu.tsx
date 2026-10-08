"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { mainNav, proposalHref, services } from "@/config/navigation";
import { siteConfig, whatsappHref } from "@/config/site";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { cn } from "@/lib/cn";
import { isActivePath } from "./nav-link";

const bigLink =
  "flex min-h-12 w-full items-center justify-between py-2 font-display text-h3 font-bold tracking-[-0.015em] text-text data-[active=true]:text-primary";

export function MobileMenu() {
  const t = useTranslations("Navigation");
  const tc = useTranslations("Common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsId = useId();
  const { phone, email } = siteConfig.contact;
  const whatsapp = siteConfig.whatsapp.number;

  // Fecha ao navegar (ajuste durante a renderização) e quando o ecrã passa a desktop.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = () => query.matches && setOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={t("openMenu")}
        className="grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface-raised text-text lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-(--z-overlay) flex animate-fade-in flex-col overflow-y-auto bg-background pb-[env(safe-area-inset-bottom)]"
        >
          <Dialog.Title className="sr-only">{t("menuTitle")}</Dialog.Title>
          <div className="container-site flex h-16 shrink-0 items-center justify-between border-b border-border">
            <Logo />
            <Dialog.Close
              aria-label={t("closeMenu")}
              className="grid size-11 place-items-center rounded-md border border-border bg-surface-raised text-text"
            >
              <X aria-hidden="true" className="size-5" />
            </Dialog.Close>
          </div>

          <nav aria-label={t("main")} className="container-site flex-1 animate-rise-in py-6">
            <ul className="flex flex-col divide-y divide-border">
              <li>
                <Link href="/" className={bigLink} data-active={pathname === "/"}>
                  {tc("home")}
                </Link>
              </li>
              {mainNav.map((item) =>
                item.key === "solutions" ? (
                  <li key={item.key}>
                    <button
                      type="button"
                      aria-expanded={solutionsOpen}
                      aria-controls={solutionsId}
                      onClick={() => setSolutionsOpen((value) => !value)}
                      data-active={isActivePath(pathname, item.href)}
                      className={cn(bigLink, "group/acc text-left")}
                    >
                      {t(item.key)}
                      <ChevronDown
                        aria-hidden="true"
                        className="size-6 transition-transform duration-(--duration-fast) group-aria-expanded/acc:rotate-180"
                      />
                    </button>
                    <ul id={solutionsId} hidden={!solutionsOpen} className="mb-3 flex flex-col">
                      {services.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`${item.href}/${service.slug}`}
                            className="flex min-h-11 items-center border-l-2 border-border pl-4 text-body text-text hover:border-primary hover:text-primary"
                          >
                            {service.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={item.href}
                          className="flex min-h-11 items-center border-l-2 border-border pl-4 text-body font-semibold text-primary"
                        >
                          {t("allSolutions")}
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={bigLink}
                      data-active={isActivePath(pathname, item.href)}
                      aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-8 flex flex-col gap-4">
              <Link href={proposalHref} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
                {tc("requestProposal")}
              </Link>
              {(phone || email || whatsapp) && (
                <div className="flex flex-col gap-2">
                  <p className="text-small font-semibold text-muted">{t("quickContact")}</p>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-2">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className={buttonVariants({ variant: "secondary", size: "sm" })}
                      >
                        <Phone aria-hidden="true" />
                        {phone}
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className={buttonVariants({ variant: "secondary", size: "sm" })}
                      >
                        <Mail aria-hidden="true" />
                        E-mail
                      </a>
                    )}
                    {whatsapp && (
                      <a
                        href={whatsappHref(whatsapp, siteConfig.whatsapp.message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track="whatsapp"
                        className={buttonVariants({ variant: "secondary", size: "sm" })}
                      >
                        <MessageCircle aria-hidden="true" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
