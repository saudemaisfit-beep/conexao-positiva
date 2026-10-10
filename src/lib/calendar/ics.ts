/**
 * Ficheiro iCalendar (RFC 5545) para "Adicionar ao calendário".
 * Datas em UTC; o calendário de cada pessoa converte para o seu fuso horário.
 */
export interface CalendarEvent {
  uid: string;
  title: string;
  description: string;
  location: string;
  url: string;
  startsAt: string;
  endsAt?: string;
}

const utc = (iso: string) =>
  new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

// Escapa caracteres especiais do formato (\ ; , e mudanças de linha).
const escape = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Linhas com mais de 75 octetos continuam na linha seguinte, iniciada por um espaço.
function fold(line: string) {
  const bytes = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  for (const char of line) {
    if (bytes.encode(current + char).length > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function buildIcs(event: CalendarEvent, now = new Date()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Conexão Positiva//Eventos//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${utc(now.toISOString())}`,
    `DTSTART:${utc(event.startsAt)}`,
    ...(event.endsAt ? [`DTEND:${utc(event.endsAt)}`] : []),
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(`${event.description}\n\n${event.url}`)}`,
    `LOCATION:${escape(event.location)}`,
    `URL:${event.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
