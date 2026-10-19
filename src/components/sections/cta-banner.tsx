import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { provisionalImages } from "@/content/provisional-images";
import { ButtonLink, arrowClassName } from "@/components/ui/button";

interface CtaBannerProps {
  id: string;
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

const wrap = "py-3 text-center whitespace-normal";

/** Fecho editorial: conversa e fotografia lado a lado, com uma ação principal. */
export function CtaBanner({ id, title, text, primary, secondary }: CtaBannerProps) {
  const image = provisionalImages.mentoring;
  return (
    <section aria-labelledby={id} className="bg-background section-spacing">
      <div className="container-site">
        <div
          data-surface="inverse"
          className="grid overflow-hidden rounded-sm bg-inverse text-on-inverse lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
        >
          <div className="flex reveal flex-col items-start gap-5 px-6 py-10 md:px-12 md:py-16">
            <h2
              id={id}
              className="max-w-[20ch] text-h2 leading-[1.12] font-bold tracking-[-0.03em]"
            >
              {title}
            </h2>
            <p className="max-w-[46ch] text-lead text-on-inverse-muted">{text}</p>
            <div className="sm:w-auto sm:flex-row sm:flex-wrap mt-3 flex w-full flex-col gap-3">
              <ButtonLink href={primary.href} variant="glow" size="lg" className={wrap}>
                {primary.label}
                <ArrowRight aria-hidden="true" className={arrowClassName} />
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="glass" size="lg" className={wrap}>
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
          <figure className="relative aspect-[16/9] min-w-0 lg:aspect-auto lg:min-h-80">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <figcaption className="absolute right-3 bottom-3 rounded-sm bg-inverse px-3 py-1 text-caption text-on-inverse">
              Fotografia ilustrativa
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
