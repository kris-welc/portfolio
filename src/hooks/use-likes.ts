"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "portfolio_likes";

function readLikes(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeLikes(likes: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...likes]));
  } catch {
    // localStorage full or unavailable — silently degrade
  }
}

export function useLikes() {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLiked(readLikes());
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      writeLikes(next);
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => liked.has(id), [liked]);

  return { toggleLike, isLiked } as const;
}
