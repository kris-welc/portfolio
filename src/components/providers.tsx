"use client";

import type { ReactNode } from "react";
import { ArticleStatsContext } from "@/hooks/article-stats-context";
import { useArticleStatsState } from "@/hooks/use-article-stats";

export function ArticleStatsProvider({ children }: { readonly children: ReactNode }) {
  const value = useArticleStatsState();
  return (
    <ArticleStatsContext.Provider value={value}>
      {children}
    </ArticleStatsContext.Provider>
  );
}

export function Providers({ children }: { readonly children: ReactNode }) {
  return <ArticleStatsProvider>{children}</ArticleStatsProvider>;
}
