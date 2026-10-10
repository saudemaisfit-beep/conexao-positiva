import { CircleAlert, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode, Ref } from "react";
import { Button } from "@/components/ui/button";

/** Resumo de erros no topo do formulário, com ligações para cada campo. */
export function ErrorSummary({
  errors,
  labels,
  ref,
}: {
  errors: { field: string; message: string }[];
  labels: Record<string, string>;
  ref?: Ref<HTMLDivElement>;
}) {
  const t = useTranslations("Forms");
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby="error-summary-title"
      className="flex flex-col gap-3 rounded-md border-l-3 border-error bg-error-soft p-5 outline-none focus-visible:outline-3 focus-visible:outline-focus"
    >
      <p id="error-summary-title" className="flex items-center gap-2 font-semibold">
        <CircleAlert aria-hidden="true" className="size-5 text-error" />
        {t("summary", { count: errors.length })}
      </p>
      <ul className="flex flex-col gap-1 pl-7 text-small">
        {errors.map((error) => (
          <li key={error.field}>
            <a
              href={`#${error.field}`}
              className="underline underline-offset-2 hover:text-error"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(error.field)?.focus();
              }}
            >
              {labels[error.field] ?? error.field}: {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Aviso de erro do servidor (os dados do formulário mantêm-se). */
export function FormAlert({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-md border-l-3 border-warning bg-warning-soft p-5"
    >
      <p className="flex items-center gap-2 font-semibold">
        <CircleAlert aria-hidden="true" className="size-5 text-warning" />
        {title}
      </p>
      <div className="pl-7 text-small">{children}</div>
    </div>
  );
}

export function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  const t = useTranslations("Forms");
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full md:w-auto">
      {pending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
      {pending ? t("sending") : label}
    </Button>
  );
}
