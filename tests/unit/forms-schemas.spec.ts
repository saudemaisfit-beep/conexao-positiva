import { expect, test } from "@playwright/test";
import { contactSchema, proposalSchema, registrationSchema } from "@/lib/forms/schemas";

const spam = { website: "", startedAt: Date.now() - 10_000, turnstileToken: "" };

const contact = {
  name: "Ana Silva",
  company: "",
  email: "ana@exemplo.ao",
  phone: "+244",
  subject: "informacao",
  message: "Gostaria de saber mais sobre as formações.",
  consent: true,
  ...spam,
};

const proposal = {
  name: "Ana Silva",
  company: "Empresa Exemplo",
  role: "Diretora de RH",
  email: "ana@exemplo.ao",
  phone: "+244 923 000 000",
  service: "palestras",
  participants: "21-50",
  location: "Luanda",
  date: "2027-03-15",
  dateUndecided: false,
  objective: "Fortalecer a comunicação da equipa comercial.",
  details: "",
  consent: true,
  ...spam,
};

const registration = {
  eventSlug: "exemplo-workshop",
  firstName: "Ana",
  lastName: "Silva",
  email: "ana@exemplo.ao",
  phone: "923000000",
  consent: true,
  ...spam,
};

function errors(result: {
  success: boolean;
  error?: { issues: { path: PropertyKey[]; message: string }[] };
}) {
  return Object.fromEntries(
    (result.error?.issues ?? []).map((issue) => [String(issue.path[0]), issue.message]),
  );
}

test.describe("Contacto", () => {
  test("aceita um pedido válido e trata só o indicativo como telefone vazio", () => {
    const result = contactSchema.safeParse(contact);
    expect(result.success).toBe(true);
    expect(result.data?.phone).toBe("");
  });

  test("exige nome, e-mail válido, mensagem com 10+ caracteres e consentimento", () => {
    const result = contactSchema.safeParse({
      ...contact,
      name: "   ",
      email: "nao-e-email",
      message: "curta",
      consent: false,
    });
    expect(errors(result)).toMatchObject({
      name: "required",
      email: "email",
      message: "tooShort",
      consent: "consent",
    });
  });

  test("recusa assuntos fora da lista", () => {
    expect(errors(contactSchema.safeParse({ ...contact, subject: "hack" }))).toMatchObject({
      subject: "required",
    });
  });

  test("remove caracteres de controlo e limita o tamanho", () => {
    const result = contactSchema.safeParse({ ...contact, name: "\u0000Ana\u0007 " });
    expect(result.data?.name).toBe("Ana");
    expect(
      errors(contactSchema.safeParse({ ...contact, message: "a".repeat(3001) })),
    ).toMatchObject({
      message: "tooLong",
    });
  });

  test("campos de uma linha não aceitam mudanças de linha (assunto do e-mail)", () => {
    const result = contactSchema.safeParse({ ...contact, name: "Ana\r\nBcc: alguem@exemplo.ao" });
    expect(result.data?.name).not.toMatch(/[\r\n]/);
    // A mensagem continua a aceitar parágrafos.
    const multi = contactSchema.safeParse({ ...contact, message: "Linha um.\nLinha dois." });
    expect(multi.data?.message).toBe("Linha um.\nLinha dois.");
  });
});

test.describe("Proposta", () => {
  test("aceita um pedido válido", () => {
    expect(proposalSchema.safeParse(proposal).success).toBe(true);
  });

  test("exige data, a não ser que esteja marcada como por definir", () => {
    expect(errors(proposalSchema.safeParse({ ...proposal, date: "" }))).toMatchObject({
      date: "date",
    });
    expect(proposalSchema.safeParse({ ...proposal, date: "", dateUndecided: true }).success).toBe(
      true,
    );
  });

  test("mostra o erro da data mesmo com outros campos inválidos", () => {
    const result = errors(proposalSchema.safeParse({ ...proposal, name: "", date: "" }));
    expect(result).toMatchObject({ name: "required", date: "date" });
  });

  test("valida o telefone: 9 a 15 dígitos", () => {
    expect(errors(proposalSchema.safeParse({ ...proposal, phone: "12345" }))).toMatchObject({
      phone: "phone",
    });
    expect(
      errors(proposalSchema.safeParse({ ...proposal, phone: "+244 9230000000000000" })),
    ).toMatchObject({
      phone: "phone",
    });
    expect(proposalSchema.safeParse({ ...proposal, phone: "+244 923-000-000" }).success).toBe(true);
  });

  test("recusa serviços, participantes e orçamentos fora da lista", () => {
    const result = errors(
      proposalSchema.safeParse({
        ...proposal,
        service: "x",
        participants: "1000",
        budget: "infinito",
      }),
    );
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["service", "participants", "budget"]),
    );
  });
});

test.describe("Inscrição em evento", () => {
  test("aceita uma inscrição válida", () => {
    expect(registrationSchema.safeParse(registration).success).toBe(true);
  });

  test("o identificador do evento só aceita letras minúsculas, números e hífenes", () => {
    for (const eventSlug of ["../admin", "Evento", "a b", "", "x".repeat(121)]) {
      expect(registrationSchema.safeParse({ ...registration, eventSlug }).success).toBe(false);
    }
  });
});
