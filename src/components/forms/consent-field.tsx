import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Link } from "@/i18n/navigation";
import { fieldA11y } from "./field";

/** Consentimento de privacidade: desmarcado por defeito e obrigatório. */
export function ConsentField({
  registration,
  error,
}: {
  registration: UseFormRegisterReturn;
  error?: string;
}) {
  const t = useTranslations("Forms");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          {...fieldA11y("consent", { error })}
          {...registration}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-xs accent-primary aria-invalid:outline-2 aria-invalid:outline-error"
        />
        <label htmlFor="consent" className="cursor-pointer text-small">
          {t.rich("consent", {
            link: (chunks) => (
              <Link
                href="/politica-de-privacidade"
                className="font-semibold text-primary underline underline-offset-2"
              >
                {chunks}
              </Link>
            ),
          })}
        </label>
      </div>
      {error && (
        <p id="consent-error" className="flex items-start gap-1.5 pl-8 text-small text-error">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
