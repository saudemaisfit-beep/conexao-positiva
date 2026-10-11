# Fase 1.4 — Conteúdos e decisões pendentes

Nada nesta lista será inventado. Enquanto não for fornecido, o CMS terá placeholders claramente identificados (ex.: `[Adicionar número real de participantes impactados]`) e as secções dependentes ficam ocultas no site público.

## Conteúdos a fornecer pela Conexão Positiva

### Identidade

| Item                                                                                                 | Necessário para                        | Prioridade    |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------- |
| ~~Logótipo da Conexão Positiva~~ ✅ Símbolo recebido (azul `#0AA0E0`)                                | Header, rodapé, favicon                | —             |
| Símbolo da Conexão Positiva em **SVG** + **logótipo com o nome** (horizontal e vertical), se existir | Header, rodapé, e-mails, imagem social | Alta (Fase 4) |
| Manual de marca com HEX exatos (as cores atuais foram extraídas das imagens)                         | Afinação do Design System              | Média         |
| ~~Identidade visual do Método C.E.N.T.R.O.~~ ✅ Logótipo recebido (marsala `#904141`)                | Página do método                       | —             |
| Logótipo do Método em **SVG** + versão monocromática branca                                          | Produção (nitidez, fundos escuros)     | Alta (Fase 8) |

A paleta usa as duas cores oficiais extraídas dos logótipos: **azul Conexão Positiva** (`#0AA0E0`) e **marsala Método C.E.N.T.R.O.** (`#904141`), com neutros quentes (areia) propostos pela equipa de design.

### Fotografia e vídeo

- Fotografias reais de palestras, formações, workshops, team building e eventos (idealmente originais em alta resolução).
- Fotografias da equipa e do(a) fundador(a).
- Vídeo curto (10–20 s) para o hero, se existir.
- Confirmação de que existe **autorização das pessoas fotografadas** para uso no site.

Enquanto não houver fotografia real, será usada fotografia de banco de imagens criteriosamente escolhida (pessoas reais, sem clichés) e marcada no CMS como **provisória**, para substituição antes do lançamento.

### Institucional

- Texto "Quem somos", história, propósito, missão, visão e valores (podemos redigir propostas para aprovação, sem factos inventados).
- Biografia do(a) fundador(a) e da equipa (nome, cargo, fotografia, LinkedIn).
- Origem e fundamentação do Método C.E.N.T.R.O.

### Comercial e prova social

- Descrição de cada um dos 8 serviços (formatos, duração típica, público).
- Indicadores reais: empresas atendidas, pessoas impactadas, formações, eventos, anos de experiência.
- Clientes e parceiros, com **autorização para usar o logótipo**.
- Testemunhos com **autorização de publicação** (nome, cargo, empresa, fotografia).
- Experiências/projetos realizados com dados reais (cliente ou descrição anonimizada, participantes, resultados).
- Próximos eventos (datas, local, preço, vagas, facilitador).
- Artigos para Insights (ou temas para redação).

### Contactos e legal

- Telefone, e-mail, número de WhatsApp, redes sociais, morada (se for pública).
- Denominação social, NIF e morada da sede — necessários para Política de Privacidade e Termos.
- Endereço de e-mail que recebe as notificações de propostas, inscrições e contactos.

## Decisões a tomar

| #   | Decisão                                                                                                                  | Recomendação                                                                                                                                                         | Impacto se adiada                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| D1  | **Repositório**: este projeto está dentro do repositório do Creator Market AO                                            | Criar um repositório dedicado `conexao-positiva` antes da Fase 19 (deploy)                                                                                           | Nenhum até ao deploy; depois, CI e deploy misturados |
| D2  | **Domínio final** (`conexaopositiva.ao` ou outro) e variante canónica (com/sem `www`)                                    | Sem `www`, com redirecionamento 301                                                                                                                                  | Bloqueia SEO final, e-mail transacional e SSL        |
| D3  | **Eventos pagos**: pagamento online ou reserva + pagamento por referência/transferência                                  | Na primeira versão, inscrição como reserva e instruções de pagamento por e-mail; integração de pagamentos (ex.: Multicaixa Express) como evolução                    | Define o fluxo de inscrição                          |
| D4  | **Lista de espera** quando um evento esgota                                                                              | Ativar (custo baixo, valor comercial)                                                                                                                                | Pequeno                                              |
| D5  | **Alojamento dos dados pessoais**: Supabase não tem região em África; os dados ficariam na Europa                        | Validar com jurista o enquadramento da Lei n.º 22/11 (Proteção de Dados Pessoais, Angola) e eventual notificação/autorização da APD para transferência internacional | Bloqueia a publicação dos formulários em produção    |
| D6  | **Prazo de conservação** dos dados de leads e inscrições                                                                 | 24 meses para leads; 12 meses após o evento para inscrições                                                                                                          | Necessário para a Política de Privacidade            |
| D7  | **Gestão de leads**: só e-mail + Supabase, ou exportação/integração com CRM                                              | Começar com e-mail + vista simples (Supabase/exportação CSV); CRM como evolução                                                                                      | Nenhum para o lançamento                             |
| D8  | **Língua inglesa**                                                                                                       | Arquitetura preparada agora; tradução numa fase posterior                                                                                                            | Nenhum                                               |
| D9  | **Contas de serviços** (Hostinger, Sanity, Supabase, Cloudflare Turnstile, Google Analytics) em nome da Conexão Positiva | Criar em nome da empresa, com acesso partilhado à equipa técnica                                                                                                     | Bloqueia a Fase 19                                   |

## Riscos

| Risco                                                                        | Mitigação                                                                                       |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Lançar com fotografia de banco e sem prova social real reduz a credibilidade | Secções ocultas quando vazias; sessão fotográfica recomendada antes do lançamento               |
| Conectividade móvel variável em Angola                                       | Orçamentos de performance rígidos, imagens AVIF/WebP, JS mínimo, sem fontes externas em runtime |
| Spam nos formulários                                                         | Defesa em camadas (honeypot, Turnstile, rate limit, validação no servidor)                      |
| Conteúdo desatualizado (eventos passados ainda "abertos")                    | Estado calculado a partir da data; inscrições fecham automaticamente                            |
| Dependência da equipa técnica para alterações                                | CMS em português, com descrições, validações e `GUIA-DO-CLIENTE.md`                             |

## Decisões tomadas pelo cliente (11/10/2026)

| #   | Decisão                                                                          | Consequência no projeto                                                                                                                    |
| --- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | **Repositório próprio** para o site                                              | O projeto passa para o repositório `conexao-positiva`, com o histórico de commits preservado                                               |
| D10 | **Alojamento na Hostinger, plano Business** (Node.js web apps), em vez da Vercel | Deploy por GitHub no hPanel (Fase 19); Node.js ≥ 22.12; variáveis de ambiente no hPanel; um processo, por isso o Upstash torna-se opcional |
| D11 | **E-mails pela caixa de correio da Hostinger** (SMTP), em vez do Resend          | Envio com `nodemailer` e as credenciais da caixa `nao-responder@conexaopositiva.ao`                                                        |

Os documentos da Fase 1 descrevem a arquitetura inicial (Vercel, Resend); prevalecem estas decisões.
