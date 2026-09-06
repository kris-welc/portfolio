"use client";

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ArticleStatsContext,
  type ArticleStats,
  type ArticleStatsContextValue,
} from "@/hooks/article-stats-context";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const VIEWS_KEY = "article_views";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>): void {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable
  }
}

async function postView(slug: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/api/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "view" }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { count?: number };
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

export function useArticleStatsState(): ArticleStatsContextValue {
  const [stats, setStats] = useState<Record<string, ArticleStats>>({});
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch(`${API_BASE}/api/stats`)
      .then((res) => res.json())
      .then((data: Record<string, ArticleStats>) => {
        setStats((prev) => {
          const merged: Record<string, ArticleStats> = { ...data };
          for (const [slug, local] of Object.entries(prev)) {
            const remote = data[slug]?.views ?? 0;
            merged[slug] = { views: Math.max(remote, local.views) };
          }
          return merged;
        });
      })
      .catch(() => {});
  }, []);

  const recordView = useCallback((slug: string) => {
    const viewed = readSet(VIEWS_KEY);
    if (viewed.has(slug)) return;
    viewed.add(slug);
    writeSet(VIEWS_KEY, viewed);

    setStats((prev) => ({
      ...prev,
      [slug]: { views: (prev[slug]?.views ?? 0) + 1 },
    }));

    void postView(slug).then((count) => {
      if (count == null) return;
      setStats((prev) => ({
        ...prev,
        [slug]: { views: Math.max(prev[slug]?.views ?? 0, count) },
      }));
    });
  }, []);

  const getStats = useCallback(
    (slug: string): ArticleStats => stats[slug] ?? { views: 0 },
    [stats],
  );

  return useMemo(
    () => ({ recordView, getStats }),
    [recordView, getStats],
  );
}

export function useArticleStats(): ArticleStatsContextValue {
  const ctx = useContext(ArticleStatsContext);
  if (!ctx) {
    throw new Error("useArticleStats must be used within ArticleStatsProvider");
  }
  return ctx;
}
