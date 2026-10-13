import { services } from "@/config/navigation";
import { ServiceCard, type ServiceCardVariant } from "@/components/cards/service-card";

/** Solução em destaque (cartão escuro 2×2) e a de cartão largo (2×1). */
const FEATURED = "team-building";
const WIDE = "desenvolvimento-de-lideranca";

const layout: Record<ServiceCardVariant, string> = {
  featured: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-2",
  default: "",
};

/**
 * Grelha bento das 8 soluções (Home e /solucoes): 4 colunas em ecrãs grandes (3 linhas
 * completas), 2 no tablet, 1 no telemóvel. O destaque aparece primeiro.
 */
export function ServicesBento({ moreLabel }: { moreLabel: string }) {
  const ordered = [
    ...services.filter((service) => service.slug === FEATURED),
    ...services.filter((service) => service.slug === WIDE),
    ...services.filter((service) => service.slug !== FEATURED && service.slug !== WIDE),
  ];
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
      {ordered.map((service) => {
        const variant: ServiceCardVariant =
          service.slug === FEATURED ? "featured" : service.slug === WIDE ? "wide" : "default";
        return (
          <li key={service.slug} className={`reveal ${layout[variant]}`}>
            <ServiceCard service={service} moreLabel={moreLabel} variant={variant} />
          </li>
        );
      })}
    </ul>
  );
}
