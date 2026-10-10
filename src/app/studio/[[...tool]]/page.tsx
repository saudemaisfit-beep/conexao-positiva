import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main
        style={{
          maxWidth: 640,
          margin: "15vh auto",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.6,
        }}
      >
        <h1 style={{ fontSize: 28 }}>Studio por configurar</h1>
        <p>
          Para editar conteúdos, defina <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> e{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> nas variáveis de ambiente (ver{" "}
          <code>docs/fase-13/01-cms.md</code>).
        </p>
      </main>
    );
  }
  return <Studio />;
}
