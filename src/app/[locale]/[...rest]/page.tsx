import { notFound } from "next/navigation";

// Qualquer rota desconhecida dentro do locale mostra a 404 com header e rodapé.
export default function CatchAllPage() {
  notFound();
}
