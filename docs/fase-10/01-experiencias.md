# Fase 10 — Experiências (portefólio)

## Objetivo

Mostrar trabalho real da Conexão Positiva (programas, workshops, eventos, team building) de forma credível. Só são publicadas experiências **reais e autorizadas** pelo cliente: nome, fotografias, números e testemunho.

## Páginas

### `/experiencias`

| #   | Secção  | Notas                                                                                                    |
| --- | ------- | -------------------------------------------------------------------------------------------------------- |
| 1   | Hero    | "Experiências que já vivemos com organizações" + frase sobre autorização                                 |
| 2   | Filtros | Team Building · Formação · Workshop · Evento · Liderança · Bem-estar; só os tipos com experiências       |
| 3   | Lista   | Grelha de 2 colunas, segunda coluna desfasada e proporções de imagem alternadas (ordem de leitura igual) |
| 4   | CTA     | "Quer criar uma experiência para a sua equipa?"                                                          |

- O filtro vive no URL (`?categoria=lideranca`): partilhável, e o botão "voltar" do browser repõe o estado. Valores inválidos são ignorados.
- **Estado vazio (produção, até haver casos no CMS):** mensagem honesta ("Estamos a preparar as primeiras experiências para partilhar") + "Solicitar proposta" e "Conhecer as soluções". O CTA final só aparece quando há experiências (o estado vazio já tem os seus).

### `/experiencias/[slug]`

Hero (tipo + título) → fotografia larga (se existir) → **Ficha** (Cliente, Setor, Soluções com links, Participantes, Formato, Data, Local; só os campos preenchidos) → **O desafio** → **O objetivo** → **A solução** → **Vídeo / Galeria** → **Resultados** (secção de ênfase) → **Testemunho** → **Outras experiências** → CTA.

- **Cliente confidencial:** sem autorização para o nome, o campo `client` fica vazio e aparece "Cliente confidencial" no card e na ficha.
- **Resultados:** cada resultado tem texto e, opcionalmente, um valor. Valores só com números reais, medidos e autorizados; sem valor, o resultado é qualitativo (ícone de verificação).
- **Vídeo:** URL do YouTube ou do Vimeo. É mostrado em "fachada": nenhum pedido ao YouTube/Vimeo até a pessoa carregar no botão; depois é usado `youtube-nocookie.com` ou o Vimeo com `dnt=1`. Uma nota informa de onde o vídeo é carregado.
- **Outras experiências:** primeiro as do mesmo tipo e com serviços em comum; completa com as restantes até 3.
- **CTA:** "Solicitar proposta" com `?servico=` do primeiro serviço da experiência (pré-preenche o formulário da Fase 12).
- Slug inexistente → 404.

## Modelo de conteúdo (`CaseStudy`, para o Sanity na Fase 13)

| Campo                                                    | Obrigatório | Notas                                                  |
| -------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| `title`, `slug`                                          | Sim         |                                                        |
| `category`                                               | Sim         | Um dos 6 tipos                                         |
| `client`                                                 | Não         | Vazio = "Cliente confidencial"                         |
| `objective`                                              | Sim         | Uma frase (card e secção "O objetivo")                 |
| `services`                                               | Sim         | Referências às 8 soluções (liga às páginas de serviço) |
| `sector`, `participants`, `format`, `period`, `location` | Não         | Só aparecem na ficha se preenchidos                    |
| `challenge`, `solution`                                  | Sim         | Parágrafos                                             |
| `results`                                                | Não         | `{ value?, text }`                                     |
| `image`, `gallery`                                       | Não         | Com texto alternativo obrigatório e autorização de uso |
| `video`                                                  | Não         | `{ url, title }` (YouTube ou Vimeo)                    |
| `testimonial`                                            | Não         | Com autorização escrita                                |

As páginas de serviço (`/solucoes/[slug]`) mostram agora as experiências reais ligadas a esse serviço (antes eram exemplos fixos), e a Home usa as 3 experiências mais recentes.

## Decisões

- Sem JSON-LD específico para experiências: nenhum tipo Schema.org representa bem um caso de cliente sem forçar dados. Fica só o `BreadcrumbList`.
- Componentes reutilizados e extraídos: `FilterChips` (também usado na agenda de Eventos), `Gallery` (também no evento), `CaseStudyCard` (agora traduz o tipo e mostra "Ver experiência").
- Sem animação na grelha além do `reveal` global; o desfasamento é um `transform` e não muda a ordem de leitura nem a do teclado.

## Verificação

Playwright + axe (WCAG 2.2 AA) a 360, 390, 768, 1024, 1280 e 1440 px, em produção e com `CONTENT_PREVIEW=1`: 0 violações, sem scroll horizontal, sem erros de consola, um `h1` por página. Filtros, "voltar", filtro inválido, vídeo sem pedidos externos antes do clique, CTA com `?servico=`, ligações a partir da Home e de `/solucoes/team-building`, 404 para slug inexistente. Em produção não aparece nenhum `[Exemplo]`.

## Pendências

- **Conteúdo do cliente:** experiências reais com autorização (nome do cliente ou confidencial, fotografias, vídeo, resultados, testemunho).
- **Fase 15/16:** acrescentar `youtube-nocookie.com` e `player.vimeo.com` a `frame-src` quando for definida a CSP.
