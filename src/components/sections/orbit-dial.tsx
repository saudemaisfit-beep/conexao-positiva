"use client";

import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { centroPillars } from "@/content/centro";
import { cn } from "@/lib/cn";
import { CentroOrbitArt } from "./centro-orbit-art";

/** Ângulo entre pilares no anel (6 pilares → 60°). */
export const ORBIT_STEP = 360 / centroPillars.length;

/**
 * Pilar ativo e rotação acumulada do anel: muda sempre pelo caminho mais curto
 * (de O para C roda um passo, não cinco).
 */
export function useOrbit() {
  const count = centroPillars.length;
  const [active, setActive] = useState(0);
  const [turns, setTurns] = useState(0);
  const goTo = (index: number) => {
    const next = ((index % count) + count) % count;
    let delta = next - active;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    if (delta === 0) return;
    setTurns((value) => value + delta);
    setActive(next);
  };
  return { active, turns, goTo, count };
}

/** Posição de um pilar no anel e aparência do nó (ativo ou não). */
export function orbitNode(index: number, selected: boolean) {
  return {
    style: { "--orbit-angle": `${index * ORBIT_STEP}deg` } as CSSProperties,
    className: cn(
      "orbit-node absolute top-1/2 left-1/2 grid size-[18%] cursor-pointer place-items-center rounded-full border font-display text-[clamp(1.5rem,5.5vw,2.5rem)] leading-none font-extrabold",
      selected
        ? "scale-115 border-glow bg-glow text-on-glow shadow-[0_0_40px_-4px_var(--color-glow)]"
        : "border-white/20 bg-inverse text-on-inverse-muted hover:border-glow hover:text-on-inverse",
    ),
  };
}

/**
 * Mostrador da órbita: anel tracejado, raios até cada pilar e núcleo com a animação do pilar
 * ativo. Os nós (botões ou links) vêm em `children`, já posicionados com `orbitNode`.
 * O contentor pai deve ter a classe `centro-orbit` e `data-animate` (estilos em globals.css).
 */
export function OrbitDial({
  active,
  turns,
  breatheIn,
  breatheOut,
  nodesProps,
  className,
  children,
}: {
  active: number;
  turns: number;
  breatheIn: string;
  breatheOut: string;
  nodesProps?: HTMLAttributes<HTMLDivElement>;
  className?: string;
  children: ReactNode;
}) {
  const pillar = centroPillars[active] ?? centroPillars[0]!;
  const rotation = { "--orbit-turn": `${-turns * ORBIT_STEP}deg` } as CSSProperties;

  return (
    <div
      className={cn("relative mx-auto aspect-square w-full max-w-[min(30rem,100%)]", className)}
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
          const angle = ((index * ORBIT_STEP - 90) * Math.PI) / 180;
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
            <CentroOrbitArt slug={pillar.slug} breatheIn={breatheIn} breatheOut={breatheOut} />
          </div>
        </div>
      </div>

      {/* Pilares em anel */}
      <div {...nodesProps} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
