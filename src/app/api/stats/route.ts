import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

const ALLOWED_ACTIONS = new Set(["view"] as const);

export async function GET() {
  try {
    const keys = await kv.keys("article:views:*");
    const stats: Record<string, { views: number }> = {};

    if (keys.length > 0) {
      const values = await kv.mget<(number | null)[]>(...keys);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const count = values[i] ?? 0;
        const slug = key.split(":").slice(2).join(":");
        stats[slug] = { views: typeof count === "number" ? count : 0 };
      }
    }

    return NextResponse.json(stats, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
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
    const { slug, action } = body as { slug: string; action: string };

    if (!slug || !action) {
      return NextResponse.json({ error: "Missing slug or action" }, { status: 400 });
    }

    // Only unique page views are tracked. Fake "star" counters are disabled —
    // GitHub stars are the only public star signal (via /api/star + OAuth).
    if (!ALLOWED_ACTIONS.has(action as "view")) {
      return NextResponse.json(
        { error: "Action not supported" },
        { status: 410, headers: { "Access-Control-Allow-Origin": "*" } },
      );
    }

    const key = `article:views:${slug}`;
    const count = await kv.incr(key);

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
