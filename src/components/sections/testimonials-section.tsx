import { getTranslations } from "next-intl/server";
import type { Testimonial } from "@/content/types";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { TestimonialsShowcase } from "./testimonials";

export async function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  const t = await getTranslations("Home.testimonials");
  return (
    <Section tone="alt" aria-labelledby="testimonials-title">
      <div className="container-site">
        <SectionHeader id="testimonials-title" eyebrow={t("eyebrow")} title={t("title")} />
        <TestimonialsShowcase testimonials={testimonials} />
      </div>
    </Section>
  );
}
