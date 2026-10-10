import "server-only";
import {
  present,
  toImage,
  toTestimonial,
  type RawImage,
  type RawTestimonial,
} from "@/sanity/mappers";
import { sanityFetch } from "@/sanity/fetch";
import { clientLogosQuery, impactStatsQuery, tags, testimonialsQuery } from "@/sanity/queries";
import type { ClientLogo, ImpactStat, Testimonial } from "./types";

/**
 * Prova social publicada no Sanity: só números marcados "Publicar" e clientes e testemunhos
 * com autorização confirmada. Sem CMS devolve listas vazias (as secções não aparecem).
 */
export async function getImpactStats(): Promise<ImpactStat[]> {
  const raw = await sanityFetch<{ value?: string | null; label?: string | null }[]>(
    impactStatsQuery,
    [...tags.stats],
  );
  return (raw ?? []).flatMap((stat) =>
    stat.value && stat.label ? [{ value: stat.value, label: stat.label }] : [],
  );
}

export async function getClientLogos(): Promise<ClientLogo[]> {
  const raw = await sanityFetch<
    { name?: string | null; url?: string | null; logo?: RawImage | null }[]
  >(clientLogosQuery, [...tags.clients]);
  return (raw ?? []).flatMap((client) =>
    client.name
      ? [{ name: client.name, url: client.url ?? undefined, logo: toImage(client.logo) }]
      : [],
  );
}

/** Testemunhos de uma solução, ou os marcados "Mostrar na Home" (com recurso aos mais recentes). */
export async function getTestimonials(filter: { service?: string; home?: boolean } = {}) {
  const raw =
    (await sanityFetch<RawTestimonial[]>(testimonialsQuery, [...tags.testimonials])) ?? [];
  let selected = raw;
  if (filter.service) selected = raw.filter((item) => item.services?.includes(filter.service!));
  if (filter.home) {
    const featured = raw.filter((item) => item.featured);
    selected = featured.length > 0 ? featured : raw;
  }
  return selected.map(toTestimonial).filter(present) satisfies Testimonial[];
}
