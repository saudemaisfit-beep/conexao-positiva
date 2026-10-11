# Fase 17 — Acessibilidade

## Objetivo

Confirmar que o site cumpre a **WCAG 2.2, nível AA**, em todas as páginas, em computador e telemóvel, e corrigir o que falhar.

## Como foi verificado

| Verificação                                                              | Ferramenta / método                                         | Resultado                                                |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------- |
| Regras automáticas WCAG 2.0–2.2 A/AA + boas práticas                     | axe-core, 49 páginas × 2 larguras (1280 px e 390 px) = 98   | **0 falhas** (antes: 2 regras de boas práticas)          |
| Lighthouse — acessibilidade                                              | Lighthouse 13.5 (telemóvel)                                 | **100** nas páginas medidas                              |
| Teclado: primeiro Tab, ordem, foco visível, foco em elementos invisíveis | Playwright, até 80 Tabs por página                          | "Saltar para o conteúdo" primeiro; foco sempre visível   |
| Menu móvel e preferências de cookies                                     | Playwright                                                  | Foco preso no diálogo, Esc fecha, foco volta ao botão    |
| Formulários com erros                                                    | Playwright (envio vazio)                                    | Foco no 1.º campo inválido; 11/11 erros ligados ao campo |
| Alvos de toque ≥ 24 × 24 px (2.5.8)                                      | Medição de todos os controlos a 320 px                      | Cumpre (ver exceção abaixo)                              |
| Reflow a 320 px (1.4.10) e zoom a 200 % (640 px)                         | Largura do documento vs. ecrã                               | Sem deslocamento horizontal                              |
| Espaçamento de texto (1.4.12)                                            | CSS do critério (linha 1,5; letras 0,12em; palavras 0,16em) | Sem perda de conteúdo                                    |
| Movimento reduzido (2.3.3)                                               | `prefers-reduced-motion: reduce`                            | Animações com duração 0                                  |

## O que mudou

1. **Marcos (landmarks) únicos e bem colocados.** As secções que continuam o cabeçalho da página repetiam o título como nome (dois marcos iguais para o leitor de ecrã); deixaram de ter nome. Blocos laterais dentro de outras secções passaram de `<aside>` a `<div>`.
2. **Alvos de toque.** Links do rodapé, "Gerir cookies", botões-link (ex.: "Personalizar"), categoria no topo do artigo, "Ver no mapa" e caixas de seleção passaram a ter pelo menos 24 px.
3. **Reflow a 320 px.**
   - O cabeçalho não cabia (o botão do menu ficava 14 px fora do ecrã): abaixo de 360 px, o nome "Conexão Positiva" passa a duas linhas.
   - As grelhas de duas colunas usavam colunas automáticas no telemóvel, que alargavam com o conteúdo; passaram a `grid-cols-1`.
   - O título principal começa agora em 34 px a 320 px (antes 40 px: "Potencializamos" não cabia e ficava cortado). Em ecrãs grandes continua a 72 px.
4. **Espaçamento de texto.** Os botões podem quebrar linha em vez de sair do ecrã, e os títulos partem palavras longas (`overflow-wrap` + `hyphens`).

## Já cumprido em fases anteriores (confirmado agora)

- Contraste AA em todo o texto (incluindo animações de entrada, Fase 16).
- Idioma da página `pt-AO`; título único por página; um `h1` por página.
- Imagens decorativas com `alt=""`; imagens com conteúdo com texto alternativo.
- Formulários com rótulos visíveis, mensagens de erro associadas (`aria-describedby`) e resumo de erros.
- Vídeos só carregam após clique, com botão identificado.
- Indicador de foco de 3 px em todos os elementos interativos (nos cartões, aparece em todo o cartão).

## Exceções e limites

- **Link "Política de Privacidade" dentro da frase do consentimento** (17 px de altura): está dentro do texto de uma frase, a exceção prevista no critério 2.5.8.
- Os testes automáticos encontram cerca de 30–40 % dos problemas de acessibilidade. Recomenda-se, antes do lançamento, um teste com leitor de ecrã real (NVDA no Windows, VoiceOver no iPhone) nas páginas principais e nos formulários.
- O conteúdo que vier do CMS (textos alternativos das imagens, títulos dos artigos) depende de quem o publica; o Studio pede o texto alternativo em todas as imagens.
