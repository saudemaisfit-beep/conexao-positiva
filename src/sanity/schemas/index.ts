import { article, author } from "./article";
import { caseStudy } from "./case-study";
import { event } from "./event";
import { clientLogo, impactStat, testimonial } from "./proof";
import { aboutPage, siteSettings } from "./settings";
import { faqItem, imageWithAlt, person } from "./shared";

export const schemaTypes = [
  // Documentos únicos
  siteSettings,
  aboutPage,
  // Coleções
  event,
  caseStudy,
  article,
  author,
  testimonial,
  clientLogo,
  impactStat,
  // Objetos reutilizáveis
  imageWithAlt,
  person,
  faqItem,
];

/** Documentos com uma única instância (sem "criar novo" nem "duplicar"). */
export const singletonTypes = new Set(["siteSettings", "aboutPage"]);
