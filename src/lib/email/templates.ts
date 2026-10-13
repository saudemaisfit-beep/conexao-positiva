import "server-only";
import { siteConfig } from "@/config/site";
import type { EventDetail } from "@/content/types";
import { formatKz, formatLongDate, formatTime } from "@/lib/format";
import type { ContactData, ProposalData, RegistrationData } from "@/lib/forms/schemas";
import type { PaymentInstructions } from "@/lib/payments/types";
import type { Email } from "./send";

/** Todo o texto vindo de formulários ou do CMS é escapado antes de entrar no HTML. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const AZUL = "#0b6592";
const MARINHO = "#082231";

/** Moldura comum: HTML simples em tabela (compatível com clientes de e-mail), cores da marca. */
function layout(title: string, body: string) {
  return `<!doctype html><html lang="pt"><body style="margin:0;background:#faf8f3;font-family:Arial,Helvetica,sans-serif;color:#131c24">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f3;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:${MARINHO};color:#ffffff;padding:20px 28px;font-size:18px;font-weight:bold">${escapeHtml(siteConfig.name)}</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${MARINHO}">${escapeHtml(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #dcd6ca;font-size:12px;color:#52606b">${escapeHtml(siteConfig.name)} · <a href="${siteConfig.url}" style="color:${AZUL}">${escapeHtml(new URL(siteConfig.url).host)}</a></td></tr>
</table></td></tr></table></body></html>`;
}

const paragraph = (text: string) =>
  `<p style="margin:0 0 14px;font-size:15px;line-height:1.6">${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;

/** Tabela de campos (só os preenchidos). */
function fields(rows: [string, string | undefined | null][]) {
  const filled = rows.filter(([, value]) => value && value.trim());
  const html = filled
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0;font-size:13px;color:#52606b;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:8px 0;font-size:15px;line-height:1.5">${escapeHtml(value!).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  const text = filled.map(([label, value]) => `${label}: ${value}`).join("\n");
  return {
    html: `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #dcd6ca;margin:8px 0 16px">${html}</table>`,
    text,
  };
}

const button = (label: string, href: string) =>
  `<p style="margin:20px 0"><a href="${escapeHtml(href)}" style="display:inline-block;background:${AZUL};color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">${escapeHtml(label)}</a></p>`;

type Labels = Record<string, string>;

// ---------- Contacto ----------
export function contactEmails(data: ContactData, labels: Labels, team: string[]): Email[] {
  const list = fields([
    ["Nome", data.name],
    ["Empresa", data.company],
    ["E-mail", data.email],
    ["Telefone", data.phone],
    ["Assunto", labels[data.subject] ?? data.subject],
    ["Mensagem", data.message],
  ]);
  return [
    {
      to: team,
      replyTo: data.email,
      subject: `Nova mensagem: ${labels[data.subject] ?? data.subject} — ${data.name}`,
      html: layout("Nova mensagem de contacto", list.html),
      text: `Nova mensagem de contacto\n\n${list.text}`,
    },
    {
      to: [data.email],
      subject: "Recebemos a sua mensagem",
      html: layout(
        `Obrigado, ${data.name}.`,
        paragraph("Recebemos a sua mensagem e respondemos por e-mail assim que possível.") +
          paragraph(
            "Este é um e-mail automático; para acrescentar informação, responda a esta mensagem.",
          ),
      ),
      text: `Obrigado, ${data.name}.\n\nRecebemos a sua mensagem e respondemos por e-mail assim que possível.`,
    },
  ];
}

// ---------- Proposta ----------
export function proposalEmails(data: ProposalData, labels: Labels, team: string[]): Email[] {
  const list = fields([
    ["Nome", data.name],
    ["Empresa", data.company],
    ["Cargo", data.role],
    ["E-mail", data.email],
    ["Telefone", data.phone],
    ["Serviço", labels[`service.${data.service}`] ?? data.service],
    ["Participantes", labels[`participants.${data.participants}`] ?? data.participants],
    ["Local", data.location],
    ["Data prevista", data.dateUndecided ? "Ainda por definir" : data.date],
    ["Objetivo", data.objective],
    ["Orçamento", data.budget ? (labels[`budget.${data.budget}`] ?? data.budget) : undefined],
    ["Informações adicionais", data.details],
  ]);
  return [
    {
      to: team,
      replyTo: data.email,
      subject: `Novo pedido de proposta: ${data.company} (${labels[`service.${data.service}`] ?? data.service})`,
      html: layout("Novo pedido de proposta", list.html),
      text: `Novo pedido de proposta\n\n${list.text}`,
    },
    {
      to: [data.email],
      subject: "Recebemos o seu pedido de proposta",
      html: layout(
        `Obrigado, ${data.name}.`,
        paragraph(
          "A equipa Conexão Positiva irá analisar as informações e entrar em contacto consigo.",
        ) +
          paragraph(
            "Próximos passos: 1) analisamos o seu pedido; 2) falamos consigo para conhecer melhor a equipa; 3) enviamos uma proposta à medida.",
          ) +
          fields([
            ["Serviço", labels[`service.${data.service}`] ?? data.service],
            ["Participantes", labels[`participants.${data.participants}`] ?? data.participants],
            ["Local", data.location],
          ]).html,
      ),
      text: `Obrigado, ${data.name}.\n\nA equipa Conexão Positiva irá analisar as informações e entrar em contacto consigo.`,
    },
  ];
}

// ---------- Inscrição ----------
export function registrationEmails(
  data: RegistrationData,
  event: EventDetail,
  waitlist: boolean,
  team: string[],
): Email[] {
  const name = `${data.firstName} ${data.lastName}`;
  const when = `${formatLongDate(event.startsAt)}, ${formatTime(event.startsAt)}${event.endsAt ? `–${formatTime(event.endsAt)}` : ""}`;
  const price = event.priceKz === null ? "Gratuito" : formatKz(event.priceKz);
  const eventUrl = new URL(`/eventos/${event.slug}`, siteConfig.url).toString();
  const calendarUrl = new URL(`/api/calendario/${event.slug}`, siteConfig.url).toString();
  const details = fields([
    ["Evento", event.title],
    ["Data", when],
    ["Local", event.location],
    ["Valor", price],
  ]);
  const person = fields([
    ["Nome", name],
    ["E-mail", data.email],
    ["Telefone", data.phone],
    ["Empresa", data.company],
    ["Cargo", data.role],
    ["Observações", data.notes],
  ]);
  const status = waitlist ? "Lista de espera" : "Inscrição confirmada";

  const userBody = waitlist
    ? paragraph(
        "As vagas estão esgotadas, mas ficou na lista de espera. Se abrir um lugar, avisamos por e-mail.",
      ) + details.html
    : paragraph("A sua inscrição está registada. Guarde este e-mail com os detalhes do evento.") +
      details.html +
      (event.priceKz !== null
        ? paragraph(
            "A inscrição reserva o seu lugar. Enviaremos as instruções de pagamento num próximo e-mail.",
          )
        : "") +
      button("Adicionar ao calendário", calendarUrl);

  return [
    {
      to: team,
      replyTo: data.email,
      subject: `${status}: ${event.title} — ${name}`,
      html: layout(`${status}: ${event.title}`, person.html + details.html),
      text: `${status}: ${event.title}\n\n${person.text}\n\n${details.text}`,
    },
    {
      to: [data.email],
      subject: waitlist
        ? `Lista de espera: ${event.title}`
        : `Inscrição confirmada: ${event.title}`,
      html: layout(
        waitlist ? `Está na lista de espera, ${data.firstName}.` : `Até breve, ${data.firstName}!`,
        userBody + paragraph(`Página do evento: ${eventUrl}`),
      ),
      text: `${waitlist ? "Lista de espera" : "Inscrição confirmada"}: ${event.title}\n\n${details.text}\n\n${eventUrl}`,
    },
  ];
}

// ---------- Pedidos e pagamentos (Método C.E.N.T.R.O.) ----------
interface OrderForEmail {
  offerName: string;
  amountKz: number;
  name: string;
  email: string;
  phone: string;
  instructions: PaymentInstructions | null;
}

function orderFields(order: OrderForEmail) {
  return fields([
    ["Pedido", order.offerName],
    ["Valor", order.amountKz === 0 ? "Gratuito" : formatKz(order.amountKz)],
  ]);
}

function instructionFields(instructions: PaymentInstructions) {
  return instructions.method === "referencia"
    ? fields([
        ["Entidade", instructions.entity],
        ["Referência", instructions.reference],
        ["Montante", formatKz(instructions.amountKz)],
        ["Pagar até", formatLongDate(instructions.expiresAt)],
      ])
    : fields([
        ["Montante", formatKz(instructions.amountKz)],
        ["Pagar até", formatLongDate(instructions.expiresAt)],
      ]);
}

/** Pedido criado: instruções de pagamento (ou confirmação do pedido gratuito) e aviso à equipa. */
export function orderCreatedEmails(order: OrderForEmail, pageUrl: string, team: string[]): Email[] {
  const person = fields([
    ["Nome", order.name],
    ["E-mail", order.email],
    ["Telefone", order.phone],
  ]);
  const summary = orderFields(order);
  const free = order.amountKz === 0;
  const pay = order.instructions ? instructionFields(order.instructions) : null;

  const userBody = free
    ? paragraph("Recebemos o seu pedido. A equipa envia-lhe o guia por e-mail em breve.") +
      summary.html
    : paragraph(
        "O seu pedido está registado. Para o concluir, faça o pagamento por referência Multicaixa (ATM, Multicaixa Express ou homebanking):",
      ) +
      (pay?.html ?? "") +
      summary.html +
      paragraph("Assim que o pagamento for confirmado, enviamos-lhe um e-mail.") +
      button("Ver o estado do pedido", pageUrl);

  return [
    {
      to: team,
      replyTo: order.email,
      subject: `${free ? "Novo pedido" : "Nova compra (por pagar)"}: ${order.offerName} — ${order.name}`,
      html: layout(
        free ? "Novo pedido" : "Nova compra, a aguardar pagamento",
        person.html + summary.html,
      ),
      text: `${free ? "Novo pedido" : "Nova compra (por pagar)"}\n\n${person.text}\n\n${summary.text}`,
    },
    {
      to: [order.email],
      subject: free
        ? `Pedido recebido: ${order.offerName}`
        : `Instruções de pagamento: ${order.offerName}`,
      html: layout(`Obrigado, ${order.name}.`, userBody),
      text: `Obrigado, ${order.name}.\n\n${free ? "Recebemos o seu pedido." : `Pagamento por referência Multicaixa:\n${pay?.text ?? ""}`}\n\n${summary.text}\n\n${pageUrl}`,
    },
  ];
}

/** Pagamento confirmado (aviso do fornecedor já verificado). */
export function orderPaidEmails(order: OrderForEmail, team: string[]): Email[] {
  const summary = orderFields(order);
  const person = fields([
    ["Nome", order.name],
    ["E-mail", order.email],
    ["Telefone", order.phone],
  ]);
  return [
    {
      to: team,
      replyTo: order.email,
      subject: `Pagamento confirmado: ${order.offerName} — ${order.name}`,
      html: layout("Pagamento confirmado", person.html + summary.html),
      text: `Pagamento confirmado\n\n${person.text}\n\n${summary.text}`,
    },
    {
      to: [order.email],
      subject: `Pagamento confirmado: ${order.offerName}`,
      html: layout(
        `Pagamento confirmado. Obrigado, ${order.name}!`,
        summary.html +
          paragraph(
            "A equipa Conexão Positiva entra em contacto consigo com os próximos passos (acesso ao e-book ou detalhes do encontro).",
          ),
      ),
      text: `Pagamento confirmado. Obrigado, ${order.name}!\n\n${summary.text}`,
    },
  ];
}
