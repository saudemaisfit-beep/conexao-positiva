import { useTranslations } from "next-intl";
import { siteConfig, whatsappHref } from "@/config/site";
import { Link } from "@/i18n/navigation";
import type { FormResult } from "@/lib/forms/schemas";
import { FormAlert } from "./form-feedback";

type ServerError = Exclude<FormResult, { ok: true }>["error"];

/** Erro do servidor com alternativas de contacto (só as que existem). */
export function ServerError({ error }: { error: ServerError }) {
  const t = useTranslations("Forms");
  if (error === "validation") return null;
  const { phone, email } = siteConfig.contact;
  const whatsapp = siteConfig.whatsapp.number;
  const showAlternatives =
    (error === "unavailable" || error === "server") && (phone || email || whatsapp);

  return (
    <FormAlert title={t(`server.${error}.title`)}>
      <p>{t(`server.${error}.text`)}</p>
      {error === "closed" && (
        <p className="mt-2">
          <Link href="/eventos" className="font-semibold text-primary underline underline-offset-2">
            {t("seeEvents")}
          </Link>
        </p>
      )}
      {showAlternatives && (
        <div className="mt-3 flex flex-col gap-1">
          <p>{t("alternatives")}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-semibold">
            {whatsapp && (
              <li>
                <a
                  href={whatsappHref(whatsapp, siteConfig.whatsapp.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-primary underline underline-offset-2"
                >
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="text-primary underline underline-offset-2">
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </FormAlert>
  );
}
