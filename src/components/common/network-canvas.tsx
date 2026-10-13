"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Rede de pontos ligados que deriva devagar no fundo dos heros escuros (a "conexão").
 * Decorativa e leve: só começa quando a página acabou de carregar e o browser está livre, anima
 * a 30 imagens/s apenas quando está visível e com o separador ativo, e fica parada (desenho
 * estático) com movimento reduzido e em telemóveis.
 */
export function NetworkCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Parada (um só desenho) com movimento reduzido e em ecrãs pequenos: poupa bateria e
    // processador em telemóveis.
    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 47.99rem)").matches;
    const styles = getComputedStyle(canvas);
    const lineColor = styles.getPropertyValue("--network-line").trim() || "10 160 224";
    const dotColor = styles.getPropertyValue("--network-dot").trim() || "179 225 245";
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const linkDistance = 140;

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let visible = true;
    let points: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(Math.min(60, (width * height) / 18000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.8,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i]!;
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
        for (let j = i + 1; j < points.length; j += 1) {
          const q = points[j]!;
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < linkDistance) {
            context.strokeStyle = `rgb(${lineColor} / ${0.35 * (1 - distance / linkDistance)})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(p.x, p.y);
            context.lineTo(q.x, q.y);
            context.stroke();
          }
        }
        context.fillStyle = `rgb(${dotColor} / 0.85)`;
        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fill();
      }
    };

    const loop = (time: number) => {
      if (time - last >= 33) {
        last = time;
        draw();
      }
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!reduceMotion && !frame && visible && !document.hidden)
        frame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      start();
    });
    const onResize = () => {
      resize();
      draw();
    };
    const onVisibility = () => start();

    // Depois do carregamento e com o browser livre: não compete com o conteúdo principal.
    let idle = 0;
    const begin = () => {
      const run = () => {
        resize();
        draw();
        observer.observe(canvas);
        start();
      };
      idle =
        "requestIdleCallback" in window && typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(run, { timeout: 3000 })
          : window.setTimeout(run, 1500);
    };
    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      window.removeEventListener("load", begin);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 size-full opacity-60", className)}
    />
  );
}
