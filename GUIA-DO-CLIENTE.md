# Guia do site Conexão Positiva

Este guia é para a equipa da Conexão Positiva. Explica como atualizar o site, onde ver os pedidos que chegam e o que pedir à equipa técnica. Não é preciso saber programar.

---

## 1. Onde fica cada coisa

| O quê                                      | Onde                                  | Quem                     |
| ------------------------------------------ | ------------------------------------- | ------------------------ |
| O site                                     | `https://conexaopositiva.ao`          | Todos                    |
| Editar conteúdos (eventos, artigos…)       | `https://conexaopositiva.ao/studio`   | Equipa (conta no Sanity) |
| Pedidos de proposta, mensagens, inscrições | E-mail da equipa + painel do Supabase | Equipa                   |
| Estatísticas de visitas                    | Google Analytics                      | Equipa                   |
| Alojamento, domínio e caixas de e-mail     | hPanel da Hostinger                   | Responsável técnico      |

As contas devem estar em nome da Conexão Positiva (decisão D9), com acesso pessoal para cada pessoa da equipa (nunca partilhar a mesma palavra-passe).

---

## 2. Editar conteúdos no Studio

Abra `https://conexaopositiva.ao/studio` e entre com a sua conta. O menu da esquerda tem:

| Secção                    | O que muda no site                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------- |
| **Definições do site**    | Telefone, e-mail, localização, WhatsApp (número e mensagem inicial), redes sociais |
| **Página Sobre Nós**      | História (marcos por ano), fundador(a) e equipa                                    |
| **Eventos**               | Agenda e páginas de cada evento, com inscrição                                     |
| **Experiências**          | Projetos realizados (casos), com resultados, galeria e vídeo                       |
| **Artigos** e **Autores** | Insights (blog)                                                                    |
| **Testemunhos**           | Citações de clientes                                                               |
| **Clientes e parceiros**  | Logótipos de organizações                                                          |
| **Números de impacto**    | Números em destaque (ex.: participantes formados)                                  |

### Regras gerais

- **Publicar:** as alterações só aparecem no site depois de carregar em **Publicar**. Aparecem em poucos segundos.
- **Campos obrigatórios** estão marcados; o Studio não deixa publicar sem eles.
- **Texto alternativo das imagens** é obrigatório: descreva o que a imagem mostra (ex.: "Equipa a participar numa dinâmica de grupo ao ar livre"). Serve a pessoas cegas e ao Google.
- **Imagens:** fotografias reais, horizontais, com boa luz. O site redimensiona e otimiza automaticamente.
- **Endereço da página (slug):** é criado a partir do título. **Não o altere depois de publicar** — os links partilhados deixam de funcionar.
- Secções sem conteúdo ficam escondidas no site (não aparecem caixas vazias).

### Eventos

1. **Eventos → Criar**. Preencha nome, tipo (Workshop, Formação, Palestra, Experiência), início, fim, local e preço (vazio = gratuito).
2. **Lotação:** número máximo de participantes (vazio = sem limite).
3. **Estado das inscrições:**
   - _Aberto_ — aceita inscrições;
   - _Últimas vagas (manual)_ — mostra o aviso mesmo com muitas vagas;
   - _Esgotado (lista de espera)_ — novas inscrições entram em lista de espera;
   - _Encerrado_ — não aceita inscrições.
4. Separadores **Conteúdo** (resumo, programa, facilitação, perguntas frequentes) e **Imagens**.

O site trata sozinho de:

- mostrar **"Últimas vagas"** quando restam 10 % ou menos dos lugares, e **"Esgotado"** quando acabam (com lista de espera);
- fechar as inscrições quando o evento termina e passá-lo para "Eventos passados";
- oferecer "Adicionar ao calendário" a quem visita.

Um evento marcado como _Encerrado_ ou _Esgotado_ nunca é reaberto automaticamente.

### Artigos (Insights)

1. Crie primeiro o **Autor** (nome, cargo, fotografia).
2. **Artigos → Criar**: título, categoria (Liderança, Equipas, Bem-estar, Método C.E.N.T.R.O., Desenvolvimento pessoal), introdução, autor, data de publicação, imagem principal e conteúdo.
3. No conteúdo pode usar títulos, listas, imagens com legenda e caixas de **Destaque**.
4. Ao rever um artigo antigo, preencha **Atualizado em**.

### Experiências (casos)

Título, tipo, cliente, objetivo, soluções usadas, setor, participantes, formato, data, local, **Resultados** (valor opcional + descrição), testemunho, imagens e vídeo (endereço do YouTube ou Vimeo: o vídeo só carrega quando a pessoa carrega em "reproduzir", sem rastreio prévio).

### Testemunhos e logótipos — autorização obrigatória

**Testemunhos** e **Clientes e parceiros** têm a caixa **"Autorização confirmada"**. Só aparecem no site quando está marcada. Marque-a **apenas** quando existir autorização escrita da pessoa ou organização (e-mail serve). Guarde essa autorização.

Em **Testemunhos**, "Mostrar na Home" põe-no na página inicial. Em **Números de impacto**, "Publicar" mostra-o; use só números verificáveis.

---

## 3. Pedidos que chegam pelo site

O site tem três formulários: **Solicitar proposta**, **Contactos** e **Inscrição em eventos**.

Quando alguém envia um pedido:

1. o pedido fica guardado na base de dados (Supabase);
2. a equipa recebe um **e-mail de aviso** (no endereço configurado em `EMAIL_TEAM_TO`); **"Responder" responde diretamente a quem enviou**;
3. quem enviou recebe um e-mail de confirmação.

### Ver e gerir os pedidos (Supabase)

Em [supabase.com](https://supabase.com) → projeto → **Table Editor**:

| Tabela                | Conteúdo              | Estados que pode usar                                              |
| --------------------- | --------------------- | ------------------------------------------------------------------ |
| `proposal_requests`   | Pedidos de proposta   | novo · em-analise · proposta-enviada · ganho · perdido · arquivado |
| `contact_messages`    | Mensagens de contacto | novo · respondido · arquivado                                      |
| `event_registrations` | Inscrições            | confirmada · lista-de-espera · cancelada                           |

- Mude a coluna **status** à medida que trata cada pedido.
- Para a lista de participantes de um evento: filtre `event_registrations` pelo evento e **exporte em CSV** (abre no Excel).
- **Cancelar uma inscrição** (mudar para _cancelada_) liberta a vaga; o número de vagas no site atualiza em até 1 hora (ou logo na inscrição seguinte).
- Os dados antigos são apagados automaticamente (pedidos com mais de 24 meses; inscrições 12 meses depois do evento), depois de o técnico agendar a limpeza diária no Supabase.

### Eventos pagos

As inscrições funcionam como **reserva**. As instruções de pagamento (referência, transferência) são enviadas pela equipa por e-mail (decisão D3). O pagamento online pode ser acrescentado mais tarde.

### Spam

O site tem várias proteções automáticas (verificação anti-robô, limite de envios, deteção de preenchimento automático). Se mesmo assim chegar spam com frequência, avise o responsável técnico.

---

## 4. Cookies e estatísticas

- Na primeira visita aparece o aviso **"Cookies e privacidade"**. O Google Analytics **só funciona para quem aceitar**; quem rejeitar não é contado.
- Por isso, os números do Google Analytics são **inferiores ao total real de visitas** — é o comportamento correto e legal.
- Qualquer pessoa pode mudar a escolha em **"Gerir cookies"**, no rodapé.
- Além das visitas, são medidos: pedidos de proposta e mensagens enviados (`generate_lead`), inscrições em eventos (`sign_up`) e cliques no botão de WhatsApp (`contact_whatsapp`).

---

## 5. O que precisa da equipa técnica

Estes textos estão no código do site (não no Studio). Para mudar, peça ao responsável técnico:

- textos das páginas de **Soluções**, **Método C.E.N.T.R.O.** e da **página inicial**;
- **Política de Privacidade**, **Política de Cookies** e **Termos e Condições** — enquanto não forem validados por um jurista, mostram o aviso "Texto-base em validação jurídica" (decisão D5);
- novas opções nos formulários (ex.: um novo serviço);
- menu, rodapé, cores e logótipos;
- domínio, e-mail, variáveis de configuração e alojamento.

---

## 6. Cuidados importantes

- **Nunca** partilhe palavras-passe, chaves ou códigos de acesso por e-mail, WhatsApp ou em documentos. Ficam apenas no hPanel da Hostinger e nos painéis de cada serviço.
- **Não** publique fotografias de pessoas, testemunhos ou logótipos sem autorização.
- **Não** apague tabelas nem colunas no Supabase; mude apenas o **status** dos pedidos.
- **Não** altere o endereço (slug) de páginas já publicadas.
- Dados pessoais dos pedidos (nomes, e-mails, telefones) são confidenciais: não os copie para listas pessoais nem os envie a terceiros.
- Antes de anunciar um evento, abra a página no telemóvel e confirme data, local e preço.

---

## 7. Antes do lançamento — o que falta fornecer

- [ ] Fotografias reais (equipa, sessões, eventos) e logótipo oficial com o nome.
- [ ] Textos e fotografia da fundadora/equipa e marcos da história (Página Sobre Nós).
- [ ] Contactos: telefone, e-mail, WhatsApp, redes sociais (Definições do site).
- [ ] Dados legais (denominação social, NIF, morada) e **validação jurídica** das políticas e do alojamento dos dados na Europa (D5).
- [ ] Primeiros eventos, experiências, artigos, testemunhos e logótipos **com autorização**.
- [ ] Endereço de e-mail que recebe os avisos de novos pedidos.
- [ ] Contas dos serviços em nome da Conexão Positiva (D9).

---

## 8. Ajuda

| Problema                                    | O que fazer                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| Alteração no Studio não aparece             | Confirme que carregou em **Publicar**; espere 1 minuto e recarregue a página           |
| Não chegam e-mails de novos pedidos         | Veja a pasta de spam; confirme no Supabase se o pedido foi gravado; avise o técnico    |
| Formulário mostra "Não foi possível enviar" | O serviço de base de dados ou de e-mail está indisponível: avise o técnico de imediato |
| Site em baixo ou com erro                   | Avise o técnico; ele pode voltar à versão anterior em minutos                          |
| Esqueceu a palavra-passe do Studio          | Use "esqueci a palavra-passe" no ecrã de entrada do Sanity                             |

Responsável técnico: **[Nome e contacto do responsável técnico]**
