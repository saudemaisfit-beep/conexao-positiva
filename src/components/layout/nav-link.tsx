"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Link de navegação com estado ativo (aria-current) calculado a partir do URL. */
export function NavLink({
  href,
  className,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-active={active}
      className={cn(className)}
      {...props}
    />
  );
}
