"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WastelandBadge } from "@/components/wasteland-badge";
import type { Article } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  readonly article: Article;
  readonly views: number;
}

export function ArticleCard({
  article,
  views,
}: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="panel-hover group border-waste-border bg-waste-panel transition-all duration-300">
      <CardHeader className="flex flex-row items-start gap-4">
        {article.imageThumb && (
          <Image
            src={article.imageThumb}
            alt={article.imageAlt ?? ""}
            width={160}
            height={160}
            className="mt-0.5 h-16 w-16 shrink-0 rounded-md border border-waste-border object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <WastelandBadge key={tag} variant={article.accent}>
                {tag}
              </WastelandBadge>
            ))}
            <span className="font-mono text-xs text-waste-ash">
              {article.readTime} / {article.topicCount} topics
            </span>
          </div>
          <CardTitle className="font-display text-xl tracking-wide text-waste-bone transition-colors group-hover:text-waste-amber">
            {article.slug ? (
              <Link href={`/articles/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            ) : (
              article.title
            )}
          </CardTitle>
          <div className="mt-1 flex items-center gap-3">
            {article.date && (
              <span className="font-mono text-xs text-waste-ash">
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            <span className="flex items-center gap-1 font-mono text-xs text-waste-ash">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {views}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-waste-sand">{article.hook}</p>

        {expanded && (
          <div className="space-y-3 border-t border-waste-border pt-4">
            {article.topics.map((topic, i) => (
              <div
                key={topic.title}
                className="rounded-md bg-waste-bg/50 px-4 py-3"
              >
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="font-mono text-xs text-waste-ash">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-display text-sm font-semibold tracking-wide text-waste-bone">
                    {topic.title}
                  </h4>
                </div>
                <p className="pl-6 text-xs leading-relaxed text-waste-sand">
                  {topic.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((prev) => !prev)}
          className={cn(
            "font-mono text-xs tracking-wider text-waste-dim transition-colors hover:text-waste-amber",
            !article.repoUrl && !article.slug ? "flex-1" : ""
          )}
        >
          {expanded
            ? "COLLAPSE"
            : `EXPAND ${article.topicCount} TOPICS`}
          <svg
            className={cn(
              "ml-2 h-3 w-3 transition-transform",
              expanded && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        {article.repoUrl && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="font-mono text-xs tracking-wider text-waste-bone transition-colors hover:text-waste-amber"
          >
            <a
              href={article.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="mr-1.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              SOURCE
            </a>
          </Button>
        )}
        {article.slug && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="font-mono text-xs tracking-wider text-waste-amber transition-colors hover:text-waste-amber-light"
          >
            <Link href={`/articles/${article.slug}`}>
              READ ARTICLE
              <svg
                className="ml-2 h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
