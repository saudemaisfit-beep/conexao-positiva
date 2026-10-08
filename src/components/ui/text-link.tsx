import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { arrowClassName } from "./button";

/** Link de texto com seta ("Ver todas…", "Saber mais"). */
export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline decoration-transparent decoration-[1.5px] underline-offset-4 transition-colors hover:decoration-current in-data-[surface=inverse]:text-on-inverse",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight aria-hidden="true" className={cn("size-4", arrowClassName)} />
    </Link>
  );
}
