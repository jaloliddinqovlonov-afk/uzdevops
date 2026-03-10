import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          UzDevOps Academy
        </Link>

        <nav className="flex gap-6 text-sm">
          <Link href="/darslar">Darslar</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/bootcamp">Bootcamp</Link>
        </nav>
      </div>
    </header>
  );
}