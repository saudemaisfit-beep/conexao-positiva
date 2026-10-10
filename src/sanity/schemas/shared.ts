import { defineField, defineType } from "sanity";
import { services } from "@/config/navigation";

/** Imagem com texto alternativo obrigatório (acessibilidade e SEO). */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Imagem",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description:
        'Descreva o que a imagem mostra, para quem não a consegue ver (ex.: "Participantes a conversar em grupo durante um workshop").',
      validation: (rule) => rule.required().error("O texto alternativo é obrigatório."),
    }),
  ],
});

/** Pessoa (fundador(a), equipa, facilitação). */
export const person = defineType({
  name: "person",
  title: "Pessoa",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Cargo", type: "string", validation: (r) => r.required() }),
    defineField({ name: "bio", title: "Biografia", type: "text", rows: 4 }),
    defineField({
      name: "photo",
      title: "Fotografia",
      type: "imageWithAlt",
      description: "Só com autorização da pessoa.",
    }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const faqItem = defineType({
  name: "faqItem",
  title: "Pergunta frequente",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Pergunta",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "answer",
      title: "Resposta",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "question" } },
});

/** Lista de soluções (as 8 páginas de serviço). */
export const serviceOptions = services.map((service) => ({
  title: service.name,
  value: service.slug,
}));

/** Campo de slug com regra comum: gerado a partir do título, só letras minúsculas, números e hífenes. */
export const slugField = (source = "title") =>
  defineField({
    name: "slug",
    title: "Endereço (URL)",
    type: "slug",
    description:
      "Gerado a partir do título. Evite alterar depois de publicar (os links deixam de funcionar).",
    options: { source, maxLength: 96 },
    validation: (rule) =>
      rule
        .required()
        .custom((value) =>
          value?.current && !/^[a-z0-9-]+$/.test(value.current)
            ? "Use apenas letras minúsculas sem acentos, números e hífenes."
            : true,
        ),
  });

/** Texto em parágrafos (separados por uma linha em branco). */
export const paragraphsField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 6,
    description: description ?? "Separe os parágrafos com uma linha em branco.",
    validation: (rule) => rule.required(),
  });
