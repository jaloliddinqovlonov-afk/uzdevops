import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type LessonMeta = {
  title: string;
  slug: string;
  module: string;
  youtubeId: string;
  publishedAt: string; // YYYY-MM-DD
  summary?: string;
  status?: "draft" | "published"; // NEW
};

async function dirExists(p: string) {
  try {
    const stat = await fs.stat(p);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function getLessonsDir() {
  const rootContent = path.join(process.cwd(), "content", "lessons");
  const srcContent = path.join(process.cwd(), "src", "content", "lessons");

  if (await dirExists(rootContent)) return rootContent;
  if (await dirExists(srcContent)) return srcContent;

  throw new Error(
    `Lessons folder not found. Create one of these:\n- ${rootContent}\n- ${srcContent}`
  );
}

function toMeta(data: any): LessonMeta {
  const statusRaw = String(data.status ?? "draft").toLowerCase();
  const status = statusRaw === "published" ? "published" : "draft";

  return {
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    module: String(data.module ?? ""),
    youtubeId: String(data.youtubeId ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    summary: data.summary ? String(data.summary) : undefined,
    status,
  };
}

export async function getAllLessons(opts?: { includeDrafts?: boolean }): Promise<LessonMeta[]> {
  const includeDrafts = Boolean(opts?.includeDrafts);

  const LESSONS_DIR = await getLessonsDir();
  const files = await fs.readdir(LESSONS_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const lessons = await Promise.all(
    mdxFiles.map(async (file) => {
      const raw = await fs.readFile(path.join(LESSONS_DIR, file), "utf8");
      const { data } = matter(raw);
      return toMeta(data);
    })
  );

  const visible = includeDrafts
    ? lessons
    : lessons.filter((l) => l.status === "published");

  visible.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return visible;
}

export async function getLessonBySlug(slug: string, opts?: { includeDrafts?: boolean }) {
  const includeDrafts = Boolean(opts?.includeDrafts);

  const LESSONS_DIR = await getLessonsDir();
  const files = await fs.readdir(LESSONS_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  for (const file of mdxFiles) {
    const raw = await fs.readFile(path.join(LESSONS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    if (String(data.slug) === slug) {
      const meta = toMeta(data);

      if (!includeDrafts && meta.status !== "published") {
        return null; // hides draft
      }

      return { meta, content };
    }
  }

  return null;
}

export async function getLessonNav(
  slug: string,
  opts?: { includeDrafts?: boolean }
) {
  const lessons = await getAllLessons(opts);
  const idx = lessons.findIndex((l) => l.slug === slug);

  const prev = idx >= 0 ? lessons[idx + 1] ?? null : null;
  const next = idx >= 0 ? lessons[idx - 1] ?? null : null;

  return { prev, next };
}
export async function getAllModules(p0: { includeDrafts: boolean; }): Promise<string[]> {
  const lessons = await getAllLessons();
  const modules = Array.from(new Set(lessons.map((l) => l.module)));
  modules.sort((a, b) => a.localeCompare(b));
  return modules;
}

export function normalizeText(s: string) {
  return s.toLowerCase().trim();
}

export const ROADMAP_ORDER = [
  "Linux asoslari",
  "Networking asoslari",
  "Git",
  "Bash",
  "Docker",
  "Docker Compose",
  "CI/CD",
  "Kubernetes",
  "Monitoring",
  "Cloud asoslari",
] as const;

export async function getRoadmapModules() {
  const lessons = await getAllLessons();

  const map = new Map<string, typeof lessons>();
  for (const l of lessons) {
    const arr = map.get(l.module) ?? [];
    arr.push(l);
    map.set(l.module, arr);
  }

  // sort lessons inside module by date ASC (start from earliest)
  for (const [m, arr] of map) {
    arr.sort((a, b) => (a.publishedAt > b.publishedAt ? 1 : -1));
    map.set(m, arr);
  }

  const moduleNames = Array.from(map.keys());

  // order modules: ROADMAP_ORDER first, then the rest alphabetical
  const ordered = [
    ...ROADMAP_ORDER.filter((m) => moduleNames.includes(m)),
    ...moduleNames
      .filter((m) => !ROADMAP_ORDER.includes(m as any))
      .sort((a, b) => a.localeCompare(b)),
  ];

  return ordered.map((name) => ({
    name,
    lessons: map.get(name)!,
    count: map.get(name)!.length,
    firstSlug: map.get(name)![0]?.slug ?? null,
  }));
}