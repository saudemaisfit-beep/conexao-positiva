# Fase 19 — Deploy na Hostinger

## Objetivo

Pôr o site em produção na Hostinger (plano Business, aplicação Node.js ligada ao GitHub) e verificar que tudo funciona no domínio real.

## Como o deploy funciona

```
GitHub (ramo main) ──► Hostinger: npm install → npm run build → next start
                                     (webpack)       (porta definida pela Hostinger)
```

- **Cada deploy usa o ramo `main`.** Alterações só chegam ao site depois do merge do PR.
- O build usa o **webpack** (`next build --webpack`): o servidor de build da Hostinger tem uma glibc antiga (< 2.29) que não carrega o compilador nativo do Next.js; o Next.js usa então a versão WASM, que não suporta o Turbopack. Os avisos `GLIBC_2.29 not found` no registo são normais.
- A configuração é `next.config.mjs` (JavaScript): a versão WASM não compila `next.config.ts`.
- **Node.js:** 22.12 ou mais recente (a Hostinger usa 24).

Definições detetadas pela Hostinger (não é preciso mudar): _Build command_ `npm run build`, _Output directory_ `.next`, _Application type_ Next.js, _Package manager_ npm.

## 1. Variáveis de ambiente

Todas estão explicadas em [`.env.example`](../../.env.example). No hPanel, nas variáveis de ambiente da aplicação Node.js:

| Quando                          | Variáveis                                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Já, antes do primeiro build** | `NEXT_PUBLIC_SITE_URL=https://conexaopositiva.ao` (sem barra final)                                |
| Com a caixa de e-mail criada    | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_TEAM_TO` (e `EMAIL_FROM`, opcional) |
| Com o Sanity criado             | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET`          |
| Depois da validação D5          | `SUPABASE_URL`, `SUPABASE_SECRET_KEY`                                                              |
| Recomendado                     | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                                           |
| Opcional                        | `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_GA_ID`                                                 |
| **Nunca em produção**           | `CONTENT_PREVIEW`, `FORMS_DRY_RUN`                                                                 |

> **Importante:** depois de alterar **qualquer** variável, fazer **novo deploy**. As `NEXT_PUBLIC_*` são fixadas no build, e as páginas geradas no build (ex.: vagas dos eventos) também usam as restantes.

Se a Hostinger pedir um valor para todas as chaves ao importar o projeto: só as chaves sem `#` no `.env.example` estão ativas, e todas têm valor.

## 2. Domínio e HTTPS

1. Domínio `conexaopositiva.ao` ligado à aplicação Node.js (registos DNS indicados pelo hPanel).
2. **SSL** ativo no hPanel (certificado gratuito).
3. **Forçar HTTPS** (redirecionar `http://` para `https://`).
4. **Uma só variante** (decisão D2, recomendado sem `www`): `www.conexaopositiva.ao` redireciona com 301 para `https://conexaopositiva.ao`.
5. O site envia `Strict-Transport-Security` (HSTS, 2 anos, com `preload`). Só pedir a inclusão na lista de pré-carregamento dos browsers ([hstspreload.org](https://hstspreload.org)) quando todos os subdomínios tiverem HTTPS — é difícil de desfazer.

## 3. Serviços (pela ordem recomendada)

1. **E-mail (Hostinger):** criar a caixa `nao-responder@conexaopositiva.ao`; confirmar SPF, DKIM e DMARC ativos no DNS. Detalhes: [Fase 14](../fase-14/01-base-de-dados.md#configurar-uma-vez).
2. **CMS (Sanity):** projeto, CORS com `https://conexaopositiva.ao`, webhook para `https://conexaopositiva.ao/api/revalidate` com o segredo de `SANITY_REVALIDATE_SECRET`, convites da equipa. Detalhes: [Fase 13](../fase-13/01-cms.md#ligar-o-projeto-sanity-uma-vez).
3. **Anti-spam (Cloudflare Turnstile):** widget para `conexaopositiva.ao`. **Recomendado em produção** (ver "IP dos visitantes", abaixo).
4. **Base de dados (Supabase):** só depois da validação jurídica D5. Executar a migração, copiar URL e chave secreta, agendar a limpeza diária. Detalhes: [Fase 14](../fase-14/01-base-de-dados.md#configurar-uma-vez).
5. **Google Analytics 4** (opcional): criar a propriedade e copiar o ID `G-…`.

Depois de cada serviço: atualizar as variáveis e fazer novo deploy.

## 4. Verificar o site publicado

```bash
npx playwright install chromium   # só na primeira vez
LIVE_URL=https://conexaopositiva.ao npm run test:live
```

Os testes **só leem** o site (não enviam formulários). Verificam:

- HTTPS, redirecionamento de `http://` e da variante com/sem `www`;
- **o domínio certo** no endereço canónico, no Open Graph, no `robots.txt` e no sitemap (apanha `NEXT_PUBLIC_SITE_URL` em falta no build);
- 7 páginas principais sem erros de JavaScript nem bloqueios da CSP; 404; `/studio`; imagem de partilha;
- cabeçalhos de segurança, cache longa dos ficheiros estáticos, nenhum pedido ao Google antes do consentimento;
- webhook do CMS a recusar pedidos sem assinatura (falha se `SANITY_REVALIDATE_SECRET` estiver em falta);
- acessibilidade da página inicial (axe).

Validados contra um build de produção local: detetam o domínio em falta e o segredo do webhook em falta, e passam quando estão definidos.

### Verificação manual (uma vez, depois de configurar os serviços)

- [ ] Enviar cada formulário (contacto, proposta, inscrição) com dados de teste: linha no Supabase + e-mail à equipa + e-mail de confirmação (verificar que não cai no spam).
- [ ] Inscrição num evento com lotação: a contagem de vagas atualiza.
- [ ] Publicar uma alteração no Studio: aparece no site em segundos (webhook).
- [ ] Aceitar estatísticas no aviso de cookies: o GA4 regista a visita em _Tempo real_.
- [ ] Partilhar um link no WhatsApp/LinkedIn: aparece a imagem de partilha.
- [ ] Google Search Console: verificar o domínio e submeter `https://conexaopositiva.ao/sitemap.xml`.
- [ ] Apagar os registos de teste no Supabase.

## IP dos visitantes (limite de pedidos)

O limite de 5 envios por 10 minutos usa o IP do visitante, lido do primeiro endereço de `X-Forwarded-For` (`src/lib/security/client-ip.ts`). Atrás do proxy da Hostinger, este valor pode ser escolhido por quem faz o pedido, se o proxy acrescentar o IP real ao fim em vez de substituir o cabeçalho; um robô poderia então mudar de "IP" e contornar o limite.

Não mudámos para o último endereço da lista: se houver mais de um proxy interno, todos os visitantes teriam o mesmo IP e 5 envios bloqueariam o site inteiro durante 10 minutos — pior do que o problema. Por isso:

- o limite por IP é uma camada **complementar**; o campo-isco e o tempo mínimo continuam ativos;
- **ativar o Cloudflare Turnstile em produção**, que não depende do IP.

## Voltar atrás (rollback)

- **Pela Hostinger:** voltar a publicar um deploy anterior, se o painel o permitir.
- **Pelo GitHub:** no PR que causou o problema, _Revert_ → novo PR → merge → novo deploy.

Os dados (Supabase) e os conteúdos (Sanity) ficam fora do servidor e não são afetados por um rollback.

## Pendências

- Testar o site publicado com `npm run test:live` (o ambiente de desenvolvimento usado nesta fase não tem acesso ao domínio).
- D2 (variante com/sem `www`), D5 (validação jurídica antes do Supabase), D9 (contas dos serviços em nome da Conexão Positiva).
