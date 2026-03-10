import Link from "next/link";
import { getAllLessons, getAllModules } from "@/lib/lessons";

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; q?: string }>;
}) {
  const { module = "all", q = "" } = await searchParams;

  const includeDrafts = process.env.INCLUDE_DRAFTS === "true";
  const lessons = await getAllLessons({ includeDrafts });
  const modules = await getAllModules({ includeDrafts });

  const query = q.toLowerCase().trim();

  const filtered = lessons.filter((l) => {
    const byModule = module === "all" ? true : l.module === module;
    const byQuery =
      query.length === 0
        ? true
        : `${l.title} ${l.summary ?? ""} ${l.module}`
            .toLowerCase()
            .includes(query);
    return byModule && byQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Barcha darslar</h1>
          <div className="mt-1 text-sm text-zinc-500">
            {filtered.length} ta dars
          </div>
        </div>

        {/* Search */}
        <form action="/darslar" className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Qidirish: linux, docker, git..."
            className="w-64 rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600/30"
          />
          <input type="hidden" name="module" value={module} />
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Qidirish
          </button>
        </form>
      </div>

      {/* Module tabs */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/darslar?module=all&q=${encodeURIComponent(q)}`}
          className={`rounded-xl px-3 py-2 text-sm border ${
            module === "all"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "bg-white hover:bg-zinc-50"
          }`}
        >
          Barchasi
        </Link>

        {modules.map((m) => (
          <Link
            key={m}
            href={`/darslar?module=${encodeURIComponent(m)}&q=${encodeURIComponent(
              q
            )}`}
            className={`rounded-xl px-3 py-2 text-sm border ${
              module === m
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "bg-white hover:bg-zinc-50"
            }`}
          >
            {m}
          </Link>
        ))}
      </div>

      {/* Lessons list */}
      <div className="grid gap-3">
        {filtered.map((l) => (
          <Link
            key={l.slug}
            href={`/darslar/${l.slug}`}
            className="rounded-2xl border bg-white p-5 hover:shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm text-zinc-500">{l.module}</div>
                <div className="font-semibold">{l.title}</div>
              </div>
              <div className="text-xs text-zinc-500">{l.publishedAt}</div>
            </div>

            {l.summary ? (
              <div className="mt-2 text-sm text-zinc-600">{l.summary}</div>
            ) : null}
          </Link>
        ))}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
            Hech narsa topilmadi. Boshqa so‘z bilan qidirib ko‘ring.
          </div>
        ) : null}
      </div>
    </div>
  );
}