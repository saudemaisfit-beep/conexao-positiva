import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  [
    "group/button inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "transition-[background-color,color,border-color,transform] duration-(--duration-instant) ease-out",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
    "aria-disabled:pointer-events-none aria-disabled:opacity-45",
    "[&_svg]:size-[1.125em] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover",
        secondary: "border-[1.5px] border-primary text-primary hover:bg-primary-soft",
        inverse: "bg-white text-primary-strong hover:bg-primary-soft",
        "inverse-outline": "border-[1.5px] border-on-inverse text-on-inverse hover:bg-white/10",
        link: "rounded-none text-primary underline decoration-[1.5px] underline-offset-4 hover:decoration-transparent",
      },
      size: {
        sm: "min-h-10 px-[1.125rem] text-small",
        md: "min-h-12 px-6 text-[0.9375rem]",
        lg: "min-h-14 px-[1.875rem] text-body",
      },
    },
    compoundVariants: [{ variant: "link", className: "min-h-0 px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ComponentProps<"button"> & Variants) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/** Seta que avança 4 px quando o botão ou link pai recebe hover. */
export const arrowClassName =
  "transition-transform duration-(--duration-fast) ease-out group-hover/button:translate-x-1 group-hover:translate-x-1";
