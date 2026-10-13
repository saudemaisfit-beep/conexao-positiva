# Método C.E.N.T.R.O.: landing page e pagamentos online

## A página /metodo-centro: landing de Luciana Machado

A página segue a **landing page completa** de Luciana Machado, com a identidade dela, aplicada com
`data-brand="luciana"`:

- **Cores:** carvão, dourado e areia.
- **Tipos de letra:** Playfair Display nos títulos e Montserrat no texto, alojados no próprio site.

O checkout e a página do pedido usam a mesma identidade.

**Secções, pela ordem da landing:**

1. Hero de ecrã inteiro com a fotografia.
2. Números.
3. "Reconhece estes sinais?".
4. Guia gratuito, com o formulário na própria página.
5. A criadora.
6. **O que é o método** (conteúdo do site).
7. **Os seis pilares em órbita** (secção do site, com as cores da landing).
8. **Como funciona** e **Para quem é** (conteúdo do site).
9. Testemunhos.
10. Benefícios.
11. Oferta.
12. Encontro.
13. Bilhetes.
14. E-books.
15. **Individual ou na sua organização** (conteúdo do site).
16. **Perguntas frequentes** (conteúdo do site).
17. Apelo final.

**Textos e dados:**

- Os textos estão em `src/content/metodo-landing.ts`; o conteúdo do site está em `src/content/metodo.ts`.
- Os preços estão em `src/content/offers.ts`.
- Os números, os testemunhos, a data do encontro, o preço de referência e a garantia de devolução estão
  marcados **[Exemplo]** até serem confirmados.

**Acessibilidade (WCAG 2.2 AA):**

- O dourado claro só aparece sobre carvão ou com texto carvão (6,3 : 1).
- O texto dourado sobre fundos claros usa o dourado escuro `#6e523a` (≥ 5 : 1).
- A contagem decrescente só aparece com uma data-limite **real** (`landing.urgency.deadline`). Não recomeça,
  atualiza de minuto a minuto e pode ser pausada.

## Como funciona a compra

1. A pessoa escolhe uma oferta e preenche nome, e-mail e telefone (`/metodo-centro/comprar/<oferta>`).
2. O servidor confirma a oferta e **lê o preço do catálogo** (o browser só envia o id). Aplica as mesmas
   proteções dos outros formulários: campo-isco, tempo mínimo, limite de pedidos e Turnstile.
3. O fornecedor de pagamento gera uma **referência Multicaixa** (entidade + referência + montante + prazo).
4. O pedido fica gravado na tabela `orders` (Supabase). A pessoa recebe por e-mail as instruções e o link da
   página do pedido (`/pagamento/<id>?t=<código>`). A base de dados guarda só o hash do código.
5. Quando a pessoa paga, o fornecedor avisa o site em `POST /api/pagamentos/webhook`. O aviso só é aceite com
   **assinatura válida** e se o fornecedor, a referência e o valor coincidirem com o pedido (função SQL
   `mark_order_paid`, idempotente). A pessoa e a equipa recebem um e-mail de confirmação.

O guia gratuito usa o mesmo fluxo, sem pagamento.

## Segurança

- Credenciais só em variáveis de ambiente do servidor (hPanel), nunca no código nem com `NEXT_PUBLIC_`.
- Tabela `orders` com RLS ativo e sem políticas: só o servidor (service_role) lê e escreve.
- Valor sempre calculado no servidor; webhooks com assinatura e corpo limitado a 16 KB.
- Página do pedido sem indexação e sem `Referer` (o código de acesso não sai do site).
- **Ofertas [Exemplo] não podem ser compradas em produção.** Para abrir a venda, confirmar nome, preço e
  condições em `src/content/offers.ts` e mudar `example: true` para `false`.

## Modo de teste (já incluído)

Em desenvolvimento e nos testes, o fornecedor `simulado` gera referências fictícias (entidade 00000). A página
do pedido mostra "Simular pagamento (teste)". Em produção, este fornecedor está sempre desligado.

## Ligar um fornecedor real (quando houver conta de comerciante)

1. Escolher o fornecedor: ProxyPay (referências Multicaixa), EMIS GPO (Multicaixa Express) ou AppyPay.
   Abrir a conta de comerciante e obter as credenciais de **sandbox**.
2. Criar `src/lib/payments/providers/<nome>.ts` com a interface `PaymentProvider` (`src/lib/payments/types.ts`):
   - `createPayment`: pede a referência ou o link de pagamento à API do fornecedor;
   - `parseWebhook`: valida a assinatura com o método indicado pelo fornecedor e devolve o aviso.
3. Registar o fornecedor em `src/lib/payments/index.ts`.
4. No hPanel: `PAYMENTS_PROVIDER=<nome>`, as credenciais do fornecedor e `PAYMENTS_WEBHOOK_SECRET` (ou o
   equivalente). No painel do fornecedor: webhook `https://<domínio>/api/pagamentos/webhook`.
5. Aplicar a migração `supabase/migrations/20261013000000_pagamentos.sql` e agendar
   `purge_expired_orders()` uma vez por dia (como `purge_expired_records`).
6. Testar no sandbox: compra, aviso, aviso repetido, valor errado (tem de ser recusado). Só depois mudar para as
   credenciais de produção.

## Pendente do lado da cliente

- Confirmar preços, condições e data do próximo encontro.
- Confirmar os números da criadora e enviar testemunhos reais com autorização.
- Ficheiro do guia "Regressar ao Centro" e dos e-books (hoje a equipa envia-os por e-mail depois do pedido).
- Escolher o fornecedor de pagamento e abrir a conta de comerciante.
