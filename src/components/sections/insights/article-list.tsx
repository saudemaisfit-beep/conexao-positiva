"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ArticleSummary } from "@/content/types";
import { ArticleGrid, paginate } from "./article-grid";

/** Versão interativa da grelha: lê ?pagina e, ao carregar mais, foca o primeiro artigo novo. */
export function ArticleList({
  articles,
  basePath,
}: {
  articles: ArticleSummary[];
  basePath: string;
}) {
  const params = useSearchParams();
  const listRef = useRef<HTMLUListElement>(null);
  const requested = Number.parseInt(params.get("pagina") ?? "1", 10);
  const shown = paginate(articles, requested).visible.length;
  const previousCount = useRef(shown);

  useEffect(() => {
    if (shown > previousCount.current) {
      listRef.current?.children[previousCount.current]?.querySelector("a")?.focus();
    }
    previousCount.current = shown;
  }, [shown]);

  return <ArticleGrid articles={articles} page={requested} basePath={basePath} listRef={listRef} />;
}
