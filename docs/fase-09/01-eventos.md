# Fase 9 — Eventos (`/eventos` e `/eventos/[slug]`)

## Conteúdo

- `src/content/events.ts`: fonte única de eventos (agenda, páginas de evento e "Próximos eventos" da Home).
- Modelo `EventDetail` (`src/content/types.ts`): título, categoria (workshop, formação, palestra, experiência), início/fim (ISO, fuso de Luanda na apresentação), local, preço em Kz ou gratuito, estado (`aberto`, `ultimas-vagas`, `esgotado`, `encerrado`), vagas restantes, resumo, descrição, programa, facilitador(a), galeria e FAQ.
- **Produção**: sem eventos reais a lista está vazia e a agenda mostra "De momento não há eventos agendados." com convite ao contacto.
- **Pré-visualização** (`CONTENT_PREVIEW=1`): 5 eventos [Exemplo] cobrindo todos os estados (aberto, últimas vagas, esgotado, 2 passados).
- As vagas restantes passam a vir da base de dados de inscrições na Fase 14.

## `/eventos`

- Filtros **Próximos / Passados** e **categoria** (só aparecem as categorias com eventos), em `?filtro=passados&categoria=workshop`: o URL pode ser partilhado e cada mudança fica no histórico (o botão "voltar" regressa ao filtro anterior).
- Contagem de resultados anunciada a leitores de ecrã (`aria-live`); "Limpar filtros" quando não há resultados.
- Próximo evento em destaque (cartão horizontal); restantes em grelha 3/2/1.
- Passados ordenados do mais recente para o mais antigo; um evento passa a "Passado" quando termina (cálculo no servidor, com revalidação de hora a hora).

## `/eventos/[slug]`

| Zona                  | Conteúdo                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Hero                  | Breadcrumbs, categoria, título, resumo, ação de inscrição                                                                 |
| Coluna fixa (desktop) | Data, horário, local (+ "Ver no mapa", Google Maps), vagas disponíveis, valor, ação, nota de pagamento para eventos pagos |
| Conteúdo              | Sobre o evento, programa, facilitação, galeria (se existir)                                                               |
| Depois                | FAQ (+ JSON-LD), outros eventos futuros                                                                                   |
| Mobile                | Barra fixa inferior com data, valor e ação (só para eventos futuros); o botão de WhatsApp sobe para ficar acima dela      |

Ação de inscrição por estado:

| Estado                 | Ação                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Aberto / Últimas vagas | **INSCREVER-ME** → `/eventos/[slug]/inscricao`                                       |
| Esgotado               | **Entrar na lista de espera** → mesmo formulário (variante lista de espera, Fase 14) |
| Encerrado              | "Inscrições encerradas" (sem link)                                                   |
| Já decorreu            | "Este evento já decorreu" (sem barra fixa)                                           |

Dados estruturados: `Event` (datas, local, organizador, `Offer` em AOA com disponibilidade), `FAQPage` e `BreadcrumbList`. Evento inexistente → 404.

## Pendências

- Formulário de inscrição `/eventos/[slug]/inscricao` e página `/inscricao-confirmada` (com "Adicionar ao calendário"): Fases 12/14.
- Decisão D3 (eventos pagos: pagamento online ou reserva + instruções por e-mail). A página assume, por agora, reserva + instruções por e-mail.
- Fotografias e galerias reais dos eventos.

## Verificação

- `lint`, `typecheck`, `build` sem erros.
- Pré-visualização (6 páginas) e produção, a 360, 390, 768, 1024, 1280 e 1440 px: código 200, um `h1`, sem scroll horizontal, 0 violações axe, sem erros de consola, JSON-LD válido.
- Filtros: contagens corretas, URL atualizado, "voltar" e URL direto com filtros testados.
- Estados aberto / esgotado / passado verificados na coluna de informação; WhatsApp acima da barra fixa no mobile.
