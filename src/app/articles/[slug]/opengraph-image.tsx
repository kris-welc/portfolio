import { ImageResponse } from "next/og";
import { ARTICLES } from "@/lib/data";

export const dynamic = "force-static";
export const alt = "Dispatch by Kris Welc";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ARTICLES.filter((a) => a.slug).map((a) => ({ slug: a.slug! }));
}

interface ImageProps {
  readonly params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  const title = article?.title ?? "Dispatches";
  const tags = article?.tags.slice(0, 3).join("  ·  ") ?? "";
  const meta = [
    article?.date
      ? new Date(article.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined,
    article?.readTime ? `${article.readTime} read` : undefined,
  ]
    .filter(Boolean)
    .join("   |   ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0a0908",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(229,162,26,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(154,224,42,0.08) 0%, transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 5,
            color: "#e5a21a",
          }}
        >
          <div style={{ display: "flex" }}>DISPATCHES</div>
          <div style={{ display: "flex", color: "#8a8071" }}>{tags}</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 62 : 76,
            fontWeight: 700,
            color: "#ede6d4",
            lineHeight: 1.15,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#8a8071",
          }}
        >
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 60,
                height: 3,
                background: "#e5a21a",
              }}
            />
            <div style={{ display: "flex", color: "#c9bc9e" }}>Kris Welc</div>
          </div>
          <div style={{ display: "flex" }}>{meta}</div>
        </div>
      </div>
    ),
    size
  );
}
