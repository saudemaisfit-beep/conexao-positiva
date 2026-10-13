"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

const parts = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 60_000));
  return [
    { value: Math.floor(total / 1440), label: "Dias" },
    { value: Math.floor((total % 1440) / 60), label: "Horas" },
    { value: total % 60, label: "Min" },
  ];
};

/**
 * Contagem até uma data-limite REAL (nunca reinicia). Atualiza de minuto a minuto e pode ser
 * pausada (WCAG 2.2.2). No servidor e antes da hidratação mostra o valor calculado no build.
 */
export function Countdown({ deadline }: { deadline: string }) {
  const end = new Date(deadline).getTime();
  const [now, setNow] = useState(() => Date.now());
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div className="flex items-center gap-3">
      <dl className="grid flex-1 grid-cols-3 gap-2 md:gap-4">
        {parts(end - now).map((item) => (
          <div
            key={item.label}
            className="flex flex-col-reverse rounded-sm bg-white p-3 text-center"
          >
            <dt className="text-small text-muted">{item.label}</dt>
            <dd
              suppressHydrationWarning
              className="font-display text-[2rem] leading-none font-bold text-text tabular-nums"
            >
              {String(item.value).padStart(2, "0")}
            </dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Retomar a contagem" : "Pausar a contagem"}
        className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-text/40 text-text hover:bg-white/30"
      >
        {paused ? (
          <Play aria-hidden="true" className="size-4" />
        ) : (
          <Pause aria-hidden="true" className="size-4" />
        )}
      </button>
    </div>
  );
}
