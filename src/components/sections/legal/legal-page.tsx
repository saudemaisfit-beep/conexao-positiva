import { Scale } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { LegalDocument } from "@/content/legal";
import { FormPageHeader } from "@/components/sections/forms/form-page-header";
import { formatLongDate } from "@/lib/format";

/** Página legal: índice de secções (âncoras) e texto com largura de leitura. */
export async function LegalPage({ document }: { document: LegalDocument }) {
  const t = await getTranslations("Legal");
  return (
    <>
      <FormPageHeader
        title={document.title}
        lead={document.intro}
        breadcrumbs={[{ label: document.title, href: `/${document.slug}` }]}
      />
      <section aria-labelledby="page-title" className="pb-(--space-section)">
        <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div className="flex flex-col gap-6 self-start lg:sticky lg:top-28">
            <p className="text-small text-muted">
              {t("updated", { date: formatLongDate(`${document.updatedAt}T12:00:00Z`) })}
            </p>
            {!document.reviewed && (
              <p className="flex items-start gap-3 rounded-md border-l-3 border-warning bg-warning-soft p-4 text-small">
                <Scale aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
                {t("draft")}
              </p>
            )}
            <nav aria-label={t("contents")}>
              <p className="mb-3 eyebrow">{t("contents")}</p>
              <ol className="flex flex-col border-l border-border">
                {document.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-small text-muted hover:border-primary hover:text-primary"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <div className="flex max-w-[68ch] flex-col gap-10">
            {document.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="flex flex-col gap-4"
              >
                <h2 id={`${section.id}-title`} className="text-h3 font-bold">
                  {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-body-lg">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="flex list-disc flex-col gap-2 pl-6 text-body-lg marker:text-accent">
                    {section.list.map((item) => (
                      <li key={item.slice(0, 40)} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.after?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-body-lg">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
