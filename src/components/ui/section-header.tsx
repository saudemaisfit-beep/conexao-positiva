import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  className?: string;
}

/** Cabeçalho de secção: eyebrow, título (h2 com id para aria-labelledby), introdução e ação. */
export function SectionHeader({ id, eyebrow, title, lead, action, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="flex max-w-3xl flex-col gap-3">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="max-w-[24ch] text-h2 leading-[1.15] font-bold tracking-[-0.025em]">
          {title}
        </h2>
        {lead && (
          <p className="mt-1 text-lead text-muted in-data-[surface=inverse]:text-on-inverse-muted">
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
