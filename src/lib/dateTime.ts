const brasiliaTimeZone = "America/Sao_Paulo";

export interface DashboardDateTime {
  greeting: string;
  dateLabel: string;
}

export function getDashboardDateTime(date: Date = new Date()): DashboardDateTime {
  const hourPart = new Intl.DateTimeFormat("pt-BR", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: brasiliaTimeZone,
  })
    .formatToParts(date)
    .find((part) => part.type === "hour");
  const hour = Number(hourPart?.value);

  const greeting = hour >= 5 && hour < 12
    ? "Bom dia"
    : hour >= 12 && hour < 18
      ? "Boa tarde"
      : "Boa noite";

  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeZone: brasiliaTimeZone,
  }).format(date);

  return { greeting, dateLabel };
}
