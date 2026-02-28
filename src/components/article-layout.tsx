import Link from "next/link";
import { WastelandBadge } from "@/components/wasteland-badge";
import type { Article } from "@/lib/data";

interface ArticleLayoutProps {
  readonly article: Article;
  readonly children: React.ReactNode;
}

export function ArticleLayout({ article, children }: ArticleLayoutProps) {
  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-waste-border/30 bg-waste-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/#articles"
            className="glow-amber font-mono text-sm tracking-[0.2em] text-waste-amber"
          >
            KW://
          </Link>
          <Link
            href="/#articles"
            className="link-underline flex items-center gap-2 text-xs tracking-wide text-waste-dim transition-colors hover:text-waste-bone md:text-sm"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            BACK
          </Link>
        </div>
      </nav>

      <main className="relative z-[1] pt-24 pb-20">
        <article className="mx-auto max-w-3xl px-6">
          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {article.tags.map((tag) => (
                <WastelandBadge
                  key={tag}
                  variant={article.accent}
                  className="text-[0.6rem]"
                >
                  {tag}
                </WastelandBadge>
              ))}
            </div>

            <h1 className="gradient-hot font-display text-3xl font-bold tracking-wide md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 font-mono text-xs text-waste-ash">
              {formattedDate && <time dateTime={article.date}>{formattedDate}</time>}
              <span className="text-waste-border">|</span>
              <span>{article.readTime} read</span>
              {article.repoUrl && (
                <>
                  <span className="text-waste-border">|</span>
                  <a
                    href={article.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-waste-amber transition-colors hover:text-waste-amber-light"
                  >
                    VIEW REPO
                  </a>
                </>
              )}
            </div>

            <p className="mt-6 text-lg leading-relaxed text-waste-sand">
              {article.hook}
            </p>
          </header>

          {/* Content */}
          <div className="article-prose">{children}</div>

          {/* Footer */}
          <footer className="mt-16 border-t border-waste-border pt-8">
            <div className="flex items-center justify-between">
              <Link
                href="/#articles"
                className="flex items-center gap-2 font-mono text-xs tracking-wider text-waste-dim transition-colors hover:text-waste-amber"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                ALL DISPATCHES
              </Link>
              {article.repoUrl && (
                <a
                  href={article.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs tracking-wider text-waste-dim transition-colors hover:text-waste-amber"
                >
                  SOURCE CODE
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
