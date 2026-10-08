import { useTranslations } from "next-intl";
import { mainNav } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

const SUGGESTED = new Set(["solutions", "events", "insights", "contact"]);

export default function NotFound() {
  const t = useTranslations("NotFound");
  const tn = useTranslations("Navigation");
  return (
    <Section>
      <div className="container-site flex max-w-2xl flex-col items-start gap-6">
        <p className="font-display text-display font-extrabold text-primary" aria-hidden="true">
          404
        </p>
        <h1 className="text-h1 font-extrabold">{t("title")}</h1>
        <p className="text-lead text-muted">{t("description")}</p>
        <ul className="flex flex-wrap gap-2">
          {mainNav
            .filter((item) => SUGGESTED.has(item.key))
            .map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-5 text-small font-semibold hover:border-primary hover:text-primary"
                >
                  {tn(item.key)}
                </Link>
              </li>
            ))}
        </ul>
        <ButtonLink href="/">{t("backHome")}</ButtonLink>
      </div>
    </Section>
  );
}
