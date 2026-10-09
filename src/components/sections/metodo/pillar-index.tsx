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
 * Índice dos seis pilares. Desktop: coluna fixa vertical; mobile: faixa horizontal fixa.
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
      className="sticky top-(--header-height) z-(--z-sticky) -mx-(--space-gutter) border-b border-border bg-background/95 px-(--space-gutter) py-2 backdrop-blur-sm lg:top-28 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
    >
      <ol className="grid grid-cols-6 gap-1 lg:grid-cols-1 lg:gap-0">
        {items.map((item) => {
          const current = item.slug === active;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-center rounded-md font-display text-h4 font-extrabold transition-colors duration-(--duration-fast) lg:justify-start lg:gap-4 lg:rounded-none lg:border-l-2 lg:py-2 lg:pl-5 lg:text-h2",
                  current
                    ? "bg-primary text-on-primary lg:border-primary lg:bg-transparent lg:text-primary"
                    : "text-muted hover:text-primary lg:border-border",
                )}
              >
                <span aria-hidden="true">{item.letter}</span>
                <span className="sr-only lg:not-sr-only lg:font-body lg:text-small lg:font-semibold">
                  {item.name}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
