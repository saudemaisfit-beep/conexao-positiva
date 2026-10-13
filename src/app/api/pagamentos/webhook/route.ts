import { getPaymentProvider } from "@/lib/payments";
import { applyPaymentNotice } from "@/lib/payments/orders";

/**
 * Avisos de pagamento do fornecedor ativo (PAYMENTS_PROVIDER). A assinatura é validada pelo
 * próprio fornecedor (parseWebhook); sem assinatura válida nada muda. Avisos repetidos são
 * seguros (confirmação idempotente na base de dados).
 *
 * Configurar no painel do fornecedor: https://<domínio>/api/pagamentos/webhook
 */
export const dynamic = "force-dynamic";

const MAX_BODY = 16_384;

export async function POST(request: Request) {
  const provider = getPaymentProvider();
  if (!provider) return new Response(null, { status: 404 });

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY) return new Response(null, { status: 413 });

  let notice;
  try {
    notice = await provider.parseWebhook(rawBody, request.headers);
  } catch {
    notice = null;
  }
  if (!notice) return new Response(null, { status: 401 });

  try {
    const applied = await applyPaymentNotice(provider.id, notice);
    // 200 mesmo para avisos que não correspondem: o fornecedor não deve repetir um aviso inválido.
    if (!applied) console.warn("[pagamentos] aviso não corresponde a nenhum pedido pendente");
    return new Response(null, { status: 200 });
  } catch (error) {
    // 500: o fornecedor volta a tentar mais tarde (a base de dados pode estar indisponível).
    console.error("[pagamentos] falha ao aplicar aviso:", String(error));
    return new Response(null, { status: 500 });
  }
}
