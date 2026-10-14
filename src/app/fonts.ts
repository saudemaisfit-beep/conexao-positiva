import localFont from "next/font/local";

// Fontes variáveis incluídas no projeto (Fontsource, licença OFL): build sem dependência
// da rede e um único ficheiro por família. O subconjunto "latin" cobre o português
// (á, à, â, ã, ç, é, ê, í, ó, ô, õ, ú).

// Identidade do site (landing do Método C.E.N.T.R.O.): títulos em Playfair Display e texto em
// Montserrat.
export const playfair = localFont({
  src: "../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2",
  weight: "400 900",
  variable: "--font-playfair",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const montserrat = localFont({
  src: "../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
