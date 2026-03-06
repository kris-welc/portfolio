"use client";

import { SectionLabel } from "@/components/section-label";
import { ArticleCard } from "@/components/article-card";
import { ARTICLES } from "@/lib/data";
import { useRevealAll } from "@/hooks/use-reveal";
import { useArticleStats } from "@/hooks/use-article-stats";

export function ArticlesSection() {
  const containerRef = useRevealAll();
  const { toggleStar, isStarred, getStats } = useArticleStats();

  return (
    <section id="articles" className="relative px-6 py-24" ref={containerRef}>
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-12">
          <SectionLabel code="SEC_01" label="FIELD NOTES" />
          <h2 className="gradient-bone font-display text-3xl font-bold tracking-wide md:text-4xl">
            Dispatches
          </h2>
          <p className="mt-3 max-w-2xl text-waste-sand">
            Patterns worth knowing. Expand any piece to see the full breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ARTICLES.map((article) => {
            const slug = article.slug ?? article.id;
            const articleStats = getStats(slug);
            return (
              <div key={article.id} className="reveal">
                <ArticleCard
                  article={article}
                  views={articleStats.views}
                  stars={articleStats.stars}
                  isStarred={isStarred(slug)}
                  onStar={() => toggleStar(slug)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
