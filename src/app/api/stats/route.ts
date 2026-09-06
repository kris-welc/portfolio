import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { ARTICLES } from "@/lib/data";

export const dynamic = "force-dynamic";

const ALLOWED_ACTIONS = new Set(["view"] as const);

/** Known article ids/slugs — reject arbitrary key injection. */
const ALLOWED_SLUGS = new Set(
  ARTICLES.flatMap((a) => [a.id, a.slug].filter(Boolean) as string[]),
);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Max distinct view registrations per IP per UTC day (anti-spam). */
const MAX_VIEWS_PER_IP_PER_DAY = 40;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

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
      headers: { ...cors, "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({}, { headers: cors });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, action, visitorId } = body as {
      slug?: string;
      action?: string;
      visitorId?: string;
    };

    if (!slug || !action) {
      return NextResponse.json(
        { error: "Missing slug or action" },
        { status: 400, headers: cors },
      );
    }

    if (!ALLOWED_ACTIONS.has(action as "view")) {
      return NextResponse.json(
        { error: "Action not supported" },
        { status: 410, headers: cors },
      );
    }

    if (!ALLOWED_SLUGS.has(slug)) {
      return NextResponse.json(
        { error: "Unknown article" },
        { status: 400, headers: cors },
      );
    }

    if (!visitorId || !UUID_RE.test(visitorId)) {
      return NextResponse.json(
        { error: "Valid visitorId (UUID) required" },
        { status: 400, headers: cors },
      );
    }

    const viewsKey = `article:views:${slug}`;
    const viewersKey = `article:viewers:${slug}`;

    // Already counted this browser for this article
    const already = await kv.sismember(viewersKey, visitorId);
    if (already) {
      const count = Number((await kv.get(viewsKey)) ?? 0);
      return NextResponse.json(
        { slug, action, count, counted: false },
        { headers: cors },
      );
    }

    // Soft IP cap so clearing localStorage / minting UUIDs can't inflate forever
    const ip = clientIp(request);
    const rateKey = `article:ipviews:${utcDay()}:${ip}`;
    const ipCount = await kv.incr(rateKey);
    if (ipCount === 1) {
      await kv.expire(rateKey, 60 * 60 * 48);
    }
    if (ipCount > MAX_VIEWS_PER_IP_PER_DAY) {
      const count = Number((await kv.get(viewsKey)) ?? 0);
      return NextResponse.json(
        { slug, action, count, counted: false, reason: "rate_limited" },
        { status: 429, headers: cors },
      );
    }

    const added = await kv.sadd(viewersKey, visitorId);
    if (!added) {
      const count = Number((await kv.get(viewsKey)) ?? 0);
      return NextResponse.json(
        { slug, action, count, counted: false },
        { headers: cors },
      );
    }

    const count = await kv.incr(viewsKey);
    return NextResponse.json(
      { slug, action, count, counted: true },
      { headers: cors },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500, headers: cors },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: cors });
}
