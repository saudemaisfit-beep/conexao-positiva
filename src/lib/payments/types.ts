/**
 * Contrato comum dos meios de pagamento. Cada fornecedor (ProxyPay, Multicaixa Express/EMIS,
 * AppyPay…) implementa esta interface num ficheiro próprio em src/lib/payments/providers/.
 * O resto do site (checkout, página de pagamento, webhook) não depende do fornecedor.
 */

/** O que a pessoa precisa para pagar. Hoje: referência Multicaixa (entidade + referência). */
export type PaymentInstructions =
  | {
      method: "referencia";
      entity: string;
      reference: string;
      amountKz: number;
      expiresAt: string;
    }
  | {
      /** Página do fornecedor (ex.: Multicaixa Express, cartão). */
      method: "redirecionar";
      url: string;
      amountKz: number;
      expiresAt: string;
    };

export interface NewPayment {
  orderId: string;
  amountKz: number;
  description: string;
  customer: { name: string; email: string; phone: string };
}

/** Aviso de pagamento (webhook) já verificado (assinatura válida). */
export interface PaymentNotice {
  orderId: string;
  providerRef: string;
  amountKz: number;
  status: "pago" | "falhado";
}

export interface PaymentProvider {
  /** Identificador guardado em cada pedido (ex.: "simulado", "proxypay"). */
  id: string;
  /** Modo de teste: nenhum dinheiro real circula. */
  testMode: boolean;
  createPayment(payment: NewPayment): Promise<{
    providerRef: string;
    instructions: PaymentInstructions;
  }>;
  /**
   * Valida a assinatura e lê o aviso. Devolve null se a assinatura for inválida: o pedido é
   * recusado e nada muda na base de dados.
   */
  parseWebhook(rawBody: string, headers: Headers): Promise<PaymentNotice | null>;
}
