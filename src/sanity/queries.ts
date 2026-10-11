/**
 * Consultas GROQ. Cada consulta devolve os campos já com os nomes usados pelos modelos do site;
 * a conversão final (parágrafos, imagens, Portable Text) está em ./mappers.ts.
 */

const image = `{
  alt,
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const person = `{ name, role, bio, linkedin, "photo": photo${image} }`;

const testimonial = `{ quote, name, role, company, services, featured, authorized, "photo": photo${image} }`;

export const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  phone, email, location, whatsappNumber, whatsappMessage, social[]{ network, url }
}`;

export const aboutQuery = `*[_id == "aboutPage"][0]{
  history[]{ year, title, text },
  founder${person},
  team[]${person}
}`;

export const impactStatsQuery = `*[_type == "impactStat" && publish == true] | order(order asc){ value, label }`;

export const clientLogosQuery = `*[_type == "clientLogo" && authorized == true] | order(order asc){
  name, url, "logo": logo${image}
}`;

export const testimonialsQuery = `*[_type == "testimonial" && authorized == true] | order(_createdAt desc)${testimonial}`;

export const eventsQuery = `*[_type == "event" && defined(slug.current)] | order(startsAt asc){
  "slug": slug.current, title, category, startsAt, endsAt, location, priceKz, capacity, status,
  summary, description,
  program[]{ time, activity },
  facilitator${person},
  faq[]{ question, answer },
  "image": image${image},
  "gallery": gallery[]${image}
}`;

export const caseStudiesQuery = `*[_type == "caseStudy" && defined(slug.current)]
  | order(coalesce(publishedAt, _createdAt) desc){
  "slug": slug.current, title, client, category, objective, services,
  sector, participants, format, period, location, challenge, solution,
  results[]{ value, text },
  video{ url, title },
  "testimonial": testimonial->${testimonial},
  "image": image${image},
  "gallery": gallery[]${image}
}`;

export const articlesQuery = `*[_type == "article" && defined(slug.current) && defined(author)]
  | order(publishedAt desc){
  "slug": slug.current, title, excerpt, category, publishedAt, updatedAt,
  "author": author->${person},
  "image": image${image},
  body[]{
    _type, style, listItem,
    "plain": select(_type == "block" => pt::text(@)),
    title, text, caption, alt,
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
}`;

/** Etiquetas de cache por tipo de documento (invalidadas pelo webhook). */
export const tags = {
  settings: ["siteSettings"],
  about: ["aboutPage"],
  stats: ["impactStat"],
  clients: ["clientLogo"],
  testimonials: ["testimonial"],
  events: ["event"],
  cases: ["caseStudy", "testimonial"],
  articles: ["article", "author"],
} as const;
