"use client";

import { useTranslations } from "next-intl";
import { submitRegistration } from "@/lib/actions/forms";
import { registrationSchema } from "@/lib/forms/schemas";
import { ConsentField } from "./consent-field";
import { Field, FieldRow, fieldA11y, inputClass, textareaClass } from "./field";
import { ErrorSummary, SubmitButton } from "./form-feedback";
import { Honeypot } from "./honeypot";
import { Turnstile } from "./turnstile";
import { ServerError } from "./server-error";
import { useSiteForm } from "./use-site-form";

type TextField = "firstName" | "lastName" | "company" | "role";

/** Inscrição num evento (ou lista de espera). O evento é fixo e confirmado no servidor. */
export function RegistrationForm({
  eventSlug,
  waitlist,
}: {
  eventSlug: string;
  waitlist: boolean;
}) {
  const t = useTranslations("Forms");
  const tr = useTranslations("Registration");
  const { form, onSubmit, summary, summaryRef, serverError, errorFor, pending, turnstile } =
    useSiteForm({
      schema: registrationSchema,
      action: submitRegistration,
      draftKey: "cp-rascunho-inscricao",
      analyticsEvent: { name: "sign_up", params: { form: "inscricao", event: eventSlug } },
      defaultValues: {
        eventSlug,
        firstName: "",
        lastName: "",
        email: "",
        phone: "+244 ",
        company: "",
        role: "",
        notes: "",
        consent: false as unknown as true,
        website: "",
        startedAt: 0,
        turnstileToken: "",
      },
    });
  const { register } = form;
  const labels: Record<string, string> = {
    firstName: t("fields.firstName"),
    lastName: t("fields.lastName"),
    email: t("fields.email"),
    phone: t("fields.phone"),
    company: t("fields.company"),
    role: t("fields.role"),
    notes: t("fields.notes"),
    consent: t("fields.consent"),
  };
  const text = (name: TextField, autoComplete: string, optional = false) => (
    <Field id={name} label={labels[name]!} optional={optional} error={errorFor(name)}>
      <input
        type="text"
        autoComplete={autoComplete}
        className={inputClass}
        {...fieldA11y(name, { error: errorFor(name) })}
        {...register(name)}
      />
    </Field>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-6">
      {summary.length > 0 && <ErrorSummary ref={summaryRef} errors={summary} labels={labels} />}
      {serverError && <ServerError error={serverError} />}
      <input type="hidden" {...register("eventSlug")} />

      <FieldRow>
        {text("firstName", "given-name")}
        {text("lastName", "family-name")}
      </FieldRow>
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
      <FieldRow>
        {text("company", "organization", true)}
        {text("role", "organization-title", true)}
      </FieldRow>
      <Field
        id="notes"
        label={labels.notes!}
        optional
        hint={t("fields.notesHint")}
        error={errorFor("notes")}
      >
        <textarea
          rows={3}
          className={textareaClass}
          {...fieldA11y("notes", { hint: true, error: errorFor("notes") })}
          {...register("notes")}
        />
      </Field>
      <ConsentField registration={register("consent")} error={errorFor("consent")} />
      <Honeypot registration={register("website")} />
      <Turnstile {...turnstile} label={t("turnstile")} />
      <div>
        <SubmitButton pending={pending} label={waitlist ? tr("waitlistSubmit") : tr("submit")} />
      </div>
    </form>
  );
}
