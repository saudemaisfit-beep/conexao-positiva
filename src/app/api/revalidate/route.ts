import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

const ALLOWED_TYPES = new Set([
  "siteSettings",
  "aboutPage",
  "event",
  "caseStudy",
  "article",
  "author",
  "testimonial",
  "clientLogo",
  "impactStat",
]);

/**
 * Webhook do Sanity: quando a equipa publica, altera ou apaga um documento, as páginas que o
 * usam são regeneradas no pedido seguinte. O pedido é assinado com SANITY_REVALIDATE_SECRET
 * (configurado no Sanity e na Vercel); pedidos sem assinatura válida são recusados.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ message: "Webhook não configurado." }, { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret, true);
    if (!isValidSignature) {
      return Response.json({ message: "Assinatura inválida." }, { status: 401 });
    }
    const type = body?._type;
    if (!type || !ALLOWED_TYPES.has(type)) {
      return Response.json({ message: "Tipo de documento desconhecido." }, { status: 400 });
    }
    // Expira já: o próximo pedido recebe o conteúdo novo.
    revalidateTag(type, { expire: 0 });
    return Response.json({ revalidated: type });
  } catch (error) {
    console.error("[revalidate] falha ao processar o webhook", error);
    return Response.json({ message: "Pedido inválido." }, { status: 400 });
  }
}
