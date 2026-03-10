interface YouTubeEmbedProps {
  url: string;
  inline?: boolean;
}

export function YouTubeEmbed({ url, inline }: YouTubeEmbedProps) {
  return (
    <div className={`${inline ? "my-4" : "my-8"} overflow-hidden rounded-md`}>
      <iframe
        src={url}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    </div>
  );
}
