import { getTranslations } from "next-intl/server";

/** "O que acontece a seguir": sequência real, por isso numerada. */
export async function NextSteps({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const t = await getTranslations("Proposal.next");
  const steps = t.raw("steps") as { title: string; text: string }[];
  const Heading = headingLevel;
  return (
    <div className="flex flex-col gap-6">
      <Heading className="text-h4 font-bold">{t("title")}</Heading>
      <ol className="flex flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-small font-extrabold text-primary tabular-nums">
              {index + 1}
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{step.title}</p>
              <p className="text-small text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
