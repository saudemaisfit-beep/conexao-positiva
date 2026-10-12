"use client";

import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { centroPillars } from "@/content/centro";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { CentroOrbitArt } from "./centro-orbit-art";

const STEP = 360 / centroPillars.length;
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
  const [active, setActive] = useState(0);
  // Rotação acumulada (em passos): roda sempre pelo caminho mais curto.
  const [turns, setTurns] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = centroPillars.length;
  const pillar = centroPillars[active] ?? centroPillars[0]!;

  const goTo = (index: number) => {
    const next = ((index % count) + count) % count;
    let delta = next - active;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setTurns((value) => value + delta);
    setActive(next);
  };

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

  const rotation = { "--orbit-turn": `${-turns * STEP}deg` } as CSSProperties;

  return (
    <div
      ref={rootRef}
      data-animate={visible && !reduceMotion ? "true" : "false"}
      className="centro-orbit grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
    >
      {/* Órbita */}
      <div
        className="relative mx-auto aspect-square w-full max-w-[min(30rem,100%)]"
        style={rotation}
      >
        {/* Anel tracejado que gira devagar */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="orbit-ring absolute inset-0 size-full text-accent-on-inverse"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeDasharray="1 2.2"
            opacity="0.6"
          />
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.2"
            opacity="0.25"
          />
        </svg>

        {/* Raios do centro até cada pilar (giram com a órbita) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="orbit-spokes absolute inset-0 size-full"
        >
          {centroPillars.map((item, index) => {
            const angle = ((index * STEP - 90) * Math.PI) / 180;
            return (
              <line
                key={item.slug}
                x1={50 + Math.cos(angle) * 17}
                y1={50 + Math.sin(angle) * 17}
                x2={50 + Math.cos(angle) * 34}
                y2={50 + Math.sin(angle) * 34}
                stroke="currentColor"
                strokeWidth={index === active ? 0.6 : 0.3}
                strokeDasharray={index === active ? "1.4 1.4" : undefined}
                className={cn(
                  "transition-[stroke-width,color] duration-(--duration-base)",
                  index === active ? "orbit-spoke-active text-glow" : "text-white/20",
                )}
              />
            );
          })}
        </svg>

        {/* Núcleo: animação do pilar ativo */}
        <div className="absolute inset-[26%] grid place-items-center rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-glow)_35%,transparent)_0%,transparent_70%)]">
          <div className="orbit-core grid size-full place-items-center rounded-full border border-white/15 bg-white/5 text-glow backdrop-blur-sm">
            <div key={pillar.slug} className="w-[74%] animate-rise-in">
              <CentroOrbitArt
                slug={pillar.slug}
                breatheIn={t("breatheIn")}
                breatheOut={t("breatheOut")}
              />
            </div>
          </div>
        </div>

        {/* Pilares (separadores) em anel */}
        <div role="tablist" aria-label={t("tablist")} className="orbit-ring-tabs absolute inset-0">
          {centroPillars.map((item, index) => {
            const selected = index === active;
            const angle = index * STEP;
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
                style={{ "--orbit-angle": `${angle}deg` } as CSSProperties}
                className={cn(
                  "orbit-node absolute top-1/2 left-1/2 grid size-[18%] cursor-pointer place-items-center rounded-full border font-display text-[clamp(1.5rem,5.5vw,2.5rem)] leading-none font-extrabold",
                  selected
                    ? "scale-115 border-glow bg-glow text-on-glow shadow-[0_0_40px_-4px_var(--color-glow)]"
                    : "border-white/20 bg-inverse text-on-inverse-muted hover:border-glow hover:text-on-inverse",
                )}
              >
                <span aria-hidden="true">{item.letter}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Texto do pilar ativo */}
      <div className="flex flex-col gap-6">
        <div
          key={pillar.slug}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="flex animate-rise-in flex-col gap-4"
        >
          <p className="font-display text-small font-bold tracking-[0.2em] text-accent-on-inverse uppercase tabular-nums">
            {t("position", { current: active + 1, total: count })}
          </p>
          <h3 className="flex items-baseline gap-4 font-display text-h1 font-extrabold">
            <span aria-hidden="true" className="text-glow-gradient text-[1.6em] leading-none">
              {pillar.letter}
            </span>
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
