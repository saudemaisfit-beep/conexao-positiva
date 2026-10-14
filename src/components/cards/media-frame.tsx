import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { ContentImage } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Área de imagem dos cards. Sem fotografia (ainda não fornecida), mostra uma composição
 * gráfica da marca em vez de um "placeholder" vazio.
 */
export function MediaFrame({
  image,
  icon: Icon,
  ratio = "aspect-[4/3]",
  sizes,
  className,
}: {
  image?: ContentImage;
  icon?: LucideIcon;
  ratio?: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-primary-soft", ratio, className)}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-(--duration-slow) ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -top-1/4 -right-1/4 size-3/4 rounded-full border-[6px] border-secondary/25" />
          <div className="absolute -bottom-1/3 -left-1/5 size-2/3 rounded-full bg-secondary/15" />
          {Icon && (
            <Icon
              className="absolute bottom-5 left-5 size-9 text-primary transition-transform duration-(--duration-slow) ease-out group-hover:scale-110"
              strokeWidth={1.5}
            />
          )}
        </div>
      )}
      {image?.provisional && (
        <span className="absolute right-3 bottom-3 rounded-full bg-inverse px-3 py-1 text-caption font-medium text-on-inverse">
          Fotografia ilustrativa
        </span>
      )}
    </div>
  );
}
