"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav, services } from "@/config/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { arrowClassName } from "@/components/ui/button";
import { NavLink, isActivePath } from "./nav-link";

const linkClass =
  "relative rounded-sm px-2.5 py-2 text-small xl:px-3 font-medium text-muted transition-colors duration-(--duration-instant) hover:text-text " +
  "after:absolute after:inset-x-2.5 xl:after:inset-x-3 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-glow after:transition-transform after:duration-(--duration-fast) " +
  "hover:after:scale-x-100 data-[active=true]:after:scale-x-100 data-[active=true]:text-text";

export function DesktopNav() {
  const t = useTranslations("Navigation");
  return (
    <nav aria-label={t("main")} className="ml-auto hidden items-center gap-0.5 lg:flex">
      {mainNav.map((item) =>
        item.key === "solutions" ? (
          <SolutionsMenu key={item.key} href={item.href} label={t(item.key)} />
        ) : (
          <NavLink key={item.key} href={item.href} className={linkClass}>
            {t(item.key)}
          </NavLink>
        ),
      )}
    </nav>
  );
}

function SolutionsMenu({ href, label }: { href: string; label: string }) {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  // Fecha ao mudar de página (ajuste de estado durante a renderização, sem efeito).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const scheduleOpen = (pointerType: string) => {
    if (pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(true), 150);
  };
  const scheduleClose = (pointerType: string) => {
    if (pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(false), 200);
  };

  return (
    <div
      ref={rootRef}
      onPointerEnter={(e) => scheduleOpen(e.pointerType)}
      onPointerLeave={(e) => scheduleClose(e.pointerType)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        data-active={isActivePath(pathname, href)}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() =>
              document.getElementById(panelId)?.querySelector<HTMLAnchorElement>("a")?.focus(),
            );
          }
        }}
        className={cn(linkClass, "group/solutions inline-flex items-center gap-1")}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform duration-(--duration-fast) group-aria-expanded/solutions:rotate-180"
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        data-surface="light"
        className="absolute inset-x-0 top-full animate-panel-in border-y border-border bg-surface-raised text-text shadow-lg"
      >
        <div className="container-site grid grid-cols-[minmax(0,1fr)_16rem] gap-10 py-8">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <li key={service.slug}>
                  <Link
                    href={`${href}/${service.slug}`}
                    className="group flex items-start gap-3 rounded-md p-3 transition-colors duration-(--duration-instant) hover:bg-primary-soft"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition-colors group-hover:bg-surface-raised">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-small font-semibold text-text">{service.name}</span>
                      <span className="text-small text-muted">{service.summary}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col justify-between gap-6 rounded-lg bg-primary-soft p-6">
            <p className="font-display text-h4 font-bold text-primary-strong">
              {t("solutionsPromo")}
            </p>
            <Link
              href={href}
              className="group inline-flex items-center gap-2 text-small font-semibold text-primary"
            >
              {t("allSolutions")}
              <ArrowRight aria-hidden="true" className={cn("size-4", arrowClassName)} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
