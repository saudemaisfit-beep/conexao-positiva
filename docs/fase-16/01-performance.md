# Fase 16 — Performance

## Objetivo

Site rápido em telemóveis e redes móveis, com terceiros carregados só quando necessários e uma política de segurança de conteúdo (CSP) que não parte nada.

## Resultados (Lighthouse 13.5, telemóvel com rede simulada)

| Página                    | Antes                        | Depois                          |
| ------------------------- | ---------------------------- | ------------------------------- |
| `/`                       | P93 · LCP 2,6 s · TBT 230 ms | **P97** · LCP 2,6 s · TBT 50 ms |
| `/metodo-centro`          | P79 · LCP 4,8 s              | **P96** · LCP 2,7 s             |
| `/eventos`                | P73 · **CLS 0,424**          | **P94** · CLS 0                 |
| `/solucoes/team-building` | P94                          | P96                             |
| `/insights/…` (artigo)    | P97                          | P96–97                          |
| `/solicitar-proposta`     | P91                          | P92                             |

Todas as páginas medidas: **performance 92–99, acessibilidade 100, boas práticas 100, SEO 100**, CLS 0. (Valores do Lighthouse variam alguns pontos entre execuções.)

## O que mudou

1. **Animações de entrada sem atrasar o LCP.** As animações do topo começavam com `opacity: 0` (o browser só conta o LCP quando o texto fica visível) e sem `fill-mode` (o texto piscava durante o atraso). Agora começam em `0.01` (visualmente igual) com `both`. Os reveals por scroll passaram a ser só deslize, **sem transparência**: o texto tem sempre o contraste total (WCAG 1.4.3).
2. **Filtros e paginação sem `Suspense`** (`src/lib/use-url-search.ts`). Eventos, Experiências e Insights eram desenhados no servidor como "fallback" e substituídos por elementos novos no browser, o que causava o salto de layout em `/eventos` e adiava o LCP. Agora o servidor desenha a vista por defeito e o browser reaproveita-a; os filtros continuam no URL (partilháveis, com "voltar").
3. **Aviso de cookies no HTML inicial.** Era desenhado só depois da hidratação e passava a ser o LCP em várias páginas. Um script mínimo no `<head>` marca quem já escolheu e o CSS esconde-o antes da primeira pintura (sem piscar); um cookie antigo volta a mostrar o aviso.
4. **Menos dados para o browser.** Só os textos usados por componentes interativos seguem para o cliente (`src/i18n/client-messages.ts`).
5. **Logótipo do Método** com `fetchPriority="high"` (era o LCP da página).
6. **Zod sem JIT** (`z.config({ jitless: true })`): evita o `eval` que a CSP bloqueia.

## Content Security Policy

Definida em `next.config.ts`, com a lista exata do que o site carrega:

| Recurso        | Origens permitidas                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Scripts        | o próprio site, Cloudflare Turnstile, Google Tag Manager (só após consentimento)                                          |
| Imagens        | o próprio site, `data:`/`blob:`, CDN do Sanity, Google Analytics                                                          |
| Ligações (XHR) | o próprio site, Turnstile, Google Analytics                                                                               |
| Frames         | Turnstile, `youtube-nocookie.com`, `player.vimeo.com`                                                                     |
| Bloqueado      | plugins (`object-src 'none'`), ser incorporado noutros sites (`frame-ancestors 'none'`), formulários para outros domínios |

`'unsafe-inline'` em scripts: o Next.js usa scripts inline de arranque; a alternativa (nonce por pedido) obrigaria a renderizar todas as páginas a cada pedido e acabaria com o cache estático. O `/studio` tem uma política própria, mais larga (API e WebSocket do Sanity, fontes e avatares), só nesse caminho. Verificado: 0 violações no site e no Studio.

## Google Analytics 4

- `NEXT_PUBLIC_GA_ID` (vazio = sem analytics).
- **Nenhum pedido à Google antes do consentimento**; o script só é carregado depois de aceitar as estatísticas. Consent Mode v2 com publicidade sempre recusada.
- Retirar o consentimento desativa a recolha e apaga os cookies `_ga`.
- Eventos: `page_view` em cada navegação, `generate_lead` (contacto, proposta), `sign_up` (inscrição, com o slug do evento), `contact_whatsapp`. Sem dados pessoais.

## Verificação

- Lighthouse antes/depois em 13 páginas (tabela acima).
- Consentimento: 0 pedidos à Google antes de aceitar; script e `page_view` depois; cookie `_ga` apagado ao retirar.
- Aviso de cookies: primeira visita (com e sem JS), quem já escolheu (com e sem JS), cookie antigo; sem erros de hidratação.
- Sem erros de consola, textos em falta nem violações de CSP ao percorrer as páginas interativas (filtros, paginação, vídeo, menu móvel, formulários).
- Regressão completa das Fases 9–12 (filtros, "voltar", URLs diretos, formulários, lista de espera) em produção e pré-visualização.

## Pendências

- Medir de novo no servidor da Hostinger depois do deploy (Fase 19), com o Search Console e dados reais (Core Web Vitals).
- Quando houver fotografias reais: confirmar `sizes` e prioridade da imagem principal de cada página.
