import { Breadcrumbs, type BreadcrumbItem } from "@/components/common/breadcrumbs";

/** Cabeçalho das páginas de formulário: sem elementos gráficos, para manter o foco. */
export function FormPageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  breadcrumbs: BreadcrumbItem[];
}) {
  return (
    <header className="container-site flex flex-col gap-4 pt-6 pb-10 md:pt-8 md:pb-14">
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-4 flex max-w-3xl flex-col gap-4 md:mt-8">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 id="page-title" className="text-h1 font-extrabold text-balance">
          {title}
        </h1>
        <p className="text-lead text-muted">{lead}</p>
      </div>
    </header>
  );
}
