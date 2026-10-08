import { cn } from "@/lib/cn";

/** Passos de um processo real (sequência com ordem), numerados 01, 02… */
export function StepsList({
  steps,
  columns = 4,
}: {
  steps: readonly { title: string; text: string }[];
  columns?: 4 | 5;
}) {
  return (
    <ol
      className={cn(
        "grid gap-5 md:grid-cols-2 lg:gap-4",
        columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4",
      )}
    >
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex reveal flex-col gap-3 rounded-lg bg-surface-raised p-6 shadow-sm"
        >
          <span className="font-display text-small font-extrabold text-secondary-strong tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-h4 font-bold">{step.title}</h3>
          <p className="text-small text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
