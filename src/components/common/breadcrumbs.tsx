import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "./json-ld";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Breadcrumbs com JSON-LD BreadcrumbList. A Home é acrescentada automaticamente;
 * o último item é a página atual. No mobile mostra apenas o regresso ao nível anterior.
 */
export async function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const t = await getTranslations("Common");
  const trail: BreadcrumbItem[] = [{ label: t("home"), href: "/" }, ...items];
  const parent = trail[trail.length - 2];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, siteConfig.url).toString(),
    })),
  };

  return (
    <nav aria-label={t("breadcrumbs")} className="text-small text-muted">
      {parent && (
        <Link href={parent.href} className="inline-flex min-h-11 items-center gap-1 md:hidden">
          <ChevronLeft aria-hidden="true" className="size-4" />
          {t("back", { page: parent.label })}
        </Link>
      )}
      <ol className="hidden flex-wrap items-center gap-1.5 md:flex">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.href} className="inline-flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-medium text-text">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center hover:text-primary hover:underline"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight aria-hidden="true" className="size-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
