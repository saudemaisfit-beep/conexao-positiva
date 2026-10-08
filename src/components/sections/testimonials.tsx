"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Testimonial } from "@/content/types";
import { TestimonialPerson } from "@/components/cards/testimonial-person";

/**
 * Layout editorial: um testemunho em destaque + dois secundários.
 * Com mais de três, setas Anterior/Seguinte rodam o conjunto (sem rotação automática).
 */
export function TestimonialsShowcase({ testimonials }: { testimonials: Testimonial[] }) {
  const t = useTranslations("Home.testimonials");
  const [start, setStart] = useState(0);
  const total = testimonials.length;
  const visible = Array.from(
    { length: Math.min(3, total) },
    (_, offset) => testimonials[(start + offset) % total]!,
  );
  const [featured, ...others] = visible;
  if (!featured) return null;

  return (
    <div>
      <div
        aria-live="polite"
        className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16"
      >
        <figure key={`f-${start}`} className="flex animate-rise-in flex-col gap-8">
          <blockquote className="font-display text-h3 leading-snug font-bold tracking-[-0.015em] md:text-h2">
            <p>“{featured.quote}”</p>
          </blockquote>
          <figcaption>
            <TestimonialPerson testimonial={featured} />
          </figcaption>
        </figure>
        {others.length > 0 && (
          <div className="flex flex-col">
            {others.map((item, index) => (
              <figure
                key={`${start}-${index}`}
                className="flex animate-rise-in flex-col gap-4 border-t border-border py-6 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-6"
              >
                <blockquote>
                  <p>“{item.quote}”</p>
                </blockquote>
                <figcaption>
                  <TestimonialPerson testimonial={item} />
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      {total > 3 && (
        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            aria-label={t("previous")}
            onClick={() => setStart((value) => (value - 1 + total) % total)}
            className="grid size-12 place-items-center rounded-full border-[1.5px] border-primary text-primary hover:bg-primary-soft"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label={t("next")}
            onClick={() => setStart((value) => (value + 1) % total)}
            className="grid size-12 place-items-center rounded-full border-[1.5px] border-primary text-primary hover:bg-primary-soft"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
          <span className="text-small text-muted tabular-nums">
            {t("position", { current: start + 1, total })}
          </span>
        </div>
      )}
    </div>
  );
}
