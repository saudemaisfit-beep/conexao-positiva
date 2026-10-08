import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclui API, Sanity Studio, ficheiros internos do Next.js e ficheiros com extensão.
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
