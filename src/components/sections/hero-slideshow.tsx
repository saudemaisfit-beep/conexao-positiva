"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { homeImages } from "@/content/provisional-images";
import { cn } from "@/lib/cn";

const slides = [
  {
    image: homeImages.slides[0]!,
    label: "Conexão entre pessoas",
    position: "60% center",
  },
  { image: homeImages.slides[1]!, label: "Equipas em movimento", position: "center center" },
  {
    image: homeImages.slides[2]!,
    label: "Espaço para o bem-estar",
    position: "center center",
  },
];
const interval = 8_000;
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const reducedSnapshot = () => window.matchMedia(motionQuery).matches;
const serverSnapshot = () => true;
const control =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/50 bg-black/35 text-white transition-colors hover:bg-white/20";

/** Fotografia de fundo em dissolvência; a mensagem e as ações ficam estáveis. */
export function HeroSlideshow({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const reduced = useSyncExternalStore(subscribeMotion, reducedSnapshot, serverSnapshot);
  const section = useRef<HTMLElement>(null);
  const running = playing && !reduced && !hovered && inView;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setInView(Boolean(entry?.isIntersecting)),
    );
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((value) => (value + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [running, active]);

  function select(index: number) {
    setPlaying(false);
    setActive((index + slides.length) % slides.length);
  }

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      aria-roledescription="carrossel"
      data-surface="inverse"
      className="hero-slideshow relative isolate overflow-hidden bg-inverse text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!(event.target instanceof Element) || !event.target.closest("[data-rotation-control]"))
          setPlaying(false);
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        {slides.map((slide, index) => (
          <div
            key={slide.label}
            data-active={active === index}
            className="hero-slide absolute inset-0 opacity-0 data-[active=true]:opacity-100"
          >
            <Image
              src={slide.image.src}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              className="object-cover"
              style={{ objectPosition: slide.position }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="hero-photo-shade absolute inset-0 -z-10" />
      {children}
      <div className="sm:flex-row sm:items-center sm:justify-between relative container-site flex flex-col gap-5 border-t border-white/25 py-5">
        <div className="flex items-center gap-4">
          <span
            aria-live={running ? "off" : "polite"}
            aria-atomic="true"
            className="text-small font-medium text-white"
          >
            <span className="mr-3 tabular-nums">
              0{active + 1} / 0{slides.length}
            </span>
            {slides[active]!.label}
          </span>
        </div>
        <div
          role="group"
          aria-label="Controlos das fotografias"
          className="flex flex-wrap items-center gap-2"
        >
          <div className="max-sm:w-full sm:mr-3 mr-auto flex gap-1">
            {slides.map((slide, index) => (
              <button
                key={slide.label}
                type="button"
                aria-label={`Mostrar fotografia ${index + 1}: ${slide.label}`}
                aria-pressed={active === index}
                onClick={() => select(index)}
                className="group grid size-11 cursor-pointer place-items-center"
              >
                <span
                  className={cn(
                    "h-1 w-8 rounded-full transition-colors",
                    active === index ? "bg-white" : "bg-white/40 group-hover:bg-white/75",
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Fotografia anterior"
            onClick={() => select(active - 1)}
            className={control}
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Fotografia seguinte"
            onClick={() => select(active + 1)}
            className={control}
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
          {!reduced && (
            <button
              type="button"
              data-rotation-control
              aria-label={playing ? "Pausar slideshow" : "Reproduzir slideshow"}
              onClick={() => setPlaying((value) => !value)}
              className={control}
            >
              {playing ? (
                <Pause aria-hidden="true" className="size-4" />
              ) : (
                <Play aria-hidden="true" className="size-4" />
              )}
            </button>
          )}
        </div>
      </div>
      <p className="container-site pb-4 text-caption text-white/85">Fotografias ilustrativas</p>
    </section>
  );
}
