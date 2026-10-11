import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Envio de e-mails transacionais pela caixa de correio da Hostinger (SMTP), só no servidor.
 * Um e-mail que falha nunca anula o pedido: os dados já estão guardados na base de dados.
 *
 * Hostinger: servidor smtp.hostinger.com, porta 465 (SSL). O remetente tem de ser a própria
 * caixa autenticada (ex.: nao-responder@conexaopositiva.ao).
 */
const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;
const from = process.env.EMAIL_FROM || (user ? `"Conexão Positiva" <${user}>` : undefined);

export const isEmailConfigured = Boolean(host && user && password && from);

/** Endereços da equipa que recebem os avisos (separados por vírgulas). */
export const teamRecipients = (process.env.EMAIL_TEAM_TO ?? "")
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);

let transporter: Transporter | null = null;

function transport() {
  transporter ??= nodemailer.createTransport({
    host,
    port,
    // 465 = SSL desde o início; 587 = STARTTLS (obrigatório).
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

// Sem quebras de linha nos cabeçalhos (assunto, endereços).
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export interface Email {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail(email: Email) {
  if (!isEmailConfigured || email.to.length === 0) return false;
  await transport().sendMail({
    from,
    to: email.to.map(oneLine),
    subject: oneLine(email.subject),
    html: email.html,
    text: email.text,
    ...(email.replyTo ? { replyTo: oneLine(email.replyTo) } : {}),
  });
  return true;
}
