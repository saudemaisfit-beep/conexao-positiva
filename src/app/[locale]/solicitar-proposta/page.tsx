import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { getHomeContent } from "@/content/home";
import { isProposalService } from "@/lib/forms/options";
import { ProposalForm } from "@/components/forms/proposal-form";
import { ClientLogos } from "@/components/sections/client-logos";
import { FormPageHeader } from "@/components/sections/forms/form-page-header";
import { NextSteps } from "@/components/sections/forms/next-steps";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ servico?: string | string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Proposal" });
  return pageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: proposalHref,
  });
}

export default async function ProposalPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Proposal");
  const requested = (await searchParams).servico;
  const service =
    typeof requested === "string" && isProposalService(requested) ? requested : undefined;
  const { clients } = await getHomeContent();

  return (
    <>
      <FormPageHeader
        title={t("title")}
        lead={t("lead")}
        breadcrumbs={[{ label: t("breadcrumb"), href: proposalHref }]}
      />
      <section aria-labelledby="page-title" className="pt-10 pb-(--space-section) md:pt-14">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <div className="rounded-xl border border-border bg-surface-raised p-5 md:p-10">
            <ProposalForm service={service} />
          </div>
          <div className="flex flex-col gap-8 self-start rounded-xl bg-surface p-6 md:p-8 lg:sticky lg:top-28">
            <NextSteps />
            <p className="flex items-start gap-3 border-t border-border pt-6 text-small text-muted">
              <ShieldCheck aria-hidden="true" className="size-5 shrink-0 text-primary" />
              {t("privacy")}
            </p>
          </div>
        </div>
      </section>
      <ClientLogos clients={clients} />
    </>
  );
}
