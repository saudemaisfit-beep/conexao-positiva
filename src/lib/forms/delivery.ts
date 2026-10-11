import "server-only";
import { getTranslations } from "next-intl/server";
import type { EventDetail } from "@/content/types";
import { isDatabaseConfigured } from "@/lib/db/client";
import {
  insertContactMessage,
  insertProposalRequest,
  registerForEvent,
  type RegistrationOutcome,
} from "@/lib/db/submissions";
import { sendEmail, teamRecipients, type Email } from "@/lib/email/send";
import { contactEmails, proposalEmails, registrationEmails } from "@/lib/email/templates";
import type { ContactData, ProposalData, RegistrationData } from "./schemas";

/**
 * Entrega dos pedidos: 1) grava na base de dados (Supabase); 2) envia os e-mails (SMTP da Hostinger).
 * Um e-mail que falha fica registado sem dados pessoais e não anula o pedido.
 *
 * Sem base de dados configurada:
 * - em desenvolvimento, ou com FORMS_DRY_RUN=1 (testes), o envio é simulado com sucesso;
 * - em produção, devolve "unavailable" e o formulário mostra os contactos alternativos,
 *   para que nenhum pedido se perca em silêncio.
 */
const simulate =
  !isDatabaseConfigured &&
  (process.env.NODE_ENV !== "production" || process.env.FORMS_DRY_RUN === "1");

async function sendAll(kind: string, emails: Email[]) {
  const results = await Promise.allSettled(emails.map(sendEmail));
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(`[formulários] e-mail não enviado (${kind}):`, String(result.reason));
    }
  });
}

/** Rótulos das opções (assunto, serviço, participantes, orçamento) para os e-mails. */
async function optionLabels() {
  const t = await getTranslations("Forms");
  const raw = t.raw("options") as Record<string, Record<string, string>>;
  const labels: Record<string, string> = { ...raw.subject };
  for (const group of ["service", "participants", "budget"]) {
    for (const [value, label] of Object.entries(raw[group] ?? {}))
      labels[`${group}.${value}`] = label;
  }
  return labels;
}

export async function deliverContact(data: ContactData): Promise<"ok" | "unavailable"> {
  if (simulate) return (console.warn("[formulários] envio simulado: contacto"), "ok");
  if (!isDatabaseConfigured) return "unavailable";
  await insertContactMessage(data);
  await sendAll("contacto", contactEmails(data, await optionLabels(), teamRecipients));
  return "ok";
}

export async function deliverProposal(data: ProposalData): Promise<"ok" | "unavailable"> {
  if (simulate) return (console.warn("[formulários] envio simulado: proposta"), "ok");
  if (!isDatabaseConfigured) return "unavailable";
  await insertProposalRequest(data);
  await sendAll("proposta", proposalEmails(data, await optionLabels(), teamRecipients));
  return "ok";
}

export async function deliverRegistration(
  event: EventDetail,
  data: RegistrationData,
): Promise<RegistrationOutcome | "unavailable"> {
  if (simulate) {
    console.warn("[formulários] envio simulado: inscrição");
    return event.status === "esgotado" ? "lista-de-espera" : "confirmada";
  }
  if (!isDatabaseConfigured) return "unavailable";
  const outcome = await registerForEvent(
    {
      slug: event.slug,
      title: event.title,
      startsAt: event.startsAt,
      capacity: event.capacity ?? null,
    },
    data,
  );
  if (outcome !== "duplicada") {
    await sendAll(
      "inscrição",
      registrationEmails(data, event, outcome === "lista-de-espera", teamRecipients),
    );
  }
  return outcome;
}
