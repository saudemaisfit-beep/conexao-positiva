# Fase 18 — Testes

## Objetivo

Testes automáticos que correm em cada PR, para que uma alteração futura não parta o site, os formulários, a privacidade ou a acessibilidade sem ninguém dar por isso.

## Ferramenta

**Playwright Test** para tudo: testes unitários (funções, sem browser) e ponta a ponta (o site real num Chromium). O Vitest foi tentado primeiro, mas a instalação falha com um erro interno do npm 10 (dependências opcionais do Vitest 4 e 5); forçar a instalação podia partir o `npm install` da Hostinger.

## Como correr

```bash
npm run test:unit    # funções (≈ 2 s)
npm run build:test   # build com conteúdos [Exemplo] e envios simulados
npm run test:e2e     # site real no Chromium (≈ 35 s)
npm test             # os três, por ordem
```

O primeiro uso num computador novo precisa do browser: `npx playwright install chromium`.

No GitHub, o trabalho **"Testes (unitários e ponta a ponta)"** corre em cada PR e em cada envio para `main`, ao lado de "Lint, tipos, formatação e build". Se falhar, o relatório fica disponível nos artefactos da execução durante 7 dias.

## O que está coberto

### Unitários — 32 testes (`tests/unit/`)

| Área              | Verifica                                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Formulários       | Campos obrigatórios, e-mail, telefone (9–15 dígitos), opções fora da lista, limites de tamanho, caracteres de controlo, data "por definir", slug do evento |
| Anti-spam         | Campo-isco, tempo mínimo (3 s) e máximo (24 h)                                                                                                             |
| Limite de pedidos | 5 envios / 10 min por chave, chaves independentes, janela que reinicia                                                                                     |
| Consentimento     | Cookie (ida e volta, `SameSite`, `Secure`, validade de 6 meses), cookie corrompido ou de outra versão                                                      |
| E-mails           | HTML dos formulários escapado (sem `<script>`/`<img onerror>`), resposta para quem escreveu                                                                |
| Eventos           | Últimas vagas (≤ 10 %), esgotado, estado do CMS respeitado, inscrições abertas/lista de espera/encerradas/passadas                                         |
| Calendário (.ics) | Datas UTC, CRLF, escape de `; , \` e mudanças de linha, linhas ≤ 75 octetos                                                                                |
| Vídeos            | YouTube/Vimeo → endereços com menos rastreio; outros domínios e `javascript:` recusados                                                                    |
| SEO               | Canónico, Open Graph, imagem de partilha                                                                                                                   |

### Ponta a ponta — 42 testes (`tests/e2e/`)

| Área                   | Verifica                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 14 páginas principais  | Abrem (200), um só `h1`, título próprio, sem erros de JavaScript nem bloqueios da CSP                                    |
| Acessibilidade         | axe (WCAG 2.0–2.2 A/AA) nas mesmas 14 páginas: 0 violações                                                               |
| Navegação              | 404 com ligação ao início, "Saltar para o conteúdo", menu móvel (foco preso, Esc), 320 px sem deslocamento horizontal    |
| Formulário de contacto | Erros junto de cada campo e foco no primeiro; envio válido → confirmação; robô (campo-isco) recebe sucesso falso         |
| Cookies                | Nenhum pedido ao Google antes do consentimento; escolha guardada após recarregar; "Gerir cookies" reabre as preferências |
| Segurança              | CSP, `X-Frame-Options`, `nosniff`, HSTS, sem `X-Powered-By`; webhook do CMS recusa pedidos sem assinatura                |
| Rotas                  | Calendário `.ics` (e 404 para evento inexistente), imagem de partilha (texto injetado não aparece), robots e sitemap     |

## Erros encontrados e corrigidos

1. **Calendário (.ics): pontos e vírgulas sem escape.** Em `src/lib/calendar/ics.ts`, `"\;"` em JavaScript é só `";"`. Um título como "Liderança; equipas" partia o campo no calendário de quem descarregasse o evento. Corrigido para `"\\;"`.
2. **Mudanças de linha em campos de uma linha.** Nome, empresa, cargo, local, etc. aceitavam quebras de linha; o nome entra no assunto do e-mail enviado à equipa. Passam a espaço; só mensagem, objetivo, informações adicionais e observações aceitam parágrafos.

## Dependências: `npm audit`

As 19 vulnerabilidades indicadas nas dependências de produção vêm todas das **ferramentas de linha de comandos do Sanity** (`@sanity/cli`, `@sanity/codegen`, leitura de YAML/TOML, `chokidar`, `globby`, `uuid` em `typeid-js`). São usadas a desenvolver e publicar o Studio, nunca a responder a visitantes, e os ataques descritos (negação de serviço com ficheiros de configuração maliciosos) precisam de acesso ao servidor. A "correção" proposta (`npm audit fix --force`) desce o Sanity da versão 6 para a 5 e partiria o CMS. **Risco aceite**; rever quando o Sanity publicar versões corrigidas. O Next.js, o React e o nodemailer não têm avisos.

## Pendentes para a Fase 19 (deploy)

- **IP do visitante no limite de pedidos.** `src/lib/security/client-ip.ts` usa o primeiro endereço de `X-Forwarded-For`. Confirmar na Hostinger que o proxy substitui (e não acrescenta a) este cabeçalho; caso contrário, um robô pode variar o IP e contornar o limite (o campo-isco, o tempo mínimo e o Turnstile continuam a proteger).
- Repetir os testes ponta a ponta contra o site publicado (domínio real, HTTPS).
