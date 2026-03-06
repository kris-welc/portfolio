"use client";

import { useArticleStats } from "@/hooks/use-article-stats";
import { cn } from "@/lib/utils";

interface ArticleStatsBarProps {
  readonly slug: string;
}

export function ArticleStatsBar({ slug }: ArticleStatsBarProps) {
  const { getStats, toggleStar, isStarred } = useArticleStats();
  const { views, stars } = getStats(slug);
  const starred = isStarred(slug);

  return (
    <div className="flex items-center gap-4 font-mono text-xs text-waste-ash">
      <span className="flex items-center gap-1.5">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {views} {views === 1 ? "view" : "views"}
      </span>
      <button
        onClick={() => toggleStar(slug)}
        className={cn(
          "flex items-center gap-1.5 transition-colors",
          starred
            ? "text-waste-amber"
            : "text-waste-ash hover:text-waste-amber"
        )}
      >
        <svg
          className={cn("h-3.5 w-3.5", starred ? "fill-current" : "fill-none stroke-current")}
          viewBox="0 0 24 24"
          strokeWidth={starred ? 0 : 1.5}
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
        </svg>
        {stars} {stars === 1 ? "star" : "stars"}
      </button>
    </div>
  );
}
