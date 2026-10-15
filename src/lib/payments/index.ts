import "server-only";
import { simulatedProvider } from "./providers/simulated";
import type { PaymentProvider } from "./types";

/**
 * Meio de pagamento ativo, escolhido pela variável PAYMENTS_PROVIDER (só no servidor).
 *
 * - "simulado": referências fictícias para ensaiar o fluxo. Só em desenvolvimento e nos
 *   testes (FORMS_DRY_RUN=1); em produção é sempre recusado.
 * - Sem valor: em desenvolvimento/testes usa "simulado"; em produção os pagamentos ficam
 *   indisponíveis e a página mostra os contactos (nenhuma compra fica a meio).
 *
 * Para ligar um fornecedor real (ProxyPay, EMIS GPO, AppyPay…): criar
 * src/lib/payments/providers/<nome>.ts com a interface PaymentProvider, acrescentá-lo a
 * `providers` e definir PAYMENTS_PROVIDER=<nome> e as credenciais no hPanel (docs/pagamentos).
 */
const providers: Record<string, PaymentProvider> = {
  simulado: simulatedProvider,
};

const testing = process.env.NODE_ENV !== "production" || process.env.FORMS_DRY_RUN === "1";

export function getPaymentProvider(): PaymentProvider | null {
  const id = process.env.PAYMENTS_PROVIDER?.trim() || (testing ? "simulado" : "");
  return getProviderById(id);
}

export function getProviderById(id: string): PaymentProvider | null {
  if (!Object.hasOwn(providers, id)) return null;
  const provider = providers[id];
  if (!provider || (provider.testMode && !testing)) return null;
  return provider;
}

export type { PaymentInstructions, PaymentProvider } from "./types";
