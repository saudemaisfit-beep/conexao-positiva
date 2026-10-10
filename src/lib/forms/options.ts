import { services } from "@/config/navigation";

/**
 * Opções dos formulários. Os rótulos estão em messages/pt.json (Forms.options);
 * os valores são estáveis porque são guardados na base de dados (Fase 14).
 */
export const proposalServices = [
  ...services.map((service) => service.slug),
  "metodo-centro",
  "nao-sei",
] as const;
export type ProposalService = (typeof proposalServices)[number];

export const participantRanges = ["ate-20", "21-50", "51-100", "101-250", "mais-250"] as const;

export const budgetRanges = [
  "ate-500k",
  "500k-1m",
  "1m-3m",
  "mais-3m",
  "prefiro-nao-indicar",
] as const;

export const contactSubjects = ["informacao", "parcerias", "imprensa", "outro"] as const;

export function isProposalService(value: string | undefined): value is ProposalService {
  return proposalServices.some((service) => service === value);
}
