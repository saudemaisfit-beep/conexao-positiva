"use client";

import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { centroPillars } from "@/content/centro";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { OrbitDial, orbitNode, useOrbit } from "./orbit-dial";

const AUTOPLAY_MS = 7000;

/**
 * Órbita do Método C.E.N.T.R.O.: os seis pilares giram em volta de um centro (o "CENTRO").
 * - As letras são separadores (ARIA Tabs): clique, setas, Home/End. O pilar escolhido roda
 *   até ao topo e o núcleo mostra a animação desse pilar (ex.: respiração guiada).
 * - Rotação automática a cada 7 s só com a secção visível, com botão de pausa (WCAG 2.2.2);
 *   para de vez quando a pessoa escolhe um pilar. Sem rotação com movimento reduzido.
 */
export function CentroOrbit() {
  const t = useTranslations("Home.centro");
  const { active, turns, goTo, count } = useOrbit();
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const pillar = centroPillars[active] ?? centroPillars[0]!;

  // Visibilidade da secção e preferência de movimento.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      {
        threshold: 0.35,
      },
    );
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      query.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  const autoplay = playing && visible && !reduceMotion;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => goTo(active + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
    // goTo depende de `active`, já na lista.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, active]);

  const choose = (index: number, focus = false) => {
    setPlaying(false);
    goTo(index);
    if (focus) tabRefs.current[((index % count) + count) % count]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: count - 1,
    };
    const next = keys[event.key];
    if (next !== undefined) {
      event.preventDefault();
      choose(next, true);
    }
  };

  return (
    <div
      ref={rootRef}
      onFocusCapture={(event) => {
        if (!(event.target instanceof Element) || !event.target.closest("[data-rotation-control]"))
          setPlaying(false);
      }}
      data-animate={visible && !reduceMotion ? "true" : "false"}
      className="centro-orbit grid grid-cols-1 items-center gap-10 overflow-x-clip lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
    >
      <OrbitDial
        active={active}
        turns={turns}
        breatheIn={t("breatheIn")}
        breatheOut={t("breatheOut")}
        nodesProps={{ role: "tablist", "aria-label": t("tablist") }}
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
              aria-label={item.name}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              {...orbitNode(index, selected)}
            >
              <span aria-hidden="true">{item.letter}</span>
            </button>
          );
        })}
      </OrbitDial>

      {/* Texto do pilar ativo */}
      <div className="flex flex-col gap-6">
        <div
          key={pillar.slug}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="flex min-h-64 flex-col gap-4 md:min-h-60"
        >
          <p className="font-display text-small font-bold tracking-[0.2em] text-accent-on-inverse uppercase tabular-nums">
            {t("position", { current: active + 1, total: count })}
          </p>
          <h3 className="font-display text-h2 leading-tight font-bold tracking-[-0.025em]">
            {pillar.name}
          </h3>
          <p className="max-w-xl text-lead text-on-inverse-muted">{pillar.description}</p>
          <TextLink href={`/metodo-centro#${pillar.slug}`} className="self-start">
            {t("more", { pillar: pillar.name })}
          </TextLink>
        </div>

        {/* Progresso e pausa */}
        <div className="flex items-center gap-4">
          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              data-rotation-control
              aria-label={playing ? t("pause") : t("play")}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 text-on-inverse transition-colors hover:bg-white/10"
            >
              {playing ? (
                <Pause aria-hidden="true" className="size-4" />
              ) : (
                <Play aria-hidden="true" className="size-4" />
              )}
            </button>
          )}
          <ol className="flex flex-1 gap-2" aria-hidden="true">
            {centroPillars.map((item, index) => (
              <li key={item.slug} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                <span
                  key={index === active ? `${item.slug}-${turns}` : item.slug}
                  className={cn(
                    "block h-full origin-left rounded-full bg-glow",
                    index < active && "scale-x-100",
                    index > active && "scale-x-0",
                    index === active && (autoplay ? "orbit-progress" : "scale-x-100"),
                  )}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
