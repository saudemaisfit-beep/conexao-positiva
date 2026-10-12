"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { centroPillars } from "@/content/centro";
import { OrbitDial, orbitNode, useOrbit } from "../orbit-dial";

/**
 * Órbita fixa (desktop) da página do Método: roda até ao pilar visível enquanto se desce a
 * página e o núcleo mostra a animação desse pilar. As letras são links para as âncoras
 * (#consciencia…) e o pilar visível fica marcado com aria-current. Sem movimento com
 * `prefers-reduced-motion` (estilos em globals.css).
 */
export function PillarsOrbit() {
  const t = useTranslations("Metodo.pillars");
  const tc = useTranslations("Home.centro");
  const { active, turns, goTo, count } = useOrbit();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const pillar = centroPillars[active] ?? centroPillars[0]!;

  // Scrollspy: o artigo que atravessa a faixa central do ecrã é o pilar ativo.
  useEffect(() => {
    const elements = centroPillars
      .map((item) => document.getElementById(item.slug))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const index = centroPillars.findIndex((item) => item.slug === visible[0]?.target.id);
        if (index >= 0) setVisibleIndex(index);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    goTo(visibleIndex);
    // goTo depende de `active`; só reage ao pilar visível.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIndex]);

  return (
    <nav
      aria-label={t("indexLabel")}
      data-animate="true"
      className="centro-orbit flex flex-col items-center gap-6"
    >
      <OrbitDial
        active={active}
        turns={turns}
        breatheIn={tc("breatheIn")}
        breatheOut={tc("breatheOut")}
      >
        {centroPillars.map((item, index) => {
          const current = index === active;
          const node = orbitNode(index, current);
          return (
            <a
              key={item.slug}
              href={`#${item.slug}`}
              aria-current={current ? "true" : undefined}
              aria-label={item.name}
              style={node.style}
              className={`${node.className} lg:text-[2rem]`}
            >
              <span aria-hidden="true">{item.letter}</span>
            </a>
          );
        })}
      </OrbitDial>
      <p
        aria-hidden="true"
        className="flex flex-col items-center gap-1 text-center font-display font-bold"
      >
        <span className="text-small tracking-[0.2em] text-accent-on-inverse uppercase tabular-nums">
          {tc("position", { current: active + 1, total: count })}
        </span>
        <span key={pillar.slug} className="animate-rise-in text-h3">
          {pillar.name}
        </span>
      </p>
    </nav>
  );
}
