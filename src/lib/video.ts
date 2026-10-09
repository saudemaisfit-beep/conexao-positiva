export interface VideoSource {
  provider: "YouTube" | "Vimeo";
  embedUrl: string;
}

/**
 * Converte um URL público do YouTube ou do Vimeo no endereço de incorporação com menos
 * rastreio (youtube-nocookie.com, Vimeo com dnt=1). Devolve null para outros endereços.
 */
export function parseVideoUrl(raw: string): VideoSource | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  let youtubeId: string | null = null;
  if (host === "youtu.be") youtubeId = url.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    youtubeId =
      url.searchParams.get("v") ??
      url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ??
      null;
  }
  if (youtubeId && /^[\w-]{11}$/.test(youtubeId)) {
    return {
      provider: "YouTube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const vimeoId = url.pathname.match(/(?:^|\/)(\d{6,})(?:\/|$)/)?.[1];
    if (vimeoId) {
      return {
        provider: "Vimeo",
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&dnt=1`,
      };
    }
  }
  return null;
}
