"use client";

import { createContext } from "react";

export interface ArticleStats {
  readonly views: number;
}

export interface ArticleStatsContextValue {
  readonly recordView: (slug: string) => void;
  readonly getStats: (slug: string) => ArticleStats;
}

export const ArticleStatsContext = createContext<ArticleStatsContextValue | null>(null);
