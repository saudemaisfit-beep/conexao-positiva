"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { VideoSource } from "@/lib/video";

/**
 * Vídeo em "fachada": até a pessoa carregar no botão não é feito nenhum pedido ao YouTube
 * ou ao Vimeo (melhor desempenho e nenhum cookie de terceiros antes de uma ação explícita).
 */
export function VideoEmbed({ source, title }: { source: VideoSource; title: string }) {
  const t = useTranslations("Experiences.detail");
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-inverse">
        {playing ? (
          <iframe
            src={source.embedUrl}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            data-surface="inverse"
            className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 p-6 text-center text-on-inverse"
          >
            <span className="grid size-18 place-items-center rounded-full bg-white text-primary-strong shadow-lg transition-transform duration-(--duration-fast) group-hover:scale-105">
              <Play aria-hidden="true" className="size-7 translate-x-0.5" fill="currentColor" />
            </span>
            <span className="max-w-md font-semibold">{t("playVideo", { title })}</span>
          </button>
        )}
      </div>
      <p className="text-small text-muted">{t("videoNotice", { provider: source.provider })}</p>
    </div>
  );
}
