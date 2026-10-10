import { useTranslations } from "next-intl";
import type { ArticleCategory } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { chipClass } from "@/components/ui/chip";
import { cn } from "@/lib/cn";

/** Categorias como ligações reais (cada uma tem URL próprio, indexável). */
export function CategoryNav({
  categories,
  active,
}: {
  categories: ArticleCategory[];
  active: ArticleCategory | null;
}) {
  const t = useTranslations("Insights");
  const items = [
    { href: "/insights", label: t("all"), current: active === null },
    ...categories.map((slug) => ({
      href: `/insights/categoria/${slug}`,
      label: t(`categories.${slug}.name`),
      current: active === slug,
    })),
  ];

  return (
    <nav aria-label={t("categoriesLabel")}>
      <ul className="-mx-(--space-gutter) flex gap-2 overflow-x-auto px-(--space-gutter) pb-1 md:mx-0 md:flex-wrap md:px-0">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={cn(
                chipClass,
                item.current
                  ? "border-primary bg-primary text-on-primary"
                  : "border-border-strong bg-surface-raised text-text hover:border-primary hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
