import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
  try {
    const keys = await kv.keys("article:*");
    const stats: Record<string, { views: number; stars: number }> = {};

    if (keys.length > 0) {
      const values = await kv.mget<(number | null)[]>(...keys);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const count = values[i] ?? 0;
        // key format: "article:views:slug" or "article:stars:slug"
        const parts = key.split(":");
        const type = parts[1] as "views" | "stars";
        const slug = parts.slice(2).join(":");
        if (!stats[slug]) stats[slug] = { views: 0, stars: 0 };
        stats[slug][type] = count;
      }
    }

    return NextResponse.json(stats, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json({}, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, action } = body as { slug: string; action: "view" | "star" | "unstar" };

    if (!slug || !action) {
      return NextResponse.json({ error: "Missing slug or action" }, { status: 400 });
    }

    const key = action === "unstar"
      ? `article:stars:${slug}`
      : `article:${action}s:${slug}`;

    let count: number;
    if (action === "unstar") {
      count = Math.max(0, await kv.decr(key));
    } else {
      count = await kv.incr(key);
    }

    return NextResponse.json({ slug, action, count }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
