"use client";

import { useTranslations } from "next-intl";
import { submitContact } from "@/lib/actions/forms";
import { contactSubjects } from "@/lib/forms/options";
import { contactSchema } from "@/lib/forms/schemas";
import { ConsentField } from "./consent-field";
import { Field, FieldRow, fieldA11y, inputClass, selectClass, textareaClass } from "./field";
import { ErrorSummary, SubmitButton } from "./form-feedback";
import { Honeypot } from "./honeypot";
import { Turnstile } from "./turnstile";
import { ServerError } from "./server-error";
import { useSiteForm } from "./use-site-form";

export function ContactForm() {
  const t = useTranslations("Forms");
  const tc = useTranslations("Contact");
  const { form, onSubmit, summary, summaryRef, serverError, errorFor, pending, turnstile } =
    useSiteForm({
      schema: contactSchema,
      action: submitContact,
      draftKey: "cp-rascunho-contacto",
      defaultValues: {
        name: "",
        company: "",
        email: "",
        phone: "+244 ",
        subject: undefined,
        message: "",
        consent: false as unknown as true,
        website: "",
        startedAt: 0,
        turnstileToken: "",
      },
    });
  const { register } = form;
  const labels = {
    name: t("fields.name"),
    company: t("fields.company"),
    email: t("fields.email"),
    phone: t("fields.phone"),
    subject: t("fields.subject"),
    message: t("fields.message"),
    consent: t("fields.consent"),
  };

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-6">
      {summary.length > 0 && <ErrorSummary ref={summaryRef} errors={summary} labels={labels} />}
      {serverError && <ServerError error={serverError} />}

      <Field id="name" label={labels.name} error={errorFor("name")}>
        <input
          type="text"
          autoComplete="name"
          className={inputClass}
          {...fieldA11y("name", { error: errorFor("name") })}
          {...register("name")}
        />
      </Field>
      <Field id="company" label={labels.company} optional error={errorFor("company")}>
        <input
          type="text"
          autoComplete="organization"
          className={inputClass}
          {...fieldA11y("company", { error: errorFor("company") })}
          {...register("company")}
        />
      </Field>
      <FieldRow>
        <Field id="email" label={labels.email} error={errorFor("email")}>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            className={inputClass}
            {...fieldA11y("email", { error: errorFor("email") })}
            {...register("email")}
          />
        </Field>
        <Field
          id="phone"
          label={labels.phone}
          optional
          hint={t("phoneHint")}
          error={errorFor("phone")}
        >
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
      <Field id="subject" label={labels.subject} error={errorFor("subject")}>
        <select
          className={selectClass}
          defaultValue=""
          {...fieldA11y("subject", { error: errorFor("subject") })}
          {...register("subject")}
        >
          <option value="" disabled>
            {t("fields.select")}
          </option>
          {contactSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {t(`options.subject.${subject}`)}
            </option>
          ))}
        </select>
      </Field>
      <Field id="message" label={labels.message} error={errorFor("message")}>
        <textarea
          rows={6}
          className={textareaClass}
          {...fieldA11y("message", { error: errorFor("message") })}
          {...register("message")}
        />
      </Field>
      <ConsentField registration={register("consent")} error={errorFor("consent")} />
      <Honeypot registration={register("website")} />
      <Turnstile {...turnstile} label={t("turnstile")} />
      <div>
        <SubmitButton pending={pending} label={tc("submit")} />
      </div>
    </form>
  );
}
