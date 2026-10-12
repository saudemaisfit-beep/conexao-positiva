"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Header fixo no topo, azul-noite (contínuo com os heros escuros). Depois de algum scroll fica
 * translúcido com desfoque, linha inferior e sombra, e reduz a altura.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      data-surface="inverse"
      className="group/header sticky top-0 z-(--z-header) border-b border-transparent bg-inverse text-on-inverse transition-[box-shadow,border-color,background-color] duration-(--duration-fast) data-[scrolled=true]:border-white/10 data-[scrolled=true]:bg-inverse/85 data-[scrolled=true]:shadow-header data-[scrolled=true]:backdrop-blur-lg"
    >
      {children}
    </header>
  );
}
