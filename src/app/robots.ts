import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Tudo indexável exceto o Studio, a API e as páginas de confirmação/inscrição. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/studio",
        "/api/",
        "/proposta-recebida",
        "/mensagem-enviada",
        "/inscricao-confirmada",
        "/eventos/*/inscricao",
      ],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
