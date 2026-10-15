import Image from "next/image";
import type { ContentImage } from "@/content/types";

export function EditorialPhoto({
  image,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: {
  image: ContentImage;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface md:aspect-[5/4]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
      {image.provisional && (
        <figcaption className="mt-2 text-caption text-muted">Fotografia ilustrativa</figcaption>
      )}
    </figure>
  );
}
