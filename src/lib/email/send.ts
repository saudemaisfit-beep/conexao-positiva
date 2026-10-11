import "server-only";

/**
 * Envio de e-mails transacionais pela API do Resend (sem SDK). Chave só no servidor.
 * Um e-mail que falha nunca anula o pedido: os dados já estão guardados na base de dados.
 */
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM;

export const isEmailConfigured = Boolean(apiKey && from);

/** Endereços da equipa que recebem os avisos (separados por vírgulas). */
export const teamRecipients = (process.env.EMAIL_TEAM_TO ?? "")
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);

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
  if (!apiKey || !from || email.to.length === 0) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: email.to.map(oneLine),
      subject: oneLine(email.subject),
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: oneLine(email.replyTo) } : {}),
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Resend respondeu ${response.status}`);
  return true;
}
