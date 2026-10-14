import { Aurora } from "@/components/common/aurora";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/common/breadcrumbs";

/**
 * Cabeçalho das páginas de formulário e legais: fundo escuro com aurora, sem outros elementos
 * gráficos, para manter o foco. A secção seguinte precisa de margem superior.
 */
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
    <header
      data-surface="inverse"
      className="relative isolate overflow-hidden bg-inverse text-on-inverse"
    >
      <Aurora />
      <div className="container-site flex flex-col gap-4 pt-6 pb-14 md:pt-8 md:pb-20">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-4 flex max-w-3xl flex-col gap-4 md:mt-8">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 id="page-title" className="text-h1 font-normal text-balance">
            {title}
          </h1>
          <p className="text-lead text-muted">{lead}</p>
        </div>
      </div>
    </header>
  );
}
