"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const VIEWS_KEY = "article_views";

interface ArticleStats {
  readonly views: number;
}

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

async function postView(slug: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "view" }),
    });
  } catch {
    // silently degrade
  }
}

export function useArticleStats() {
  const [stats, setStats] = useState<Record<string, ArticleStats>>({});
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch(`${API_BASE}/api/stats`)
      .then((res) => res.json())
      .then((data: Record<string, ArticleStats>) => setStats(data))
      .catch(() => {});
  }, []);

  const recordView = useCallback((slug: string) => {
    const viewed = readSet(VIEWS_KEY);
    if (viewed.has(slug)) return;
    viewed.add(slug);
    writeSet(VIEWS_KEY, viewed);
    postView(slug);
    setStats((prev) => ({
      ...prev,
      [slug]: {
        views: (prev[slug]?.views ?? 0) + 1,
      },
    }));
  }, []);

  const getStats = useCallback(
    (slug: string): ArticleStats => stats[slug] ?? { views: 0 },
    [stats],
  );

  return { recordView, getStats } as const;
}
