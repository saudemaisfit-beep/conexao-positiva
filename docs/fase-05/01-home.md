# Fase 5 — Home

## Secções

| #   | Secção              | Componente                                                        | Conteúdo                                                                              | Quando aparece               |
| --- | ------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------- |
| 1   | Hero                | `sections/home-hero.tsx`                                          | Headline em 3 linhas, texto, 2 CTAs, motivo da rede                                   | Sempre                       |
| 2   | Quem somos          | `sections/about-intro.tsx`                                        | Texto + percurso Conexão → Consciência → Desenvolvimento → Transformação → Resultados | Sempre                       |
| 3   | Soluções            | `sections/services-grid.tsx` + `cards/service-card.tsx`           | 8 serviços (4/2/1 colunas)                                                            | Sempre                       |
| 4   | Método C.E.N.T.R.O. | `sections/centro-section.tsx` + `centro-experience.tsx`           | 6 pilares interativos, identidade marsala                                             | Sempre                       |
| 5   | Experiências        | `sections/case-studies-preview.tsx` + `cards/case-study-card.tsx` | 1 destaque + 2                                                                        | Com casos publicados         |
| 6   | Impacto             | `sections/impact-stats.tsx`                                       | Até 4–5 indicadores                                                                   | Com números reais publicados |
| 7   | Clientes            | `sections/client-logos.tsx`                                       | Logótipos em caixas iguais                                                            | Com clientes autorizados     |
| 8   | Testemunhos         | `sections/testimonials-section.tsx` + `testimonials.tsx`          | 1 destaque + 2; setas com mais de 3                                                   | Com testemunhos autorizados  |
| 9   | Próximos eventos    | `sections/upcoming-events.tsx` + `cards/event-card.tsx`           | Até 3 eventos futuros                                                                 | Com eventos futuros          |
| 10  | Insights            | `sections/latest-insights.tsx` + `cards/article-card.tsx`         | 3 artigos mais recentes                                                               | Com artigos publicados       |
| 11  | CTA final           | `sections/cta-banner.tsx`                                         | "Pronto para desenvolver a sua equipa?"                                               | Sempre                       |

## Conteúdo

- Os textos fixos estão em `messages/pt.json` (`Home`); passam para o singleton `homePage` do CMS na Fase 13.
- As coleções vêm de `src/content/home.ts` (`getHomeContent`). Até à ligação ao Sanity estão **vazias**: em produção as secções 5–10 não aparecem e nada é inventado.
- **Pré-visualização de design**: com `CONTENT_PREVIEW=1`, a Home é preenchida com exemplos de `src/content/fixtures.ts`, todos marcados **[Exemplo]**. Serve para rever o layout (por exemplo num deploy de pré-visualização); nunca ativar em produção.
- Os pilares do Método (`src/content/centro.ts`) usam o texto fornecido no briefing.
- A página revalida de hora a hora (`revalidate = 3600`) para que eventos passados saiam de "Próximos eventos".

## Decisões

- **Hero sem fotografia**: enquanto não houver fotografia real, o hero usa um motivo gráfico gerado a partir da ideia do logótipo (rede de pontos ligados), desenhado em SVG no servidor, sem imagens nem JavaScript. Os cards aceitam fotografia opcional (`MediaFrame`) e, sem ela, mostram uma composição gráfica da marca em vez de um espaço vazio.
- **Método na Home com identidade marsala** (`data-brand="metodo"`): a secção mais forte da página e visualmente distinta do CTA final em azul-marinho.
- **C.E.N.T.R.O. interativo**: separadores ARIA no desktop (clique, hover com atraso de 150 ms, setas, Home/End) e acordeão no mobile, em que as letras empilhadas formam "CENTRO". Só a letra grande fica atenuada nos pilares inativos; o nome mantém contraste AA.
- **Movimento**: entrada do hero linha a linha e desenho da rede ao carregar; reveals ao fazer scroll em CSS puro (`animation-timeline: view()`), sem JavaScript, como melhoria progressiva. Com "reduzir movimento", todas as animações, atrasos e transições são anulados globalmente.
- **Testemunhos sem rotação automática**; setas só com mais de três.
- **Eventos**: o botão do card leva diretamente à inscrição quando há vagas e a "Ver evento" quando esgotado ou encerrado.

## Verificação

- `lint`, `typecheck`, `format:check` e `build` sem erros.
- Produção (5 secções) e pré-visualização (11 secções), em Chromium a 360, 390, 430, 768, 1024, 1280 e 1440 px: sem scroll horizontal, **0 violações axe** (WCAG 2.2 AA), sem erros de consola.
- C.E.N.T.R.O.: setas, End e hover testados; acordeão mobile verificado.
- "Reduzir movimento": todo o conteúdo visível de imediato.
