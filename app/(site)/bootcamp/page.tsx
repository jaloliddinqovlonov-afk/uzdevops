"use client";

import { useState } from "react";

export default function BootcampPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      telegram: String(form.get("telegram") ?? ""),
    };

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("err");
      setError(data?.error || "Error");
      return;
    }

    setStatus("ok");
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border bg-white p-8">
        <h1 className="text-3xl font-bold">UzDevOps Bootcamp (tez kunda)</h1>
        <p className="mt-3 max-w-2xl text-zinc-600">
          3 oylik intensiv: real loyihalar, mentorlik, code review, mock interview,
          CV va ishga tayyorlash.
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-8">
        <h2 className="text-xl font-semibold">Waitlist</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Bootcamp ochilganda birinchi bo‘lib xabar beramiz.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-lg">
          <input
            name="name"
            placeholder="Ism"
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/30"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/30"
            required
          />
          <input
            name="telegram"
            placeholder="Telegram username (ixtiyoriy): @username"
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/30"
          />

          <button
            disabled={status === "loading"}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {status === "loading" ? "Yuborilmoqda..." : "Waitlist’ga qo‘shilish"}
          </button>

          {status === "ok" ? (
            <div className="text-sm text-emerald-700">
              ✅ Rahmat! Siz waitlist’ga qo‘shildingiz.
            </div>
          ) : null}

          {status === "err" ? (
            <div className="text-sm text-red-600">
              ❌ {error}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}