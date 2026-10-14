# Redesign visual (depois da Fase 20)

Proposta feita com a skill de design (UI/UX Pro Max) e aprovada pelo cliente: um site mais apelativo e moderno, **com a mesma marca** (azul e marsala oficiais, Manrope e Inter), os mesmos textos e a mesma estrutura.

Mockup aprovado: página "Conexão Positiva Redesign" (artefacto partilhado na conversa do projeto).

## O que mudou

| Onde                        | Antes                         | Agora                                                                                                         |
| --------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Cabeçalho                   | Claro                         | Azul-noite, contínuo com os heros; translúcido com desfoque ao fazer scroll; botão "Solicitar proposta" ciano |
| Heros (todas as páginas)    | Fundo claro + motivo da rede  | Fundo escuro com **aurora** (brilhos das cores da marca) e **rede de pontos** em movimento lento              |
| Hero da Home                | Título + motivo da rede       | Última linha com gradiente; cartões de vidro com o próximo evento e 2 números de impacto (só com dados reais) |
| Formulários, legais, artigo | Cabeçalho claro               | Cabeçalho escuro com aurora (sem rede de pontos, para manter o foco)                                          |
| Soluções (Home e /solucoes) | Grelha de 8 cartões iguais    | **Grelha bento**: Team Building em destaque (escuro, 2×2), Liderança larga (2×1)                              |
| Cartões                     | Sombra no hover               | Cantos maiores e pequena subida no hover; seta circular nas soluções                                          |
| CTA final                   | Azul-noite com motivo da rede | Cartão com aurora; botões "glow" e "glass"                                                                    |

Sub-marca do Método C.E.N.T.R.O.: dentro de `data-brand="metodo"`, a aurora, a rede de pontos e o botão "glow" passam automaticamente a marsala.

## Como funciona (para quem mantém)

- **Superfícies escuras:** `data-surface="inverse"` reatribui `--color-text`, `--color-muted` e `--color-border` a tons claros (`globals.css`), por isso breadcrumbs, navegação e cartões funcionam sem variantes. Um painel claro dentro de uma superfície escura usa `data-surface="light"` (ex.: menu Soluções).
- **Componentes novos:** `common/aurora.tsx`, `common/network-canvas.tsx` (carregado à parte por `network-canvas-lazy.tsx`), `sections/services-bento.tsx`; variantes de botão `glow` e `glass`; utilitários `.glass` e `.text-glow-gradient`.
- **Destaque da grelha bento:** constantes `FEATURED` e `WIDE` em `sections/services-bento.tsx`.

## Acessibilidade e desempenho

- Contraste verificado: ciano com texto azul-noite 5,5 : 1; marsala claro com marsala profundo 5,0 : 1; texto claro sobre a zona mais brilhante da aurora ≥ 4,5 : 1 (aurora a 50 % de opacidade).
- axe: 0 violações (49 páginas × 2 larguras); 74 testes automáticos a passar; 320 px sem deslocamento horizontal.
- Movimento reduzido: aurora e rede de pontos paradas. Em telemóveis (< 768 px) a rede de pontos é desenhada uma vez, sem animação (poupa bateria e processador).
- Otimizações: aurora sem `filter: blur` (gradientes radiais já suaves), animação em camada própria (`will-change: transform`); rede de pontos fora do JavaScript inicial, começa só com o browser livre, a 30 imagens/s, e para fora do ecrã ou com o separador oculto.
- Lighthouse (telemóvel, simulado): desempenho **91–95** (antes 94–98 na mesma máquina); acessibilidade, boas práticas e SEO 100; CLS 0. O tempo real até à primeira pintura é praticamente igual; a diferença vem sobretudo do trabalho extra de pintura e do carregamento de links do hero na simulação.

## Secção do Método C.E.N.T.R.O. na Home: órbita interativa

O nome é o conceito: os seis pilares giram em volta de um **centro**.

- As letras C, E, N, T, R, O estão num anel; o pilar escolhido roda até ao topo (caminho mais curto) e um raio animado liga-o ao núcleo.
- O núcleo mostra uma animação própria de cada pilar (SVG e CSS, sem bibliotecas): ondas de luz (Consciência), balança que estabiliza (Equilíbrio), rebento que cresce (Nutrição), ponteiros de relógio (Tempo), **respiração guiada** com "Inspire / Expire" em ciclos de 4 s (Respiração) e agulha de bússola que procura o norte (Orientação).
- Rotação automática a cada 7 s só com a secção visível, com barra de progresso e **botão de pausa** (WCAG 2.2.2); para de vez quando a pessoa escolhe um pilar.
- Acessibilidade: separadores ARIA (setas, Home/End, foco visível), nome de cada pilar no separador, painel de texto associado. Com movimento reduzido: sem rotação automática nem animações (cada desenho tem um estado parado legível).
- Componentes: `sections/centro-orbit.tsx` e `sections/centro-orbit-art.tsx`; estilos em `globals.css` ("Órbita do Método C.E.N.T.R.O."). Substitui `centro-experience.tsx`.

## Página /metodo-centro: órbita guiada pelo scroll

- A secção dos seis pilares passa a marsala-escuro (`tone="inverse"`), com a letra em gradiente e as práticas em caixas de vidro.
- Desktop (≥ 1024 px): a órbita fica fixa à esquerda e roda até ao pilar visível enquanto se desce a página; o núcleo mostra a animação desse pilar. As letras são links para as âncoras (`#consciencia`…), com `aria-current` no pilar visível.
- Mobile e tablet: índice fixo em faixa (como antes) e a animação de cada pilar junto à letra.
- O mostrador é partilhado com a Home: `sections/orbit-dial.tsx` (`useOrbit`, `orbitNode`, `OrbitDial`); a página usa `sections/metodo/pillars-orbit.tsx`.

## Identidade da landing em todo o site (outubro de 2026)

A pedido da cliente, o site todo passou a usar a identidade da landing do Método C.E.N.T.R.O.
(Luciana Machado), através dos tokens globais (`src/styles/tokens.css`, `src/styles/theme.css`):

- **Cores:** carvão `#2c2c2c` (texto, botões, secções escuras, cabeçalho), dourado `#c9a88a`
  (destaques sobre carvão e botões com texto carvão), dourado escuro `#6e523a` (texto dourado sobre
  fundos claros) e areia `#f5f1ed` (fundo). O azul oficial fica só no logótipo.
- **Tipos de letra:** Playfair Display nos títulos (peso normal nos títulos grandes, como na landing)
  e Montserrat no texto, alojados no site com Fontsource. Manrope e Inter deixam de ser carregadas.
- **Tamanhos:** a escala da landing (`--text-display` 48→96 px, `--text-h1` 40→72, `--text-h2` 36→60,
  `--text-lead` 18→22, texto 16–18).
- **Contraste:** a auditoria axe passa nas 50 páginas, em 390 px e em 1280 px.

## Fotografias ilustrativas (Unsplash)

Enquanto não há fotografias reais, o site usa fotografias de banco do Unsplash
(`src/content/stock-photos.ts`), servidas pelo CDN do Unsplash, com crédito ao autor nos heros:

- Heros com fotografia de fundo (véu carvão para o contraste): Sobre, Soluções, cada solução,
  Insights, categorias de Insights e Contactos.
- Cartões de artigos sem imagem própria: fotografia da categoria.
- **Nunca** em equipa, clientes, testemunhos, eventos ou casos (seria enganoso).

Para trocar por fotografias reais: publicar a imagem no CMS (tem prioridade) ou retirar a chave
do ficheiro. A política de segurança (CSP) autoriza `https://images.unsplash.com`.
