# Fase 11 — Insights

## Objetivo

Área editorial que mostra o conhecimento da Conexão Positiva e encaminha cada leitor para a solução certa. Em produção só aparecem artigos reais, publicados no CMS.

## Páginas

### `/insights` e `/insights/categoria/[slug]`

| #   | Secção     | Notas                                                                                               |
| --- | ---------- | --------------------------------------------------------------------------------------------------- |
| 1   | Hero       | "Ideias para pessoas, líderes e equipas"; nas categorias, nome e descrição da categoria             |
| 2   | Categorias | Ligações reais (URL próprio e indexável), `aria-current` na atual; só as categorias com artigos     |
| 3   | Destaque   | Artigo mais recente em formato grande                                                               |
| 4   | Lista      | 6 artigos por página, 3 / 2 / 1 colunas; "Carregar mais" é uma ligação para `?pagina=2` (acumulada) |
| 5   | Vazio      | Produção sem artigos: "Os primeiros artigos estão a ser preparados." + "Conhecer as soluções"       |

- A primeira página é renderizada no servidor (os artigos estão no HTML para os motores de busca e funcionam sem JavaScript); a versão interativa lê `?pagina` e, depois de "Carregar mais", o foco passa para o primeiro artigo novo (teclado e leitores de ecrã).
- Categorias: Liderança, Equipas, Bem-estar, Método C.E.N.T.R.O., Desenvolvimento pessoal. Categoria inexistente → 404.

### `/insights/[slug]`

Breadcrumbs (Insights › Categoria › Artigo) → categoria (ligação) · título · introdução · autor (fotografia ou iniciais) · data · tempo de leitura → imagem principal → corpo → caixa do autor → "Continue a ler" (3: mesma categoria primeiro) → CTA da categoria.

- **Corpo editorial:** parágrafos, subtítulos (H2/H3), listas (com e sem numeração), citações com autor, imagens com legenda e caixas de destaque; coluna de leitura de ~68 caracteres.
- **Tempo de leitura:** calculado automaticamente (200 palavras por minuto), não é escrito à mão.
- **Partilha:** LinkedIn, WhatsApp, Facebook e "Copiar ligação". São ligações diretas: nenhum script ou cookie das redes sociais é carregado. No desktop fica fixa ao lado do texto; no mobile, depois do artigo.
- **CTA contextual:** cada categoria liga à solução mais próxima (Liderança → Desenvolvimento de Liderança, Equipas → Desenvolvimento de Equipas, Bem-estar → Bem-estar Corporativo, Método C.E.N.T.R.O. → página do método, Desenvolvimento pessoal → Formações), mais "Solicitar proposta".
- **Dados estruturados:** `Article` (título, descrição, datas, autor, editor com logótipo, secção, tempo de leitura, imagem quando existe) e `BreadcrumbList`. Metadados Open Graph de artigo.

## Modelo de conteúdo (`Article`, para o Sanity na Fase 13)

| Campo                      | Obrigatório | Notas                                                                |
| -------------------------- | ----------- | -------------------------------------------------------------------- |
| `title`, `slug`, `excerpt` | Sim         | `excerpt` é a introdução (card, página e descrição para o Google)    |
| `category`                 | Sim         | Uma das 5 categorias                                                 |
| `publishedAt`, `updatedAt` | Sim / Não   | "Atualizado a…" aparece quando existe                                |
| `author`                   | Sim         | Nome, cargo, biografia, fotografia (pessoas reais e com autorização) |
| `image`                    | Não         | Com texto alternativo                                                |
| `body`                     | Sim         | Portable Text: texto, títulos, listas, citação, imagem, destaque     |

A Home passa a mostrar os 3 artigos mais recentes reais.

## Decisões

- **Pesquisa** e **newsletter** não foram implementadas: a pesquisa só faz sentido com volume de artigos (pode usar a pesquisa do Sanity na Fase 13); a newsletter depende de decisão e de ferramenta de envio.
- O botão das chamadas finais passa a quebrar linha em ecrãs estreitos (nomes de serviços longos eram cortados).
- `chipClass` passou para `components/ui/chip.ts`: importar uma constante de um módulo `"use client"` num componente de servidor não devolve o valor.

## Verificação

Playwright + axe (WCAG 2.2 AA) a 360, 390, 768, 1024, 1280 e 1440 px, em produção e com `CONTENT_PREVIEW=1`: 0 violações, sem scroll horizontal, sem erros de consola, um `h1` por página, JSON-LD válido. "Carregar mais" (URL, contagem, foco), artigos presentes no HTML do servidor, categoria atual, copiar ligação, ligações de partilha, CTA contextual, 404 para artigo e categoria inexistentes. Sem botões com texto cortado em nenhuma página. Em produção não aparece nenhum `[Exemplo]`.

## Pendências

- **Conteúdo do cliente:** artigos reais, autores (nome, cargo, biografia, fotografia), imagens.
- **Validação editorial:** nomes e descrições das 5 categorias (texto proposto em `messages/pt.json`).
