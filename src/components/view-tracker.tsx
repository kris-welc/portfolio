"use client";

import { useEffect, useRef } from "react";
import { useArticleStats } from "@/hooks/use-article-stats";

interface ViewTrackerProps {
  readonly slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  const { recordView } = useArticleStats();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    recordView(slug);
  }, [slug, recordView]);

  return null;
}
