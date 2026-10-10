import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** ids de ajuda e erro ligados ao campo por aria-describedby. */
export function fieldA11y(id: string, { hint, error }: { hint?: boolean; error?: string }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy || undefined,
  };
}

const control =
  "w-full rounded-md border-[1.5px] border-border-strong bg-surface-raised px-3.5 text-body text-text transition-[border-color,box-shadow] duration-(--duration-instant) placeholder:text-muted/70 focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] focus:outline-none aria-invalid:border-error disabled:bg-surface disabled:text-muted";

export const inputClass = cn(control, "h-(--input-height)");
export const textareaClass = cn(control, "min-h-30 py-3 leading-relaxed");
export const selectClass = cn(
  control,
  "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2352606b%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] h-(--input-height) cursor-pointer appearance-none bg-[position:right_0.875rem_center] bg-no-repeat pr-11",
);

export function Field({
  id,
  label,
  optional = false,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const t = useTranslations("Forms");
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-small font-semibold">
        {label}
        {optional && <span className="font-normal text-muted"> {t("optional")}</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-small text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-small text-error">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Grupo de campos com legenda (fieldset + legend). */
export function FieldGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t border-border pt-8 first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="contents text-h4 font-bold">{legend}</legend>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </fieldset>
  );
}

/** Dois campos curtos lado a lado a partir de 768 px. */
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}
