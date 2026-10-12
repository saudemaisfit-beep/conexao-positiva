import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Verificação do site publicado (Fase 19). Só leituras: não envia formulários (criaria pedidos
 * e e-mails reais). Uso: LIVE_URL=https://conexaopositiva.ao npm run test:live
 */
const live = process.env.LIVE_URL?.replace(/\/$/, "") ?? "";
test.skip(!live, "Defina LIVE_URL com o endereço do site publicado.");

const origin = live ? new URL(live).origin : "";
const PAGES = ["/", "/sobre", "/solucoes", "/metodo-centro", "/eventos", "/insights", "/contactos"];

test.describe("Endereço e HTTPS", () => {
  test("o site usa HTTPS", () => {
    expect(origin.startsWith("https://")).toBe(true);
  });

  test("http:// redireciona para https://", async ({ request }) => {
    const response = await request.get(origin.replace("https://", "http://"), {
      maxRedirects: 0,
    });
    expect([301, 302, 307, 308]).toContain(response.status());
    expect(response.headers().location ?? "").toMatch(/^https:\/\//);
  });

  test("a variante com/sem www leva ao mesmo domínio", async ({ request }) => {
    const host = new URL(origin).hostname;
    const other = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
    const response = await request.get(`https://${other}/`).catch(() => null);
    test.skip(!response, `${other} não responde (DNS por configurar).`);
    expect(new URL(response!.url()).hostname).toBe(host);
  });
});

test.describe("Domínio certo em todo o lado (NEXT_PUBLIC_SITE_URL no build)", () => {
  test("canónico e Open Graph apontam para o domínio publicado", async ({ page }) => {
    await page.goto("/sobre");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}/sobre`);
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    expect(ogUrl).toBe(`${origin}/sobre`);
    const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(ogImage?.startsWith(origin)).toBe(true);
  });

  test("robots.txt e sitemap.xml com o domínio publicado (nunca localhost)", async ({
    request,
  }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? "");
    expect(locs.length).toBeGreaterThan(0);
    expect(locs.filter((loc) => !loc.startsWith(`${origin}/`))).toEqual([]);
  });
});

test.describe("Páginas", () => {
  for (const path of PAGES) {
    test(`${path} abre, com um h1, sem erros de JavaScript nem bloqueios da CSP`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });
  }

  test("página inexistente devolve 404", async ({ request }) => {
    expect((await request.get("/pagina-que-nao-existe-xyz")).status()).toBe(404);
  });

  test("CMS em /studio abre", async ({ request }) => {
    expect((await request.get("/studio")).status()).toBe(200);
  });

  test("imagem de partilha", async ({ request }) => {
    const response = await request.get("/og?path=/");
    expect(response.headers()["content-type"]).toBe("image/png");
  });
});

test.describe("Segurança e privacidade", () => {
  test("cabeçalhos de segurança", async ({ request }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("ficheiros estáticos com cache longa", async ({ page, request }) => {
    await page.goto("/");
    const script = await page.locator('script[src*="/_next/static/"]').first().getAttribute("src");
    const headers = (await request.get(script!)).headers();
    expect(headers["cache-control"]).toContain("immutable");
  });

  test("nenhum pedido ao Google antes do consentimento", async ({ page }) => {
    const google: string[] = [];
    page.on("request", (request) => {
      if (/google/.test(request.url())) google.push(request.url());
    });
    await page.goto("/");
    await expect(page.locator("[data-consent-banner]")).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(google).toEqual([]);
  });

  test("webhook do CMS recusa pedidos sem assinatura", async ({ request }) => {
    const response = await request.post("/api/revalidate", { data: { _type: "event" } });
    // 401 = segredo configurado e assinatura recusada; 500 = SANITY_REVALIDATE_SECRET em falta.
    expect(response.status(), "SANITY_REVALIDATE_SECRET está definido?").toBe(401);
  });

  test("página inicial sem violações de acessibilidade (axe)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
});
