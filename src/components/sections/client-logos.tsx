import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ClientLogo } from "@/content/types";
import { Section } from "@/components/layout/section";

/** Logótipos de clientes (com autorização), em caixas iguais e sem distorção. */
export async function ClientLogos({ clients }: { clients: ClientLogo[] }) {
  if (clients.length === 0) return null;
  const t = await getTranslations("Home.clients");
  return (
    <Section aria-labelledby="clients-title" className="py-16 md:py-20">
      <div className="container-site flex flex-col gap-10">
        <h2 id="clients-title" className="mx-auto max-w-2xl text-center text-h4 font-bold">
          {t("title")}
        </h2>
        <ul className="grid grid-cols-3 gap-3 md:gap-5 lg:grid-cols-6">
          {clients.slice(0, 12).map((client) => (
            <li
              key={client.name}
              className="relative grid aspect-[3/2] reveal place-items-center rounded-md border border-border bg-surface-raised p-4"
            >
              {client.logo ? (
                <Image
                  src={client.logo.src}
                  alt={client.name}
                  fill
                  sizes="(min-width: 1024px) 180px, 30vw"
                  className="object-contain p-5 opacity-80 grayscale transition duration-(--duration-fast) hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <span className="text-center text-caption font-semibold text-muted">
                  {client.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
