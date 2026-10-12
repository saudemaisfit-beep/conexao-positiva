import { getTranslations } from "next-intl/server";
import { proposalHref } from "@/config/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { DesktopNav } from "./desktop-nav";
import { HeaderShell } from "./header-shell";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
  const t = await getTranslations("Common");
  return (
    <HeaderShell>
      <div className="container-site flex h-(--header-height) items-center gap-2 transition-[height] duration-(--duration-fast) md:gap-3 lg:h-(--header-height-lg) lg:gap-4 lg:group-data-[scrolled=true]/header:h-(--header-height) xl:gap-6">
        <Logo priority />
        <DesktopNav />
        <ButtonLink
          href={proposalHref}
          size="sm"
          variant="glow"
          className="ml-auto max-lg:min-h-11 max-md:px-3.5 lg:ml-0"
        >
          <span className="xl:hidden">{t("proposalShort")}</span>
          <span className="max-xl:hidden">{t("requestProposal")}</span>
        </ButtonLink>
        <MobileMenu />
      </div>
    </HeaderShell>
  );
}
