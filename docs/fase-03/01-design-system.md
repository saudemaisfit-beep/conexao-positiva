# Fase 3 — Design System

Referência visual navegável: [`design-system.html`](design-system.html).
Código: [`src/styles/tokens.css`](../../src/styles/tokens.css) (paleta base e tokens de layout/movimento) e [`src/styles/theme.css`](../../src/styles/theme.css) (tokens semânticos expostos ao Tailwind v4).

> **Paleta provisória.** A identidade oficial da Conexão Positiva ainda não foi fornecida. As cores abaixo são uma proposta de trabalho e **não** são identidade oficial. Para aplicar as cores oficiais, basta alterar os valores da "Paleta base" em `tokens.css` e voltar a verificar os contrastes desta página.

## 1. Direção visual

**Ideia central: o centro.** O Método C.E.N.T.R.O. dá ao sistema o seu motivo: um ponto a partir do qual tudo se organiza. Visualmente traduz-se em:

- **Anel e ponto**: círculo fino com um ponto central, usado com moderação (marcador de eyebrow, representação dos 6 pilares, fundo da página do Método). Nunca como padrão decorativo repetido.
- **Calma com profundidade**: fundo de areia muito claro, texto grafite esverdeado, um petróleo profundo como cor de confiança e um ocre quente apenas em detalhes.
- **Tipografia que lidera**: títulos grandes em Manrope, com espaço à volta; o texto corrido em Inter, confortável e sem pressa.
- **Fotografia humana em primeiro plano**: o sistema é discreto para que as pessoas nas fotografias sejam o centro.

O que fica de fora: gradientes, glassmorphism, cards em todas as secções, sombras pesadas, mais de uma cor de destaque, emojis como ícones.

## 2. Cor

### Paleta base (provisória)

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
| Ocre | `--ocre-700` | `#94591A` | Texto de destaque quente ("Últimas vagas") |
| | `--ocre-400` | `#D08C45` | **Acento**: ponto do motivo, sublinhados, indicadores (decorativo) |
| | `--ocre-100` | `#F6E6D3` | Fundo de destaque quente; foco sobre fundo escuro |
| Areia | `--areia-50` | `#FAF8F3` | **Fundo** da página |
| | `--areia-100` | `#F1EDE4` | **Superfície** (secções alternadas) |
| | `--areia-300` | `#DCD6CA` | Bordas decorativas, divisores |
| Grafite | `--grafite-900` | `#16201F` | **Texto** |
| | `--grafite-600` | `#56625F` | Texto secundário (**muted**) |
| | `--grafite-400` | `#7E8984` | Bordas de campos de formulário |
| Estados | `--verde-700` / `--vermelho-700` / `--ambar-700` | `#2E7A4E` / `#B42318` / `#8A5600` | Sucesso / erro / aviso (com fundos `-100`) |

### Tokens semânticos

Os componentes usam **apenas** tokens semânticos (nunca a paleta base nem HEX):

`--color-primary` · `--color-primary-hover` · `--color-primary-strong` · `--color-primary-soft` · `--color-on-primary` · `--color-secondary` (+ `-strong`, `-soft`) · `--color-accent` (+ `-strong`, `-soft`) · `--color-background` · `--color-surface` · `--color-surface-raised` · `--color-inverse` · `--color-on-inverse` · `--color-on-inverse-muted` · `--color-text` · `--color-muted` · `--color-border` · `--color-border-strong` · `--color-focus` · `--color-focus-on-inverse` · `--color-success|error|warning` (+ `-soft`).

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
| Ocre-700 sobre fundo | 5,34 : 1 | AA |
| Ocre-700 sobre ocre-100 (etiqueta) | 4,64 : 1 | AA |
| Sálvia-700 sobre sálvia-100 (etiqueta) | 5,01 : 1 | AA |
| Erro `#B42318` sobre branco | 6,57 : 1 | AA |
| Sucesso `#2E7A4E` sobre fundo | 4,93 : 1 | AA |
| Borda de campo `#7E8984` sobre branco | 3,62 : 1 | AA (componente ≥ 3 : 1) |
| Foco `#2D6B6F` sobre fundo | 5,74 : 1 | AA (≥ 3 : 1) |
| Foco escuro `#F6E6D3` sobre petróleo-950 | 12,25 : 1 | AA |

**Regras**: `--color-accent` (2,63 : 1) e `--color-secondary` (2,48 : 1) **nunca** são usados para texto ou para limites de controlos sobre fundo claro; são apenas decorativos. Para texto nessas famílias usam-se as variantes `-strong`.

### Proporção de uso

~70 % areia/branco · ~20 % petróleo (texto, botões, secções de ênfase) · ~8 % sálvia · ≤ 2 % ocre. Por página, no máximo **duas** secções de ênfase escura (Método + CTA final na Home).

### Modo escuro

O site público usa apenas o tema claro na primeira versão (decisão de marca: consistência visual e fotografia). As secções de ênfase já funcionam como "superfície escura" com tokens próprios (`inverse`), e a separação paleta/semântica permite acrescentar um tema escuro mais tarde sem tocar nos componentes.

## 3. Tipografia

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

## 4. Espaçamento e layout

- Base de 4 px; o Tailwind mantém `--spacing: 0.25rem`, portanto `p-4` = 16 px, `gap-6` = 24 px.
- Tokens de layout: `--space-section` (64 → 128 px entre secções), `--space-gutter` (20 → 40 px de margem lateral), `--container-max` (1200 px), `--container-wide` (1320 px).
- Grelha e breakpoints conforme Fase 2: `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1440. A paleta de breakpoints padrão do Tailwind (incluindo `sm`) foi substituída por esta.
- Ritmo interno: eyebrow → título 12 px · título → lead 16 px · lead → CTAs 32 px · cabeçalho de secção → conteúdo 40–56 px.

## 5. Raios, bordas e sombras

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

## 6. Ícones

- **Lucide** em exclusivo; traço 1,75 px; tamanhos 16 (inline), 20 (botões, metadados), 24 (cards), 32 (destaques).
- Ícones de serviço e de pilar dentro de um contentor circular `bg-primary-soft text-primary` (40 px nos cards, 56 px nos destaques).
- Ícones decorativos com `aria-hidden="true"`; ícones que são o único conteúdo de um botão têm nome acessível.
- Proposta inicial de ícones (Lucide): Palestras `mic`, Formações `graduation-cap`, Workshops `pencil-ruler`, Team Building `users`, Liderança `compass`, Equipas `handshake`, Bem-estar `leaf`, Eventos `calendar-heart`. Pilares: Consciência `eye`, Equilíbrio `scale`, Nutrição `sprout`, Tempo `hourglass`, Respiração `wind`, Orientação `navigation`.

## 7. Componentes base

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
| Categoria (eyebrow) | Caption em maiúsculas, `muted`, com ponto ocre de 6 px antes |
| Estado "Últimas vagas" | Pílula `accent-soft` / texto `accent-strong` |
| Estado "Gratuito" | Pílula `secondary-soft` / texto `secondary-strong` |
| Estado "Esgotado" / "Encerrado" | Pílula `surface` / texto `muted` |
| Filtro (chip) | Pílula com borda; selecionado = fundo `primary`, texto branco |

### Avisos e feedback

`Alert` com ícone, título curto e texto, nas variantes `success`, `error`, `warning`, `info` (fundos `-soft`, texto `text`, ícone e borda esquerda de 3 px na cor do estado). Usado no resumo de erros dos formulários e em avisos de eventos.

## 8. Movimento

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

## 9. Foco e acessibilidade visual

- Anel de foco global: `outline: 3px solid var(--color-focus); outline-offset: 2px`, aplicado com `:focus-visible`. Sobre secções de ênfase: `--color-focus-on-inverse`.
- Nunca remover o foco sem substituto.
- Alvos de toque ≥ 44 × 44 px no mobile; ≥ 24 × 24 px no desktop.
- Informação nunca transmitida só pela cor: estados de evento têm texto, erros têm ícone e mensagem.
- Links em texto corrido são sempre sublinhados.

## 10. Como alterar a marca

1. Receber o manual de marca ou as cores oficiais (HEX).
2. Substituir os valores da "Paleta base" em `src/styles/tokens.css`, mantendo os nomes ou ajustando os mapeamentos em `theme.css`.
3. Recalcular a tabela de contrastes (secção 2) e ajustar as variantes `-strong` se algum par descer abaixo de AA.
4. Substituir o logótipo provisório em `siteSettings` (CMS).
