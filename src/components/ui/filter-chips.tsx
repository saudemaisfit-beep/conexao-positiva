"use client";

import { cn } from "@/lib/cn";
import { chipClass } from "./chip";

interface FilterChipsProps<T extends string> {
  label: string;
  options: { value: T | null; label: string }[];
  value: T | null;
  onChange: (value: T | null) => void;
}

/** Grupo de filtros em "chips" (botões com aria-pressed). No mobile faz scroll horizontal. */
export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterChipsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-(--space-gutter) flex gap-2 overflow-x-auto px-(--space-gutter) pb-1 md:mx-0 md:flex-wrap md:px-0"
    >
      {options.map((option) => (
        <button
          key={option.value ?? "todos"}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            chipClass,
            value === option.value
              ? "border-primary bg-primary text-on-primary"
              : "border-border-strong bg-surface-raised text-text hover:border-primary hover:text-primary",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
