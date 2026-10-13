import { expect, test } from "@playwright/test";

/**
 * Compra no Método C.E.N.T.R.O. O build de teste usa FORMS_DRY_RUN=1: os pedidos ficam em
 * memória e o pagamento usa o fornecedor de teste (referências fictícias, nada é cobrado).
 */
test.describe("Compra no Método C.E.N.T.R.O.", () => {
  test("bilhete: dados → referência Multicaixa → pagamento simulado confirmado", async ({
    page,
  }) => {
    await page.goto("/metodo-centro");
    const premium = page.getByRole("article", { name: /Plano Premium/ });
    await premium.getByRole("link", { name: "Adquirir bilhete Premium" }).click();
    await expect(page).toHaveURL(/\/metodo-centro\/comprar\/encontro-plano-premium$/);
    // O valor mostrado vem do catálogo do servidor.
    await expect(page.getByRole("complementary")).toContainText("75");

    await page.getByLabel("Nome").fill("Teste Automático");
    await page.getByLabel("E-mail").fill("teste@exemplo.ao");
    await page.getByLabel("Telefone").fill("+244 923 000 000");
    await page.getByRole("checkbox").check();
    await page.waitForTimeout(3_200);
    await page.getByRole("button", { name: "Continuar para o pagamento" }).click();

    await expect(page).toHaveURL(/\/pagamento\/[0-9a-f-]{36}\?t=/);
    await expect(page.locator("h1")).toHaveText("Falta só o pagamento");
    await expect(page.getByText("Entidade")).toBeVisible();
    await expect(page.getByText("Modo de teste")).toBeVisible();

    await page.getByRole("button", { name: "Simular pagamento (teste)" }).click();
    await expect(page.locator("h1")).toHaveText("Pagamento confirmado");
  });

  test("guia gratuito: pedido na própria página do Método, sem pagamento", async ({ page }) => {
    await page.goto("/metodo-centro#guia");
    await page.getByLabel("Nome").fill("Teste Automático");
    await page.getByLabel("E-mail").fill("teste@exemplo.ao");
    await page.getByLabel("Telefone").fill("+244 923 000 000");
    await page.getByRole("checkbox").check();
    await page.waitForTimeout(3_200);
    await page.getByRole("button", { name: "Pedir o guia" }).click();
    await expect(page.locator("h1")).toHaveText("Pedido recebido");
  });

  test("pedido sem o código de acesso certo não mostra nada", async ({ page }) => {
    await page.goto("/pagamento/00000000-0000-4000-8000-000000000000?t=codigo-errado-0123456789");
    await expect(page.locator("h1")).toHaveText("Não encontrámos este pedido.");
  });

  test("webhook recusa avisos sem assinatura válida", async ({ request }) => {
    const response = await request.post("/api/pagamentos/webhook", {
      data: { orderId: "x", providerRef: "y", amountKz: 1, status: "pago" },
      headers: { "x-signature": "0".repeat(64) },
    });
    expect(response.status()).toBe(401);
  });
});
