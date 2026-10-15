import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy: lista exata do que o site carrega.
 * - 'unsafe-inline' em scripts: o Next.js injeta scripts inline de arranque; a alternativa
 *   (nonce por pedido) obrigaria a renderizar todas as páginas a cada pedido e acabaria com
 *   o cache estático (ISR). Mantém-se o resto da política estrita.
 * - Terceiros só os necessários: Turnstile (Cloudflare), Google Analytics (só após
 *   consentimento), imagens do Sanity e vídeos do YouTube/Vimeo (só após clique).
 */
/** @param {Record<string, string[]>} directives */
const csp = (directives) =>
  Object.entries(directives)
    .map(([name, values]) => [name, ...values].join(" ").trim())
    .join("; ");

const siteCsp = csp({
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    "https://challenges.cloudflare.com",
    "https://www.googletagmanager.com",
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://cdn.sanity.io",
    "https://*.google-analytics.com",
    "https://*.googletagmanager.com",
  ],
  "font-src": ["'self'"],
  "connect-src": [
    "'self'",
    "https://challenges.cloudflare.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
  ],
  "frame-src": [
    "https://challenges.cloudflare.com",
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
  ],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
});

// O Sanity Studio (/studio) fala com a API do Sanity (HTTPS e WebSocket) e mostra avatares
// das contas; tem uma política própria, mais larga, só nesse caminho.
const studioCsp = csp({
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://*.sanity.io"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:", "https://*.sanity.io"],
  "connect-src": ["'self'", "https://*.sanity.io", "wss://*.sanity.io", "https://*.sanity.work"],
  "frame-src": ["'self'", "https://*.sanity.io"],
  "worker-src": ["'self'", "blob:"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "frame-ancestors": ["'none'"],
});

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

// Raiz do projeto fixa (evita que o Next.js procure um package-lock.json em pastas acima).
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Mantém a URL original para o next-intl reescrever / para /pt sem um ciclo de redirecionamento.
  skipProxyUrlNormalize: true,
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Imagens publicadas no Sanity (só do projeto configurado).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "sem-projeto"}/**`,
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/((?!studio).*)",
        headers: [{ key: "Content-Security-Policy", value: siteCsp }],
      },
      { source: "/studio/:path*", headers: [{ key: "Content-Security-Policy", value: studioCsp }] },
      { source: "/studio", headers: [{ key: "Content-Security-Policy", value: studioCsp }] },
    ];
  },
};

export default withNextIntl(nextConfig);
