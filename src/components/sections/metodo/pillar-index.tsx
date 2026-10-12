"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface IndexItem {
  slug: string;
  letter: string;
  name: string;
}

/**
 * Índice dos seis pilares em faixa horizontal fixa (mobile e tablet; no desktop há a órbita).
 * Marca o pilar visível (IntersectionObserver) com aria-current.
 */
export function PillarIndex({ items }: { items: IndexItem[] }) {
  const t = useTranslations("Metodo.pillars");
  const [active, setActive] = useState(items[0]?.slug ?? "");

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.slug))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={t("indexLabel")}
      className="sticky top-(--header-height) z-(--z-sticky) -mx-(--space-gutter) border-b border-border bg-inverse/95 px-(--space-gutter) py-2 backdrop-blur-sm lg:hidden"
    >
      <ol className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const current = item.slug === active;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-center rounded-md font-display text-h4 font-extrabold transition-colors duration-(--duration-fast)",
                  current ? "bg-glow text-on-glow" : "text-muted hover:text-glow",
                )}
              >
                <span aria-hidden="true">{item.letter}</span>
                <span className="sr-only">{item.name}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
