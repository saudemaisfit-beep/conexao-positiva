# Fase 14 — Base de dados e formulários

## Objetivo

Os formulários gravam de verdade, de forma segura: a equipa recebe um aviso por e-mail, quem envia recebe uma confirmação e as vagas dos eventos passam a ser reais.

> **Bloqueio antes de ativar em produção (decisão D5):** os dados pessoais ficam alojados na Europa (o Supabase não tem região em África). É preciso validar com um jurista o enquadramento da Lei n.º 22/11 (Proteção de Dados Pessoais) e uma eventual notificação/autorização da APD, e publicar a Política de Privacidade, **antes** de configurar o Supabase no site publicado.

## Como funciona um envio

```
Browser ──Server Action──▶ campo-isco e tempo ▶ limite de pedidos ▶ Turnstile ▶ validação Zod
                                                                                   │
                         ┌─────────────────────────────────────────────────────────┘
                         ▼
          1. Supabase (grava)  ──falha──▶ "Ocorreu um erro" (dados mantidos no formulário)
                         │
          2. Resend (e-mails à equipa e a quem envia; uma falha fica registada e não anula o pedido)
                         │
          3. Página de confirmação (e, nas inscrições, vagas atualizadas)
```

Sem base de dados configurada, em produção o envio devolve "indisponível" e o formulário mostra os contactos alternativos (nada se perde em silêncio). `FORMS_DRY_RUN=1` simula o envio, **só para testes**.

## Base de dados (Supabase / PostgreSQL)

Migração: `supabase/migrations/20261011000000_formularios.sql`.

| Tabela                | Conteúdo                                           | Estados                                                            |
| --------------------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| `contact_messages`    | Mensagens de `/contactos`                          | novo · respondido · arquivado                                      |
| `proposal_requests`   | Pedidos de `/solicitar-proposta`                   | novo · em-analise · proposta-enviada · ganho · perdido · arquivado |
| `event_registrations` | Inscrições (com cópia do nome e da data do evento) | confirmada · lista-de-espera · cancelada                           |

- **Acesso:** RLS ativo e **sem políticas**: as chaves públicas (`anon`, `authenticated`) não leem nem escrevem nada. Só o servidor do site, com a chave secreta, acede aos dados.
- **Defesa em profundidade:** limites de tamanho, listas de valores e formatos também na base de dados.
- **Inscrições atómicas** (`register_for_event`): bloqueia o evento durante a transação, conta as vagas confirmadas e decide entre _confirmada_ e _lista de espera_. Nunca são atribuídas mais vagas do que a lotação, mesmo com muitos pedidos ao mesmo tempo. A mesma pessoa (e-mail, sem distinguir maiúsculas) só pode ter uma inscrição ativa por evento.
- **Conservação (decisão D6):** `purge_expired_records()` apaga leads com mais de 24 meses e inscrições 12 meses depois do evento. Agendar uma vez por dia no Supabase (_Database → Extensions → pg_cron_):

  ```sql
  select cron.schedule('limpeza-diaria', '15 3 * * *', 'select public.purge_expired_records()');
  ```

- **Consultar os pedidos:** _Table Editor_ do Supabase (filtrar, mudar o estado, exportar CSV). Integração com CRM fica como evolução (decisão D7).

## Vagas dos eventos

- Novo campo **Lotação** nos eventos do CMS (vazio = sem limite).
- Vagas restantes = lotação − inscrições confirmadas, lidas da base de dados (cache de 1 h, atualizada a cada inscrição).
- Estado automático: **Últimas vagas** com 10 % ou menos da lotação; **Esgotado** (com lista de espera, decisão D4) quando não há vagas. Um estado marcado no CMS como _Encerrado_ ou _Esgotado_ nunca é reaberto automaticamente.
- O servidor confirma sempre o estado do evento e a lotação no momento da inscrição.

## E-mails (Resend)

| Formulário | Para a equipa (`EMAIL_TEAM_TO`, responder = quem enviou) | Para quem enviou                                                                                       |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Contacto   | Todos os campos                                          | "Recebemos a sua mensagem"                                                                             |
| Proposta   | Todos os campos                                          | Agradecimento, próximos passos e resumo                                                                |
| Inscrição  | Pessoa + evento + estado                                 | Confirmação com data, local, valor, nota de pagamento (eventos pagos) e calendário; ou lista de espera |

HTML simples em tabelas (compatível com os clientes de e-mail), cores da marca e versão em texto. **Todo o texto vindo de formulários ou do CMS é escapado**; quebras de linha são removidas de assuntos e endereços.

## Anti-spam

| Camada               | Notas                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Campo-isco + tempo   | Robôs evidentes recebem um sucesso falso                                                                                |
| Limite de pedidos    | 5 envios por formulário e IP em 10 min; **Upstash Redis** partilhado entre instâncias, com recurso em memória se falhar |
| Cloudflare Turnstile | Normalmente invisível; validado no servidor; o token é renovado depois de cada tentativa. Sem chaves, é ignorado        |

## Configurar (uma vez)

1. **Supabase** ([supabase.com](https://supabase.com)): criar projeto (região na Europa, ver D5) → _SQL Editor_ → executar a migração → _Project Settings → API_: copiar o URL e a **secret key** para `SUPABASE_URL` e `SUPABASE_SECRET_KEY` (Vercel, ambiente _Production_). Agendar a limpeza diária (acima).
2. **Resend** ([resend.com](https://resend.com)): verificar o domínio `conexaopositiva.ao` (registos DNS SPF/DKIM) → criar uma API key → `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TEAM_TO`.
3. **Cloudflare Turnstile**: criar um widget para o domínio → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`.
4. **Upstash** ([upstash.com](https://upstash.com)): criar uma base Redis (região Europa) → `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`.
5. Fazer um envio de teste em cada formulário e confirmar a linha no Supabase e os dois e-mails.

Todas as chaves ficam apenas nas variáveis de ambiente do servidor; só a chave do site do Turnstile é pública.

## Verificação

- **Migração num PostgreSQL 16 local** (com os papéis do Supabase simulados): lotação 3 → 3 confirmadas e 2 em lista de espera; duplicado com maiúsculas detetado; **20 inscrições simultâneas para 5 vagas → exatamente 5 confirmadas**; `anon` sem acesso a tabelas e funções; restrições a recusar valores inválidos; limpeza a apagar só os registos expirados.
- **Fluxo completo no browser**, com uma imitação local da API do Supabase e do Upstash sobre essa base de dados:
  - inscrições: confirmada → confirmada → lista de espera; a página passa de "2 vagas" a "1 vaga" e depois a "Esgotado";
  - duplicado: "Já existe uma inscrição com este e-mail";
  - 6.º envio: "Recebemos vários pedidos seguidos";
  - contacto e proposta gravados (incluindo texto com `<b>` guardado tal como foi escrito).
- **E-mails:** HTML escapado (`<script>`, `&`, aspas), quebras de linha, assunto sem quebras, pedido correto ao Resend, falha do Resend tratada.
- **Turnstile:** sem chaves é ignorado; sem token ou token inválido é recusado; falha de rede é recusada.
- **Sem regressões:** produção sem serviços ("Não foi possível enviar", dados mantidos), pré-visualização e testes de acessibilidade das fases anteriores.

## Decisões

- **Sem SDKs** do Supabase, Resend ou Upstash: pedidos `fetch` diretos às APIs REST (menos dependências e menos superfície de ataque).
- Modelos de e-mail em HTML com escape explícito em vez de React Email (menos dependências; o mesmo resultado nos clientes de e-mail).
- Gravar primeiro e enviar e-mails depois: um e-mail que falha nunca faz perder um pedido.

## Pendências

- **D5** (validação jurídica do alojamento na Europa) e Política de Privacidade antes de ativar em produção.
- **D3:** e-mail com instruções de pagamento para eventos pagos (envio manual pela equipa até haver integração de pagamentos).
- Contas dos serviços em nome da Conexão Positiva (D9).
- **Fase 15/16:** acrescentar `challenges.cloudflare.com` à política de segurança de conteúdo (CSP).
