import { defineArrayMember, defineField, defineType } from "sanity";
import { paragraphsField, slugField } from "./shared";

export const event = defineType({
  name: "event",
  title: "Evento",
  type: "document",
  groups: [
    { name: "main", title: "Principal", default: true },
    { name: "content", title: "Conteúdo" },
    { name: "media", title: "Imagens" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nome do evento",
      type: "string",
      group: "main",
      validation: (r) => r.required().max(90),
    }),
    { ...slugField(), group: "main" },
    defineField({
      name: "category",
      title: "Tipo",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Workshop", value: "workshop" },
          { title: "Formação", value: "formacao" },
          { title: "Palestra", value: "palestra" },
          { title: "Experiência", value: "experiencia" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "startsAt",
      title: "Início",
      type: "datetime",
      group: "main",
      description: "Hora de Luanda.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Fim",
      type: "datetime",
      group: "main",
      validation: (rule) =>
        rule.custom((value, context) => {
          const start = (context.document as { startsAt?: string } | undefined)?.startsAt;
          return value && start && value <= start ? "O fim tem de ser depois do início." : true;
        }),
    }),
    defineField({
      name: "location",
      title: "Local",
      type: "string",
      group: "main",
      description: "Nome do espaço e cidade.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "priceKz",
      title: "Preço (Kz)",
      type: "number",
      group: "main",
      description: "Vazio = gratuito.",
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "capacity",
      title: "Lotação",
      type: "number",
      group: "main",
      description:
        'Número de vagas. Vazio = sem limite. Quando as vagas acabam, o site passa a "Esgotado" e abre a lista de espera automaticamente.',
      validation: (r) => r.min(1).integer(),
    }),
    defineField({
      name: "status",
      title: "Estado das inscrições",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Aberto", value: "aberto" },
          { title: "Últimas vagas (manual)", value: "ultimas-vagas" },
          { title: "Esgotado (lista de espera)", value: "esgotado" },
          { title: "Encerrado", value: "encerrado" },
        ],
        layout: "radio",
      },
      initialValue: "aberto",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Resumo",
      type: "text",
      rows: 2,
      group: "content",
      description: "Uma ou duas frases (cards e Google).",
      validation: (r) => r.required().max(200),
    }),
    { ...paragraphsField("description", "Descrição"), group: "content" },
    defineField({
      name: "program",
      title: "Programa",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "programItem",
          title: "Momento",
          fields: [
            defineField({
              name: "time",
              title: "Hora",
              type: "string",
              description: "Ex.: 09:00",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "activity",
              title: "Atividade",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "activity", subtitle: "time" } },
        }),
      ],
    }),
    defineField({ name: "facilitator", title: "Facilitação", type: "person", group: "content" }),
    defineField({
      name: "faq",
      title: "Perguntas frequentes",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "faqItem" })],
    }),
    defineField({ name: "image", title: "Imagem principal", type: "imageWithAlt", group: "media" }),
    defineField({
      name: "gallery",
      title: "Galeria",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
  ],
  orderings: [{ title: "Data", name: "startsAt", by: [{ field: "startsAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", date: "startsAt", media: "image" },
    prepare: ({ title, date, media }) => ({
      title,
      media,
      subtitle: date
        ? new Date(date).toLocaleDateString("pt-PT", { timeZone: "Africa/Luanda" })
        : "Sem data",
    }),
  },
});
