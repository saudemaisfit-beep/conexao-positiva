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
