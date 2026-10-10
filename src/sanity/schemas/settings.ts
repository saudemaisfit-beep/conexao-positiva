import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Definições do site",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Telefone",
      type: "string",
      description: "Com indicativo, ex.: +244 923 000 000. Vazio = não é mostrado.",
    }),
    defineField({ name: "email", title: "E-mail", type: "string", validation: (r) => r.email() }),
    defineField({
      name: "location",
      title: "Localização",
      type: "string",
      description: "Ex.: Luanda, Angola.",
    }),
    defineField({
      name: "whatsappNumber",
      title: "Número de WhatsApp",
      type: "string",
      description:
        "Formato internacional, só dígitos (ex.: 244923000000). Vazio = sem botão de WhatsApp.",
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^\d{9,15}$/.test(value) ? true : "Use só dígitos, com o indicativo do país.",
        ),
    }),
    defineField({
      name: "whatsappMessage",
      title: "Mensagem inicial do WhatsApp",
      type: "string",
      initialValue: "Olá! Gostaria de saber mais sobre as soluções da Conexão Positiva.",
    }),
    defineField({
      name: "social",
      title: "Redes sociais",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          title: "Rede social",
          fields: [
            defineField({
              name: "network",
              title: "Rede",
              type: "string",
              options: { list: ["Instagram", "LinkedIn", "Facebook", "YouTube"] },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "Endereço",
              type: "url",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "network", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Definições do site" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "Página Sobre Nós",
  type: "document",
  fields: [
    defineField({
      name: "history",
      title: "História (marcos)",
      type: "array",
      description: "3 a 5 marcos, do mais antigo para o mais recente.",
      validation: (r) => r.max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "milestone",
          title: "Marco",
          fields: [
            defineField({
              name: "year",
              title: "Ano",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "text",
              title: "Frase",
              type: "text",
              rows: 2,
              validation: (r) => r.required().max(220),
            }),
          ],
          preview: { select: { title: "title", subtitle: "year" } },
        }),
      ],
    }),
    defineField({ name: "founder", title: "Fundador(a)", type: "person" }),
    defineField({
      name: "team",
      title: "Equipa",
      type: "array",
      of: [defineArrayMember({ type: "person" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Página Sobre Nós" }) },
});
