# Fase 3 — Design System

Referência visual navegável: [`design-system.html`](design-system.html).
Código: [`src/styles/tokens.css`](../../src/styles/tokens.css) (paleta base e tokens de layout/movimento) e [`src/styles/theme.css`](../../src/styles/theme.css) (tokens semânticos expostos ao Tailwind v4).

> **Estado da identidade.** O **marsala** (`#904141`) é **oficial**: foi extraído do logótipo do Método C.E.N.T.R.O. fornecido pela Conexão Positiva. Petróleo, sálvia, areia e grafite continuam a ser uma **proposta provisória** até à entrega da identidade da Conexão Positiva. Para os substituir, basta alterar os valores da "Paleta base" em `tokens.css` e voltar a verificar os contrastes desta página.

## 1. Direção visual

**Ideia central: o centro.** O Método C.E.N.T.R.O. dá ao sistema o seu motivo: um ponto a partir do qual tudo se organiza. Visualmente traduz-se em:

- **Anel e ponto**: círculo fino com um ponto central, usado com moderação (marcador de eyebrow, representação dos 6 pilares, fundo da página do Método). Nunca como padrão decorativo repetido.
- **Calma com profundidade**: fundo de areia muito claro, texto grafite esverdeado, um petróleo profundo como cor de confiança e o marsala do Método como único acento quente.
- **O símbolo oficial confirma a ideia**: seis figuras humanas em movimento à volta de um ponto central. O site usa este símbolo como assinatura do Método e o motivo "anel e ponto" como eco discreto noutras páginas.
- **Tipografia que lidera**: títulos grandes em Manrope, com espaço à volta; o texto corrido em Inter, confortável e sem pressa.
- **Fotografia humana em primeiro plano**: o sistema é discreto para que as pessoas nas fotografias sejam o centro.

O que fica de fora: gradientes, glassmorphism, cards em todas as secções, sombras pesadas, mais de uma cor de destaque, emojis como ícones.

## 2. Cor

### Paleta base (provisória, exceto marsala)

| Família | Token | HEX | Uso |
| --- | --- | --- | --- |
| Petróleo | `--petroleo-950` | `#0D2B2E` | Fundo das secções de ênfase, rodapé |
| | `--petroleo-800` | `#0F3A3E` | Hover do botão primário |
| | `--petroleo-700` | `#174A4F` | **Primária**: botões, links, ícones ativos |
| | `--petroleo-500` | `#2D6B6F` | Anel de foco |
| | `--petroleo-300` | `#A9C4C1` | Texto secundário sobre fundo escuro |
| | `--petroleo-100` | `#DCEAE8` | Superfícies tingidas, contentor de ícones |
| Sálvia | `--salvia-700` | `#4F6A50` | Texto de etiquetas "Gratuito", detalhes |
| | `--salvia-400` | `#8EA68B` | **Secundária**: ilustração, linhas, motivo do anel (decorativo) |
| | `--salvia-100` | `#E6EDE2` | Fundo de etiquetas e blocos suaves |
| **Marsala (oficial)** | `--marsala-950` | `#3A1717` | Fundo das secções de ênfase da página do Método |
| | `--marsala-800` | `#742F30` | Hover de botões do Método; texto de destaque quente |
| | `--marsala-700` | `#904141` | **Cor do logótipo do Método** · **acento** do site (ponto do motivo, sublinhados, "Últimas vagas") |
| | `--marsala-400` | `#C27F7C` | Acento sobre fundo petróleo escuro |
| | `--marsala-200` | `#E9C9C6` | Texto secundário sobre marsala profundo |
| | `--marsala-100` | `#F5E6E4` | Fundo de etiquetas quentes; foco sobre fundo escuro |
| Areia | `--areia-50` | `#FAF8F3` | **Fundo** da página |
| | `--areia-100` | `#F1EDE4` | **Superfície** (secções alternadas) |
| | `--areia-300` | `#DCD6CA` | Bordas decorativas, divisores |
| Grafite | `--grafite-900` | `#16201F` | **Texto** |
| | `--grafite-600` | `#56625F` | Texto secundário (**muted**) |
| | `--grafite-400` | `#7E8984` | Bordas de campos de formulário |
| Estados | `--verde-700` / `--vermelho-700` / `--ambar-700` | `#2E7A4E` / `#B42318` / `#8A5600` | Sucesso / erro / aviso (com fundos `-100`) |

### Tokens semânticos

Os componentes usam **apenas** tokens semânticos (nunca a paleta base nem HEX):

`--color-primary` · `--color-primary-hover` · `--color-primary-strong` · `--color-primary-soft` · `--color-on-primary` · `--color-secondary` (+ `-strong`, `-soft`) · `--color-accent` (+ `-strong`, `-soft`, `-on-inverse`) · `--color-method` (+ `-strong`, `-soft`) · `--color-on-method` · `--color-background` · `--color-surface` · `--color-surface-raised` · `--color-inverse` · `--color-on-inverse` · `--color-on-inverse-muted` · `--color-text` · `--color-muted` · `--color-border` · `--color-border-strong` · `--color-focus` · `--color-focus-on-inverse` · `--color-success|error|warning` (+ `-soft`).

No Tailwind: `bg-primary`, `text-muted`, `border-border-strong`, `bg-inverse text-on-inverse`, etc. A paleta padrão do Tailwind está desativada, o que impede usar cores fora do sistema.

### Contrastes verificados (WCAG 2.2)

| Combinação | Rácio | Resultado |
| --- | --- | --- |
| Texto `#16201F` sobre fundo `#FAF8F3` | 15,70 : 1 | AAA |
| Texto sobre superfície `#F1EDE4` | 14,26 : 1 | AAA |
| Muted `#56625F` sobre fundo | 5,98 : 1 | AA |
| Muted sobre superfície | 5,43 : 1 | AA |
| Branco sobre primária `#174A4F` (botão) | 9,86 : 1 | AAA |
| Primária sobre fundo (links) | 9,29 : 1 | AAA |
| Branco sobre petróleo-950 (secções de ênfase) | 14,98 : 1 | AAA |
| Petróleo-300 sobre petróleo-950 (texto secundário escuro) | 8,10 : 1 | AAA |
| Marsala-700 sobre fundo (acento, links do Método) | 6,56 : 1 | AA |
| Branco sobre marsala-700 (botão do Método) | 6,96 : 1 | AA |
| Marsala-700 sobre marsala-100 (etiqueta) | 5,74 : 1 | AA |
| Branco sobre marsala-950 (ênfase do Método) | 15,97 : 1 | AAA |
| Marsala-200 sobre marsala-950 | 10,37 : 1 | AAA |
| Marsala-400 sobre petróleo-950 (acento em ênfase) | 4,72 : 1 | AA |
| Sálvia-700 sobre sálvia-100 (etiqueta) | 5,01 : 1 | AA |
| Erro `#B42318` sobre branco | 6,57 : 1 | AA |
| Sucesso `#2E7A4E` sobre fundo | 4,93 : 1 | AA |
| Borda de campo `#7E8984` sobre branco | 3,62 : 1 | AA (componente ≥ 3 : 1) |
| Foco `#2D6B6F` sobre fundo | 5,74 : 1 | AA (≥ 3 : 1) |
| Foco escuro `#F5E6E4` sobre petróleo-950 | 12,35 : 1 | AA |

**Regras**: `--color-secondary` (2,48 : 1) **nunca** é usado para texto ou para limites de controlos sobre fundo claro; é apenas decorativo (para texto usa-se `--color-secondary-strong`). O acento marsala passa AA como texto, mas continua reservado a detalhes: nunca para parágrafos nem para botões fora do universo do Método.

### Proporção de uso

~70 % areia/branco · ~20 % petróleo (texto, botões, secções de ênfase) · ~8 % sálvia · ≤ 2 % marsala. Na página do Método a proporção inverte-se: o marsala substitui o petróleo (ver secção 3). Por página, no máximo **duas** secções de ênfase escura (Método + CTA final na Home).

### Modo escuro

O site público usa apenas o tema claro na primeira versão (decisão de marca: consistência visual e fotografia). As secções de ênfase já funcionam como "superfície escura" com tokens próprios (`inverse`), e a separação paleta/semântica permite acrescentar um tema escuro mais tarde sem tocar nos componentes.

## 3. Marca Método C.E.N.T.R.O.

O logótipo oficial foi fornecido (`public/brand/metodo-centro/`):

| Ficheiro | Conteúdo | Uso |
| --- | --- | --- |
| `metodo-centro-original.jpg` | Original recebido (fundo branco) | Referência; não usar no site |
| `metodo-centro-logo.png` | Símbolo + "MÉTODO C.E.N.T.R.O®", fundo transparente | Hero da página do Método, materiais |
| `metodo-centro-simbolo.png` | Só o símbolo, fundo transparente | Secção C.E.N.T.R.O. da Home, favicon do Método, marca de água |

Os PNG foram recortados do original sem redesenho. **Para produção é necessário o logótipo em SVG** (e uma versão monocromática branca para fundos escuros); pedido registado nas pendências.

**Regras de uso**
- Nunca redesenhar, distorcer, rodar, recolorir nem aplicar efeitos ao símbolo ou ao lettering.
- Área de proteção: no mínimo a altura do ponto central do símbolo × 2 à volta de todo o logótipo.
- Tamanho mínimo: símbolo com 32 px; logótipo completo com 160 px de largura.
- Sobre fundo claro (areia, branco): versão marsala original. Sobre marsala profundo ou petróleo: apenas a versão branca, quando for fornecida.
- O nome escreve-se sempre **Método C.E.N.T.R.O.** em texto corrido; o "®" aparece no logótipo e na primeira menção da página do Método.

**Identidade da página do Método**: o contentor da página leva `data-brand="metodo"`. Com isso, as secções de ênfase passam a marsala profundo (`--marsala-950`), os botões primários a marsala e o foco a marsala, sem duplicar componentes. Nas restantes páginas, o Método aparece com o símbolo oficial e o acento marsala, mantendo o petróleo da Conexão Positiva.

**Tipografia do logótipo**: o lettering faz parte da imagem e não é reproduzido com fontes do site. Nos títulos do site, "C.E.N.T.R.O." usa Manrope 800, que tem um peso e uma largura próximos do logótipo.

## 4. Tipografia

Duas famílias, carregadas por `next/font/google` com `display: swap`, subconjuntos `latin` e `latin-ext`, e apenas os pesos usados:

| Família | Papel | Pesos |
| --- | --- | --- |
| **Manrope** | Títulos, números de impacto, letras do C.E.N.T.R.O. | 700, 800 |
| **Inter** | Texto, interface, formulários | 400, 500, 600 |

### Escala (fluida entre 360 e 1440 px)

| Token / utilitário | Tamanho | Altura de linha | Tracking | Família · peso | Uso |
| --- | --- | --- | --- | --- | --- |
| `text-display` | 40 → 72 px | 1,05 | −0,03 em | Manrope 800 | Hero da Home e do Método |
| `text-h1` | 34 → 56 px | 1,10 | −0,02 em | Manrope 800 | `h1` das páginas |
| `text-h2` | 28 → 40 px | 1,15 | −0,02 em | Manrope 700 | Títulos de secção |
| `text-h3` | 22 → 28 px | 1,30 | −0,015 em | Manrope 700 | Subtítulos, títulos de pilar |
| `text-h4` | 18 → 20 px | 1,35 | — | Manrope 700 | Títulos de card |
| `text-lead` | 18 → 20 px | 1,60 | — | Inter 400 | Introduções |
| `text-body` | 16 px | 1,60 | — | Inter 400 | Texto padrão |
| `text-body-lg` | 17 px | 1,70 | — | Inter 400 | Artigos |
| `text-small` | 14 px | 1,50 | — | Inter 400/500 | Metadados, legendas |
| `text-caption` | 12 px | 1,40 | +0,12 em, maiúsculas | Inter 600 | Eyebrows, categorias |

Regras: texto nunca abaixo de 12 px (e 12 px só em maiúsculas curtas); texto corrido limitado a `--measure` (68 ch); títulos com `text-wrap: balance`; números alinhados com `tabular-nums` (datas, horários, indicadores); itálico apenas em citações curtas.

## 5. Espaçamento e layout

- Base de 4 px; o Tailwind mantém `--spacing: 0.25rem`, portanto `p-4` = 16 px, `gap-6` = 24 px.
- Tokens de layout: `--space-section` (64 → 128 px entre secções), `--space-gutter` (20 → 40 px de margem lateral), `--container-max` (1200 px), `--container-wide` (1320 px).
- Grelha e breakpoints conforme Fase 2: `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1440. A paleta de breakpoints padrão do Tailwind (incluindo `sm`) foi substituída por esta.
- Ritmo interno: eyebrow → título 12 px · título → lead 16 px · lead → CTAs 32 px · cabeçalho de secção → conteúdo 40–56 px.

## 6. Raios, bordas e sombras

| Token | Valor | Uso |
| --- | --- | --- |
| `rounded-xs` | 4 px | Etiquetas pequenas, foco interno |
| `rounded-sm` | 8 px | Chips de data, tooltips |
| `rounded-md` | 12 px | Campos de formulário, caixas de logótipo |
| `rounded-lg` | 20 px | Cards, imagens, painéis |
| `rounded-xl` | 28 px | Imagens de destaque, CTA final |
| `rounded-full` | — | Botões, chips de filtro, avatares, WhatsApp |

Bordas: `--border-hairline` 1 px (divisores, cards), `--border-control` 1,5 px (campos e botão secundário), `--border-focus` 3 px (anel de foco).

Sombras tingidas com o petróleo: `shadow-sm` (repouso de cards elevados), `shadow-md` (hover de cards, dropdowns), `shadow-lg` (modal, menu), `shadow-header` (header após scroll). Nada de sombras em texto nem em botões.

## 7. Ícones

- **Lucide** em exclusivo; traço 1,75 px; tamanhos 16 (inline), 20 (botões, metadados), 24 (cards), 32 (destaques).
- Ícones de serviço e de pilar dentro de um contentor circular `bg-primary-soft text-primary` (40 px nos cards, 56 px nos destaques).
- Ícones decorativos com `aria-hidden="true"`; ícones que são o único conteúdo de um botão têm nome acessível.
- Proposta inicial de ícones (Lucide): Palestras `mic`, Formações `graduation-cap`, Workshops `pencil-ruler`, Team Building `users`, Liderança `compass`, Equipas `handshake`, Bem-estar `leaf`, Eventos `calendar-heart`. Pilares: Consciência `eye`, Equilíbrio `scale`, Nutrição `sprout`, Tempo `hourglass`, Respiração `wind`, Orientação `navigation`.

## 8. Componentes base

### Botões

| Variante | Aparência | Uso |
| --- | --- | --- |
| `primary` | Fundo primária, texto branco | Ação principal (máx. 1 por bloco) |
| `secondary` | Contorno 1,5 px primária, texto primária | Ação alternativa |
| `inverse` | Fundo branco, texto petróleo-950 | Ação principal sobre ênfase escura |
| `inverse-outline` | Contorno branco, texto branco | Alternativa sobre ênfase escura |
| `link` | Texto primária, sublinhado animado, seta opcional | "Saber mais →", "Ver todas" |

Tamanhos: `sm` 40 px · `md` 48 px · `lg` 56 px (alvo mínimo no mobile: 44 px; CTAs do hero usam `lg`). Forma em pílula (`rounded-full`), Inter 600, padding horizontal 20–28 px, ícone opcional à direita (seta) com deslocamento de 4 px no hover.

Estados: **hover** (primária → primary-hover; contorno ganha fundo `primary-soft`) · **active** (escala 0,98) · **focus-visible** (anel de 3 px `--color-focus` com offset de 2 px; sobre fundo escuro, `--color-focus-on-inverse`) · **disabled** (opacidade 0,45, sem hover, `aria-disabled`) · **loading** (spinner de 16 px + texto "A enviar…", largura mantida, `aria-busy`).

### Cards (só em coleções)

Anatomia comum: imagem `rounded-lg` (proporção fixa por tipo) → etiqueta de categoria (caption) → título `text-h4` → descrição `text-small muted` (máx. 2 linhas) → metadados/ação. Card inteiro clicável através do link do título (área de clique alargada), sem links aninhados.

| Card | Imagem | Particularidades |
| --- | --- | --- |
| `ServiceCard` | 4:3 | Ícone em contentor circular; mobile compacto sem imagem |
| `EventCard` | 16:9 | Bloco de data (dia em Manrope 800 + mês em caption), estado (pílula), preço, botão |
| `CaseStudyCard` | 4:3 ou 16:10 | Categoria · cliente, objetivo numa linha |
| `ArticleCard` | 16:10 | Categoria, data e tempo de leitura |

Superfície: `surface-raised` com borda hairline `border`; sem sombra em repouso. **Hover**: `shadow-md`, imagem com zoom 1,04 (`--duration-slow`, `ease-out`), título sublinhado, seta desloca 4 px. Foco visível no card inteiro quando o link recebe foco.

### Campos de formulário

- Altura 52 px (`--input-height`), texto 16 px (evita zoom automático no iOS), padding 14 px, `rounded-md`, borda 1,5 px `border-strong`, fundo branco.
- Label acima (Inter 600, 14 px); "(opcional)" em `muted`; texto de ajuda em `text-small muted`.
- **Foco**: borda primária + anel de 3 px `primary` a 25 % de opacidade. **Erro**: borda `error`, ícone `circle-alert` + mensagem `text-small` a `error`, fundo inalterado. **Sucesso** (validação em tempo real, quando útil, ex.: e-mail): ícone `check` discreto a `success`. **Desativado**: fundo `surface`, texto `muted`.
- Checkbox 20 px com `rounded-xs`, marcado em primária; select com chevron Lucide; textarea com altura mínima de 120 px.

### Etiquetas e pílulas

| Tipo | Estilo |
| --- | --- |
| Categoria (eyebrow) | Caption em maiúsculas, `muted`, com ponto marsala de 6 px antes |
| Estado "Últimas vagas" | Pílula `accent-soft` / texto `accent-strong` (marsala) |
| Estado "Gratuito" | Pílula `secondary-soft` / texto `secondary-strong` |
| Estado "Esgotado" / "Encerrado" | Pílula `surface` / texto `muted` |
| Filtro (chip) | Pílula com borda; selecionado = fundo `primary`, texto branco |

### Avisos e feedback

`Alert` com ícone, título curto e texto, nas variantes `success`, `error`, `warning`, `info` (fundos `-soft`, texto `text`, ícone e borda esquerda de 3 px na cor do estado). Usado no resumo de erros dos formulários e em avisos de eventos.

## 9. Movimento

| Token | Valor | Uso |
| --- | --- | --- |
| `--duration-instant` | 120 ms | Hover de cor, active |
| `--duration-fast` | 200 ms | Header, chips, acordeões |
| `--duration-base` | 320 ms | Painéis do C.E.N.T.R.O., menu mobile |
| `--duration-slow` | 500 ms | Zoom de imagem, reveals |
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entradas (padrão) |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transições de estado |
| `--reveal-distance` | 16 px | Deslocamento dos reveals |

Com `prefers-reduced-motion: reduce`, todas as durações passam a 0 e o deslocamento a 0 px; os componentes não precisam de lógica própria. Animar apenas `opacity` e `transform` (nunca `width`, `height`, `top`).

## 10. Foco e acessibilidade visual

- Anel de foco global: `outline: 3px solid var(--color-focus); outline-offset: 2px`, aplicado com `:focus-visible`. Sobre secções de ênfase: `--color-focus-on-inverse`.
- Nunca remover o foco sem substituto.
- Alvos de toque ≥ 44 × 44 px no mobile; ≥ 24 × 24 px no desktop.
- Informação nunca transmitida só pela cor: estados de evento têm texto, erros têm ícone e mensagem.
- Links em texto corrido são sempre sublinhados.

## 11. Como alterar a marca

1. Receber o manual de marca ou as cores oficiais (HEX).
2. Substituir os valores da "Paleta base" em `src/styles/tokens.css`, mantendo os nomes ou ajustando os mapeamentos em `theme.css`.
3. Recalcular a tabela de contrastes (secção 2) e ajustar as variantes `-strong` se algum par descer abaixo de AA.
4. Substituir o logótipo provisório em `siteSettings` (CMS).
