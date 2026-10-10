import "server-only";
import type { ContactData, ProposalData, RegistrationData } from "./schemas";

export type Submission =
  | { kind: "contacto"; data: ContactData }
  | { kind: "proposta"; data: ProposalData }
  | { kind: "inscricao"; data: RegistrationData & { waitlist: boolean } };

/**
 * Entrega de um pedido (base de dados + e-mails). Implementada na Fase 14 (Supabase + Resend).
 *
 * Até lá, para que nenhum pedido se perca em silêncio:
 * - em desenvolvimento, ou com FORMS_DRY_RUN=1 (testes), o envio é simulado com sucesso;
 * - em produção, devolve "unavailable" e o formulário mostra os contactos alternativos.
 * Os dados pessoais nunca são escritos nos registos (logs) do servidor.
 */
export async function deliverSubmission(submission: Submission): Promise<"ok" | "unavailable"> {
  const simulate = process.env.NODE_ENV !== "production" || process.env.FORMS_DRY_RUN === "1";
  if (simulate) {
    console.warn(`[formulários] envio simulado: ${submission.kind}`);
    return "ok";
  }
  return "unavailable";
}
