import { defineField, defineType } from "sanity";
import { serviceOptions } from "./shared";

const authorization = (what: string) =>
  defineField({
    name: "authorized",
    title: "Autorização confirmada",
    type: "boolean",
    description: `Marque apenas quando existir autorização escrita para publicar ${what}. Sem esta marca, não aparece no site.`,
    initialValue: false,
  });

export const impactStat = defineType({
  name: "impactStat",
  title: "Número de impacto",
  type: "document",
  description: "Só números reais e verificáveis.",
  fields: [
    defineField({
      name: "value",
      title: "Valor",
      type: "string",
      description: "Ex.: 120, +3 000, 15 anos.",
      validation: (r) => r.required().max(12),
    }),
    defineField({
      name: "label",
      title: "Rótulo",
      type: "string",
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "publish",
      title: "Publicar",
      type: "boolean",
      description: "Marque depois de confirmar que o número é real e atual.",
      initialValue: false,
    }),
    defineField({ name: "order", title: "Ordem", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Ordem", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const clientLogo = defineType({
  name: "clientLogo",
  title: "Cliente / parceiro",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nome da organização",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "logo",
      title: "Logótipo",
      type: "imageWithAlt",
      description: "De preferência SVG ou PNG com fundo transparente.",
    }),
    defineField({ name: "url", title: "Site", type: "url" }),
    authorization("o nome e o logótipo"),
    defineField({ name: "order", title: "Ordem", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", media: "logo", authorized: "authorized" },
    prepare: ({ title, media, authorized }) => ({
      title,
      media,
      subtitle: authorized ? "Publicado" : "Sem autorização (oculto)",
    }),
  },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testemunho",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Testemunho",
      type: "text",
      rows: 4,
      validation: (r) => r.required().max(600),
    }),
    defineField({ name: "name", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Cargo", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "company",
      title: "Empresa",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "photo", title: "Fotografia", type: "imageWithAlt" }),
    defineField({
      name: "services",
      title: "Soluções relacionadas",
      type: "array",
      of: [{ type: "string" }],
      options: { list: serviceOptions },
      description: "O testemunho aparece nas páginas destas soluções.",
    }),
    defineField({
      name: "featured",
      title: "Mostrar na Home",
      type: "boolean",
      initialValue: false,
    }),
    authorization("o testemunho, o nome e a fotografia"),
  ],
  preview: { select: { title: "name", subtitle: "company", media: "photo" } },
});
