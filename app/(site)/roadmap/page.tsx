import Link from "next/link";
import { getRoadmapModules } from "@/lib/lessons";

export default async function RoadmapPage() {
  const modules = await getRoadmapModules();

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border bg-white p-8">
        <h1 className="text-3xl font-bold">DevOps Roadmap</h1>
        <p className="mt-3 max-w-2xl text-zinc-600">
          Ushbu roadmap darslar asosida avtomatik yangilanadi. Har modul ichida
          darslar ketma-ket joylashadi.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/darslar"
            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
          >
            Darslarni ko‘rish
          </Link>
          <Link
            href="/bootcamp"
            className="rounded-xl border px-5 py-3 hover:bg-zinc-50 transition"
          >
            Bootcamp (tez kunda)
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map((m) => (
          <div key={m.name} className="rounded-2xl border bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{m.name}</h2>
                <div className="mt-1 text-sm text-zinc-500">
                  {m.count} ta dars
                </div>
              </div>

              {m.firstSlug ? (
                <Link
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-black transition"
                  href={`/darslar/${m.firstSlug}`}
                >
                  Boshlash →
                </Link>
              ) : null}
            </div>

            <div className="mt-4 space-y-2">
              {m.lessons.slice(0, 5).map((l) => (
                <Link
                  key={l.slug}
                  href={`/darslar/${l.slug}`}
                  className="block rounded-xl border bg-zinc-50 px-4 py-3 text-sm hover:bg-white transition"
                >
                  <div className="font-medium">{l.title}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {l.publishedAt}
                  </div>
                </Link>
              ))}

              {m.count > 5 ? (
                <Link
                  href={`/darslar?module=${encodeURIComponent(m.name)}`}
                  className="block text-sm underline text-zinc-700 mt-2"
                >
                  Hammasini ko‘rish →
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}