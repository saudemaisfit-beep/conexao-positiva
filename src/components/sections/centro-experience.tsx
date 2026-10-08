"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { centroPillars } from "@/content/centro";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";

/**
 * Secção interativa do Método C.E.N.T.R.O.
 * ≥ 768 px: as seis letras são separadores (ARIA Tabs) — clique, hover com atraso, setas, Home/End.
 * < 768 px: acordeão vertical em que as letras empilhadas formam "CENTRO".
 */
export function CentroExperience() {
  const t = useTranslations("Home.centro");
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef<number | undefined>(undefined);
  const baseId = useId();
  const pillar = centroPillars[active] ?? centroPillars[0]!;
  const Icon = pillar.icon;

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = centroPillars.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = keys[event.key];
    if (next !== undefined) {
      event.preventDefault();
      select(next, true);
    }
  };

  return (
    <>
      {/* Desktop e tablet */}
      <div className="hidden md:block">
        <div
          role="tablist"
          aria-label={t("tablist")}
          className="grid grid-cols-6 gap-2"
          onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
        >
          {centroPillars.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.slug}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => select(index), 150);
                }}
                className={cn(
                  "group flex cursor-pointer flex-col items-start gap-3 border-b-2 pt-2 pb-4 text-left transition-colors duration-(--duration-fast)",
                  selected ? "border-accent-on-inverse" : "border-white/15",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "font-display text-[clamp(3rem,7vw,6.5rem)] leading-none font-extrabold tracking-[-0.03em] transition-opacity duration-(--duration-fast)",
                    selected ? "opacity-100" : "opacity-35 group-hover:opacity-70",
                  )}
                >
                  {item.letter}
                </span>
                <span
                  className={cn(
                    "text-small font-semibold",
                    selected ? "text-on-inverse" : "text-on-inverse-muted",
                  )}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div
          key={pillar.slug}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="grid animate-rise-in grid-cols-[auto_minmax(0,1fr)] gap-6 pt-10"
        >
          <span className="grid size-16 place-items-center rounded-full bg-white/10 text-accent-on-inverse">
            <Icon aria-hidden="true" className="size-7" strokeWidth={1.75} />
          </span>
          <div className="flex max-w-2xl flex-col gap-3">
            <h3 className="text-h3 font-bold">{pillar.name}</h3>
            <p className="text-lead text-on-inverse-muted">{pillar.description}</p>
            <TextLink href={`/metodo-centro#${pillar.slug}`} className="self-start">
              {t("more", { pillar: pillar.name })}
            </TextLink>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <ul className="flex flex-col md:hidden">
        {centroPillars.map((item, index) => {
          const open = openMobile === index;
          const ItemIcon = item.icon;
          return (
            <li key={item.slug} className="border-b border-white/15">
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${baseId}-m-${index}`}
                  onClick={() => setOpenMobile(open ? null : index)}
                  className="flex min-h-16 w-full items-center gap-4 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "w-10 font-display text-[2.5rem] leading-none font-extrabold transition-opacity",
                      open ? "opacity-100" : "opacity-60",
                    )}
                  >
                    {item.letter}
                  </span>
                  <span className="flex-1 text-h4 font-bold">{item.name}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-5 transition-transform duration-(--duration-fast)",
                      open && "rotate-180",
                    )}
                  />
                </button>
              </h3>
              <div
                id={`${baseId}-m-${index}`}
                hidden={!open}
                className="animate-rise-in pb-5 pl-14"
              >
                <ItemIcon
                  aria-hidden="true"
                  className="mb-3 size-6 text-accent-on-inverse"
                  strokeWidth={1.75}
                />
                <p className="text-on-inverse-muted">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
