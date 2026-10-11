"use client";

import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "cp:url-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * Parâmetros do endereço (filtros, paginação) sem `Suspense`. No servidor e na hidratação
 * devolve "sem parâmetros", por isso a vista por defeito vem no HTML e é reaproveitada: não
 * há troca de elementos (o que adiaria o LCP) nem saltos de layout. Depois da hidratação,
 * se o endereço tiver filtros, a vista atualiza-se.
 *
 * `navigate` usa a History API nativa (integrada no router do Next.js): cada mudança fica
 * no histórico do browser ("voltar") sem pedir a página de novo ao servidor.
 */
export function useUrlSearch() {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const navigate = useCallback((query: URLSearchParams) => {
    const value = query.toString();
    window.history.pushState(null, "", `${window.location.pathname}${value ? `?${value}` : ""}`);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  return { params: new URLSearchParams(search), navigate };
}
