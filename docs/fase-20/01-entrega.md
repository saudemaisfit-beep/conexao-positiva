# Fase 20 — Entrega e manutenção

Documento para quem mantém o site (programador ou agência). O guia para a equipa da Conexão Positiva está em [`GUIA-DO-CLIENTE.md`](../../GUIA-DO-CLIENTE.md).

## Arquitetura

```
Visitante ──HTTPS──► Hostinger (Node.js, `next start`)
                       │  páginas geradas no build + regeneradas por webhook (ISR)
                       ├──► Sanity (conteúdos; Studio em /studio)
                       ├──► Supabase (formulários; só no servidor, chave secreta)
                       ├──► SMTP da Hostinger (e-mails)
                       ├──► Cloudflare Turnstile (anti-robô; validado no servidor)
                       └──► Google Analytics 4 (no browser, só após consentimento)
GitHub (main) ──deploy──► Hostinger    ·    PR ──► CI (lint, tipos, build, testes)
```

Detalhe: [arquitetura técnica (Fase 1)](../fase-01/03-arquitetura-tecnica.md), atualizada pelas decisões D10 (Hostinger) e D11 (SMTP).

| Camada         | Tecnologia (versão fixada)                                                |
| -------------- | ------------------------------------------------------------------------- |
| Framework      | Next.js 16.3.8 (App Router), React 19.3, TypeScript 6 (strict)            |
| Estilo         | Tailwind CSS 4.3 com tokens do Design System (`src/styles/`)              |
| Textos         | next-intl 4.14 (`messages/pt.json`; preparado para inglês, D8)            |
| CMS            | Sanity 6.16 + next-sanity 13.3 (Studio embebido)                          |
| Formulários    | React Hook Form 7.88 + Zod 4.6 (mesmos esquemas no browser e no servidor) |
| Dados / e-mail | Supabase (REST, sem SDK) · nodemailer 10.0                                |
| Testes         | Playwright 1.63 + axe (unitários, ponta a ponta e site publicado)         |

## Contas e serviços

Todos devem estar em nome da Conexão Positiva (D9), com acessos individuais.

| Serviço               | Para quê                     | Variáveis                                                | Estado                                  |
| --------------------- | ---------------------------- | -------------------------------------------------------- | --------------------------------------- |
| GitHub                | Código, CI, origem do deploy | —                                                        | ✅ `saudemaisfit-beep/conexao-positiva` |
| Hostinger (Business)  | Alojamento, domínio, e-mail  | `NEXT_PUBLIC_SITE_URL`, `SMTP_*`, `EMAIL_*`              | 🔶 deploy feito; verificar              |
| Sanity                | Conteúdos                    | `NEXT_PUBLIC_SANITY_*`, `SANITY_REVALIDATE_SECRET`       | ⏳ por criar                            |
| Supabase              | Pedidos e inscrições         | `SUPABASE_URL`, `SUPABASE_SECRET_KEY`                    | ⏳ depois da validação D5               |
| Cloudflare Turnstile  | Anti-robô                    | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | ⏳ recomendado                          |
| Google Analytics 4    | Estatísticas                 | `NEXT_PUBLIC_GA_ID`                                      | ⏳ opcional                             |
| Google Search Console | Indexação, Core Web Vitals   | —                                                        | ⏳ depois do lançamento                 |

Todas as variáveis: [`.env.example`](../../.env.example). Passos: [Deploy (Fase 19)](../fase-19/01-deploy-hostinger.md).

## Comandos

| Comando                                | O que faz                                             |
| -------------------------------------- | ----------------------------------------------------- |
| `npm run dev`                          | Desenvolvimento (`CONTENT_PREVIEW=1` mostra exemplos) |
| `npm run build` / `npm start`          | Build de produção (webpack) e servidor                |
| `npm run check`                        | Lint + tipos + formatação                             |
| `npm test`                             | Unitários + build de teste + ponta a ponta            |
| `LIVE_URL=https://… npm run test:live` | Verificação só de leitura do site publicado           |

## Decisões

| #   | Decisão                           | Estado                                                          |
| --- | --------------------------------- | --------------------------------------------------------------- |
| D1  | Repositório próprio               | ✅ `conexao-positiva`                                           |
| D2  | Domínio e variante canónica       | 🔶 `conexaopositiva.ao`; confirmar redirecionamento do `www`    |
| D3  | Eventos pagos                     | ✅ reserva + instruções por e-mail; pagamento online é evolução |
| D4  | Lista de espera                   | ✅ ativa                                                        |
| D5  | Dados pessoais alojados na Europa | ⏳ **validação jurídica** (Lei n.º 22/11; bloqueia o Supabase)  |
| D6  | Conservação (24 meses / 12 meses) | ✅ implementada; agendar `purge_expired_records()` no Supabase  |
| D7  | Gestão de leads                   | ✅ e-mail + Supabase; CRM é evolução                            |
| D8  | Inglês                            | ✅ arquitetura pronta; tradução é evolução                      |
| D9  | Contas em nome da empresa         | ⏳ cliente                                                      |
| D10 | Hostinger, plano Business         | ✅                                                              |
| D11 | E-mail pela Hostinger (SMTP)      | ✅ código pronto; ⏳ caixa por criar                            |

## Antes do lançamento

1. Merge dos PRs pendentes e novo deploy; `npm run test:live` sem falhas.
2. Variáveis de produção definidas (pelo menos `NEXT_PUBLIC_SITE_URL`, SMTP e Sanity); `CONTENT_PREVIEW` e `FORMS_DRY_RUN` **ausentes**.
3. Conteúdos reais no Studio; textos para aprovação das Fases 6, 7 e 8 validados pelo cliente.
4. Páginas legais: preencher os campos `[ ]` em `src/content/legal.ts`, validação jurídica, `reviewed: true`.
5. D5 validada → Supabase ligado → envio de teste de cada formulário (base de dados + dois e-mails, fora do spam).
6. Turnstile ativo; Search Console com o sitemap submetido.

## Manutenção

| Quando             | O quê                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Mensalmente        | `npm outdated` e `npm audit --omit=dev`; atualizar versões de correção (patch) num PR — o CI e os testes validam             |
| A cada versão nova | Next.js/React/Sanity: ler as notas de lançamento; atualizar num PR próprio; correr `npm test` e `test:live` depois do deploy |
| Trimestralmente    | Rodar as chaves secretas (Supabase, Turnstile, segredo do webhook, palavra-passe SMTP) e atualizar no hPanel                 |
| Anualmente         | Rever as Políticas (Privacidade, Cookies) e o aviso de cookies; incrementar `CONSENT_VERSION` se as categorias mudarem       |

Regras do projeto (manter):

- **Segredos só nas variáveis do hPanel.** Nunca com prefixo `NEXT_PUBLIC_`, nunca no repositório.
- Versões **exatas** no `package.json` para tudo o que corre no site (exceções: tipos de letra Fontsource e ESLint) e lockfile no repositório.
- Nenhum conteúdo inventado: o que falta mostra-se como `[ ]` ou fica escondido.
- Cada alteração por PR; o CI (lint, tipos, build, 74 testes) tem de passar antes do merge.
- Não reativar o Turbopack no build enquanto a Hostinger tiver glibc < 2.30 (ver Fase 19).

## Limitações conhecidas

- **`npm audit`:** 19 avisos, todos nas ferramentas de linha de comandos do Sanity (não no site em funcionamento). Rever quando o Sanity publicar correções ([Fase 18](../fase-18/01-testes.md#dependências-npm-audit)).
- **Limite de pedidos por IP** pode ser contornado se o proxy da Hostinger não substituir `X-Forwarded-For`; o Turnstile cobre este caso ([Fase 19](../fase-19/01-deploy-hostinger.md#ip-dos-visitantes-limite-de-pedidos)).
- **Build mais lento** na Hostinger (compilador WASM).
- **Logótipos em SVG** ainda não fornecidos (usam-se PNG transparentes).
- Textos de Soluções, Método, Home e páginas legais estão no código, não no CMS.

## Evoluções possíveis

- Pré-visualização de rascunhos no Studio (Draft Mode / Presentation).
- Passar para o CMS os textos de Soluções, Método e Sobre Nós, depois de aprovados.
- Versão em inglês (D8).
- Pagamento online de eventos, ex.: Multicaixa Express (D3).
- Integração com CRM (D7).
- Painel interno para os pedidos (em vez do Table Editor do Supabase).

## Índice da documentação

| Fase | Documento                                                              |
| ---- | ---------------------------------------------------------------------- |
| 1    | [Planeamento](../fase-01/)                                             |
| 2    | [Wireframes e UX](../fase-02/)                                         |
| 3    | [Design System](../fase-03/01-design-system.md)                        |
| 4–12 | Páginas e componentes: [fase-04](../fase-04/) … [fase-12](../fase-12/) |
| 13   | [CMS](../fase-13/01-cms.md)                                            |
| 14   | [Base de dados e formulários](../fase-14/01-base-de-dados.md)          |
| 15   | [SEO](../fase-15/01-seo.md)                                            |
| 16   | [Performance](../fase-16/01-performance.md)                            |
| 17   | [Acessibilidade](../fase-17/01-acessibilidade.md)                      |
| 18   | [Testes](../fase-18/01-testes.md)                                      |
| 19   | [Deploy na Hostinger](../fase-19/01-deploy-hostinger.md)               |
| 20   | Este documento + [Guia do cliente](../../GUIA-DO-CLIENTE.md)           |
