import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("Common");
  return (
    <a
      href="#conteudo"
      className="sr-only z-(--z-toast) rounded-full bg-primary px-5 py-3 font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      {t("skipToContent")}
    </a>
  );
}
