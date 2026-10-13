import "server-only";
import { randomUUID } from "node:crypto";
import { siteConfig } from "@/config/site";
import type { Offer } from "@/content/offers";
import {
  getOrderForServer,
  insertOrder,
  markOrderPaid,
  newAccessToken,
  type Order,
} from "@/lib/db/orders";
import { sendEmail, teamRecipients, type Email } from "@/lib/email/send";
import { orderCreatedEmails, orderPaidEmails } from "@/lib/email/templates";
import type { CheckoutData } from "@/lib/forms/schemas";
import { getProviderById } from "./index";
import type { PaymentNotice, PaymentProvider } from "./types";

/** Caminho da página do pedido (o código de acesso vai no URL, nunca dados pessoais). */
export const orderPath = (id: string, token: string) =>
  `/pagamento/${id}?t=${encodeURIComponent(token)}`;

async function sendAll(kind: string, emails: Email[]) {
  const results = await Promise.allSettled(emails.map(sendEmail));
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(`[pagamentos] e-mail não enviado (${kind}):`, String(result.reason));
    }
  });
}

/**
 * Cria o pedido: preço do catálogo, referência no fornecedor (se não for gratuito), registo na
 * base de dados e e-mails. Devolve o caminho da página do pedido.
 */
export async function createOrder(
  offer: Offer,
  data: CheckoutData,
  provider: PaymentProvider | null,
): Promise<string> {
  const id = randomUUID();
  const token = newAccessToken();
  const free = offer.priceKz === 0;
  if (!free && !provider) throw new Error("Sem meio de pagamento ativo.");

  const payment =
    free || !provider
      ? null
      : await provider.createPayment({
          orderId: id,
          amountKz: offer.priceKz,
          description: offer.name,
          customer: { name: data.name, email: data.email, phone: data.phone },
        });

  const order = {
    id,
    offerId: offer.id,
    offerName: offer.name,
    amountKz: offer.priceKz,
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: free ? ("pago" as const) : ("pendente" as const),
    provider: free ? "gratuito" : provider!.id,
    providerRef: payment?.providerRef ?? "",
    instructions: payment?.instructions ?? null,
  };
  await insertOrder(order, token);

  const path = orderPath(id, token);
  await sendAll(
    "pedido",
    orderCreatedEmails(order, new URL(path, siteConfig.url).toString(), teamRecipients),
  );
  return path;
}

/**
 * Aplica um aviso de pagamento já verificado. Idempotente: avisos repetidos não reenviam e-mails.
 * Devolve false se o aviso não corresponder ao pedido (valor, referência ou fornecedor errados).
 */
export async function applyPaymentNotice(providerId: string, notice: PaymentNotice) {
  if (notice.status !== "pago") return true;
  const result = await markOrderPaid(
    notice.orderId,
    providerId,
    notice.providerRef,
    notice.amountKz,
  );
  if (result === "rejeitado") return false;
  if (result === "pago") {
    const order = await getOrderForServer(notice.orderId);
    if (order) await sendAll("pagamento", orderPaidEmails(order, teamRecipients));
  }
  return true;
}

/** Pagamento simulado (só fornecedor de teste): o mesmo caminho de um aviso real. */
export async function simulatePaid(order: Order) {
  const provider = getProviderById(order.provider);
  if (!provider?.testMode || order.status !== "pendente") return false;
  return applyPaymentNotice(provider.id, {
    orderId: order.id,
    providerRef: order.providerRef,
    amountKz: order.amountKz,
    status: "pago",
  });
}
