import type { ReactNode } from "react";

/** Layout raiz próprio do Studio (fora de [locale]: sem header, rodapé nem estilos do site). */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
