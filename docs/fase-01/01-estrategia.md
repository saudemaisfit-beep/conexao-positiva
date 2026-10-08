# Fase 1.1 — Estratégia, públicos e conversão

## Objetivo do website

Posicionar a Conexão Positiva como **parceira estratégica no desenvolvimento de pessoas, líderes, equipas e organizações**, e não como simples fornecedora de palestras ou formações.

Narrativa que atravessa todo o site:

```
Conexão → Consciência → Desenvolvimento → Transformação → Resultados
```

Mensagem central (fio condutor):

> Pessoas melhores constroem equipas melhores.
> Equipas melhores constroem organizações mais fortes.

## Públicos

| Público                             | Quem é                                             | O que procura                                        | O que precisa de ver                                                                   | Conversão principal           |
| ----------------------------------- | -------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------- |
| **Decisor corporativo**             | Diretor(a) de RH, Pessoas & Cultura, Administração | Parceiro credível para desenvolver equipas e líderes | Soluções claras, experiências reais, clientes, método próprio, processo de contratação | Solicitar proposta            |
| **Organizador de eventos internos** | Comunicação interna, eventos, gestão de equipas    | Team building, palestra ou evento com impacto        | Formatos, logística, fotografias, testemunhos                                          | Solicitar proposta / WhatsApp |
| **Instituição**                     | Escolas, ONG, entidades públicas                   | Formação e programas de bem-estar                    | Abordagem, método, credibilidade                                                       | Contacto / proposta           |
| **Profissional individual**         | Pessoa interessada em desenvolvimento pessoal      | Workshops, formações abertas, eventos                | Agenda, preço, local, vagas                                                            | Inscrição em evento           |
| **Parceiro / imprensa**             | Media, parceiros, oradores                         | Informação institucional                             | Sobre nós, fundador(a), contactos                                                      | Contacto                      |

O **decisor corporativo** é o público prioritário: a hierarquia de conteúdos e os CTAs são desenhados primeiro para ele.

## Hierarquia de conversões

| Prioridade | Conversão                                 | Onde acontece                                             | Evento de analytics                |
| ---------- | ----------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| 1          | Pedido de proposta                        | `/solicitar-proposta` (CTA no header em todas as páginas) | `generate_lead` (`form: proposta`) |
| 2          | Inscrição em evento                       | `/eventos/[slug]/inscricao`                               | `sign_up` (`form: inscricao`)      |
| 3          | Mensagem de contacto                      | `/contactos`                                              | `generate_lead` (`form: contacto`) |
| 4          | Clique no WhatsApp                        | Botão flutuante e página de contactos                     | `contact_whatsapp`                 |
| Micro      | Clique em serviço, ver evento, ler artigo | Cards e listagens                                         | `select_content`, `view_item`      |

Os eventos de analytics só são enviados depois de o utilizador consentir (ver arquitetura técnica).

## Jornadas principais

**Decisor corporativo (pesquisa → proposta)**

```
Google / LinkedIn → Home ou Serviço → Experiências (prova) → Método C.E.N.T.R.O. (diferencial)
→ Solicitar proposta → /proposta-recebida → e-mail de confirmação → contacto da equipa
```

**Participante (redes sociais → inscrição)**

```
Instagram / WhatsApp → /eventos/[slug] → Inscrever-me → /eventos/[slug]/inscricao
→ /inscricao-confirmada → e-mail com detalhes do evento
```

**Visitante orgânico (conteúdo → confiança → contacto)**

```
Pesquisa → /insights/[artigo] → artigos relacionados / Método → Solução relacionada → Proposta
```

Regra de UX resultante: **nenhuma página termina sem um próximo passo** (CTA final, conteúdo relacionado ou contacto).

## Princípios de produto

1. **Clareza antes de criatividade** — em 5 segundos a Home tem de responder: quem é, o que faz, para quem, qual o diferencial, como contratar.
2. **Prova antes de promessa** — experiências, testemunhos e clientes reais; nunca dados inventados.
3. **O Método como assinatura** — o C.E.N.T.R.O. é o elemento visual e conceptual mais distintivo do site.
4. **Editável sem programador** — todo o conteúdo que muda vive no CMS.
5. **Rápido e acessível por defeito** — Lighthouse 90+/95+ e WCAG 2.2 AA são requisitos, não extras.
6. **Mobile primeiro** — grande parte do tráfego em Angola é móvel; o CTA de proposta e o WhatsApp estão sempre a um toque.

## Tom de voz (resumo)

Profissional, próximo, humano, inspirador, claro, seguro e positivo. Português de Angola (norma europeia: _equipa_, _telemóvel_, _registo_, _utilizador_, _ecrã_).

| Preferir                                      | Evitar                                 |
| --------------------------------------------- | -------------------------------------- |
| "Como podemos ajudar a sua equipa a…"         | "Nós fazemos…"                         |
| "Experiências pensadas para…"                 | "Somos os melhores"                    |
| "Resultados que procuramos construir consigo" | "Resultados garantidos"                |
| Frases curtas, verbos concretos               | Jargão corporativo vazio, superlativos |

## Indicadores de sucesso (após lançamento)

- Pedidos de proposta por mês e taxa de conversão da página `/solicitar-proposta`.
- Inscrições por evento e percentagem de vagas preenchidas.
- Cliques no WhatsApp.
- Tráfego orgânico para `/insights` e `/solucoes/*`.
- Core Web Vitals em "Bom" (LCP < 2,5 s, INP < 200 ms, CLS < 0,1).

Os valores-alvo devem ser definidos com a equipa da Conexão Positiva depois de existir uma linha de base real.
