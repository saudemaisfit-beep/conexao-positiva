import { ArrowRight } from "lucide-react";
import { ButtonLink, arrowClassName } from "@/components/ui/button";

interface CtaBannerProps {
  id: string;
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

// Rótulos longos (ex.: nomes de serviços) quebram linha em ecrãs estreitos em vez de serem cortados.
const wrap = "py-3 text-center whitespace-normal";

/** CTA final de página: superfície escura, tipografia forte e ações diretas. */
export function CtaBanner({ id, title, text, primary, secondary }: CtaBannerProps) {
  return (
    <section aria-labelledby={id} className="bg-background section-spacing">
      <div className="container-site">
        <div
          data-surface="inverse"
          className="relative isolate overflow-hidden rounded-[2rem] bg-inverse px-6 py-14 text-on-inverse md:px-14 md:py-20"
        >
          <div className="flex max-w-2xl reveal flex-col gap-5">
            <h2 id={id} className="text-h1 font-extrabold">
              {title}
            </h2>
            <p className="text-lead text-on-inverse-muted">{text}</p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row">
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
        </div>
      </div>
    </section>
  );
}
