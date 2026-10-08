import { cn } from "@/lib/cn";

/** Lista de itens título + texto (problemas, benefícios, valores…), sem numeração. */
export function FeatureList({
  items,
  variant = "rule",
}: {
  items: readonly { title: string; text: string }[];
  variant?: "rule" | "card";
}) {
  return (
    <ul
      className={cn(
        "grid md:grid-cols-2",
        items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        variant === "rule" ? "gap-x-10 gap-y-8" : "gap-4",
      )}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className={cn(
            "flex reveal flex-col gap-2",
            variant === "rule"
              ? "border-t-2 border-secondary pt-5"
              : "rounded-lg border border-border bg-surface-raised p-6",
          )}
        >
          <h3 className="text-h4 font-bold">{item.title}</h3>
          <p className="text-muted">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
