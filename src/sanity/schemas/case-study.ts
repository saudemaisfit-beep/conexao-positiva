import { defineArrayMember, defineField, defineType } from "sanity";
import { paragraphsField, serviceOptions, slugField } from "./shared";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Experiência",
  type: "document",
  description: "Projeto real, publicado com autorização do cliente.",
  groups: [
    { name: "main", title: "Principal", default: true },
    { name: "story", title: "História" },
    { name: "media", title: "Imagens e vídeo" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "main",
      validation: (r) => r.required().max(100),
    }),
    { ...slugField(), group: "main" },
    defineField({
      name: "category",
      title: "Tipo de experiência",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Team Building", value: "team-building" },
          { title: "Formação", value: "formacao" },
          { title: "Workshop", value: "workshop" },
          { title: "Evento", value: "evento" },
          { title: "Liderança", value: "lideranca" },
          { title: "Bem-estar", value: "bem-estar" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "client",
      title: "Cliente",
      type: "string",
      group: "main",
      description: 'Só com autorização. Vazio = aparece "Cliente confidencial".',
    }),
    defineField({
      name: "objective",
      title: "Objetivo",
      type: "string",
      group: "main",
      description: "Uma frase.",
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: "services",
      title: "Soluções usadas",
      type: "array",
      group: "main",
      of: [{ type: "string" }],
      options: { list: serviceOptions },
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "sector", title: "Setor", type: "string", group: "main" }),
    defineField({
      name: "participants",
      title: "Participantes",
      type: "number",
      group: "main",
      description: "Número real de participantes.",
      validation: (r) => r.min(1).integer(),
    }),
    defineField({
      name: "format",
      title: "Formato",
      type: "string",
      group: "main",
      options: { list: ["Presencial", "Online", "Híbrido"] },
    }),
    defineField({
      name: "period",
      title: "Data",
      type: "string",
      group: "main",
      description: "Texto livre, ex.: Março de 2026.",
    }),
    defineField({ name: "location", title: "Local", type: "string", group: "main" }),
    { ...paragraphsField("challenge", "O desafio"), group: "story" },
    { ...paragraphsField("solution", "A solução"), group: "story" },
    defineField({
      name: "results",
      title: "Resultados",
      type: "array",
      group: "story",
      description: "Use valores só com números reais, medidos e autorizados.",
      of: [
        defineArrayMember({
          type: "object",
          name: "result",
          title: "Resultado",
          fields: [
            defineField({
              name: "value",
              title: "Valor (opcional)",
              type: "string",
              validation: (r) => r.max(12),
            }),
            defineField({
              name: "text",
              title: "Descrição",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "text", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "testimonial",
      title: "Testemunho",
      type: "reference",
      group: "story",
      to: [{ type: "testimonial" }],
    }),
    defineField({ name: "image", title: "Imagem principal", type: "imageWithAlt", group: "media" }),
    defineField({
      name: "gallery",
      title: "Galeria",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
    defineField({
      name: "video",
      title: "Vídeo",
      type: "object",
      group: "media",
      fields: [
        defineField({
          name: "url",
          title: "Endereço do YouTube ou Vimeo",
          type: "url",
          validation: (rule) =>
            rule.custom((value) =>
              !value || /(youtube\.com|youtu\.be|vimeo\.com)/.test(value)
                ? true
                : "Use um endereço do YouTube ou do Vimeo.",
            ),
        }),
        defineField({ name: "title", title: "Título do vídeo", type: "string" }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Data de publicação",
      type: "datetime",
      group: "main",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Mais recentes",
      name: "publishedAt",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      media,
      subtitle: subtitle || "Cliente confidencial",
    }),
  },
});
