import type { BreadcrumbItem } from "@/components/common/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";

/** Formulários com fotografia contextual; páginas legais e confirmações sem distrações. */
export function FormPageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  breadcrumbs: BreadcrumbItem[];
  compact?: boolean;
}) {
  return (
    <PageHero
      eyebrow={eyebrow ?? ""}
      title={title}
      lead={lead}
      breadcrumbs={breadcrumbs}
      compact={compact}
    />
  );
}
