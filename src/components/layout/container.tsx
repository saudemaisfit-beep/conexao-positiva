import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = { as?: T } & Omit<ComponentProps<T>, "as">;

export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component className={cn("container-site", className)} {...props} />;
}
