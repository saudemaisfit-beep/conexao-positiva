import { z } from "zod";
import { budgetRanges, contactSubjects, participantRanges, proposalServices } from "./options";

/**
 * Esquemas partilhados entre o browser (React Hook Form) e o servidor (Server Actions).
 * As mensagens de erro são CHAVES de tradução (Forms.errors.*), não texto final.
 */

// Remove caracteres de controlo (exceto mudança de linha) e espaços nas pontas.
const clean = (value: string) => value.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim();

const text = (max: number) => z.string().transform(clean).pipe(z.string().max(max, "tooLong"));
const required = (max: number) =>
  z.string().transform(clean).pipe(z.string().min(1, "required").max(max, "tooLong"));
const optional = (max: number) => text(max).optional().default("");

const email = z
  .string()
  .transform(clean)
  .pipe(z.string().min(1, "required").max(254, "tooLong").pipe(z.email("email")));

// Indicativo opcional (+244 por defeito no formulário) e 9 a 15 dígitos.
const phonePattern = /^\+?[\d\s().-]{9,20}$/;
const phoneDigits = (value: string) => value.replace(/\D/g, "").length;
const isPhone = (value: string) =>
  phonePattern.test(value) && phoneDigits(value) >= 9 && phoneDigits(value) <= 15;
const phone = z
  .string()
  .transform(clean)
  .pipe(z.string().min(1, "required").refine(isPhone, "phone"));
// Só o indicativo (ex.: "+244") conta como vazio.
const optionalPhone = z
  .string()
  .transform(clean)
  .transform((value) => (/^\+?\d{0,4}$/.test(value.replace(/\s/g, "")) ? "" : value))
  .pipe(z.string().refine((value) => value === "" || isPhone(value), "phone"))
  .optional()
  .default("");

const consent = z.literal(true, "consent");

/** Campos anti-spam: isco que só robôs preenchem e momento em que o formulário foi aberto. */
export const spamFields = {
  website: z.string().optional().default(""),
  startedAt: z.number().int().nonnegative(),
};

export const contactSchema = z.object({
  name: required(120),
  company: optional(120),
  email,
  phone: optionalPhone,
  subject: z.enum(contactSubjects, "required"),
  message: required(3000).pipe(z.string().min(10, "tooShort")),
  consent,
  ...spamFields,
});

export const proposalSchema = z
  .object({
    name: required(120),
    company: required(120),
    role: required(120),
    email,
    phone,
    service: z.enum(proposalServices, "required"),
    participants: z.enum(participantRanges, "required"),
    location: required(160),
    date: z.string().optional().default(""),
    dateUndecided: z.boolean().optional().default(false),
    objective: required(2000).pipe(z.string().min(10, "tooShort")),
    budget: z.enum(budgetRanges).optional(),
    details: optional(3000),
    consent,
    ...spamFields,
  })
  // Corre mesmo com outros campos inválidos, para mostrar todos os erros de uma vez.
  .refine((data) => data.dateUndecided || /^\d{4}-\d{2}-\d{2}$/.test(data.date ?? ""), {
    path: ["date"],
    message: "date",
    when: () => true,
  });

export const registrationSchema = z.object({
  eventSlug: z.string().regex(/^[a-z0-9-]{1,120}$/),
  firstName: required(80),
  lastName: required(80),
  email,
  phone,
  company: optional(120),
  role: optional(120),
  notes: optional(1000),
  consent,
  ...spamFields,
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ProposalInput = z.input<typeof proposalSchema>;
export type ProposalData = z.output<typeof proposalSchema>;
export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationData = z.output<typeof registrationSchema>;

/** Resultado devolvido pelas Server Actions. */
export type FormResult =
  | { ok: true; redirectTo: string }
  | {
      ok: false;
      error: "validation" | "rate-limit" | "closed" | "unavailable" | "server";
      fieldErrors?: Record<string, string>;
    };
