"use client";

import { useTranslations } from "next-intl";
import { submitCheckout } from "@/lib/actions/checkout";
import { checkoutSchema } from "@/lib/forms/schemas";
import { ConsentField } from "./consent-field";
import { Field, FieldRow, fieldA11y, inputClass } from "./field";
import { ErrorSummary, SubmitButton } from "./form-feedback";
import { Honeypot } from "./honeypot";
import { ServerError } from "./server-error";
import { Turnstile } from "./turnstile";
import { useSiteForm } from "./use-site-form";

/** Dados de quem compra (ou pede o guia). O preço é decidido no servidor, a partir da oferta. */
export function CheckoutForm({ offerId, free }: { offerId: string; free: boolean }) {
  const t = useTranslations("Forms");
  const tc = useTranslations("Checkout");
  const { form, onSubmit, summary, summaryRef, serverError, errorFor, pending, turnstile } =
    useSiteForm({
      schema: checkoutSchema,
      action: submitCheckout,
      draftKey: "cp-rascunho-compra",
      analyticsEvent: {
        name: free ? "generate_lead" : "begin_checkout",
        params: { form: "compra", offer: offerId },
      },
      defaultValues: {
        offerId,
        name: "",
        email: "",
        phone: "+244 ",
        consent: false as unknown as true,
        website: "",
        startedAt: 0,
        turnstileToken: "",
      },
    });
  const { register } = form;
  const labels: Record<string, string> = {
    name: t("fields.name"),
    email: t("fields.email"),
    phone: t("fields.phone"),
    consent: t("fields.consent"),
  };

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-6">
      {summary.length > 0 && <ErrorSummary ref={summaryRef} errors={summary} labels={labels} />}
      {serverError && <ServerError error={serverError} />}
      <input type="hidden" {...register("offerId")} />

      <Field id="name" label={labels.name!} error={errorFor("name")}>
        <input
          type="text"
          autoComplete="name"
          className={inputClass}
          {...fieldA11y("name", { error: errorFor("name") })}
          {...register("name")}
        />
      </Field>
      <FieldRow>
        <Field id="email" label={labels.email!} error={errorFor("email")}>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            className={inputClass}
            {...fieldA11y("email", { error: errorFor("email") })}
            {...register("email")}
          />
        </Field>
        <Field id="phone" label={labels.phone!} hint={t("phoneHint")} error={errorFor("phone")}>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={inputClass}
            {...fieldA11y("phone", { hint: true, error: errorFor("phone") })}
            {...register("phone")}
          />
        </Field>
      </FieldRow>
      <ConsentField registration={register("consent")} error={errorFor("consent")} />
      <Honeypot registration={register("website")} />
      <Turnstile {...turnstile} label={t("turnstile")} />
      <p className="text-small text-muted">{tc("secure")}</p>
      <div>
        <SubmitButton pending={pending} label={free ? tc("freeSubmit") : tc("submit")} />
      </div>
    </form>
  );
}
