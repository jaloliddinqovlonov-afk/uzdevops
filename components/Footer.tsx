export default function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-zinc-500">
        © {new Date().getFullYear()} UzDevOps Academy
      </div>
    </footer>
  );
}