import "server-only";
import { headers } from "next/headers";

/** IP do visitante (primeiro endereço de x-forwarded-for, definido pelo proxy do alojamento). */
export async function clientIp() {
  const list = await headers();
  return (
    list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "desconhecido"
  );
}
