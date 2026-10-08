import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const tones = {
  base: "bg-background text-text",
  alt: "bg-surface text-text",
  inverse: "bg-inverse text-on-inverse",
} as const;

export type SectionTone = keyof typeof tones;

export function Section({
  tone = "base",
  className,
  ...props
}: ComponentProps<"section"> & { tone?: SectionTone }) {
  return (
    <section
      data-surface={tone === "inverse" ? "inverse" : undefined}
      className={cn("section-spacing", tones[tone], className)}
      {...props}
    />
  );
}
