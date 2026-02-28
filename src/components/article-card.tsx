"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WastelandBadge } from "@/components/wasteland-badge";
import { HeartIcon, HeartFilledIcon } from "@/components/icons";
import type { Article } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  readonly article: Article;
  readonly liked: boolean;
  readonly onToggleLike: (id: string) => void;
}

export function ArticleCard({
  article,
  liked,
  onToggleLike,
}: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="panel-hover group border-waste-border bg-waste-panel transition-all duration-300">
      <CardHeader>
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <WastelandBadge
                key={tag}
                variant={article.accent}
                className="text-[0.55rem]"
              >
                {tag}
              </WastelandBadge>
            ))}
            <span className="font-mono text-[0.6rem] text-waste-ash">
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
          {article.date && (
            <span className="font-mono text-[0.6rem] text-waste-ash">
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
        <CardAction>
          <button
            onClick={() => onToggleLike(article.id)}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1.5 font-mono text-xs transition-all",
              liked
                ? "text-waste-rust-light"
                : "text-waste-dim hover:text-waste-rust-light"
            )}
            aria-label={liked ? "Unlike article" : "Like article"}
          >
            {liked ? (
              <HeartFilledIcon className="h-4 w-4 text-waste-rust-light" />
            ) : (
              <HeartIcon className="h-4 w-4" />
            )}
          </button>
        </CardAction>
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
                  <span className="font-mono text-[0.6rem] text-waste-ash">
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
            article.slug ? "flex-1" : "w-full"
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
        {article.slug && (
          <Link href={`/articles/${article.slug}`}>
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs tracking-wider text-waste-amber transition-colors hover:text-waste-amber-light"
            >
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
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
