import { ptPTLocale } from "@sanity/locale-pt-pt";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityApiVersion, sanityDataset, sanityProjectId } from "./env";
import { schemaTypes, singletonTypes } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  name: "conexao-positiva",
  title: "Conexão Positiva",
  basePath: "/studio",
  projectId: sanityProjectId || "sem-projeto",
  dataset: sanityDataset,
  plugins: [
    structureTool({ structure }),
    // Consola GROQ só em desenvolvimento.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: sanityApiVersion })]
      : []),
    ptPTLocale(),
  ],
  schema: {
    types: schemaTypes,
    // Documentos únicos não aparecem em "Criar novo".
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(
            ({ action }) => action && ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions,
  },
});
