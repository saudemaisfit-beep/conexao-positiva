import { expect, test } from "@playwright/test";
import {
  createConsent,
  parseConsent,
  readConsentCookie,
  serializeConsentCookie,
} from "@/lib/consent";
import { escapeHtml } from "@/lib/email/templates";
import { rateLimit } from "@/lib/security/rate-limit";
import { looksLikeSpam } from "@/lib/security/spam";

test.describe("Anti-spam", () => {
  const now = 1_800_000_000_000;

  test("campo-isco preenchido é robô", () => {
    expect(looksLikeSpam({ website: "http://spam", startedAt: now - 60_000 }, now)).toBe(true);
  });

  test("menos de 3 s ou mais de 24 h de preenchimento é robô", () => {
    expect(looksLikeSpam({ startedAt: now - 2_000 }, now)).toBe(true);
    expect(looksLikeSpam({ startedAt: now - 25 * 3_600_000 }, now)).toBe(true);
    expect(looksLikeSpam({}, now)).toBe(true);
  });

  test("uma pessoa normal passa", () => {
    expect(looksLikeSpam({ website: "", startedAt: now - 45_000 }, now)).toBe(false);
  });
});

test.describe("Limite de pedidos", () => {
  test("5 envios em 10 minutos por chave; outras chaves não são afetadas", async () => {
    const key = `teste:${Math.random()}`;
    const results = [];
    for (let i = 0; i < 6; i++) results.push((await rateLimit(key)).allowed);
    expect(results).toEqual([true, true, true, true, true, false]);
    expect((await rateLimit(`${key}:outro`)).allowed).toBe(true);
  });

  test("a janela reinicia ao fim do tempo", async () => {
    const key = `teste:${Math.random()}`;
    expect((await rateLimit(key, 1, 50)).allowed).toBe(true);
    expect((await rateLimit(key, 1, 50)).allowed).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect((await rateLimit(key, 1, 50)).allowed).toBe(true);
  });
});

test.describe("Consentimento de cookies", () => {
  test("ida e volta pelo cookie", () => {
    const consent = createConsent(true);
    const cookie = serializeConsentCookie(consent, true);
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Secure");
    expect(cookie).toMatch(/Max-Age=15552000/);
    const header = `outro=1; ${cookie.split(";")[0]}; mais=2`;
    expect(readConsentCookie(header)).toEqual(consent);
  });

  test("sem Secure em http (desenvolvimento)", () => {
    expect(serializeConsentCookie(createConsent(false), false)).not.toContain("Secure");
  });

  test("cookie corrompido, de outra versão ou com tipos errados conta como sem escolha", () => {
    for (const raw of [
      "%7Bnao-json",
      encodeURIComponent(JSON.stringify({ version: 0, analytics: true, updatedAt: "x" })),
      encodeURIComponent(JSON.stringify({ version: 1, analytics: "sim", updatedAt: "x" })),
      "",
      undefined,
    ]) {
      expect(parseConsent(raw)).toBeNull();
    }
  });
});

test.describe("E-mails", () => {
  test("escapa HTML vindo dos formulários", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'a'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;a&#39;",
    );
  });
});
