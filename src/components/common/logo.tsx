import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import logo from "../../../public/brand/conexao-positiva/conexao-positiva-oficial-horizontal.png";

/** Composição compacta com o símbolo e o lettering do logótipo oficial. */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Conexão Positiva — página inicial"
      className={cn("inline-flex min-h-11 shrink-0 items-center rounded-sm", className)}
    >
      <Image
        src={logo}
        alt="Conexão Positiva"
        priority={priority}
        sizes="(min-width: 768px) 192px, 144px"
        className="h-auto w-36 md:w-48"
      />
    </Link>
  );
}
