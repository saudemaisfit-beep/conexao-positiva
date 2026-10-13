import { expect, test } from "@playwright/test";
import { getOffer, offers } from "@/content/offers";
import { checkoutSchema } from "@/lib/forms/schemas";
import { signSimulatedWebhook, simulatedProvider } from "@/lib/payments/providers/simulated";

test.describe("Pagamentos", () => {
  test("catálogo: ids únicos e preços inteiros não negativos", () => {
    const ids = offers.map((offer) => offer.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const offer of offers) {
      expect(Number.isInteger(offer.priceKz) && offer.priceKz >= 0, offer.id).toBe(true);
      expect(offer.id).toMatch(/^[a-z0-9-]{1,80}$/);
    }
    expect(getOffer("nao-existe")).toBeUndefined();
  });

  test("o checkout não aceita preço vindo do browser", () => {
    const parsed = checkoutSchema.safeParse({
      offerId: "encontro-plano-premium",
      name: "Teste",
      email: "teste@exemplo.ao",
      phone: "+244 923 000 000",
      consent: true,
      startedAt: 1,
      priceKz: 1,
    });
    expect(parsed.success).toBe(true);
    expect(parsed.success && "priceKz" in parsed.data).toBe(false);
  });

  test("fornecedor de teste: referência de 9 dígitos com o valor do pedido", async () => {
    const { providerRef, instructions } = await simulatedProvider.createPayment({
      orderId: "11111111-1111-4111-8111-111111111111",
      amountKz: 75_000,
      description: "Teste",
      customer: { name: "Teste", email: "teste@exemplo.ao", phone: "+244923000000" },
    });
    expect(providerRef).toMatch(/^SIM-\d{9}$/);
    expect(instructions.method).toBe("referencia");
    expect(instructions.amountKz).toBe(75_000);
    if (instructions.method === "referencia") {
      expect(instructions.reference.replace(/\s/g, "")).toMatch(/^\d{9}$/);
    }
  });

  test("webhook de teste: só aceita a assinatura HMAC certa", async () => {
    process.env.PAYMENTS_WEBHOOK_SECRET = "segredo-de-teste";
    const body = JSON.stringify({
      orderId: "11111111-1111-4111-8111-111111111111",
      providerRef: "SIM-123456789",
      amountKz: 75_000,
      status: "pago",
    });
    const good = new Headers({ "x-signature": signSimulatedWebhook(body, "segredo-de-teste") });
    const bad = new Headers({ "x-signature": signSimulatedWebhook(body, "outro-segredo") });
    expect(await simulatedProvider.parseWebhook(body, good)).toMatchObject({ amountKz: 75_000 });
    expect(await simulatedProvider.parseWebhook(body, bad)).toBeNull();
    expect(await simulatedProvider.parseWebhook(`${body} `, good)).toBeNull();
    delete process.env.PAYMENTS_WEBHOOK_SECRET;
  });
});
