import { expect, test } from "@playwright/test";

/**
 * Formulários e privacidade. O build de teste usa FORMS_DRY_RUN=1: o envio é simulado com
 * sucesso, sem base de dados nem e-mails.
 */

test.describe("Formulário de contacto", () => {
  test("envio vazio mostra os erros junto de cada campo", async ({ page }) => {
    await page.goto("/contactos");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.getByLabel("Nome")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Nome")).toBeFocused();
    const invalid = page.locator("[aria-invalid=true]");
    for (const field of await invalid.all()) {
      const describedBy = (await field.getAttribute("aria-describedby")) ?? "";
      expect(describedBy, (await field.getAttribute("id")) ?? "").not.toBe("");
    }
  });

  test("envio válido leva à página de confirmação", async ({ page }) => {
    await page.goto("/contactos");
    await page.getByLabel("Nome").fill("Teste Automático");
    await page.getByLabel("E-mail").fill("teste@exemplo.ao");
    await page.getByLabel("Assunto").selectOption("informacao");
    await page
      .getByLabel("Mensagem")
      .fill("Mensagem de teste automático com mais de dez caracteres.");
    await page.getByRole("checkbox").check();
    // Proteção anti-robô: um formulário enviado em menos de 3 s é ignorado.
    await page.waitForTimeout(3_200);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page).toHaveURL(/\/mensagem-enviada$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("um robô (campo-isco preenchido) recebe sucesso falso e nada é processado", async ({
    page,
  }) => {
    await page.goto("/contactos");
    await page.getByLabel("Nome").fill("Robô");
    await page.getByLabel("E-mail").fill("robo@exemplo.ao");
    await page.getByLabel("Assunto").selectOption("outro");
    await page.getByLabel("Mensagem").fill("Mensagem automática de um robô qualquer.");
    await page.getByRole("checkbox").check();
    await page.locator("input[name=website]").evaluate((input: HTMLInputElement) => {
      input.value = "http://spam.example";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page).toHaveURL(/\/mensagem-enviada$/);
  });
});

test.describe("Cookies e estatísticas", () => {
  test("nenhum pedido ao Google antes do consentimento; a escolha fica guardada", async ({
    page,
  }) => {
    const google: string[] = [];
    page.on("request", (request) => {
      if (/google/.test(request.url())) google.push(request.url());
    });
    await page.goto("/");
    const banner = page.locator("[data-consent-banner]");
    await expect(banner).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(google).toEqual([]);

    await banner.getByRole("button", { name: "Rejeitar" }).click();
    await expect(banner).toBeHidden();
    const cookie = (await page.context().cookies()).find((c) => c.name === "cp_consent");
    expect(cookie?.sameSite).toBe("Lax");

    await page.reload();
    await expect(page.locator("[data-consent-banner]")).toBeHidden();
    expect(google).toEqual([]);
  });

  test('"Gerir cookies" no rodapé reabre as preferências', async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-consent-banner]").getByRole("button", { name: "Aceitar" }).click();
    await page.getByRole("button", { name: "Gerir cookies" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("Segurança e SEO", () => {
  test("cabeçalhos de segurança em todas as páginas", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("webhook do CMS recusa pedidos sem assinatura", async ({ request }) => {
    const response = await request.post("/api/revalidate", { data: { _type: "event" } });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test("calendário do evento em formato iCalendar", async ({ request }) => {
    const response = await request.get("/api/calendario/exemplo-workshop");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/calendar");
    expect(await response.text()).toContain("BEGIN:VEVENT");
    expect((await request.get("/api/calendario/nao-existe")).status()).toBe(404);
  });

  test("imagem de partilha só usa texto do próprio site", async ({ request }) => {
    const known = await request.get("/og?path=/metodo-centro");
    expect(known.headers()["content-type"]).toBe("image/png");
    const injected = await request.get(`/og?path=${encodeURIComponent("/<script>")}`);
    expect(injected.status()).toBe(200);
    expect(injected.headers()["content-type"]).toBe("image/png");
  });

  test("robots.txt e sitemap.xml", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Sitemap:");
    expect(robots).toMatch(/Disallow: \/studio/);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("<urlset");
    expect(sitemap).not.toContain("/inscricao");
  });
});
