import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Páginas principais (com conteúdos [Exemplo]: o build de teste usa CONTENT_PREVIEW=1). */
const PAGES = [
  "/",
  "/sobre",
  "/solucoes",
  "/solucoes/palestras",
  "/metodo-centro",
  "/eventos",
  "/eventos/exemplo-workshop",
  "/eventos/exemplo-workshop/inscricao",
  "/experiencias",
  "/insights",
  "/insights/exemplo-conversas-conscientes",
  "/contactos",
  "/solicitar-proposta",
  "/politica-de-privacidade",
];

/** Já escolheu os cookies: o aviso não tapa a página nas verificações. */
async function withConsent(page: Page) {
  await page.context().addCookies([
    {
      name: "cp_consent",
      value: encodeURIComponent(
        JSON.stringify({ version: 1, analytics: false, updatedAt: new Date().toISOString() }),
      ),
      url: "http://localhost:3100",
    },
  ]);
}

test.describe("Páginas", () => {
  for (const path of PAGES) {
    test(`${path} abre sem erros, com um único h1 e título próprio`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Conexão Positiva/);
      await page.waitForLoadState("networkidle");
      // Recursos externos bloqueados pela rede do ambiente de testes não contam.
      expect(errors.filter((error) => !/net::ERR_/.test(error))).toEqual([]);
    });
  }

  test("página inexistente devolve 404 com ligação para o início", async ({ page }) => {
    const response = await page.goto("/pagina-que-nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /página inicial/i }).first()).toBeVisible();
  });
});

test.describe("Acessibilidade (axe, WCAG 2.2 AA)", () => {
  for (const path of PAGES) {
    test(`${path} sem violações`, async ({ page }) => {
      await withConsent(page);
      // Sem animações de entrada: o axe mediria o texto a meio do fade-in (contraste falso).
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  }
});

test.describe("Navegação", () => {
  test('teclado: o primeiro Tab é "Saltar para o conteúdo"', async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText(/conteúdo/i);
  });

  test("menu móvel: abre, prende o foco e fecha com Esc", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await withConsent(page);
    await page.goto("/");
    const button = page.getByRole("button", { name: /menu/i }).first();
    await button.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 30; i++) await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => Boolean(document.activeElement?.closest("[role=dialog]"))),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("320 px: sem deslocamento horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    for (const path of ["/", "/solicitar-proposta", "/eventos/exemplo-workshop"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
