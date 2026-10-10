"use client";

import { useTranslations } from "next-intl";
import { submitProposal } from "@/lib/actions/forms";
import {
  budgetRanges,
  participantRanges,
  proposalServices,
  type ProposalService,
} from "@/lib/forms/options";
import { proposalSchema } from "@/lib/forms/schemas";
import { ConsentField } from "./consent-field";
import {
  Field,
  FieldGroup,
  FieldRow,
  fieldA11y,
  inputClass,
  selectClass,
  textareaClass,
} from "./field";
import { ErrorSummary, SubmitButton } from "./form-feedback";
import { Honeypot } from "./honeypot";
import { ServerError } from "./server-error";
import { useSiteForm } from "./use-site-form";

/** Pedido de proposta: três grupos, sem passos. `service` vem de ?servico= (páginas de serviço). */
export function ProposalForm({ service }: { service?: ProposalService }) {
  const t = useTranslations("Forms");
  const tp = useTranslations("Proposal");
  const { form, onSubmit, summary, summaryRef, serverError, errorFor, pending } = useSiteForm({
    schema: proposalSchema,
    action: submitProposal,
    // Com serviço no URL, o rascunho de outro serviço não deve sobrepor-se à escolha.
    draftKey: service ? undefined : "cp-rascunho-proposta",
    defaultValues: {
      name: "",
      company: "",
      role: "",
      email: "",
      phone: "+244 ",
      service,
      participants: undefined,
      location: "",
      date: "",
      dateUndecided: false,
      objective: "",
      budget: undefined,
      details: "",
      consent: false as unknown as true,
      website: "",
      startedAt: 0,
    },
  });
  const { register, watch } = form;
  const dateUndecided = watch("dateUndecided");
  const labels: Record<string, string> = {
    name: t("fields.name"),
    company: t("fields.company"),
    role: t("fields.role"),
    email: t("fields.email"),
    phone: t("fields.phone"),
    service: t("fields.service"),
    participants: t("fields.participants"),
    location: t("fields.location"),
    date: t("fields.date"),
    objective: t("fields.objective"),
    budget: t("fields.budget"),
    details: t("fields.details"),
    consent: t("fields.consent"),
  };
  const text = (
    name: "name" | "company" | "role" | "location",
    autoComplete: string,
    hint?: string,
  ) => (
    <Field id={name} label={labels[name]!} hint={hint} error={errorFor(name)}>
      <input
        type="text"
        autoComplete={autoComplete}
        className={inputClass}
        {...fieldA11y(name, { hint: Boolean(hint), error: errorFor(name) })}
        {...register(name)}
      />
    </Field>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-8">
      {summary.length > 0 && <ErrorSummary ref={summaryRef} errors={summary} labels={labels} />}
      {serverError && <ServerError error={serverError} />}

      <FieldGroup legend={tp("groups.you")}>
        {text("name", "name")}
        <FieldRow>
          {text("company", "organization")}
          {text("role", "organization-title")}
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
      </FieldGroup>

      <FieldGroup legend={tp("groups.project")}>
        <Field id="service" label={labels.service!} error={errorFor("service")}>
          <select
            className={selectClass}
            defaultValue={service ?? ""}
            {...fieldA11y("service", { error: errorFor("service") })}
            {...register("service")}
          >
            <option value="" disabled>
              {t("fields.select")}
            </option>
            {proposalServices.map((value) => (
              <option key={value} value={value}>
                {t(`options.service.${value}`)}
              </option>
            ))}
          </select>
        </Field>
        <FieldRow>
          <Field id="participants" label={labels.participants!} error={errorFor("participants")}>
            <select
              className={selectClass}
              defaultValue=""
              {...fieldA11y("participants", { error: errorFor("participants") })}
              {...register("participants")}
            >
              <option value="" disabled>
                {t("fields.select")}
              </option>
              {participantRanges.map((value) => (
                <option key={value} value={value}>
                  {t(`options.participants.${value}`)}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex flex-col gap-3">
            <Field id="date" label={labels.date!} error={errorFor("date")}>
              <input
                type="date"
                className={inputClass}
                disabled={dateUndecided}
                {...fieldA11y("date", { error: errorFor("date") })}
                {...register("date")}
              />
            </Field>
            <label className="flex cursor-pointer items-center gap-3 text-small">
              <input
                type="checkbox"
                className="size-5 cursor-pointer rounded-xs accent-primary"
                {...register("dateUndecided", {
                  onChange: () => form.trigger("date"),
                })}
              />
              {t("fields.dateUndecided")}
            </label>
          </div>
        </FieldRow>
        {text("location", "address-level2", t("fields.locationHint"))}
        <Field
          id="objective"
          label={labels.objective!}
          hint={t("fields.objectiveHint")}
          error={errorFor("objective")}
        >
          <textarea
            rows={4}
            className={textareaClass}
            {...fieldA11y("objective", { hint: true, error: errorFor("objective") })}
            {...register("objective")}
          />
        </Field>
      </FieldGroup>

      <FieldGroup legend={tp("groups.extra")}>
        <Field id="budget" label={labels.budget!} optional error={errorFor("budget")}>
          <select
            className={selectClass}
            defaultValue=""
            {...fieldA11y("budget", { error: errorFor("budget") })}
            {...register("budget", { setValueAs: (value) => value || undefined })}
          >
            <option value="">{t("fields.select")}</option>
            {budgetRanges.map((value) => (
              <option key={value} value={value}>
                {t(`options.budget.${value}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="details" label={labels.details!} optional error={errorFor("details")}>
          <textarea
            rows={4}
            className={textareaClass}
            {...fieldA11y("details", { error: errorFor("details") })}
            {...register("details")}
          />
        </Field>
        <ConsentField registration={register("consent")} error={errorFor("consent")} />
      </FieldGroup>

      <Honeypot registration={register("website")} />
      <div>
        <SubmitButton pending={pending} label={tp("submit")} />
      </div>
    </form>
  );
}
