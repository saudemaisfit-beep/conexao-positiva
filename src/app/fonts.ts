import localFont from "next/font/local";

// Fontes variáveis incluídas no projeto (Fontsource, licença OFL): build sem dependência
// da rede e um único ficheiro por família. O subconjunto "latin" cobre o português
// (á, à, â, ã, ç, é, ê, í, ó, ô, õ, ú).

export const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
