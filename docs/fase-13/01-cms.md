# Fase 13 — CMS (Sanity)

## Objetivo

A equipa da Conexão Positiva publica e edita conteúdos sem tocar no código, num Studio em português, e o site atualiza-se sozinho quando algo é publicado.

## O que está no CMS

| No Studio                 | Tipo            | Onde aparece no site                                                                 | Regras                                                                  |
| ------------------------- | --------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **Definições do site**    | Documento único | Header (menu móvel), rodapé, `/contactos`, botão de WhatsApp, avisos dos formulários | Campo vazio = não é mostrado (recurso: variáveis de ambiente)           |
| **Página Sobre Nós**      | Documento único | `/sobre`: história, fundador(a), equipa                                              | Fotografias só com autorização                                          |
| **Eventos**               | Coleção         | Home, `/eventos`, página do evento, inscrição, `.ics`                                | Fim depois do início; preço vazio = gratuito                            |
| **Experiências**          | Coleção         | Home, `/experiencias`, página da experiência, páginas de serviço                     | Cliente vazio = "Cliente confidencial"; resultados só com números reais |
| **Artigos** e **Autores** | Coleções        | Home, `/insights`, categorias, página do artigo                                      | Texto alternativo obrigatório nas imagens                               |
| **Testemunhos**           | Coleção         | Home ("Mostrar na Home"), páginas de serviço, experiências                           | **Só aparecem com "Autorização confirmada"**                            |
| **Clientes e parceiros**  | Coleção         | Home, `/solicitar-proposta`                                                          | **Só aparecem com "Autorização confirmada"**                            |
| **Números de impacto**    | Coleção         | Home                                                                                 | **Só aparecem com "Publicar"**; nunca números de exemplo                |

Todos os campos têm etiquetas e descrições em português, com validações (campos obrigatórios, URL com letras minúsculas e hífenes, texto alternativo obrigatório, telefone/WhatsApp em formato válido, endereços de vídeo do YouTube/Vimeo). A interface do Studio usa o pacote de língua portuguesa (`@sanity/locale-pt-pt`).

**Ficam no código, por agora:** os textos das páginas de serviço, do Método C.E.N.T.R.O. e de Sobre Nós (missão, visão, valores), que estão em aprovação, e os textos de interface (`messages/pt.json`). Depois de aprovados, podem passar para documentos do CMS sem alterar o design.

## Como o site lê o conteúdo

```
Studio (/studio) ──publica──▶ Sanity Content Lake ──webhook assinado──▶ /api/revalidate ──▶ revalidateTag
                                    │
                                    └──GROQ (CDN, cache por etiquetas)──▶ src/content/* ──▶ páginas
```

- `src/sanity/queries.ts`: consultas GROQ; `src/sanity/mappers.ts`: conversão para os modelos do site. **Documentos incompletos são ignorados** (nunca partem uma página) e testemunhos/clientes sem autorização nunca chegam às páginas.
- Cache: cada consulta tem a etiqueta do seu tipo de documento; o webhook invalida só o que mudou. Revalidação de hora a hora como rede de segurança. Se o Sanity falhar, a página mantém a última versão válida.
- Imagens servidas pelo CDN do Sanity através do `next/image` (AVIF/WebP, tamanhos certos), limitadas ao projeto configurado.
- Corpo dos artigos em Portable Text: parágrafos, títulos, subtítulos, citações, listas, imagens com legenda e caixas de destaque.
- Origem do conteúdo (`src/content/source.ts`): **Sanity** quando configurado; senão **exemplos** com `CONTENT_PREVIEW=1`; senão **vazio** (as secções não aparecem).

## Ligar o projeto Sanity (uma vez)

1. Criar conta e projeto em [sanity.io/manage](https://www.sanity.io/manage) (plano gratuito), com o dataset `production`.
2. **API → CORS origins**: acrescentar `https://conexaopositiva.ao` (e o domínio de pré-visualização da Vercel) com "Allow credentials".
3. Na Vercel (e em `.env.local` para desenvolvimento), definir:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` (ID do projeto; é público);
   - `NEXT_PUBLIC_SANITY_DATASET=production`;
   - `SANITY_REVALIDATE_SECRET` (gerar com `openssl rand -hex 32`; **só no servidor**, nunca em código).
4. **API → Webhooks → Create**: URL `https://conexaopositiva.ao/api/revalidate`, dataset `production`, eventos _Create/Update/Delete_, projeção `{_type}`, método POST, **Secret** igual a `SANITY_REVALIDATE_SECRET`.
5. **Members**: convidar a equipa com o papel _Editor_ (conteúdos) e manter _Administrator_ apenas para quem gere o projeto.
6. Abrir `https://conexaopositiva.ao/studio` e preencher primeiro **Definições do site**.

Validar os esquemas localmente: `npx sanity schema validate`.

## Segurança

- O Studio usa a autenticação do Sanity (contas e papéis geridos em sanity.io); o site lê apenas conteúdo **publicado**, sem token.
- O webhook recusa pedidos sem segredo configurado (500), sem assinatura ou com assinatura inválida (401) e tipos de documento desconhecidos (400).
- Dados pessoais (propostas, inscrições, contactos) **nunca** vão para o Sanity: ficam na base de dados (Fase 14).
- `npm audit`: os alertas novos vêm das ferramentas de linha de comandos do Sanity (análise de YAML/TOML, observação de ficheiros) e de um uso de `uuid` que o site não faz. Não fazem parte do site publicado; rever quando houver versões corrigidas.

## Dependências

`sanity` 6.16.0, `next-sanity` 13.3.4, `@sanity/vision` 6.16.0 (consola GROQ, só em desenvolvimento), `@sanity/locale-pt-pt` 1.1.37, `styled-components` 6.5.3. Requer Node.js ≥ 22.12.

## Verificação

- `npx sanity schema validate`: 0 erros, 0 avisos.
- Conversões testadas com dados no formato das consultas: parágrafos, Portable Text (títulos, listas agrupadas, citação, imagem, destaque), documentos incompletos ignorados, testemunhos sem autorização ignorados, cliente vazio → confidencial.
- Webhook: sem segredo 500; sem assinatura e assinatura errada 401; assinatura válida 200 (`revalidated: event`); tipo desconhecido 400.
- `/studio` sem projeto: página "Studio por configurar"; com projeto, o Studio carrega (neste ambiente sem acesso aos servidores do Sanity).
- Sem regressões: builds de produção e de pré-visualização e testes Playwright + axe das Fases 10–12 (0 violações, sem scroll horizontal, sem erros).

## Pendências

- **Cliente:** criar o projeto Sanity e seguir os passos acima; introduzir conteúdos reais.
- **Fase 15/16:** pré-visualização de rascunhos (Draft Mode / Presentation) e política de segurança de conteúdo (CSP) compatível com o Studio.
- Passar para o CMS os textos de serviços, Método e Sobre Nós depois de aprovados.
