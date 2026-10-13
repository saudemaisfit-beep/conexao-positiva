import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { CentroOrbit } from "./centro-orbit";

/** Secção do Método na Home, com a identidade marsala do Método (data-brand="metodo"). */
export async function CentroSection() {
  const t = await getTranslations("Home.centro");
  return (
    <div data-brand="metodo">
      <Section tone="inverse" aria-labelledby="centro-title">
        <div className="container-site">
          <SectionHeader
            id="centro-title"
            eyebrow={t("eyebrow")}
            title={t("title")}
            lead={t("lead")}
            action={
              <ButtonLink href="/metodo-centro" variant="inverse-outline">
                {t("cta")}
              </ButtonLink>
            }
          />
          <CentroOrbit />
        </div>
      </Section>
    </div>
  );
}
