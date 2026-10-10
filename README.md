# Conexão Positiva — Website institucional

Plataforma institucional e comercial da **Conexão Positiva**: desenvolvimento humano, formação, eventos e experiências corporativas, incluindo o **Método C.E.N.T.R.O.**

> Este projeto é independente do restante repositório (Creator Market AO). Recomenda-se movê-lo para um repositório próprio antes do deploy (ver `docs/fase-01/04-conteudos-e-decisoes-pendentes.md`).

## Estado

| Fase  | Descrição                                     | Estado       |
| ----- | --------------------------------------------- | ------------ |
| 1     | Planeamento e sitemap                         | ✅ Concluída |
| 2     | Wireframes e estrutura UX                     | ✅ Concluída |
| 3     | Design System (cores oficiais azul e marsala) | ✅ Concluída |
| 4     | Header, Footer e componentes globais          | ✅ Concluída |
| 5     | Home                                          | ✅ Concluída |
| 6     | Sobre Nós                                     | ✅ Concluída |
| 7     | Soluções                                      | ✅ Concluída |
| 8     | Método C.E.N.T.R.O.                           | ✅ Concluída |
| 9     | Eventos                                       | ✅ Concluída |
| 10    | Experiências                                  | ✅ Concluída |
| 11    | Insights                                      | ✅ Concluída |
| 12    | Contactos e Proposta                          | ✅ Concluída |
| 13    | CMS                                           | ✅ Concluída |
| 14    | Base de dados e formulários                   | ⏳ Próxima   |
| 15–20 | SEO → Documentação final                      | Por iniciar  |

## Documentação de planeamento (Fase 1)

1. [Estratégia, públicos e conversão](docs/fase-01/01-estrategia.md)
2. [Sitemap, URLs e navegação](docs/fase-01/02-sitemap-e-navegacao.md)
3. [Arquitetura técnica](docs/fase-01/03-arquitetura-tecnica.md)
4. [Conteúdos e decisões pendentes](docs/fase-01/04-conteudos-e-decisoes-pendentes.md)

## Wireframes e UX (Fase 2)

1. [Fundamentos de UX](docs/fase-02/01-fundamentos-ux.md): grelha, navegação, interações, formulários, estados
2. [Especificação de páginas](docs/fase-02/02-especificacao-de-paginas.md): secções, componentes e limites de texto
3. [Wireframes navegáveis](docs/fase-02/wireframes.html): abrir no browser; alternar Desktop / Tablet / Mobile

## Design System (Fase 3)

1. [Design System](docs/fase-03/01-design-system.md): direção visual, cor e contrastes, tipografia, espaçamento, componentes base, movimento
2. [Guia visual](docs/fase-03/design-system.html): abrir no browser
3. Tokens em código: `src/styles/tokens.css` (paleta base: azul e marsala oficiais, neutros propostos) e `src/styles/theme.css` (tokens semânticos para Tailwind v4)
4. Logótipos: `public/brand/conexao-positiva/` e `public/brand/metodo-centro/` (originais + PNG transparentes; SVG pendentes)

## Componentes globais (Fase 4)

[Componentes globais](docs/fase-04/01-componentes-globais.md): stack, componentes, decisões e verificação.

## Home (Fase 5)

[Home](docs/fase-05/01-home.md): secções, origem do conteúdo, decisões e verificação. Para rever todas as secções com exemplos: `CONTENT_PREVIEW=1 npm run dev`.

## Sobre Nós (Fase 6)

[Sobre Nós](docs/fase-06/01-sobre-nos.md): estrutura, **textos para aprovação** (missão, visão, valores) e conteúdo a fornecer.

## Soluções (Fase 7)

[Soluções](docs/fase-07/01-solucoes.md): página índice, 8 páginas de serviço e **textos para aprovação**.

## Método C.E.N.T.R.O. (Fase 8)

[Método C.E.N.T.R.O.](docs/fase-08/01-metodo-centro.md): identidade marsala, scroll storytelling dos seis pilares e **textos para aprovação**.

## Eventos (Fase 9)

[Eventos](docs/fase-09/01-eventos.md): agenda com filtros, páginas de evento, estados de inscrição e dados estruturados.

## Experiências (Fase 10)

[Experiências](docs/fase-10/01-experiencias.md): portefólio com filtros, página de cada experiência, regras de autorização e modelo de conteúdo.

## Insights (Fase 11)

[Insights](docs/fase-11/01-insights.md): listagem com categorias e "Carregar mais", página de artigo, partilha, dados estruturados e modelo de conteúdo.

## Contactos e Proposta (Fase 12)

[Contactos e Proposta](docs/fase-12/01-contactos-e-proposta.md): formulários de contacto, proposta e inscrição, validação, anti-spam e páginas de confirmação.

## CMS (Fase 13)

[CMS](docs/fase-13/01-cms.md): o que se edita no Studio (`/studio`), como o site lê o conteúdo e **como ligar o projeto Sanity**.

## Desenvolvimento

Requisitos: Node.js 22 (mínimo 20.9).

```bash
cd conexao-positiva
npm install
cp .env.example .env.local   # preencher os valores necessários
npm run dev                  # http://localhost:3000
```

| Comando                           | O que faz                    |
| --------------------------------- | ---------------------------- |
| `npm run dev`                     | Servidor de desenvolvimento  |
| `npm run build` / `npm start`     | Build de produção e servidor |
| `npm run lint`                    | ESLint                       |
| `npm run typecheck`               | TypeScript (strict)          |
| `npm run format` / `format:check` | Prettier                     |
| `npm run check`                   | Lint + tipos + formatação    |

O CI (`.github/workflows/conexao-positiva.yml`) corre lint, tipos, formatação e build em cada pull request que altere esta pasta.

### Estrutura

```
src/
  app/[locale]/      páginas (App Router) e layout raiz
  components/
    ui/              primitivos (Button…)
    layout/          Header, Footer, Container, Section, navegação
    common/          Logo, SkipLink, WhatsApp, Breadcrumbs, motivo da rede
    sections/        secções de página (Hero, Soluções, C.E.N.T.R.O.…)
    cards/           ServiceCard, EventCard, CaseStudyCard, ArticleCard…
    consent/         consentimento de cookies
  config/            navegação e dados institucionais provisórios
  content/           modelos e leitura de conteúdo (Sanity, exemplos ou vazio)
  sanity/            Studio: esquemas, consultas GROQ e conversões
  i18n/              next-intl (routing, request, navigation)
  lib/               utilitários (cn, consent)
  styles/            tokens do Design System
messages/            textos de interface (pt.json)
```

As instruções de CMS, base de dados e publicação são acrescentadas nas fases respetivas.
