# Fase 8 — Método C.E.N.T.R.O. (`/metodo-centro`)

## Estrutura

| #   | Secção                             | Componente                                               | Conteúdo                                                                     |
| --- | ---------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Hero                               | `PageHero` com logótipo oficial (também no mobile)       | "Um caminho para desenvolver pessoas de dentro para fora." + 2 CTAs          |
| 2   | O que é / Porque foi criado        | página                                                   | O que é: briefing · Porque: **proposta**                                     |
| 3   | Para quem é                        | `FeatureList` (cards)                                    | Pessoas, Líderes, Equipas, Organizações (**proposta**)                       |
| 4   | Os seis pilares                    | `sections/metodo/pillars-story.tsx` + `pillar-index.tsx` | Nome e descrição: briefing · "Na prática": **proposta**                      |
| 5   | Como funciona                      | `StepsList`                                              | 4 etapas (**proposta**)                                                      |
| 6   | Aplicação individual / corporativa | `sections/metodo/application-paths.tsx`                  | Individual → `/eventos` · Corporativa → proposta com `servico=metodo-centro` |
| 7   | Resultados esperados               | `FeatureList`                                            | 6 resultados qualitativos (**proposta**, sem números)                        |
| 8   | FAQ                                | `Faq` (+ JSON-LD `FAQPage`)                              | 4 perguntas (**proposta**)                                                   |
| 9   | CTA                                | `CtaBanner`                                              | "Levar o Método C.E.N.T.R.O. para a minha organização"                       |

Todos os textos estão em `src/content/metodo.ts`; os pilares em `src/content/centro.ts`.

## Identidade diferenciada

- A página inteira usa `data-brand="metodo"`: botões, links, foco e secções de ênfase passam a marsala; o header e o rodapé mantêm a identidade da Conexão Positiva.
- O logótipo oficial aparece no hero sobre fundo claro (regra de uso: marsala só sobre fundos claros).
- Letras gigantes em marsala suave marcam cada pilar; o motivo gráfico do CTA final fica em marsala nesta página (`--color-brand-on-inverse`).

## Scroll storytelling

- **Desktop (≥ 1024 px)**: índice vertical fixo à esquerda (letra + nome) que acompanha a leitura.
- **Mobile e tablet**: faixa horizontal fixa por baixo do header com as seis letras.
- O pilar visível é detetado com `IntersectionObserver` e marcado com `aria-current`; sem animações de scroll, por isso funciona igual com "reduzir movimento".
- Cada pilar tem âncora própria e partilhável: `/metodo-centro#consciencia`, `#equilibrio`, `#nutricao`, `#tempo`, `#respiracao`, `#orientacao`. Os links "Saber mais" da Home apontam para estas âncoras.

## Textos para aprovação

"Porque foi criado", "Para quem é", as práticas de cada pilar ("Na prática"), "Como funciona", "Resultados esperados" e a FAQ foram redigidos a partir do briefing e devem ser validados pela Conexão Positiva e pelo(a) autor(a) do método. Não foram criadas citações nem informação biográfica. A FAQ esclarece que o método não substitui acompanhamento médico ou psicológico.

## Nota para a Fase 12

O formulário de proposta tem de aceitar `servico=metodo-centro` (além dos 8 serviços).

## Verificação

- `lint`, `typecheck`, `build` sem erros.
- 360–1440 px: código 200, um `h1`, logótipo visível, sem scroll horizontal, 0 violações axe, sem erros de consola, JSON-LD `BreadcrumbList` + `FAQPage` válido.
- Âncoras: `#respiracao` (desktop) e `#nutricao` (mobile) abrem no pilar certo, abaixo do header e do índice, com o índice a marcar o pilar; clicar numa letra atualiza o índice.
