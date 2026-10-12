import { Check } from "lucide-react";
import { Section } from "@/components/layout/section";

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AudienceFormats({
  audienceTitle,
  audience,
  formatsTitle,
  formats,
}: {
  audienceTitle: string;
  audience: string[];
  formatsTitle: string;
  formats: string[];
}) {
  return (
    <Section aria-label={`${audienceTitle} · ${formatsTitle}`}>
      <div className="container-site grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex reveal flex-col gap-6 rounded-lg border border-border bg-surface-raised p-6 md:p-8">
          <h2 className="text-h3 font-bold">{audienceTitle}</h2>
          <CheckList items={audience} />
        </div>
        <div className="flex reveal flex-col gap-6 rounded-lg bg-primary-soft p-6 md:p-8">
          <h2 className="text-h3 font-bold">{formatsTitle}</h2>
          <CheckList items={formats} />
        </div>
      </div>
    </Section>
  );
}
