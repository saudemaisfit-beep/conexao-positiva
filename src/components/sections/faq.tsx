import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { FaqItem } from "@/content/services";
import { JsonLd } from "@/components/common/json-ld";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";

/** Perguntas frequentes (details/summary nativo, sem JavaScript) + JSON-LD FAQPage. */
export async function Faq({ items, id = "faq-title" }: { items: FaqItem[]; id?: string }) {
  if (items.length === 0) return null;
  const t = await getTranslations("Common");
  return (
    <Section aria-labelledby={id}>
      <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
        <SectionHeader id={id} title={t("faqTitle")} className="mb-0 self-start md:mb-0" />
        <div className="flex flex-col border-t border-border">
          {items.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-border"
              open={index === 0}
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-h4 font-bold [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary transition-transform duration-(--duration-fast) group-open:rotate-180"
                />
              </summary>
              <p className="max-w-[68ch] pb-6 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </Section>
  );
}
