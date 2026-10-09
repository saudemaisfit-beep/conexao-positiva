import Image from "next/image";
import type { ContentImage } from "@/content/types";

/** Galeria simples: grelha 3 / 2 colunas, recorte 4:3. */
export function Gallery({ images }: { images: ContentImage[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((image) => (
        <li key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-md">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
