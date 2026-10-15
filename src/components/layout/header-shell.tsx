"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Header fixo azul-noite. Depois de algum scroll ganha uma linha inferior e sombra,
 * mantendo um fundo opaco e reduzindo a altura.
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
      className="group/header sticky top-0 z-(--z-header) border-b border-transparent bg-inverse text-on-inverse transition-[box-shadow,border-color] duration-(--duration-fast) data-[scrolled=true]:border-white/10 data-[scrolled=true]:shadow-header"
    >
      {children}
    </header>
  );
}
