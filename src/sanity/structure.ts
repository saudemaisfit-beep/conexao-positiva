import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

/** Menu do Studio: definições primeiro, depois conteúdos pela ordem do site. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Conteúdos")
    .items([
      singleton(S, "siteSettings", "Definições do site"),
      singleton(S, "aboutPage", "Página Sobre Nós"),
      S.divider(),
      S.documentTypeListItem("event").title("Eventos"),
      S.documentTypeListItem("caseStudy").title("Experiências"),
      S.documentTypeListItem("article").title("Artigos"),
      S.documentTypeListItem("author").title("Autores"),
      S.divider(),
      S.documentTypeListItem("testimonial").title("Testemunhos"),
      S.documentTypeListItem("clientLogo").title("Clientes e parceiros"),
      S.documentTypeListItem("impactStat").title("Números de impacto"),
    ]);
