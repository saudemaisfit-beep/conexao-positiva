# Fase 3 — Design System

Referência visual navegável: [`design-system.html`](design-system.html).
Código: [`src/styles/tokens.css`](../../src/styles/tokens.css) (paleta base e tokens de layout/movimento) e [`src/styles/theme.css`](../../src/styles/theme.css) (tokens semânticos expostos ao Tailwind v4).

> **Estado da identidade.** As duas cores de marca são **oficiais**, extraídas dos logótipos fornecidos: **azul Conexão Positiva** (`#0AA0E0`) e **marsala Método C.E.N.T.R.O.** (`#904141`). A imagem do logótipo da Conexão Positiva vinha em Display P3 e foi convertida para sRGB (o espaço de cor da web) antes da medição. Os tons derivados (mais escuros e mais claros) foram calculados a partir do mesmo matiz para garantir contraste. Os neutros (areia, grafite) são uma proposta. Para ajustar, basta alterar a "Paleta base" em `tokens.css` e voltar a verificar os contrastes desta página.

## 1. Direção visual

**Duas marcas, uma linguagem: pontos ligados.**
- **Conexão Positiva: a rede.** O logótipo é um globo formado por pontos ligados por linhas: pessoas, equipas e organizações em conexão. Traduz literalmente "Conectamos pessoas".
- **Método C.E.N.T.R.O.: o centro.** Seis figuras humanas em movimento à volta de um ponto central: os seis pilares a partir de dentro.
- As duas marcas partilham o mesmo vocabulário (ponto, linha, movimento circular). O site usa-o com moderação: o símbolo da rede como assinatura da Conexão Positiva (header, rodapé, separadores discretos) e o símbolo do centro na secção e na página do Método.

**Tom visual**
- **Claro e confiante**: fundo de areia muito claro, texto grafite com viés azul, o azul profundo da marca em botões e links, e um azul-marinho para as secções de ênfase, onde o azul oficial brilha.
- **Calor humano em detalhes**: o marsala do Método é o único acento quente.
- **Tipografia que lidera**: títulos grandes em Manrope, texto em Inter.
- **Fotografia humana em primeiro plano**: o sistema é discreto para que as pessoas sejam o centro.

O que fica de fora: gradientes, glassmorphism, cards em todas as secções, sombras pesadas, mais cores além de azul, marsala e neutros, emojis como ícones.

## 2. Cor

### Paleta base

| Família | Token | HEX | Uso |
| --- | --- | --- | --- |
| **Azul (oficial Conexão Positiva)** | `--azul-950` | `#082231` | Fundo das secções de ênfase e do rodapé (azul-marinho) |
| | `--azul-800` | `#0A4E73` | Hover do botão primário; texto em etiquetas azuis |
| | `--azul-700` | `#0B6592` | **Primária**: botões, links, ícones ativos |
| | `--azul-600` | `#0A7DB5` | Anel de foco |
| | `--azul-400` | `#0AA0E0` | **Cor do logótipo**: símbolo, detalhes, destaques sobre azul-marinho (nunca texto sobre fundo claro) |
| | `--azul-200` | `#B3E1F5` | Texto secundário e foco sobre azul-marinho; fundo de etiquetas |
| | `--azul-100` | `#E2F3FB` | Superfícies tingidas, contentor de ícones |
| **Marsala (oficial Método C.E.N.T.R.O.)** | `--marsala-950` | `#3A1717` | Fundo das secções de ênfase da página do Método |
| | `--marsala-800` | `#742F30` | Hover de botões do Método; texto de destaque quente |
| | `--marsala-700` | `#904141` | **Cor do logótipo do Método** · **acento** do site (ponto do eyebrow, sublinhados, "Últimas vagas") |
| | `--marsala-400` | `#C27F7C` | Acento sobre azul-marinho |
| | `--marsala-200` | `#E9C9C6` | Texto secundário sobre marsala profundo |
| | `--marsala-100` | `#F5E6E4` | Fundo de etiquetas quentes |
| Areia (proposta) | `--areia-50` | `#FAF8F3` | **Fundo** da página |
| | `--areia-100` | `#F1EDE4` | **Superfície** (secções alternadas) |
| | `--areia-300` | `#DCD6CA` | Bordas decorativas, divisores |
| Grafite (proposta) | `--grafite-900` | `#131C24` | **Texto** |
| | `--grafite-600` | `#52606B` | Texto secundário (**muted**) |
| | `--grafite-400` | `#7A8691` | Bordas de campos de formulário |
| Estados | `--verde-700` / `--vermelho-700` / `--ambar-700` | `#2E7A4E` / `#B42318` / `#8A5600` | Sucesso / erro / aviso (com fundos `-100`) |

### Tokens semânticos

Os componentes usam **apenas** tokens semânticos (nunca a paleta base nem HEX):

`--color-primary` · `--color-primary-hover` · `--color-primary-strong` · `--color-primary-soft` · `--color-on-primary` · `--color-secondary` (azul oficial; + `-strong`, `-soft`) · `--color-accent` (marsala; + `-strong`, `-soft`, `-on-inverse`) · `--color-brand-on-inverse` · `--color-method` (+ `-strong`, `-soft`) · `--color-on-method` · `--color-background` · `--color-surface` · `--color-surface-raised` · `--color-inverse` · `--color-on-inverse` · `--color-on-inverse-muted` · `--color-text` · `--color-muted` · `--color-border` · `--color-border-strong` · `--color-focus` · `--color-focus-on-inverse` · `--color-success|error|warning` (+ `-soft`).

No Tailwind: `bg-primary`, `text-muted`, `border-border-strong`, `bg-inverse text-on-inverse`, etc. A paleta padrão do Tailwind está desativada, o que impede usar cores fora do sistema.

### Contrastes verificados (WCAG 2.2)

| Combinação | Rácio | Resultado |
| --- | --- | --- |
| Texto `#131C24` sobre fundo `#FAF8F3` | 16,23 : 1 | AAA |
| Texto sobre superfície `#F1EDE4` | 14,74 : 1 | AAA |
| Muted `#52606B` sobre fundo | 6,10 : 1 | AA |
| Muted sobre superfície | 5,54 : 1 | AA |
| Branco sobre primária `#0B6592` (botão) | 6,38 : 1 | AA |
| Primária sobre fundo (links) | 6,01 : 1 | AA |
| Branco sobre azul-marinho `#082231` (ênfase, rodapé) | 16,36 : 1 | AAA |
| Azul oficial `#0AA0E0` sobre azul-marinho | 5,55 : 1 | AA |
| Azul-200 sobre azul-marinho (texto secundário escuro) | 11,69 : 1 | AAA |
| Azul-800 sobre azul-200 (etiqueta azul) | 6,38 : 1 | AA |
| Marsala-700 sobre fundo (acento, links do Método) | 6,56 : 1 | AA |
| Branco sobre marsala-700 (botão do Método) | 6,96 : 1 | AA |
| Marsala-700 sobre marsala-100 (etiqueta) | 5,74 : 1 | AA |
| Marsala-400 sobre azul-marinho (acento em ênfase) | 5,16 : 1 | AA |
| Branco sobre marsala-950 (ênfase do Método) | 15,97 : 1 | AAA |
| Marsala-200 sobre marsala-950 | 10,37 : 1 | AAA |
| Erro `#B42318` sobre branco | 6,57 : 1 | AA |
| Sucesso `#2E7A4E` sobre fundo | 4,93 : 1 | AA |
| Borda de campo `#7A8691` sobre branco | 3,72 : 1 | AA (componente ≥ 3 : 1) |
| Foco `#0A7DB5` sobre fundo | 4,29 : 1 | AA (componente ≥ 3 : 1) |
| Foco escuro `#B3E1F5` sobre azul-marinho | 11,69 : 1 | AA |

**Regras**: o **azul oficial** `#0AA0E0` tem apenas 2,78 : 1 sobre fundo claro: é usado no símbolo, em ilustrações e em detalhes gráficos, **nunca** em texto ou limites de controlos sobre fundo claro (aí usa-se `--color-primary`). Sobre azul-marinho pode ser usado em texto grande e destaques. O marsala passa AA como texto, mas continua reservado a detalhes fora do universo do Método.

### Proporção de uso

~70 % areia/branco · ~22 % azul (texto de ação, botões, secções de ênfase, símbolo) · ≤ 5 % marsala · resto em estados. Na página do Método o marsala substitui o azul nas ênfases (ver secção 3). Por página, no máximo **duas** secções de ênfase escura (Método + CTA final na Home).

### Modo escuro

O site público usa apenas o tema claro na primeira versão (consistência visual e fotografia). As secções de ênfase já funcionam como "superfície escura" com tokens próprios (`inverse`), e a separação paleta/semântica permite acrescentar um tema escuro mais tarde sem tocar nos componentes.

## 3. Marcas

### Conexão Positiva

Ficheiros em `public/brand/conexao-positiva/`:

| Ficheiro | Conteúdo | Uso |
| --- | --- | --- |
| `conexao-positiva-original.jpg` | Captura recebida (símbolo sobre disco branco, fundo de fotografia) | Referência; não usar no site |
| `conexao-positiva-simbolo.png` | Símbolo (globo em rede), azul oficial em sRGB, fundo transparente, 680 px | Header, rodapé, favicon provisório, imagem social |

O PNG foi recortado da imagem recebida sem redesenho; as bordas são ligeiramente suaves por causa da resolução de origem. **Para produção são necessários**: o símbolo em **SVG**, e o **logótipo com o nome** "Conexão Positiva" (versões horizontal e vertical), se existir. Enquanto não existir, o header usa o símbolo + "Conexão Positiva" composto em Manrope 800, marcado como **composição provisória**.

**Regras de uso**
- Nunca redesenhar, distorcer, rodar, recolorir nem aplicar efeitos.
- Área de proteção: no mínimo 25 % do diâmetro do símbolo à volta.
- Tamanho mínimo: 24 px de diâmetro (favicon 32 px).
- Funciona em azul oficial sobre areia, branco e azul-marinho. Sobre fotografia, apenas dentro do disco branco (como na versão recebida) ou numa versão branca, quando fornecida.

### Método C.E.N.T.R.O.

Ficheiros em `public/brand/metodo-centro/`:

| Ficheiro | Conteúdo | Uso |
| --- | --- | --- |
| `metodo-centro-original.jpg` | Original recebido (fundo branco) | Referência; não usar no site |
| `metodo-centro-logo.png` | Símbolo + "MÉTODO C.E.N.T.R.O®", fundo transparente | Hero da página do Método, materiais |
| `metodo-centro-simbolo.png` | Só o símbolo, fundo transparente | Secção C.E.N.T.R.O. da Home, marca de água |

**Para produção é necessário o logótipo em SVG** e uma versão monocromática branca para fundos escuros.

**Regras de uso**
- Nunca redesenhar, distorcer, rodar, recolorir nem aplicar efeitos ao símbolo ou ao lettering.
- Área de proteção: no mínimo a altura do ponto central do símbolo × 2 à volta de todo o logótipo.
- Tamanho mínimo: símbolo com 32 px; logótipo completo com 160 px de largura.
- Sobre fundo claro (areia, branco): versão marsala original. Sobre fundos escuros: apenas a versão branca, quando for fornecida (marsala sobre azul-marinho tem só 2,35 : 1).
- O nome escreve-se sempre **Método C.E.N.T.R.O.** em texto corrido; o "®" aparece no logótipo e na primeira menção da página do Método.

**Identidade da página do Método**: o contentor da página leva `data-brand="metodo"`. As secções de ênfase passam a marsala profundo (`--marsala-950`), os botões primários, links e foco a marsala, sem duplicar componentes. Nas restantes páginas (ex.: secção C.E.N.T.R.O. da Home), o Método aparece com o símbolo oficial sobre fundo claro e o acento marsala, dentro do azul da Conexão Positiva.

**Tipografia dos logótipos**: o lettering faz parte da imagem e não é reproduzido com fontes do site. Nos títulos, "C.E.N.T.R.O." usa Manrope 800, com peso e largura próximos do logótipo.

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

Sombras tingidas com o azul-marinho: `shadow-sm` (repouso de cards elevados), `shadow-md` (hover de cards, dropdowns), `shadow-lg` (modal, menu), `shadow-header` (header após scroll). Nada de sombras em texto nem em botões.

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
| `inverse` | Fundo branco, texto azul-marinho | Ação principal sobre ênfase escura |
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

## 11. Como ajustar a marca

As cores oficiais foram extraídas de imagens dos logótipos (valores aproximados ao pixel). Quando chegar o manual de marca com os HEX exatos:

1. Substituir `--azul-400` e `--marsala-700` em `src/styles/tokens.css` pelos valores oficiais e recalcular os tons derivados do mesmo matiz.
2. Recalcular a tabela de contrastes (secção 2) e ajustar as variantes escuras se algum par descer abaixo de AA.
3. Substituir os PNG de `public/brand/` pelos SVG oficiais.
4. Atualizar logótipo e favicon em `siteSettings` (CMS).
