import { CircleCheck, Clock, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOrderWithToken } from "@/lib/db/orders";
import { getProviderById } from "@/lib/payments";
import { OrderActions, CopyValue } from "@/components/sections/forms/order-actions";
import { ButtonLink } from "@/components/ui/button";
import { formatKz, formatLongDate } from "@/lib/format";
import { noIndex } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string; pedido: string }>;
  // Código de acesso do pedido (enviado por e-mail). Nenhum dado pessoal no URL.
  searchParams: Promise<{ t?: string | string[] }>;
}

// Estado sempre atual (o pagamento pode ser confirmado a qualquer momento).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Order" });
  // Nunca indexar nem enviar o URL (com o código) a outros sites.
  return { title: t("metaTitle"), robots: noIndex, referrer: "no-referrer" };
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { locale, pedido } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Order");
  const tm = await getTranslations("Metodo");
  const query = await searchParams;
  const token = typeof query.t === "string" ? query.t : "";
  const order = token ? await getOrderWithToken(pedido, token).catch(() => null) : null;

  if (!order) {
    return (
      <section aria-labelledby="page-title" className="pt-10 pb-(--space-section) md:pt-16">
        <div className="container-site flex max-w-3xl flex-col items-start gap-5">
          <h1 id="page-title" className="text-h1 font-extrabold">
            {t("notFound.title")}
          </h1>
          <p className="text-lead text-muted">{t("notFound.text")}</p>
          <ButtonLink href="/contactos">{tm("cta.secondary")}</ButtonLink>
        </div>
      </section>
    );
  }

  const free = order.amountKz === 0;
  const instructions = order.instructions;
  const expired =
    order.status === "expirado" ||
    (order.status === "pendente" &&
      instructions !== null &&
      new Date(instructions.expiresAt) < new Date());
  const state =
    order.status === "pago" ? (free ? "free" : "paid") : expired ? "expired" : "pending";
  const testMode = Boolean(getProviderById(order.provider)?.testMode);
  const Icon = state === "pending" ? Clock : state === "expired" ? TriangleAlert : CircleCheck;

  return (
    <section
      data-brand="metodo"
      aria-labelledby="page-title"
      className="pt-10 pb-(--space-section) md:pt-16"
    >
      <div className="container-site flex max-w-3xl flex-col gap-10">
        <div className="flex flex-col items-start gap-5">
          <span
            className={
              state === "pending" || state === "expired"
                ? "grid size-16 place-items-center rounded-full bg-primary-soft text-primary"
                : "grid size-16 place-items-center rounded-full bg-success-soft text-success"
            }
          >
            <Icon aria-hidden="true" className="size-8" strokeWidth={1.75} />
          </span>
          <h1 id="page-title" className="text-h1 font-extrabold text-balance">
            {t(`${state}Title`)}
          </h1>
          <p className="text-lead text-muted">{t(`${state}Lead`)}</p>
        </div>

        <div className="flex flex-col gap-6 rounded-xl bg-surface p-6 md:p-8">
          <dl className="sm:grid-cols-2 grid gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <dt className="text-small text-muted">{t("order")}</dt>
              <dd className="font-semibold">{order.offerName}</dd>
            </div>
            {state === "pending" && instructions?.method === "referencia" && (
              <>
                <div className="flex flex-col gap-1">
                  <dt className="text-small text-muted">{t("entity")}</dt>
                  <dd>
                    <CopyValue value={instructions.entity} />
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-small text-muted">{t("reference")}</dt>
                  <dd>
                    <CopyValue value={instructions.reference} />
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-small text-muted">{t("until")}</dt>
                  <dd className="font-semibold">{formatLongDate(instructions.expiresAt)}</dd>
                </div>
              </>
            )}
            <div className="flex flex-col gap-1">
              <dt className="text-small text-muted">{t("amount")}</dt>
              <dd className="font-display text-h3 font-extrabold">
                {free ? tm("offers.free") : formatKz(order.amountKz)}
              </dd>
            </div>
          </dl>

          {state === "pending" && (
            <OrderActions
              orderId={order.id}
              token={token}
              redirectUrl={instructions?.method === "redirecionar" ? instructions.url : undefined}
              testMode={testMode}
            />
          )}
        </div>

        <div>
          <ButtonLink href="/metodo-centro" variant="secondary">
            {t("back")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
