import { ArrowRight, CircleCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/** Estrutura das páginas de confirmação: ícone, título, texto e conteúdo seguinte. */
export function Confirmation({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="pt-10 pb-(--space-section) md:pt-16">
      <div className="container-site flex max-w-3xl flex-col gap-10">
        <div className="flex flex-col items-start gap-5">
          <span className="grid size-16 animate-rise-in place-items-center rounded-full bg-success-soft text-success">
            <CircleCheck aria-hidden="true" className="size-8" strokeWidth={1.75} />
          </span>
          <h1 id="page-title" className="text-h1 font-extrabold text-balance">
            {title}
          </h1>
          <p className="text-lead text-muted">{text}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Ligações para continuar a navegar depois de uma confirmação. */
export function ExploreLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-4 border-t border-border pt-8">
      <p className="eyebrow">{title}</p>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center justify-between gap-4 border-b border-border py-4 font-semibold hover:text-primary"
            >
              {link.label}
              <ArrowRight
                aria-hidden="true"
                className="size-5 text-primary transition-transform duration-(--duration-fast) group-hover:translate-x-1"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
