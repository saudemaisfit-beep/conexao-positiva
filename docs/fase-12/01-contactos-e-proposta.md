# Fase 12 — Contactos e Proposta

## Objetivo

Transformar interesse em contactos qualificados com formulários claros, acessíveis e protegidos contra spam, sem nunca perder um pedido em silêncio.

## Páginas

| URL                                 | Conteúdo                                                                                                                    | Indexação |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------- |
| `/contactos`                        | "Vamos conversar": canais diretos (só os preenchidos) · formulário de contacto · faixa "Procura uma proposta…?"             | Sim       |
| `/solicitar-proposta`               | Formulário em 3 grupos · coluna "O que acontece a seguir" · logótipos de clientes (só se existirem)                         | Sim       |
| `/eventos/[slug]/inscricao`         | Resumo do evento · inscrição, lista de espera (esgotado) ou mensagem (passado/encerrado)                                    | Não       |
| `/proposta-recebida`                | Agradecimento + próximos passos + Experiências e Método C.E.N.T.R.O.                                                        | Não       |
| `/mensagem-enviada`                 | Agradecimento + Insights e Eventos                                                                                          | Não       |
| `/inscricao-confirmada?evento=slug` | Confirmação (ou lista de espera com `&lista=1`), resumo do evento, **Adicionar ao calendário**. Nenhum dado pessoal no URL. | Não       |
| `/api/calendario/[slug]`            | Ficheiro `.ics` (RFC 5545) do evento                                                                                        | —         |

`/solicitar-proposta?servico=…` pré-seleciona o serviço: os 8 serviços, `metodo-centro` e "Ainda não sei". Valores desconhecidos são ignorados.

## Campos

- **Contacto:** Nome · Empresa (opcional) · E-mail · Telefone (opcional) · Assunto (Pedido de informação, Parcerias, Imprensa, Outro) · Mensagem · Consentimento.
- **Proposta:** _Os seus dados_ (Nome, Empresa, Cargo, E-mail, Telefone) · _O seu projeto_ (Serviço, Participantes por intervalos, Data prevista ou "Ainda por definir", Local, Objetivo) · _Detalhes adicionais_ (Orçamento por intervalos, opcional; Informações adicionais; Consentimento).
- **Inscrição:** Nome · Sobrenome · E-mail · Telefone · Empresa e Cargo (opcionais) · Observações (opcional) · Consentimento. O evento é fixo.

Telefone com `+244` por defeito; `autocomplete`, `type` e `inputmode` adequados a cada campo.

## Validação e acessibilidade

- **Um único esquema Zod** (`src/lib/forms/schemas.ts`) valida no browser (React Hook Form) e outra vez no servidor (Server Action). As mensagens são chaves de tradução (`Forms.errors.*`).
- Valida à saída de cada campo; depois do primeiro erro, revalida enquanto se escreve.
- No envio com erros: **resumo no topo** (com ligações para cada campo) e foco no primeiro campo com erro. Cada erro fica junto do campo, ligado por `aria-describedby`, e o campo recebe `aria-invalid`.
- Botão "A enviar…" desativado durante o envio. Erro do servidor: aviso no topo, **dados preservados**, botão volta a ficar ativo, contactos alternativos (WhatsApp, telefone, e-mail) quando existirem.
- Consentimento desmarcado e obrigatório, com ligação para a Política de Privacidade.
- **Rascunho** guardado em `sessionStorage` (apagado ao fechar o separador ou depois do envio), para não perder dados ao abrir a Política de Privacidade. O consentimento, o campo-isco e o evento nunca são guardados.

## Segurança

| Medida                | Implementação                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| Validação no servidor | Esquema Zod em cada Server Action; o browser nunca é a única barreira                                     |
| Limpeza de texto      | Espaços nas pontas e caracteres de controlo removidos; comprimentos máximos por campo                     |
| Campo-isco (honeypot) | Campo invisível; se preenchido, o robô recebe um sucesso falso e nada é guardado                          |
| Tempo mínimo          | Envios em menos de 3 s ou com formulário aberto há mais de 24 h são tratados como robô                    |
| Limite de pedidos     | 5 envios por formulário e por IP a cada 10 minutos (em memória; Upstash Redis na Fase 14)                 |
| Estado do evento      | Inscrições confirmadas no servidor (aberto / lista de espera); evento encerrado devolve erro              |
| Dados pessoais        | Nunca nos registos (logs) do servidor nem no URL                                                          |
| Envio até à Fase 14   | Em produção devolve "indisponível" (nenhum pedido se perde em silêncio); `FORMS_DRY_RUN=1` só para testes |

## Dependências

`react-hook-form` 7.88.0, `zod` 4.6.5, `@hookform/resolvers` 5.9.1. **Next.js atualizado de 16.3.6 para 16.3.8** (e `eslint-config-next`) para corrigir vulnerabilidades altas publicadas para 16.0.0–16.3.7 (cache poisoning em SSG/ISR, SSRF na otimização de imagens, entre outras). Exceção à regra de versões com 14 dias, por ser uma correção de segurança. O `npm audit` mantém um alerta em `braces`, usado apenas pelas ferramentas de lint (desenvolvimento), sem correção disponível e fora do site publicado.

## Decisões

- As páginas de formulário mantêm o header e o rodapé normais (a especificação previa um "layout de foco" na inscrição); o botão flutuante do WhatsApp já fica escondido nos formulários no mobile.
- Intervalos de orçamento em Kz são uma **proposta para validação** (passam a ser configuráveis no CMS).
- Turnstile (Cloudflare) e o limite partilhado (Upstash) ficam para a Fase 14, porque exigem contas e chaves.

## Verificação

Playwright + axe (WCAG 2.2 AA) a 360–1440 px, em produção e pré-visualização: 0 violações, também com o formulário em estado de erro. Testados: resumo com 11 erros e foco no primeiro campo, revalidação ao escrever, data desativada com "Ainda por definir", envio com sucesso → `/proposta-recebida`, `?servico=` (válido, `metodo-centro`, inválido), rascunho após recarregar, campo-isco, lista de espera → `/inscricao-confirmada?evento=…&lista=1`, evento passado sem formulário, `noindex` nas páginas certas, `.ics` válido. Em produção sem Fase 14: aviso "Não foi possível enviar", dados mantidos e botão ativo.

## Pendências

- **Fase 14:** gravar em Supabase, e-mails (Resend) para a equipa e para quem envia, vagas reais e lista de espera, Turnstile e Upstash.
- **Páginas legais** (Política de Privacidade, Cookies, Termos): as ligações já existem; o conteúdo depende do texto jurídico do cliente.
- **Cliente:** contactos diretos (telefone, e-mail, WhatsApp, localização, redes), validação dos intervalos de orçamento e do prazo de resposta a anunciar.
