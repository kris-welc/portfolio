"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const VIEWS_KEY = "article_views";
const STARS_KEY = "article_stars";

interface ArticleStats {
  readonly views: number;
  readonly stars: number;
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

async function postStat(slug: string, action: "view" | "star" | "unstar"): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action }),
    });
  } catch {
    // silently degrade
  }
}

export function useArticleStats() {
  const [stats, setStats] = useState<Record<string, ArticleStats>>({});
  const [starredSet, setStarredSet] = useState<Set<string>>(new Set());
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    setStarredSet(readSet(STARS_KEY));

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
    postStat(slug, "view");
    setStats((prev) => ({
      ...prev,
      [slug]: {
        views: (prev[slug]?.views ?? 0) + 1,
        stars: prev[slug]?.stars ?? 0,
      },
    }));
  }, []);

  const toggleStar = useCallback((slug: string) => {
    setStarredSet((prev) => {
      const next = new Set(prev);
      const wasStarred = next.has(slug);
      if (wasStarred) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      writeSet(STARS_KEY, next);
      postStat(slug, wasStarred ? "unstar" : "star");
      setStats((prevStats) => ({
        ...prevStats,
        [slug]: {
          views: prevStats[slug]?.views ?? 0,
          stars: Math.max(0, (prevStats[slug]?.stars ?? 0) + (wasStarred ? -1 : 1)),
        },
      }));
      return next;
    });
  }, []);

  const isStarred = useCallback(
    (slug: string) => starredSet.has(slug),
    [starredSet],
  );

  const getStats = useCallback(
    (slug: string): ArticleStats => stats[slug] ?? { views: 0, stars: 0 },
    [stats],
  );

  return { recordView, toggleStar, isStarred, getStats } as const;
}
