import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleLayout } from "@/components/article-layout";
import { ARTICLES } from "@/lib/data";
import { AgentAlgebraContent } from "@/lib/articles/agent-algebra";
import { DualLayerRegimeContent } from "@/lib/articles/dual-layer-regime";
import { VpinConvictionContent } from "@/lib/articles/vpin-conviction";

const CONTENT_MAP: Record<string, React.ComponentType> = {
  "agent-algebra": AgentAlgebraContent,
  "dual-layer-regime": DualLayerRegimeContent,
  "vpin-conviction": VpinConvictionContent,
};

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.filter((a) => a.slug).map((a) => ({ slug: a.slug! }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Not Found" };

  return {
    title: `${article.title} | Kris Welc`,
    description: article.hook,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  const Content = CONTENT_MAP[slug];

  if (!article || !Content) {
    notFound();
  }

  return (
    <ArticleLayout article={article}>
      <Content />
    </ArticleLayout>
  );
}
