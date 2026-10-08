import Image from "next/image";
import type { ContentImage } from "@/content/types";
import { cn } from "@/lib/cn";

/** Fotografia de pessoa ou, sem fotografia, as iniciais sobre fundo da marca (nunca uma foto genérica). */
export function PersonAvatar({
  name,
  photo,
  className,
  sizes,
}: {
  name: string;
  photo?: ContentImage;
  className?: string;
  sizes: string;
}) {
  const initials = name
    .replace(/\[.*?\]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div className={cn("relative overflow-hidden bg-primary-soft", className)}>
      {photo ? (
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-display text-h2 font-extrabold text-primary"
        >
          {initials || "·"}
        </span>
      )}
    </div>
  );
}
