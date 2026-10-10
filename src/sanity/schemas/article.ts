import { defineArrayMember, defineField, defineType } from "sanity";
import { slugField } from "./shared";

export const author = defineType({
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Cargo", type: "string", validation: (r) => r.required() }),
    defineField({ name: "bio", title: "Biografia", type: "text", rows: 3 }),
    defineField({ name: "photo", title: "Fotografia", type: "imageWithAlt" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const article = defineType({
  name: "article",
  title: "Artigo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required().max(110),
    }),
    slugField(),
    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Liderança", value: "lideranca" },
          { title: "Equipas", value: "equipas" },
          { title: "Bem-estar", value: "bem-estar" },
          { title: "Método C.E.N.T.R.O.", value: "metodo-centro" },
          { title: "Desenvolvimento pessoal", value: "desenvolvimento-pessoal" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Introdução",
      type: "text",
      rows: 3,
      description: "Uma ou duas frases. Aparece nos cards, no topo do artigo e no Google.",
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Data de publicação",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Atualizado em",
      type: "datetime",
      description: "Preencher só quando o conteúdo mudar de forma relevante.",
    }),
    defineField({ name: "image", title: "Imagem principal", type: "imageWithAlt" }),
    defineField({
      name: "body",
      title: "Conteúdo",
      type: "array",
      validation: (r) => r.required(),
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Parágrafo", value: "normal" },
            { title: "Título", value: "h2" },
            { title: "Subtítulo", value: "h3" },
            { title: "Citação", value: "blockquote" },
          ],
          lists: [
            { title: "Lista", value: "bullet" },
            { title: "Lista numerada", value: "number" },
          ],
          marks: { decorators: [], annotations: [] },
        }),
        defineArrayMember({
          type: "image",
          name: "articleImage",
          title: "Imagem",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              validation: (r) => r.required().error("O texto alternativo é obrigatório."),
            }),
            defineField({ name: "caption", title: "Legenda", type: "string" }),
          ],
        }),
        defineArrayMember({
          type: "object",
          name: "callout",
          title: "Destaque",
          fields: [
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({
              name: "text",
              title: "Texto",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Mais recentes",
      name: "publishedAt",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});
