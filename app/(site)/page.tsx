import Link from "next/link";
import { getAllLessons } from "@/lib/lessons";

export default async function HomePage() {
  const lessons = await getAllLessons();
  const latest = lessons.slice(0, 6);

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-white p-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight">
            DevOps’ni o‘zbek tilida
            <span className="block text-blue-600">
              professional darajada o‘rganing
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-600">
            0’dan boshlab real loyihalar, amaliy mashg‘ulotlar va professional
            Bootcamp orqali DevOps muhandisga aylaning.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/darslar"
              className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
            >
              Bepul darslarni boshlash
            </Link>

            <Link
              href="/bootcamp"
              className="rounded-xl border border-zinc-300 px-6 py-3 hover:bg-zinc-50 transition"
            >
              Bootcamp haqida
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-zinc-500">
            <div>✓ Real amaliyot</div>
            <div>✓ Har kuni yangi dars</div>
            <div>✓ Mentorlik (Bootcamp)</div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="font-semibold">Strukturali dastur</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Linux’dan Kubernetesgacha to‘liq roadmap asosida.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="font-semibold">Amaliy yondashuv</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Har bir mavzu real server va real loyiha bilan.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="font-semibold">Karyera yo‘naltirilgan</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Bootcamp orqali ishga tayyorlanish imkoniyati.
          </p>
        </div>
      </section>

      {/* LATEST LESSONS */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">So‘nggi darslar</h2>
          <Link href="/darslar" className="text-sm underline">
            Hammasi
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {latest.map((l) => (
            <Link
              key={l.slug}
              href={`/darslar/${l.slug}`}
              className="rounded-xl border bg-white p-5 hover:shadow-sm"
            >
              <div className="text-sm text-zinc-500">{l.module}</div>
              <div className="mt-1 font-semibold">{l.title}</div>
              <div className="mt-2 text-sm text-zinc-600">{l.summary}</div>
              <div className="mt-4 text-xs text-zinc-500">{l.publishedAt}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}