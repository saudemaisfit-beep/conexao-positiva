"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldErrors,
  type FieldValues,
  type Path,
  type Resolver,
} from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "@/i18n/navigation";
import { track } from "@/lib/analytics/track";
import type { FormResult } from "@/lib/forms/schemas";

type ServerError = Exclude<FormResult, { ok: true }>["error"];

/** Campos que nunca são guardados no rascunho. */
const NOT_SAVED = new Set(["consent", "website", "startedAt", "eventSlug", "turnstileToken"]);

/**
 * Lógica comum dos formulários: validação (à saída do campo e, depois do primeiro erro,
 * enquanto se escreve), resumo de erros no envio, envio para a Server Action, erros do
 * servidor, rascunho na sessão do browser e redirecionamento para a página de confirmação.
 */
export function useSiteForm<S extends z.ZodType<FieldValues, FieldValues>>({
  schema,
  defaultValues,
  action,
  draftKey,
  analyticsEvent,
}: {
  schema: S;
  defaultValues: DefaultValues<z.input<S>>;
  action: (input: unknown) => Promise<FormResult>;
  /** Chave do rascunho em sessionStorage (apagado ao fechar o separador ou ao enviar). */
  draftKey?: string;
  /** Evento de conversão (GA4, só com consentimento), sem dados pessoais. */
  analyticsEvent?: { name: string; params: Record<string, string> };
}) {
  const t = useTranslations("Forms");
  const router = useRouter();
  const form = useForm<z.input<S>, unknown, z.output<S>>({
    resolver: zodResolver(schema) as unknown as Resolver<z.input<S>, unknown, z.output<S>>,
    defaultValues,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const [summary, setSummary] = useState<{ field: string; message: string }[]>([]);
  const [serverError, setServerError] = useState<ServerError | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  // Muda depois de cada envio sem sucesso: o token do Turnstile só pode ser usado uma vez.
  const [attempt, setAttempt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const { reset, subscribe, setError, setValue } = form;

  // Momento em que o formulário foi aberto (anti-spam: tempo mínimo de preenchimento).
  useEffect(() => {
    setValue("startedAt" as Path<z.input<S>>, Date.now() as never);
  }, [setValue]);

  // Rascunho: repõe ao abrir e guarda a cada alteração.
  useEffect(() => {
    if (!draftKey) return;
    try {
      const saved = sessionStorage.getItem(draftKey);
      if (saved) {
        const draft = Object.fromEntries(
          Object.entries(JSON.parse(saved) as Record<string, unknown>).filter(
            ([key]) => !NOT_SAVED.has(key),
          ),
        );
        reset({ ...defaultValues, ...draft, startedAt: Date.now() });
      }
    } catch {
      // Sem acesso ao armazenamento (modo privado, bloqueado): segue sem rascunho.
    }
    return subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        try {
          const draft = Object.fromEntries(
            Object.entries(values).filter(([key]) => !NOT_SAVED.has(key)),
          );
          sessionStorage.setItem(draftKey, JSON.stringify(draft));
        } catch {
          // Ignorar: o rascunho é apenas uma conveniência.
        }
      },
    });
    // defaultValues só conta na primeira montagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey, reset, subscribe]);

  const message = (key: string | undefined) => {
    const code = key ?? "invalid";
    return t.has(`errors.${code}`) ? t(`errors.${code}`) : t("errors.invalid");
  };

  const onInvalid = (errors: FieldErrors<z.input<S>>) => {
    setServerError(null);
    setSummary(
      Object.entries(errors).map(([field, error]) => ({
        field,
        message: message(error?.message as string | undefined),
      })),
    );
    // O foco vai para o primeiro campo com erro (React Hook Form); o resumo é anunciado.
  };

  const onValid = async (data: z.output<S>) => {
    setSummary([]);
    setServerError(null);
    let result: FormResult;
    try {
      result = await action(data);
    } catch {
      result = { ok: false, error: "server" };
    }
    if (result.ok) {
      if (draftKey) {
        try {
          sessionStorage.removeItem(draftKey);
        } catch {
          // Ignorar.
        }
      }
      if (analyticsEvent) track(analyticsEvent.name, analyticsEvent.params);
      setRedirecting(true);
      router.push(result.redirectTo);
      return;
    }
    setAttempt((value) => value + 1);
    if (result.error === "validation" && result.fieldErrors) {
      const entries = Object.entries(result.fieldErrors);
      for (const [field, code] of entries) {
        setError(field as Path<z.input<S>>, { type: "server", message: code });
      }
      setSummary(entries.map(([field, code]) => ({ field, message: message(code) })));
      summaryRef.current?.focus();
      return;
    }
    setServerError(result.error);
  };

  return {
    form,
    onSubmit: (event: FormEvent<HTMLFormElement>) => form.handleSubmit(onValid, onInvalid)(event),
    summary,
    summaryRef,
    serverError,
    /** Mensagem traduzida do erro de um campo (ou undefined). */
    errorFor: (field: Path<z.input<S>>) => {
      const error = form.formState.errors[field as keyof FieldErrors<z.input<S>>];
      return error ? message(error.message as string | undefined) : undefined;
    },
    pending: form.formState.isSubmitting || redirecting,
    turnstile: {
      resetKey: attempt,
      onToken: (token: string) => setValue("turnstileToken" as Path<z.input<S>>, token as never),
    },
  };
}
