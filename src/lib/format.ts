const TIME_ZONE = "Africa/Luanda";
const LOCALE = "pt-AO";

export function formatDay(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, { day: "2-digit", timeZone: TIME_ZONE }).format(
    new Date(iso),
  );
}

export function formatMonthShort(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, { month: "short", timeZone: TIME_ZONE })
    .format(new Date(iso))
    .replace(".", "");
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

export function formatKz(value: number) {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(value);
}
