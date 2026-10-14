import type { StockPhoto } from "@/content/stock-photos";
import { cn } from "@/lib/cn";

/** Crédito de uma fotografia de banco (Unsplash), discreto mas legível sobre fundo escuro. */
export function PhotoCredit({ photo, className }: { photo: StockPhoto; className?: string }) {
  const utm = "?utm_source=conexao_positiva&utm_medium=referral";
  return (
    <p className={cn("text-caption text-on-inverse-muted", className)}>
      Foto:{" "}
      <a
        href={`https://unsplash.com/@${photo.username}${utm}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-on-inverse"
      >
        {photo.author}
      </a>{" "}
      /{" "}
      <a
        href={`https://unsplash.com/${utm}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-on-inverse"
      >
        Unsplash
      </a>
    </p>
  );
}
