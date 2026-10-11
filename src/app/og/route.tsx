import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";
import { resolveOgContent } from "@/lib/og-content";

// Caminhos a partir da raiz do projeto (o servidor arranca sempre na raiz, com `next start`).
const asset = (file: string) => readFile(join(process.cwd(), file));
const fonts = Promise.all([
  asset("src/assets/fonts/manrope-latin-800-normal.woff"),
  asset("src/assets/fonts/inter-latin-500-normal.woff"),
  asset("public/brand/conexao-positiva/conexao-positiva-simbolo.png"),
]);

const palette = {
  conexao: { bg: "#082231", accent: "#0aa0e0", muted: "#b3e1f5", dot: "#c27f7c" },
  metodo: { bg: "#3a1717", accent: "#c27f7c", muted: "#e9c9c6", dot: "#e9c9c6" },
};

/**
 * Imagem de partilha (Open Graph, 1200×630) gerada com a identidade da marca.
 * /og?path=/insights/slug → título do artigo; caminho desconhecido → imagem geral.
 */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") ?? "/";
  const content = await resolveOgContent(path);
  const colors = palette[content.brand];
  const [manrope, inter, symbol] = await fonts;
  const logo = `data:image/png;base64,${symbol.toString("base64")}`;
  const titleSize = content.title.length > 70 ? 56 : content.title.length > 40 ? 64 : 76;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: colors.bg,
        color: "#ffffff",
        fontFamily: "Inter",
        position: "relative",
      }}
    >
      {/* Motivo da rede: círculos concêntricos, discretos, no canto */}
      <div
        style={{
          position: "absolute",
          right: -140,
          top: -140,
          width: 560,
          height: 560,
          borderRadius: 9999,
          border: `3px solid ${colors.accent}`,
          opacity: 0.25,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 360,
          height: 360,
          borderRadius: 9999,
          border: `3px solid ${colors.accent}`,
          opacity: 0.18,
          display: "flex",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
        <img src={logo} width={64} height={64} alt="" />
        <span style={{ fontFamily: "Manrope", fontSize: 30 }}>{siteConfig.name}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: colors.muted,
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: colors.dot,
              display: "flex",
            }}
          />
          {content.eyebrow}
        </div>
        <div
          style={{
            fontFamily: "Manrope",
            fontSize: titleSize,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          }}
        >
          {content.title}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: colors.accent }}>
        {new URL(siteConfig.url).host}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Manrope", data: manrope, weight: 800, style: "normal" },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
