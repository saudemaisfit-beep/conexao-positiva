import { expect, test } from "@playwright/test";
import { applyAvailability, isPastEvent, registrationState } from "@/content/events";
import type { EventDetail } from "@/content/types";
import { buildIcs } from "@/lib/calendar/ics";
import { contactEmails } from "@/lib/email/templates";
import { formatKz } from "@/lib/format";
import { ogImageUrl, pageMetadata } from "@/lib/seo";
import { parseVideoUrl } from "@/lib/video";

const event = (overrides: Partial<EventDetail> = {}) =>
  ({
    slug: "workshop",
    title: "Workshop",
    category: "workshop",
    startsAt: "2027-03-15T09:00:00Z",
    endsAt: "2027-03-15T13:00:00Z",
    location: "Luanda",
    priceKz: null,
    status: "aberto",
    capacity: 40,
    ...overrides,
  }) as EventDetail;

test.describe("Eventos: vagas e estado das inscrições", () => {
  test("últimas vagas com 10 % ou menos da lotação; esgotado sem vagas", () => {
    expect(applyAvailability(event(), 10)).toMatchObject({ spotsLeft: 30, status: "aberto" });
    expect(applyAvailability(event(), 36)).toMatchObject({ spotsLeft: 4, status: "ultimas-vagas" });
    expect(applyAvailability(event(), 40)).toMatchObject({ spotsLeft: 0, status: "esgotado" });
    expect(applyAvailability(event(), 55)).toMatchObject({ spotsLeft: 0, status: "esgotado" });
  });

  test("um evento encerrado no CMS nunca reabre; sem lotação não há contagem", () => {
    expect(applyAvailability(event({ status: "encerrado" }), 0).status).toBe("encerrado");
    expect(applyAvailability(event({ capacity: undefined }), 99)).not.toHaveProperty("spotsLeft");
  });

  test("estado das inscrições", () => {
    const before = new Date("2027-03-01T00:00:00Z");
    const after = new Date("2027-03-16T00:00:00Z");
    expect(registrationState(event(), before)).toBe("aberto");
    expect(registrationState(event({ status: "esgotado" }), before)).toBe("lista-de-espera");
    expect(registrationState(event({ status: "encerrado" }), before)).toBe("encerrado");
    expect(registrationState(event(), after)).toBe("passado");
    // Termina às 13:00: às 12:00 ainda não passou.
    expect(isPastEvent(event(), new Date("2027-03-15T12:00:00Z"))).toBe(false);
  });
});

test.describe("Calendário (.ics)", () => {
  const ics = buildIcs(
    {
      uid: "workshop@conexaopositiva",
      title: "Liderança; equipas, e foco",
      description: "Linha 1\nLinha 2 \\ fim",
      location: "Luanda, Talatona",
      url: "https://exemplo.ao/eventos/workshop",
      startsAt: "2027-03-15T09:00:00Z",
      endsAt: "2027-03-15T13:00:00Z",
    },
    new Date("2027-01-01T00:00:00Z"),
  );

  test("datas em UTC e linhas terminadas em CRLF", () => {
    expect(ics).toContain("DTSTART:20270315T090000Z\r\n");
    expect(ics).toContain("DTEND:20270315T130000Z\r\n");
    expect(ics).toContain("DTSTAMP:20270101T000000Z\r\n");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  test("escapa ; , \\ e mudanças de linha (RFC 5545)", () => {
    expect(ics).toContain("SUMMARY:Liderança\\; equipas\\, e foco\r\n");
    expect(ics).toContain("LOCATION:Luanda\\, Talatona\r\n");
    expect(ics.replace(/\r\n /g, "")).toContain("DESCRIPTION:Linha 1\\nLinha 2 \\\\ fim\\n\\n");
  });

  test("nenhuma linha passa de 75 octetos", () => {
    const long = buildIcs({
      uid: "x",
      title: "Ç".repeat(100),
      description: "",
      location: "",
      url: "https://exemplo.ao",
      startsAt: "2027-03-15T09:00:00Z",
    });
    for (const line of long.split("\r\n")) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });
});

test.describe("Vídeos", () => {
  test("YouTube e Vimeo passam a endereços com menos rastreio", () => {
    expect(parseVideoUrl("https://youtu.be/dQw4w9WgXcQ")?.embedUrl).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    );
    expect(parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")?.provider).toBe(
      "YouTube",
    );
    expect(parseVideoUrl("https://m.youtube.com/shorts/dQw4w9WgXcQ")?.provider).toBe("YouTube");
    expect(parseVideoUrl("https://vimeo.com/123456789")?.embedUrl).toBe(
      "https://player.vimeo.com/video/123456789?autoplay=1&dnt=1",
    );
  });

  test("recusa outros sites e identificadores inválidos", () => {
    for (const url of [
      "https://evil.com/watch?v=dQw4w9WgXcQ",
      "https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/curto",
      "javascript:alert(1)",
      "não é url",
    ]) {
      expect(parseVideoUrl(url)).toBeNull();
    }
  });
});

test.describe("SEO", () => {
  test("canónico, Open Graph e imagem de partilha da própria página", () => {
    const meta = pageMetadata({ title: "Eventos", description: "Agenda", path: "/eventos" });
    expect(meta.alternates?.canonical).toBe("/eventos");
    expect(meta.openGraph).toMatchObject({ locale: "pt_AO", url: "/eventos" });
    expect(JSON.stringify(meta.openGraph)).toContain(ogImageUrl("/eventos"));
    expect(ogImageUrl("/insights/a b")).toBe("/og?path=%2Finsights%2Fa%20b");
  });
});

test.describe("E-mails de contacto", () => {
  test("o texto do formulário chega escapado ao HTML", () => {
    const [team, confirmation] = contactEmails(
      {
        name: "<b>Ana</b>",
        company: "",
        email: "ana@exemplo.ao",
        phone: "",
        subject: "outro",
        message: `<img src=x onerror="alert(1)">`,
        consent: true,
        website: "",
        startedAt: 0,
        turnstileToken: "",
      },
      { outro: "Outro" },
      ["equipa@exemplo.ao"],
    );
    expect(team?.html).not.toContain("<img");
    expect(team?.html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(confirmation?.html).not.toContain("<b>Ana</b>");
    expect(team?.replyTo).toBe("ana@exemplo.ao");
  });
});

test("formato de moeda em kwanzas", () => {
  expect(formatKz(25000).replace(/\s/g, " ")).toMatch(/25.000/);
});
