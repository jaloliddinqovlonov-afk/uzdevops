import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

type WaitlistPayload = {
  name: string;
  email: string;
  telegram?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<WaitlistPayload>;

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const telegram = String(body.telegram ?? "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Valid email is required" }, { status: 400 });
    }

    const record = {
      name,
      email,
      telegram: telegram || null,
      createdAt: new Date().toISOString(),
      ua: req.headers.get("user-agent") ?? null,
    };

    const filePath = path.join(process.cwd(), "data", "waitlist.jsonl");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.appendFile(filePath, JSON.stringify(record) + "\n", "utf8");

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}