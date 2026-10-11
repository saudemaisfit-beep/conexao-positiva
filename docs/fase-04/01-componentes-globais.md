# Fase 4 — Header, Footer e componentes globais

## Stack instalada

| Pacote                                 | Versão | Nota                                                                                                                                                |
| -------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js                                | 16.3.6 | App Router, Turbopack; versão estável mais recente com ≥ 2 semanas (a 16.4.0 saiu a 6/10/2026)                                                      |
| React                                  | 19.3.0 |                                                                                                                                                     |
| TypeScript                             | 6.0.3  | `strict` + `noUncheckedIndexedAccess`. O TypeScript 7 (nativo) ainda não é suportado pelo typescript-eslint (< 6.1)                                 |
| Tailwind CSS                           | 4.3.3  | Tokens da Fase 3 (`src/styles/`)                                                                                                                    |
| next-intl                              | 4.14.6 | `pt` sem prefixo; preparado para `en`                                                                                                               |
| ESLint                                 | 9.39.5 | `eslint-config-next` 16.3.6. O ESLint 10 foi testado e falha (o `eslint-plugin-react` ainda não é compatível); atualizar quando o plugin o suportar |
| Radix Dialog                           | 1.1.23 | Menu mobile e preferências de cookies (focus trap, Esc, devolução de foco)                                                                          |
| Lucide                                 | 1.47.0 | Ícones. A versão 1.x removeu os ícones de marcas (redes sociais): o rodapé usa links de texto                                                       |
| Fontsource Manrope / Inter (variáveis) | 5.3.0  | Carregadas com `next/font/local`                                                                                                                    |

Versões fixadas (sem `^`) para builds reprodutíveis.

## Componentes criados

| Componente                                               | Ficheiro                                   | Tipo     | Notas                                                                                                                                                  |
| -------------------------------------------------------- | ------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`, `ButtonLink`, `buttonVariants`                 | `components/ui/button.tsx`                 | Servidor | Variantes `primary`, `secondary`, `inverse`, `inverse-outline`, `link`; tamanhos `sm` 40 · `md` 48 · `lg` 56                                           |
| `Container`                                              | `components/layout/container.tsx`          | Servidor | Largura máx. 1200 px + margem fluida                                                                                                                   |
| `Section`                                                | `components/layout/section.tsx`            | Servidor | Tons `base`, `alt`, `inverse` (marca `data-surface` para o foco)                                                                                       |
| `Logo`                                                   | `components/common/logo.tsx`               | Servidor | Símbolo oficial + nome (composição provisória)                                                                                                         |
| `SkipLink`                                               | `components/common/skip-link.tsx`          | Servidor | Primeiro elemento focável                                                                                                                              |
| `Header`                                                 | `components/layout/header.tsx`             | Servidor | Compõe `HeaderShell`, `DesktopNav`, `MobileMenu`                                                                                                       |
| `HeaderShell`                                            | `components/layout/header-shell.tsx`       | Cliente  | Fixo no topo; 80 → 64 px e sombra após scroll                                                                                                          |
| `DesktopNav` + painel Soluções                           | `components/layout/desktop-nav.tsx`        | Cliente  | Clique, Enter/Espaço, ↓ foca o 1.º serviço, Esc fecha e devolve o foco, clique fora, hover com atraso de 150 ms (só rato)                              |
| `MobileMenu`                                             | `components/layout/mobile-menu.tsx`        | Cliente  | Ecrã inteiro, Soluções em acordeão, CTA em largura total, contactos rápidos; fecha ao navegar e ao passar a desktop                                    |
| `Footer`                                                 | `components/layout/footer.tsx`             | Servidor | 4 colunas (desktop); contactos e redes só aparecem quando configurados                                                                                 |
| `WhatsAppButton`                                         | `components/common/whatsapp-button.tsx`    | Cliente  | Aparece após 1 s ou scroll; escondido no mobile em páginas de formulário; não é mostrado sem número configurado                                        |
| `Breadcrumbs`                                            | `components/common/breadcrumbs.tsx`        | Servidor | Com JSON-LD `BreadcrumbList`; no mobile mostra só "← Voltar a…". Usado a partir da Fase 6                                                              |
| `ConsentProvider`, `CookieBanner`, `ManageCookiesButton` | `components/consent/`                      | Cliente  | Aceitar e Rejeitar com o mesmo peso; preferências por categoria; cookie `cp_consent` versionado (6 meses); evento `cp:consent-change` para o analytics |
| Página 404                                               | `app/[locale]/not-found.tsx` + `[...rest]` | Servidor | Com header e rodapé, sugestões de navegação                                                                                                            |

## Decisões

- **Fontes locais** (`next/font/local` + Fontsource) em vez de `next/font/google`: build sem dependência de rede (o download da Google falhava no ambiente de build por proxy), um ficheiro variável por família (Inter 48 KB, Manrope 25 KB) e apenas o subconjunto `latin`, suficiente para português.
- **Raiz do projeto fixada** em `next.config.mjs` (`turbopack.root`): o projeto está numa subpasta de outro repositório com o seu próprio `package-lock.json`.
- **1024–1279 px**: o botão do header mostra "Proposta" e os links ficam mais compactos; "Solicitar proposta" completo a partir de 1280 px. Medido: sem scroll horizontal em nenhuma largura.
- **Rodapé no mobile**: Navegação e Soluções lado a lado em duas colunas, em vez de acordeões (menos toques, tudo visível).
- **WhatsApp**: usa a cor primária da marca (sem verde WhatsApp) para não acrescentar uma cor ao sistema; o rodapé tem espaço inferior para o botão nunca tapar os links legais.
- **Dados institucionais** (`src/config/site.ts`): telefone, e-mail, localização e redes estão a `null` até serem fornecidos; nada é inventado e nada aparece vazio. Passam para o CMS na Fase 13.
- **Home provisória** com o hero de texto; a Home completa é a Fase 5. As restantes páginas do menu mostram a 404 até serem construídas.

## Verificação

- `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`: sem erros.
- Chromium a 360, 390, 430, 768, 1024, 1280 e 1440 px (Home e 404): sem scroll horizontal, **0 violações axe** (WCAG 2.0/2.1/2.2 A e AA), sem erros de consola.
- Interações testadas: painel Soluções por teclado, menu mobile (focus trap, Esc, devolução de foco, fecha ao navegar), skip link, header ao fazer scroll, aviso de cookies (rejeitar, aceitar, persistência após recarregar, preferências), link do WhatsApp.
- Cabeçalhos de segurança base ativos (HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`); a CSP completa fica para a fase de segurança.
