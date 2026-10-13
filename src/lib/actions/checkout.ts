"use server";

import { getOffer, isOfferAvailable } from "@/content/offers";
import { getOrderWithToken, isOrderStoreAvailable } from "@/lib/db/orders";
import { guard, safely } from "@/lib/forms/guard";
import { checkoutSchema, type FormResult } from "@/lib/forms/schemas";
import { getPaymentProvider } from "@/lib/payments";
import { createOrder, orderPath, simulatePaid } from "@/lib/payments/orders";

/** Compra de uma oferta do Método C.E.N.T.R.O. (ou pedido do guia gratuito). */
export async function submitCheckout(input: unknown): Promise<FormResult> {
  const checked = await guard("compra", checkoutSchema, input, "/metodo-centro");
  if ("result" in checked) return checked.result;

  return safely("compra", async () => {
    // Oferta e preço confirmados no servidor: o browser só indica o id.
    const offer = getOffer(checked.data.offerId);
    if (!offer || !isOfferAvailable(offer)) return { ok: false, error: "offer-unavailable" };

    const provider = offer.priceKz === 0 ? null : getPaymentProvider();
    if (!isOrderStoreAvailable || (offer.priceKz > 0 && !provider)) {
      return { ok: false, error: "unavailable" };
    }
    return { ok: true, redirectTo: await createOrder(offer, checked.data, provider) };
  });
}

/**
 * Botão "Simular pagamento" da página do pedido. Só funciona com o fornecedor de teste
 * (desenvolvimento e testes); em produção não há fornecedor de teste e nada acontece.
 */
export async function simulatePayment(orderId: unknown, token: unknown): Promise<FormResult> {
  if (typeof orderId !== "string" || typeof token !== "string") {
    return { ok: false, error: "validation" };
  }
  return safely("compra", async () => {
    const order = await getOrderWithToken(orderId, token);
    if (!order || !(await simulatePaid(order))) return { ok: false, error: "closed" };
    return { ok: true, redirectTo: orderPath(order.id, token) };
  });
}
