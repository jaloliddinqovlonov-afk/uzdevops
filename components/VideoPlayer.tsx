export default function VideoPlayer({ youtubeId }: { youtubeId: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="Lesson video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}