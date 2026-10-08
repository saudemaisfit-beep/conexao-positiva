# Fase 6 — Sobre Nós (`/sobre`)

## Estrutura

| #   | Secção                   | Componente                                  | Origem do conteúdo                                 | Quando aparece           |
| --- | ------------------------ | ------------------------------------------- | -------------------------------------------------- | ------------------------ |
| 1   | Hero com breadcrumbs     | `sections/page-hero.tsx` (reutilizável)     | `messages/pt.json` → `About.hero`                  | Sempre                   |
| 2   | Quem somos               | `sections/about/who-we-are.tsx`             | Briefing                                           | Sempre                   |
| 3   | Nossa história           | `sections/about/history-timeline.tsx`       | Marcos reais (CMS)                                 | Só com marcos fornecidos |
| 4   | Frase central            | `sections/pull-quote.tsx`                   | Mensagem central do briefing                       | Sempre                   |
| 5   | Propósito, Missão, Visão | `sections/about/purpose-mission-vision.tsx` | Propósito: briefing · Missão e Visão: **proposta** | Sempre                   |
| 6   | Valores                  | `sections/about/values-list.tsx`            | **Proposta**                                       | Sempre                   |
| 7   | Nossa abordagem          | `sections/about/approach-steps.tsx`         | Percurso do briefing (descrições redigidas)        | Sempre                   |
| 8   | Fundador(a)              | `sections/about/founder-feature.tsx`        | Dados reais (CMS)                                  | Só com dados fornecidos  |
| 9   | Equipa                   | `sections/about/team-grid.tsx`              | Dados reais (CMS)                                  | Só com dados fornecidos  |
| 10  | CTA                      | `sections/cta-banner.tsx`                   | `About.cta`                                        | Sempre                   |

Em produção, hoje, a página mostra 7 secções; com `CONTENT_PREVIEW=1` mostra as 10, com exemplos marcados [Exemplo].

## Textos para aprovação

Os textos abaixo estão em `src/content/about.ts`, marcados com `source: "proposta"`. Devem ser validados pela Conexão Positiva antes do lançamento.

**Missão (proposta)**

> Criar experiências de desenvolvimento humano que ajudem pessoas, líderes e equipas a ganhar consciência, equilíbrio e direção, com impacto real no trabalho e na vida.

**Visão (proposta)**

> Ser a parceira de referência das organizações que acreditam que pessoas melhores constroem equipas melhores, e equipas melhores constroem organizações mais fortes.

**Valores (proposta)**

- **Pessoas primeiro**: cada experiência começa por ouvir quem a vai viver.
- **Consciência**: mudança duradoura nasce de compreender comportamentos, emoções e escolhas.
- **Conexão**: relações de confiança tornam as equipas mais fortes do que a soma das partes.
- **Integridade**: dizemos o que fazemos e fazemos o que dizemos, com clareza e respeito.
- **Compromisso com resultados**: desenvolvimento humano que se traduz em mudanças visíveis no dia a dia.

**Abordagem**: as cinco etapas (Conexão → Consciência → Desenvolvimento → Transformação → Resultados) vêm do briefing; as frases que descrevem cada etapa foram redigidas e também devem ser validadas.

## Conteúdo a fornecer

- Marcos da história (ano, título, uma frase).
- Fundador(a): nome, cargo, biografia, fotografia, LinkedIn.
- Equipa: nome, cargo, fotografia, LinkedIn (com autorização de publicação).
- Fotografias da equipa e de sessões, para acompanhar "Quem somos".

## Decisões

- **Sem fotografia, sem vazio**: "Quem somos" mostra os quatro públicos (Pessoas, Empresas, Organizações, Instituições, do briefing) em vez de uma imagem genérica; pessoas sem fotografia aparecem com iniciais sobre fundo da marca.
- **Storytelling**: blocos de texto curtos (≤ 2 parágrafos) alternados com citação em grande formato, um bloco escuro para o propósito e a abordagem em passos.
- **Valores sem numeração** (a ordem não tem significado); **abordagem numerada** (é uma sequência real).
- `PageHero` e `PullQuote` são reutilizados nas próximas páginas.

## Verificação

- `lint`, `typecheck`, `format:check`, `build` sem erros.
- Produção (7 secções) e pré-visualização (10 secções), 360–1440 px: sem scroll horizontal, 0 violações axe, sem erros de consola, um único `h1`, "Sobre Nós" marcado como página atual no menu, JSON-LD `BreadcrumbList` presente.
