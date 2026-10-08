# Fase 2.1 — Fundamentos de UX

Regras transversais de layout, navegação, interação, formulários e estados. Os valores visuais exatos (cores, tipografia, espaçamentos em tokens) são definidos na Fase 3; aqui fixa-se a estrutura e o comportamento.

Wireframes navegáveis: [`wireframes.html`](wireframes.html) (abrir no browser; alternar Desktop / Tablet / Mobile).

## 1. Grelha e breakpoints

Mobile first. Os breakpoints coincidem com os do Tailwind para não haver tradução.

| Breakpoint | Largura    | Colunas | Gutter | Margem lateral | Notas                     |
| ---------- | ---------- | ------- | ------ | -------------- | ------------------------- |
| base       | 360–639 px | 4       | 16 px  | 20 px          | Testado em 360, 390, 430  |
| `md`       | ≥ 768 px   | 8       | 24 px  | 32 px          | Tablet vertical           |
| `lg`       | ≥ 1024 px  | 12      | 24 px  | 40 px          | Menu desktop aparece aqui |
| `xl`       | ≥ 1280 px  | 12      | 32 px  | auto           | Contentor 1200 px         |
| `2xl`      | ≥ 1440 px  | 12      | 32 px  | auto           | Contentor máx. 1320 px    |

- **Largura de leitura**: texto corrido limitado a ~68 caracteres (artigos, páginas legais, introduções).
- **Imagens "full-bleed"** (hero, faixas fotográficas) podem sair do contentor; o texto nunca.
- **Sem scroll horizontal** em nenhuma largura. Listas horizontais (testemunhos no mobile) usam scroll-snap dentro do próprio contentor.

## 2. Ritmo e tipos de secção

| Tipo          | Uso                                                 | Fundo                              |
| ------------- | --------------------------------------------------- | ---------------------------------- |
| **Base**      | Maioria das secções                                 | Fundo principal (claro)            |
| **Alternada** | Quebrar sequências longas (ex.: Testemunhos, FAQ)   | Superfície ligeiramente tingida    |
| **Ênfase**    | Reservada a **Método C.E.N.T.R.O.** e **CTA final** | Cor profunda da marca, texto claro |

- Espaço vertical entre secções: ~64 px (mobile) · ~96 px (tablet) · ~128 px (desktop).
- Cada secção tem no máximo **um** título `h2`, uma linha de introdução opcional e **um** CTA principal.
- **Cards só onde há coleções navegáveis**: Soluções, Eventos, Experiências, Insights. Quem somos, Impacto, Testemunhos, Clientes e CTAs usam layouts editoriais (texto + fotografia, números grandes, citações), evitando o efeito "template de cards".
- Hierarquia de títulos: um `h1` por página; `h2` por secção; `h3` em cards e subtítulos.

## 3. Navegação

### Header

- Desktop: 80 px de altura sobre o hero (transparente, texto claro); depois de ~80 px de scroll passa a 64 px, fundo sólido e sombra subtil. Transição ≤ 200 ms.
- Páginas sem hero fotográfico começam já no estado sólido.
- **Soluções ▾**: painel com 8 serviços em 2 colunas × 4 (ícone, nome, uma linha). Abre por clique, Enter/Espaço e seta para baixo; fecha com Esc, clique fora ou saída de foco. Hover abre com atraso de intenção (~150 ms) em dispositivos com rato.
- Mobile/tablet (< 1024 px): 64 px; logótipo, botão **Proposta** compacto e botão de menu (rótulo acessível "Abrir menu").

### Menu mobile

- Painel em ecrã inteiro, entra com fade + slide curto (sem animação com reduced motion).
- Ordem: links principais (tipografia grande, alvos ≥ 48 px) → Soluções em acordeão → botão "Solicitar proposta" largura total → contactos rápidos (telefone, e-mail, WhatsApp) → redes sociais.
- Foco preso no painel; Esc e o botão "Fechar menu" fecham e devolvem o foco ao botão de menu; scroll do fundo bloqueado; a navegação fecha o painel.

### WhatsApp flutuante

- Botão circular de 56 px, canto inferior direito, 16 px das margens + safe area.
- Aparece depois de 1 s ou do primeiro scroll (não compete com o hero no primeiro instante).
- **Escondido nas páginas de formulário no mobile** (`/solicitar-proposta`, `/contactos`, `/eventos/*/inscricao`) para nunca cobrir campos ou o botão de envio; nessas páginas o WhatsApp aparece como link no próprio conteúdo.
- Nas páginas de evento sobe acima da barra fixa de inscrição.

### Barra fixa de inscrição (mobile, página de evento)

- Fixa no fundo: data abreviada + preço/"Gratuito" + botão **Inscrever-me**. Aparece quando o CTA principal sai do ecrã. Respeita a safe area inferior.

### Breadcrumbs

- Em todas as páginas de segundo nível ou mais. No mobile mostram apenas o nível anterior ("← Soluções") para poupar espaço.

## 4. Padrões de interação

### Método C.E.N.T.R.O. na Home

- **Desktop/tablet (≥ 768 px)**: seis letras grandes em linha formam a palavra C·E·N·T·R·O. São **separadores** (padrão ARIA Tabs): setas ←/→ mudam de pilar, Home/End vão ao primeiro/último. Hover (com atraso de intenção) e clique ativam o pilar; o painel mostra ícone, nome, descrição curta e link "Saber mais". A letra ativa ganha destaque; as restantes ficam atenuadas. Sem rotação automática.
- **Mobile (< 768 px)**: acordeão vertical: as letras empilhadas leem "CENTRO" na coluna esquerda; um pilar aberto de cada vez, o primeiro aberto por defeito.
- Microanimação: entrada do painel com fade + 8 px de deslocamento (≤ 250 ms). Com `prefers-reduced-motion`, mudança instantânea.

### Página do Método (scroll storytelling)

- **Desktop**: coluna esquerda sticky com índice vertical C/E/N/T/R/O, que funciona como navegação (links âncora) e marca o pilar visível; coluna direita com as seis secções em scroll. Indicador de progresso pela própria letra ativa, sem barras extra.
- **Mobile**: índice horizontal de 6 letras fixo por baixo do header (chips de 44 px), secções empilhadas.
- Cada pilar tem um id próprio (`/metodo-centro#consciencia`) para partilha e links da Home.

### Testemunhos

- Layout editorial: um testemunho em destaque (citação grande, fotografia, nome, cargo, empresa) + dois secundários.
- Com mais de 3 testemunhos: setas Anterior/Seguinte e indicador "2 / 6"; **sem autoplay**. No mobile: scroll-snap horizontal com as mesmas setas.
- Fotografia opcional; sem ela, mostra as iniciais (nunca uma fotografia genérica).

### Clientes e parceiros

- Grelha estática (6 por linha no desktop, 3 no mobile), logótipos monocromáticos dentro de caixas de proporção igual (`object-fit: contain`), nunca esticados. Sem marquee animado.

### Filtros (Eventos, Experiências)

- Eventos: separador **Próximos | Passados** + chips de categoria (Workshops, Formações, Palestras, Experiências).
- Experiências: chips (Todas, Team Building, Formação, Workshop, Evento, Liderança, Bem-estar).
- Chips são botões com `aria-pressed`; estado refletido no URL (`?filtro=passados&categoria=workshops`) para partilha e botão "voltar". Contagem de resultados anunciada (`aria-live="polite"`). Chips com zero resultados ficam ocultos.
- No mobile os chips fazem scroll horizontal dentro da sua faixa.

### Pesquisa em Insights

- Ativada quando houver ≥ 12 artigos publicados (limite configurável). Campo de pesquisa + chips de categoria (as categorias navegam para `/insights/categoria/[slug]`). Resultados em `/insights?q=` com `noindex`.

### Galeria

- Grelha 3 colunas (desktop) / 2 (mobile); abre lightbox acessível (diálogo modal, setas, Esc, legenda, contador). Vídeos com poster e controlos nativos, nunca autoplay com som.

### FAQ

- Acordeão; vários itens podem estar abertos. Pergunta é o botão; estado com `aria-expanded`.

## 5. Formulários

### Regras gerais

- Uma coluna no mobile; no desktop, pares curtos lado a lado (Nome | Sobrenome, E-mail | Telefone).
- Label sempre visível acima do campo (nunca só placeholder). Campos opcionais marcados "(opcional)"; os restantes são obrigatórios.
- `autocomplete` correto (`given-name`, `family-name`, `email`, `tel`, `organization`, `organization-title`), `type` e `inputmode` adequados para teclados móveis.
- Telefone com indicativo **+244** por defeito e editável.
- **Validação**: no envio e à saída de cada campo; depois do primeiro erro, revalida enquanto se escreve. Mensagem por baixo do campo, ligada por `aria-describedby`. No envio com erros, resumo no topo (com links para os campos) e foco no primeiro erro.
- **Estados do botão**: normal → "A enviar…" (desativado, indicador de progresso) → redireciona para a página de confirmação. Erro de servidor: aviso no topo, dados preservados, botão volta a ficar ativo.
- Consentimento de privacidade: checkbox **desmarcada**, obrigatória, com link para a Política de Privacidade (abre no mesmo separador numa página leve; o rascunho do formulário é guardado localmente para não se perder).
- Anti-spam invisível ao utilizador (honeypot, tempo mínimo, Turnstile).

### Pedido de proposta (`/solicitar-proposta`)

Página única com três grupos (`fieldset` + `legend`), sem passos, para não esconder o esforço e simplificar a validação:

1. **Os seus dados**: Nome · Empresa · Cargo · E-mail · Telefone
2. **O seu projeto**: Serviço pretendido (lista do CMS + "Ainda não sei: preciso de ajuda a escolher") · Número aproximado de participantes (intervalos: até 20 · 21–50 · 51–100 · 101–250 · mais de 250) · Local · Data prevista (data ou "Ainda por definir") · Objetivo
3. **Detalhes adicionais**: Orçamento estimado (opcional; intervalos configuráveis no CMS + "Prefiro não indicar") · Informações adicionais (opcional) · Consentimento

- `?servico=team-building` pré-seleciona o serviço (CTAs das páginas de serviço).
- Desktop: coluna lateral sticky "O que acontece a seguir" (1. Analisamos o seu pedido · 2. Contactamos para conhecer melhor o contexto · 3. Enviamos uma proposta à medida). Prazo de resposta só é mostrado depois de confirmado pela equipa.

### Inscrição em evento (`/eventos/[slug]/inscricao`)

- Resumo do evento no topo (mobile) ou coluna lateral sticky (desktop): imagem, nome, data, hora, local, preço, vagas restantes.
- Campos: Nome · Sobrenome · E-mail · Telefone · Empresa (opcional) · Cargo (opcional) · Observações (opcional) · Consentimento. O evento está fixo (não editável).
- Variantes por estado do evento: **Aberto** → formulário; **Esgotado** → mesmo formulário como "Entrar na lista de espera" (se ativado); **Encerrado / Passado / Cancelado** → mensagem + link para próximos eventos.
- Evento pago: nota "A inscrição reserva o seu lugar. Enviaremos as instruções de pagamento por e-mail." (sujeito à decisão D3).

### Contacto (`/contactos`)

- Nome · Empresa (opcional) · E-mail · Telefone (opcional) · Assunto (lista: Pedido de informação, Parcerias, Imprensa, Outro) · Mensagem · Consentimento. Botão **Enviar mensagem**.
- Ao lado: telefone, e-mail, WhatsApp, redes, localização. Quem quer uma proposta é encaminhado para `/solicitar-proposta`.

## 6. Estados

| Estado                     | Comportamento                                                                                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Carregamento de página** | Páginas estáticas não mostram loaders. Onde há streaming (vagas de evento), skeleton do próprio bloco com as dimensões finais (sem saltos de layout).                                                                                                        |
| **Listagens vazias**       | Mensagem humana + ação. Eventos: "De momento não há eventos agendados. Siga-nos no Instagram ou fale connosco para levar uma experiência à sua organização." Experiências e Insights: secção oculta na Home; página própria com mensagem e link de contacto. |
| **Filtros sem resultados** | "Não encontrámos resultados para este filtro." + botão "Limpar filtros".                                                                                                                                                                                     |
| **Sucesso**                | Páginas de confirmação dedicadas (abaixo).                                                                                                                                                                                                                   |
| **Erro de formulário**     | Ver secção 5.                                                                                                                                                                                                                                                |
| **404**                    | Título claro ("Esta página não existe ou mudou de lugar"), pesquisa/links para Soluções, Eventos, Insights, Contactos e Home.                                                                                                                                |
| **Erro inesperado**        | Mensagem calma, botão "Tentar novamente" e link para a Home; erro registado no servidor.                                                                                                                                                                     |

### Páginas de confirmação

- **`/proposta-recebida`**: "Obrigado pelo seu contacto. A equipa Conexão Positiva irá analisar as informações e entrar em contacto consigo." + próximos passos (os mesmos 3) + links para Experiências e Método C.E.N.T.R.O.
- **`/inscricao-confirmada?evento=slug`**: confirmação com nome, data e local do evento (lidos do CMS pelo slug; nenhum dado pessoal no URL), botão **Adicionar ao calendário** (.ics), lembrete de que foi enviado um e-mail, e "Partilhar evento".
- **`/mensagem-enviada`**: agradecimento curto + links para Insights e Eventos.

## 7. Movimento

- Reveals ao entrar no ecrã: fade + 12–16 px, uma vez por elemento, ≤ 400 ms, em cascata curta nos grupos de cards. O conteúdo é visível sem JavaScript (o movimento só melhora o que já está lá).
- Hover de cards: imagem com zoom ≤ 1,04, título sublinhado animado, seta do link desloca 4 px.
- Hero: entrada do título linha a linha (as três frases da headline), depois subtítulo e CTAs; total < 1 s.
- `prefers-reduced-motion: reduce` desativa reveals, zoom, entrada do hero e transições do C.E.N.T.R.O. (ficam mudanças instantâneas).

## 8. Checklist de acessibilidade por componente

| Componente        | Requisitos                                                                         |
| ----------------- | ---------------------------------------------------------------------------------- |
| Header / Soluções | `nav` com rótulo, `aria-expanded`, Esc fecha, foco gerido                          |
| Menu mobile       | Diálogo modal, focus trap, devolução de foco                                       |
| C.E.N.T.R.O.      | Tabs ARIA (desktop) / acordeão (mobile), navegação por setas                       |
| Testemunhos       | Região com rótulo, botões com nome acessível, sem autoplay                         |
| Filtros           | `aria-pressed`, contagem em `aria-live`                                            |
| Galeria           | Diálogo modal, alt text obrigatório, setas e Esc                                   |
| Formulários       | Labels, `aria-describedby`, `aria-invalid`, resumo de erros, foco no primeiro erro |
| WhatsApp          | Link com nome acessível "Falar connosco no WhatsApp", ≥ 44 px                      |
| Global            | Skip link, foco visível, alvos ≥ 44 px no mobile, contraste AA                     |
