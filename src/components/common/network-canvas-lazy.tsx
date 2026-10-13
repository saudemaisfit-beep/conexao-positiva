"use client";

import dynamic from "next/dynamic";

/** A rede de pontos é decorativa: carregada à parte, fora do JavaScript inicial da página. */
export const NetworkCanvas = dynamic(
  () => import("./network-canvas").then((module) => module.NetworkCanvas),
  { ssr: false },
);
