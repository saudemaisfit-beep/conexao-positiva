import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import symbol from "../../../public/brand/conexao-positiva/conexao-positiva-simbolo.png";

/**
 * Composição PROVISÓRIA: símbolo oficial + nome em Manrope 800,
 * até ser fornecido o logótipo oficial com o nome (ver docs/fase-03).
 */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-sm font-display text-[0.9375rem] leading-none font-extrabold tracking-[-0.01em] md:gap-2.5 md:text-[1.0625rem]",
        className,
      )}
    >
      <Image
        src={symbol}
        alt=""
        width={36}
        height={36}
        priority={priority}
        className="size-8 md:size-9"
      />
      {/* Abaixo de 360px o nome passa a duas linhas para caber o menu (reflow a 320px). */}
      <span className="max-[22.5rem]:w-min">Conexão Positiva</span>
    </Link>
  );
}
