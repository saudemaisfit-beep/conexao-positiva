"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Header fixo no topo que ganha fundo, sombra e menor altura depois de algum scroll. */
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
      className="group/header sticky top-0 z-(--z-header) border-b border-transparent bg-background transition-[box-shadow,border-color] duration-(--duration-fast) data-[scrolled=true]:border-border data-[scrolled=true]:shadow-header"
    >
      {children}
    </header>
  );
}
