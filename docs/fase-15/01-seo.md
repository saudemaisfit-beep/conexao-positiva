# Fase 15 — SEO

## Objetivo

O site fica fácil de encontrar no Google e bem apresentado quando é partilhado (WhatsApp, LinkedIn, Facebook, X), sem dados inventados.

## O que foi feito

| Elemento                   | Onde                                                                      | Notas                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Metadados por página       | `src/lib/seo.ts` (`pageMetadata`)                                         | Título, descrição, **canónico**, Open Graph (`pt_AO`, `website`/`article`) e Twitter `summary_large_image` em todas as páginas |
| Imagens de partilha        | `src/app/og/route.tsx` (`/og?path=…`)                                     | 1200×630 com a marca; título real de cada artigo, evento, experiência, serviço e página; marsala no Método e artigos do método |
| `sitemap.xml`              | `src/app/sitemap.ts`                                                      | Páginas fixas, 8 serviços, eventos, experiências, artigos (com data de atualização) e categorias com artigos                   |
| `robots.txt`               | `src/app/robots.ts`                                                       | Bloqueia `/studio`, `/api/`, confirmações e inscrições; aponta para o sitemap                                                  |
| Dados estruturados globais | `OrganizationJsonLd` (layout)                                             | `Organization` + `WebSite`; contactos e redes só quando preenchidos no CMS                                                     |
| Páginas legais             | `/politica-de-privacidade`, `/politica-de-cookies`, `/termos-e-condicoes` | Texto-base para **validação jurídica** (ver abaixo)                                                                            |

Já existiam das fases anteriores: `BreadcrumbList` em todas as páginas interiores, `Service` (serviços), `Event` (eventos), `Article` (artigos), `FAQPage` (onde há FAQ), `noindex` nas confirmações e inscrições.

## Decisões

- **Imagem de partilha por caminho, não por texto:** `/og` recebe apenas o caminho de uma página do site e lê o título do conteúdo real. Caminhos desconhecidos ou inválidos recebem a imagem geral, por isso ninguém consegue gerar imagens com frases arbitrárias no domínio da marca. Fica fora de `/api/` para que as redes sociais (que respeitam o `robots.txt`) a possam ler.
- Fontes das imagens (Manrope 800 e Inter 500, WOFF) incluídas em `src/assets/fonts/` com as licenças OFL; o gerador de imagens não aceita WOFF2.
- Sem `hreflang` por agora (só português); a estrutura do next-intl já o permite quando houver inglês (D8).
- O domínio vem de `NEXT_PUBLIC_SITE_URL`, que tem de estar definido **no momento do build** na Hostinger (`https://conexaopositiva.ao`).

## Páginas legais

O texto descreve o que o site faz de facto: dados de cada formulário, finalidades e fundamentos, prestadores (Hostinger, Supabase, Cloudflare, Google Analytics só com consentimento; Sanity sem dados pessoais), transferências para fora de Angola, prazos de conservação (D6), direitos ao abrigo da Lei n.º 22/11 e reclamação à APD, cookies reais (`cp_consent`, Turnstile, Google Analytics com consentimento, rascunho em `sessionStorage`, vídeos só após clique) e condições de inscrição em eventos (D3/D4).

Ficam por preencher (entre `[ ]`): denominação social, NIF, morada, e-mail de privacidade, foro competente, prazos de pagamento e política de cancelamento e reembolso. Enquanto `reviewed: false` (em `src/content/legal.ts`), cada página mostra o aviso "Texto-base em validação jurídica".

## Verificação

- Meta tags verificadas em 9 páginas: título, canónico, `og:*`, `twitter:*`, JSON-LD válido (Organization + WebSite em todas; tipos específicos por página); `noindex, follow` nas confirmações e inscrições.
- `/og`: imagens corretas para Home, artigo, Método (marsala), evento e página legal; `/../etc/passwd` e `<script>` → imagem geral.
- Produção: `sitemap.xml` com 20 endereços reais e **nenhum conteúdo de exemplo**; `robots.txt` com o domínio de produção.
- Páginas legais sem violações de acessibilidade (axe) a 360, 768 e 1280 px; sem regressões nas Fases 10–12.

## Pendências

- Cliente: preencher os dados entre `[ ]` e validar os textos legais com o jurista; depois, `reviewed: true`.
- Depois do lançamento: registar o site e o sitemap no Google Search Console (Fase 19).
