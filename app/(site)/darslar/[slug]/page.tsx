import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { getAllLessons, getLessonBySlug, getLessonNav } from "@/lib/lessons";

// ✅ version-safe MDXRemote import
import * as mdxRsc from "next-mdx-remote/rsc";
const MDXRemoteComp: any = (mdxRsc as any).MDXRemote ?? (mdxRsc as any).default;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug, { includeDrafts: false });

  if (!lesson) return { title: "Dars topilmadi — UzDevOps Academy" };

  return {
    title: `${lesson.meta.title} — UzDevOps Academy`,
    description: lesson.meta.summary ?? `${lesson.meta.module} bo‘yicha dars`,
  };
}



export async function generateStaticParams() {
  const includeDrafts = process.env.INCLUDE_DRAFTS === "true";
  const lessons = await getAllLessons({ includeDrafts });
  return lessons.map((l) => ({ slug: l.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const includeDrafts = process.env.INCLUDE_DRAFTS === "true";
  const lesson = await getLessonBySlug(slug, { includeDrafts });
  if (!lesson) return notFound();

  const { meta, content } = lesson;
  const nav = await getLessonNav(meta.slug, { includeDrafts });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-zinc-500">{meta.module}</div>
        <h1 className="text-2xl font-semibold">{meta.title}</h1>
        <div className="mt-1 text-sm text-zinc-500">{meta.publishedAt}</div>
      </div>

      <VideoPlayer youtubeId={meta.youtubeId} />

      <article className="prose max-w-none prose-zinc">
        <MDXRemoteComp source={content} />
      </article>

      <div className="flex items-center justify-between pt-6">
        {nav.prev ? (
          <Link className="underline" href={`/darslar/${nav.prev.slug}`}>
            ← {nav.prev.title}
          </Link>
        ) : (
          <span />
        )}

        {nav.next ? (
          <Link className="underline" href={`/darslar/${nav.next.slug}`}>
            {nav.next.title} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}