import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
const liveURL = process.env.LIVE_URL?.replace(/\/$/, "");
const browser = {
  ...devices["Desktop Chrome"],
  locale: "pt-AO",
  timezoneId: "Africa/Luanda",
  // Browser já instalado no ambiente (ex.: imagem com Chromium); senão o do Playwright.
  launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {},
};

/**
 * Testes automáticos (Fase 18), com uma só ferramenta:
 * - unit: funções do site (validação, consentimento, anti-spam, calendário…), sem browser;
 * - e2e: o site real (build de produção com conteúdos [Exemplo]) num browser Chromium;
 * - live: o site publicado (LIVE_URL=https://…), só leituras: nunca envia formulários.
 */
export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  projects: [
    { name: "unit", testDir: "tests/unit" },
    {
      name: "e2e",
      testDir: "tests/e2e",
      use: { ...browser, baseURL },
    },
    { name: "live", testDir: "tests/live", use: { ...browser, baseURL: liveURL } },
  ],
  webServer:
    process.env.PLAYWRIGHT_UNIT_ONLY || liveURL
      ? undefined
      : {
          command: `npx next start -p ${PORT}`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
          env: { CONTENT_PREVIEW: "1", FORMS_DRY_RUN: "1" },
        },
});
