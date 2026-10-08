# Fase 7 — Soluções (`/solucoes` e `/solucoes/[slug]`)

## Páginas

| URL                            | Conteúdo                                                                                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/solucoes`                    | Hero · "Por onde começar" (Para empresas / líderes / pessoas, com as soluções indicadas) · as 8 soluções · "Como trabalhamos" (4 passos) · faixa do Método C.E.N.T.R.O. · CTA                                                                    |
| `/solucoes/[slug]` (8 páginas) | Hero com CTA "Solicitar uma proposta" (`/solicitar-proposta?servico=<slug>`) · Introdução · Desafios que resolve · Como funciona · Benefícios · Para quem é + Formatos · Experiências relacionadas* · Testemunhos* · FAQ · Outras soluções · CTA |

\* Só aparecem com conteúdo real ligado ao serviço (CMS). Em pré-visualização (`CONTENT_PREVIEW=1`) mostram exemplos [Exemplo].

As 8 páginas são geradas estaticamente (`generateStaticParams`, `dynamicParams = false`): qualquer outro slug devolve 404.

## Conteúdo

- `src/content/services.ts` (só servidor): introdução, desafios, passos, benefícios, público, formatos e FAQ de cada serviço.
- `src/config/navigation.ts`: nome, resumo e ícone (usados também no menu, por isso ficam fora do conteúdo longo para não pesar no JavaScript do browser).
- **Todos os textos dos serviços são proposta para aprovação.** Foram redigidos a partir do briefing e **não incluem** números, durações concretas, preços, garantias de resultados nem clientes. Os "Formatos" descrevem modalidades possíveis (presencial/online, sessão única/programa…) e devem ser confirmados pela Conexão Positiva para cada serviço.
- FAQ comum a todos os serviços: adaptação à organização e custo (o investimento depende do formato, duração, participantes e local, sem valores).
- Bem-estar Corporativo inclui a nota de que os programas não substituem acompanhamento médico ou psicológico.

## Dados estruturados

Cada página de serviço emite `BreadcrumbList`, `Service` (nome, descrição, URL, `provider` Organization) e `FAQPage` (só quando há FAQ). Validados como JSON nos testes.

## Componentes novos (reutilizáveis)

| Componente                  | Uso                                                                          |
| --------------------------- | ---------------------------------------------------------------------------- |
| `sections/steps-list.tsx`   | Passos numerados (também usado na abordagem de Sobre Nós)                    |
| `sections/feature-list.tsx` | Itens título + texto, variantes "rule" e "card"; 4 colunas quando há 4 itens |
| `sections/faq.tsx`          | Acordeão nativo (`details`/`summary`, sem JavaScript) + JSON-LD              |
| `common/json-ld.tsx`        | Dados estruturados com escape seguro                                         |
| `sections/solutions/*`      | Caminhos por público, faixa do Método, público + formatos                    |
| `PageHero`                  | Passa a aceitar `actions` (botões)                                           |

## Verificação

- `lint`, `typecheck`, `format:check`, `build` sem erros.
- 9 páginas × 360, 768 e 1280 px, em produção e pré-visualização: código 200, um `h1`, sem scroll horizontal, 0 violações axe, sem erros de consola, JSON-LD válido.
- Slug inexistente → 404. Link de proposta com o serviço pré-selecionado.
