"use client";

import { NextStudio } from "next-sanity/studio/client-component";
import config from "@/sanity/config";

/** O Studio corre só no browser (a configuração importa a interface do Sanity). */
export function Studio() {
  return <NextStudio config={config} />;
}
