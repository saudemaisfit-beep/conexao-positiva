# Fase 2.2 — Especificação de páginas

Para cada página: secções por ordem, conteúdo, componente, limites de texto (que se tornam validações no CMS na Fase 13) e comportamento no mobile.

**Limites de texto padrão** (aplicam-se salvo indicação):

| Campo | Limite |
| --- | --- |
| Título de hero (`h1`) | ≤ 60 caracteres |
| Subtítulo de hero | ≤ 180 caracteres |
| Título de secção (`h2`) | ≤ 70 caracteres |
| Introdução de secção | ≤ 200 caracteres |
| Descrição em card | ≤ 120 caracteres |
| Título SEO / meta description | ≤ 60 / ≤ 155 caracteres |
| Alt text | obrigatório em imagens de conteúdo, ≤ 125 caracteres |

Legenda de componentes: os nomes correspondem aos componentes a criar na Fase 4 (ver arquitetura técnica).

---

## Home `/`

| # | Secção | Conteúdo | Componente | Desktop | Mobile |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | Headline (3 linhas: "Conectamos pessoas. / Fortalecemos equipas. / Potencializamos resultados."), texto, 2 CTAs, vídeo ou fotografia | `Hero` (variante `home`) | Texto à esquerda sobre imagem/vídeo com gradiente de leitura na base; altura ajustada ao conteúdo (~85 % do ecrã) | Imagem por cima (4:5), texto por baixo; CTAs em largura total, empilhados |
| 2 | Quem somos | Título "Desenvolvimento que começa nas pessoas.", 2–3 frases, CTA "Conhecer a Conexão Positiva", 1 fotografia | `SplitSection` | Fotografia 5 colunas + texto 6 colunas | Texto, depois fotografia |
| 3 | Soluções | Título, introdução, 8 serviços, link "Ver todas as soluções" | `ServiceCard` × 8 | Grelha 4 × 2; card com fotografia 4:3, ícone, nome, descrição, "Saber mais →" | 1 coluna; cards horizontais compactos (ícone + nome + descrição) para reduzir scroll |
| 4 | Método C.E.N.T.R.O. | Título, frase, 6 pilares (letra, nome, descrição, ícone), CTA "Descobrir o Método C.E.N.T.R.O." | `CentroExperience` | Secção de ênfase; 6 letras como separadores + painel | Acordeão vertical |
| 5 | Experiências | 3 casos em destaque, CTA "Ver todas as experiências" | `CaseStudyCard` | 1 grande (7 colunas) + 2 empilhados (5 colunas) | 1 coluna |
| 6 | Impacto | Até 5 indicadores (valor + rótulo); só os marcados "Publicar" | `ImpactStats` | Linha de números grandes, sem cards | Grelha 2 colunas |
| 7 | Clientes e parceiros | Título "Organizações que já viveram experiências Conexão Positiva", logótipos | `ClientLogos` | Grelha 6 por linha | 3 por linha |
| 8 | Testemunhos | 1 destaque + 2 secundários | `Testimonials` | Editorial | Scroll-snap com setas |
| 9 | Próximos eventos | Até 3 eventos futuros, link "Ver agenda" | `EventCard` | 3 colunas | 1 coluna |
| 10 | Insights | 3 artigos mais recentes, CTA "Explorar Insights" | `ArticleCard` | 3 colunas | 1 coluna; o 1.º com imagem, os outros só texto |
| 11 | CTA final | "Pronto para desenvolver a sua equipa?", frase, "Solicitar proposta" + "Falar connosco" | `CtaBanner` | Secção de ênfase com fotografia lateral | Empilhado, botões largura total |

Regras: as secções 5–10 não são renderizadas se estiverem vazias. A secção 6 nunca mostra valores de exemplo.

## Sobre `/sobre`

| # | Secção | Conteúdo | Componente |
| --- | --- | --- | --- |
| 1 | Hero | Título, subtítulo, fotografia de equipa/workshop | `PageHero` (variante `image`) |
| 2 | Quem somos | 1–2 parágrafos curtos | `SplitSection` |
| 3 | Nossa história | 3–5 marcos (ano + título + frase) | `Timeline` (linha vertical no mobile, horizontal no desktop) |
| 4 | Frase de destaque | Citação curta do(a) fundador(a) ou da mensagem central | `PullQuote` (largura total, tipografia grande) |
| 5 | Propósito, Missão, Visão | 3 blocos de texto curtos | `TriptychText` (3 colunas / empilhado) |
| 6 | Valores | 4–6 valores (nome + frase) | `ValuesList` (lista editorial numerada só se a ordem tiver significado; senão, grelha) |
| 7 | Nossa abordagem | Conexão → Consciência → Desenvolvimento → Transformação → Resultados (5 passos) | `ProcessSteps` (sequência real, por isso numerada) |
| 8 | Fundador(a) | Fotografia grande, nome, cargo, biografia, LinkedIn | `FounderFeature` |
| 9 | Equipa | Membros (fotografia 4:5, nome, cargo, LinkedIn) | `TeamGrid` (4 / 2 colunas) |
| 10 | CTA | "Vamos construir algo juntos?" + Proposta / Contacto | `CtaBanner` |

Storytelling: secções de texto nunca têm mais de ~120 palavras seguidas; entre blocos alternam fotografia, citação e elementos gráficos.

## Soluções `/solucoes`

| # | Secção | Conteúdo | Componente |
| --- | --- | --- | --- |
| 1 | Hero | Título "Soluções para pessoas, equipas e organizações", subtítulo | `PageHero` (variante `simple`) |
| 2 | Para quem | 3 entradas rápidas: Para empresas · Para líderes · Para pessoas (cada uma filtra/realça serviços) | `AudienceSwitch` (links âncora) |
| 3 | Serviços | 8 serviços em cards maiores que na Home (fotografia, nome, descrição, formatos como etiquetas) | `ServiceCard` (variante `large`) — 2 colunas / 1 |
| 4 | Como trabalhamos | 4 passos: Diagnóstico → Desenho à medida → Experiência → Acompanhamento | `ProcessSteps` |
| 5 | Método C.E.N.T.R.O. | Faixa curta de ligação ao método | `CentroTeaser` |
| 6 | CTA | "Não sabe qual a solução certa? Ajudamos a escolher." | `CtaBanner` |

## Serviço `/solucoes/[slug]` (modelo único)

| # | Secção | Conteúdo | Componente | Mobile |
| --- | --- | --- | --- | --- |
| 1 | Breadcrumbs + Hero | Nome, frase de valor, fotografia, CTA "Solicitar uma proposta" (`?servico=slug`) | `PageHero` (`image`) | Imagem 16:10 por cima |
| 2 | Introdução | 1 parágrafo | `Prose` | — |
| 3 | Problema que resolve | 3–4 desafios comuns | `ChallengeList` | Lista |
| 4 | Como funciona | 3–5 passos | `ProcessSteps` | Vertical |
| 5 | Benefícios | 4–6 benefícios (ícone + título + frase) | `FeatureGrid` (3 / 2 / 1 col.) | 1 col. |
| 6 | Para quem é | Perfis/contextos | `AudienceList` | — |
| 7 | Formatos | Presencial, online, híbrido, duração típica, nº participantes indicativo | `FormatTable` | Cards empilhados |
| 8 | Galeria | 3–9 fotografias | `Gallery` | 2 col. |
| 9 | Experiências relacionadas | Até 3 casos com este serviço | `CaseStudyCard` | Oculta se vazia |
| 10 | Testemunhos | Até 3 ligados ao serviço | `Testimonials` (variante `compact`) | Oculta se vazia |
| 11 | FAQ | 4–8 perguntas | `Faq` | — |
| 12 | CTA | "Vamos desenhar a experiência certa para a sua equipa." | `CtaBanner` | — |

## Método C.E.N.T.R.O. `/metodo-centro`

Identidade diferenciada: usa a variante de ênfase da paleta em mais secções, tipografia de display maior e um motivo gráfico próprio (círculo/centro), definidos na Fase 3.

| # | Secção | Conteúdo | Componente |
| --- | --- | --- | --- |
| 1 | Hero | "Método C.E.N.T.R.O." / "Um caminho para desenvolver pessoas de dentro para fora." + representação visual dos 6 pilares (SVG) | `CentroHero` |
| 2 | O que é o método | Texto curto + destaque | `SplitSection` |
| 3 | Porque foi criado | Narrativa curta + citação do(a) autor(a) | `PullQuote` |
| 4 | Para quem é | Pessoas · Líderes · Equipas · Organizações | `AudienceList` |
| 5 | Os seis pilares | Para cada pilar: letra, nome, descrição, conteúdo, imagem, ícone | `CentroStory` (sticky desktop / índice horizontal mobile) |
| 6 | Como funciona | Sequência de aplicação (ex.: diagnóstico → sessões → prática → integração) | `ProcessSteps` |
| 7 | Aplicação individual / corporativa | Dois blocos lado a lado com formatos e CTAs próprios | `DualPath` |
| 8 | Resultados esperados | Lista de resultados qualitativos (sem números inventados) | `FeatureGrid` |
| 9 | FAQ | Perguntas do método | `Faq` |
| 10 | CTA | "Levar o Método C.E.N.T.R.O. para a minha organização" → `/solicitar-proposta?servico=metodo-centro` | `CtaBanner` |

## Eventos `/eventos`

| # | Secção | Conteúdo | Componente |
| --- | --- | --- | --- |
| 1 | Hero | Título "Agenda", subtítulo | `PageHero` (`simple`) |
| 2 | Filtros | Próximos / Passados + categorias | `FilterBar` |
| 3 | Destaque | Próximo evento em formato grande (se existir) | `EventCard` (`featured`) |
| 4 | Lista | Eventos ordenados por data (próximos: crescente; passados: decrescente) | `EventCard` — 3 / 2 / 1 col. |
| 5 | Vazio / CTA | Mensagem + "Levar um evento à sua organização" | `EmptyState` + `CtaBanner` |

**EventCard**: imagem 16:9 com etiqueta de categoria, bloco de data (dia grande + mês), nome, hora, local, preço ou "Gratuito", estado ("Últimas vagas" quando ≤ 10 %, "Esgotado", "Encerrado"), botão "Ver evento" (ou "Inscrever-me" quando aberto).

## Evento `/eventos/[slug]`

| # | Secção | Conteúdo | Componente |
| --- | --- | --- | --- |
| 1 | Breadcrumbs + Hero | Imagem, categoria, nome, data, hora, local, CTA "INSCREVER-ME" | `EventHero` |
| 2 | Informação prática | Data · Horário · Local (com link para mapa externo) · Vagas disponíveis (streaming) · Valor | `EventFacts` (coluna sticky no desktop) |
| 3 | Descrição | Rich text | `Prose` |
| 4 | Programa | Lista de horários (hora + atividade) | `Agenda` |
| 5 | Facilitador(a) | Fotografia, nome, cargo, bio curta | `PersonCard` |
| 6 | Galeria | Fotografias (edições anteriores ou do evento passado) | `Gallery` |
| 7 | FAQ | Perguntas do evento | `Faq` |
| 8 | Outros eventos | Até 3 | `EventCard` |

Mobile: `EventFacts` vira lista logo após o hero; barra fixa inferior com data, preço e **Inscrever-me**. Evento passado: CTA substituído por "Este evento já decorreu" + galeria em destaque.

## Inscrição `/eventos/[slug]/inscricao`

Layout de foco: header simplificado (logo + "← Voltar ao evento"), sem rodapé completo (só linha legal). Resumo do evento + formulário (ver Fundamentos §5). `noindex`.

## Experiências `/experiencias`

| # | Secção | Conteúdo | Componente |
| --- | --- | --- | --- |
| 1 | Hero | "Experiências que já vivemos com organizações" | `PageHero` (`simple`) |
| 2 | Filtros | Categorias | `FilterBar` |
| 3 | Lista | Casos | `CaseStudyCard` — grelha de 2 colunas com alturas variadas (masonry leve) / 1 col. |
| 4 | CTA | "Quer criar uma experiência para a sua equipa?" | `CtaBanner` |

**CaseStudyCard**: fotografia, categoria, cliente (ou "Cliente confidencial" se o cliente não autorizar), título, objetivo numa linha, "Ver experiência →".

## Experiência `/experiencias/[slug]`

Hero (fotografia larga, categoria, título, cliente) → Ficha (Cliente · Serviço · Participantes · Data/Local, só os campos preenchidos) → Desafio → Objetivo → Solução → Galeria / vídeo → Resultados (qualitativos ou números reais) → Testemunho → Experiências relacionadas → CTA.

## Insights `/insights`

| # | Secção | Conteúdo | Componente |
| --- | --- | --- | --- |
| 1 | Hero | "Insights", frase editorial | `PageHero` (`simple`) |
| 2 | Categorias + pesquisa | Chips (links) + campo de pesquisa (quando ativo) | `CategoryNav`, `SearchField` |
| 3 | Destaque | Artigo mais recente grande | `ArticleCard` (`featured`) |
| 4 | Lista | Restantes, paginação "Carregar mais" com URL `?pagina=2` | `ArticleCard` — 3 / 2 / 1 col. |
| 5 | Newsletter (futuro) | Reservado; não implementar sem decisão | — |

`/insights/categoria/[slug]`: igual, com título da categoria e descrição.

## Artigo `/insights/[slug]`

Breadcrumbs → Categoria · Título · Introdução · Autor (foto + nome) · Data · Tempo de leitura → Imagem principal (largura do contentor) → Conteúdo (`Prose`: títulos, listas, citações, imagens com legenda, destaques) → Partilha (LinkedIn, WhatsApp, Facebook, copiar link) → Caixa do autor → Artigos relacionados (3, mesma categoria) → CTA contextual (ex.: artigo da categoria Liderança → "Desenvolvimento de Liderança").

Mobile: partilha no fim do artigo e num botão discreto junto ao título; sem barras laterais flutuantes.

## Contactos `/contactos`

Hero simples ("Vamos conversar") → 2 colunas: canais (telefone, e-mail, WhatsApp, redes, localização) | formulário → Faixa "Procura uma proposta para a sua organização?" → `/solicitar-proposta`. Mobile: canais primeiro como botões grandes (Ligar, E-mail, WhatsApp), depois formulário.

## Solicitar proposta `/solicitar-proposta`

Layout de foco (header normal, sem secções de marketing). Título "Solicitar proposta", frase "Conte-nos o que pretende. Preparamos uma proposta à medida da sua equipa." → formulário em 3 grupos | coluna "O que acontece a seguir" → pequena faixa de confiança (logótipos de clientes, só se existirem).

## Confirmações, legal e erros

| Página | Conteúdo |
| --- | --- |
| `/proposta-recebida`, `/inscricao-confirmada`, `/mensagem-enviada` | Ver Fundamentos §6 |
| Páginas legais | Título, data de última atualização, índice de secções (âncoras), `Prose` com largura de leitura |
| 404 / erro | Ver Fundamentos §6 |

## Rodapé (global)

4 colunas (desktop) → 2 (tablet) → 1 com acordeões para "Navegação" e "Soluções" (mobile). Linha legal no fim. Conteúdo descrito na Fase 1.
