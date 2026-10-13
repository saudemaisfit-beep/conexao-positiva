import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { PaymentInstructions } from "@/lib/payments/types";
import { isDatabaseConfigured, rest } from "./client";

/**
 * Pedidos de compra (bilhetes, e-books, guia gratuito).
 * - O valor vem sempre do catálogo no servidor (src/content/offers.ts).
 * - Cada pedido tem um código de acesso aleatório: o link da página de pagamento leva o código
 *   e a base de dados guarda só o seu hash (SHA-256). Sem o código, ninguém vê o pedido.
 * - Sem base de dados, em desenvolvimento e nos testes (FORMS_DRY_RUN=1), os pedidos ficam em
 *   memória para se poder ensaiar o fluxo completo.
 */
export type OrderStatus = "pendente" | "pago" | "expirado" | "cancelado";

export interface Order {
  id: string;
  createdAt: string;
  offerId: string;
  offerName: string;
  amountKz: number;
  name: string;
  email: string;
  phone: string;
  status: OrderStatus;
  provider: string;
  providerRef: string;
  instructions: PaymentInstructions | null;
  paidAt: string | null;
}

export interface NewOrder {
  id: string;
  offerId: string;
  offerName: string;
  amountKz: number;
  name: string;
  email: string;
  phone: string;
  status: "pendente" | "pago";
  provider: string;
  providerRef: string;
  instructions: PaymentInstructions | null;
}

interface Row {
  id: string;
  created_at: string;
  offer_id: string;
  offer_name: string;
  amount_kz: number;
  name: string;
  email: string;
  phone: string;
  status: OrderStatus;
  provider: string;
  provider_ref: string;
  instructions: PaymentInstructions | null;
  access_token_hash: string;
  paid_at: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export const newAccessToken = () => randomBytes(24).toString("base64url");

const simulate =
  !isDatabaseConfigured &&
  (process.env.NODE_ENV !== "production" || process.env.FORMS_DRY_RUN === "1");

export const isOrderStoreAvailable = isDatabaseConfigured || simulate;

// Memória partilhada entre pedidos no mesmo processo (só desenvolvimento e testes).
const memory = ((globalThis as { __cpOrders?: Map<string, Row> }).__cpOrders ??= new Map());

const toOrder = (row: Row): Order => ({
  id: row.id,
  createdAt: row.created_at,
  offerId: row.offer_id,
  offerName: row.offer_name,
  amountKz: row.amount_kz,
  name: row.name,
  email: row.email,
  phone: row.phone,
  status: row.status,
  provider: row.provider,
  providerRef: row.provider_ref,
  instructions: row.instructions,
  paidAt: row.paid_at,
});

export async function insertOrder(order: NewOrder, accessToken: string) {
  const row: Row = {
    id: order.id,
    created_at: new Date().toISOString(),
    offer_id: order.offerId,
    offer_name: order.offerName,
    amount_kz: order.amountKz,
    name: order.name,
    email: order.email,
    phone: order.phone,
    status: order.status,
    provider: order.provider,
    provider_ref: order.providerRef,
    instructions: order.instructions,
    access_token_hash: hash(accessToken),
    paid_at: order.status === "pago" ? new Date().toISOString() : null,
  };
  if (simulate) {
    memory.set(row.id, row);
    return;
  }
  // created_at fica a cargo da base de dados.
  const body: Partial<Row> & { consent_at: string } = { ...row, consent_at: row.created_at };
  delete body.created_at;
  await rest("orders", { method: "POST", prefer: "return=minimal", body });
}

async function findRow(id: string): Promise<Row | null> {
  if (!UUID.test(id)) return null;
  if (simulate) return memory.get(id) ?? null;
  const rows = await rest<Row[]>(
    `orders?id=eq.${id}&select=id,created_at,offer_id,offer_name,amount_kz,name,email,phone,status,provider,provider_ref,instructions,access_token_hash,paid_at&limit=1`,
  );
  return rows[0] ?? null;
}

/** Pedido, só com o código de acesso certo (comparação em tempo constante). */
export async function getOrderWithToken(id: string, token: string): Promise<Order | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const row = await findRow(id);
  if (!row) return null;
  const expected = Buffer.from(row.access_token_hash, "hex");
  const given = Buffer.from(hash(token), "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return toOrder(row);
}

/** Pedido por id, sem código: só para o servidor (webhook), nunca para mostrar a visitantes. */
export async function getOrderForServer(id: string): Promise<Order | null> {
  const row = await findRow(id);
  return row ? toOrder(row) : null;
}

export type MarkPaidResult = "pago" | "ja-pago" | "rejeitado";

/**
 * Marca como pago de forma atómica e idempotente (função SQL mark_order_paid): só se o
 * fornecedor, a referência e o valor coincidirem com o pedido. Avisos repetidos devolvem "ja-pago".
 */
export async function markOrderPaid(
  id: string,
  provider: string,
  providerRef: string,
  amountKz: number,
): Promise<MarkPaidResult> {
  if (!UUID.test(id)) return "rejeitado";
  if (simulate) {
    const row = memory.get(id);
    if (!row) return "rejeitado";
    if (row.status === "pago") return "ja-pago";
    if (
      row.provider !== provider ||
      row.provider_ref !== providerRef ||
      row.amount_kz !== amountKz ||
      (row.status !== "pendente" && row.status !== "expirado")
    ) {
      return "rejeitado";
    }
    row.status = "pago";
    row.paid_at = new Date().toISOString();
    return "pago";
  }
  const rows = await rest<{ result: MarkPaidResult }[]>("rpc/mark_order_paid", {
    method: "POST",
    body: {
      p_order_id: id,
      p_provider: provider,
      p_provider_ref: providerRef,
      p_amount_kz: amountKz,
    },
  });
  return rows[0]?.result ?? "rejeitado";
}
