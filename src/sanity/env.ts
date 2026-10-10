/**
 * Ligação ao Sanity. Valores públicos (identificam o projeto, não dão acesso de escrita).
 * Sem NEXT_PUBLIC_SANITY_PROJECT_ID o site funciona sem CMS (secções vazias ou exemplos).
 */
export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityApiVersion = "2026-09-01";
export const isSanityConfigured = /^[a-z0-9]+$/.test(sanityProjectId);
