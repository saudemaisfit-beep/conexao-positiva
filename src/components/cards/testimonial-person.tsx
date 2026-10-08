import Image from "next/image";
import type { Testimonial } from "@/content/types";

export function TestimonialPerson({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .replace(/\[.*?\]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div className="flex items-center gap-3">
      {testimonial.photo ? (
        <Image
          src={testimonial.photo.src}
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-primary-soft font-display font-bold text-primary"
        >
          {initials || "·"}
        </span>
      )}
      <div className="flex flex-col">
        <span className="font-semibold">{testimonial.name}</span>
        <span className="text-small text-muted">
          {testimonial.role}, {testimonial.company}
        </span>
      </div>
    </div>
  );
}
