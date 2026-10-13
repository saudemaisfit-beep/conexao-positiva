import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentNotice, PaymentProvider } from "../types";

/**
 * Fornecedor de TESTE: gera referências Multicaixa fictícias (entidade 00000) e aceita avisos
 * assinados com PAYMENTS_WEBHOOK_SECRET (HMAC-SHA256 do corpo, cabeçalho x-signature).
 * Nunca é usado em produção (ver src/lib/payments/index.ts). Nenhum dinheiro circula.
 */
const VALIDITY_DAYS = 3;

export function signSimulatedWebhook(rawBody: string, secret: string) {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

export const simulatedProvider: PaymentProvider = {
  id: "simulado",
  testMode: true,

  async createPayment(payment) {
    // Referência de 9 dígitos derivada do pedido (estável, sem dados pessoais).
    const digits = BigInt(`0x${createHash("sha256").update(payment.orderId).digest("hex")}`)
      .toString()
      .slice(0, 9)
      .padStart(9, "0");
    const expiresAt = new Date(Date.now() + VALIDITY_DAYS * 86_400_000).toISOString();
    return {
      providerRef: `SIM-${digits}`,
      instructions: {
        method: "referencia",
        entity: "00000",
        reference: digits.replace(/(\d{3})(?=\d)/g, "$1 "),
        amountKz: payment.amountKz,
        expiresAt,
      },
    };
  },

  async parseWebhook(rawBody, headers) {
    const secret = process.env.PAYMENTS_WEBHOOK_SECRET;
    const signature = headers.get("x-signature") ?? "";
    if (!secret || !/^[0-9a-f]{64}$/.test(signature)) return null;
    const expected = Buffer.from(signSimulatedWebhook(rawBody, secret), "hex");
    if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return null;

    const body = JSON.parse(rawBody) as Partial<PaymentNotice>;
    if (
      typeof body.orderId !== "string" ||
      typeof body.providerRef !== "string" ||
      typeof body.amountKz !== "number" ||
      (body.status !== "pago" && body.status !== "falhado")
    ) {
      return null;
    }
    return {
      orderId: body.orderId,
      providerRef: body.providerRef,
      amountKz: body.amountKz,
      status: body.status,
    };
  },
};
