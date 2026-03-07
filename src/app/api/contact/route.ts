import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "";
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly timestamp: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body as {
      name: string;
      email: string;
      message: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message too long (max 2000 characters)" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
      );
    }

    const entry: ContactMessage = {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    // Store in KV and send email in parallel
    const kvPromise = kv.lpush("contact:messages", JSON.stringify(entry));

    let emailPromise: Promise<unknown> = Promise.resolve();
    if (CONTACT_EMAIL && resend) {
      emailPromise = resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: CONTACT_EMAIL,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}\n\n---\nSent at ${entry.timestamp}`,
      });
    }

    await Promise.all([kvPromise, emailPromise]);

    return NextResponse.json(
      { success: true },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

export async function GET() {
  // Retrieve messages (for your own use)
  try {
    const messages = await kv.lrange("contact:messages", 0, -1);
    return NextResponse.json({ messages, count: messages.length });
  } catch {
    return NextResponse.json({ messages: [], count: 0 });
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
