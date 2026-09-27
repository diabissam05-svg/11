import { parseVideoSource } from "../lib/video";

/**
 * Renders a background video from an MP4 link or a YouTube/Vimeo embed.
 * Falls back to nothing when the URL is empty/invalid.
 */
export default function VideoBackground({
  url,
  poster,
  autoplay = true,
  muted = true,
  loop = true,
  className = "h-full w-full object-cover",
}: {
  url: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}) {
  const source = parseVideoSource(url, { autoplay, muted, loop });
  if (!source) return null;

  if (source.kind === "file") {
    return (
      <video
        className={className}
        src={source.src}
        poster={poster || undefined}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <iframe
      className={`${className} pointer-events-auto`}
      src={source.src}
      title="Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      frameBorder={0}
      loading="lazy"
      style={{ border: 0 }}
    />
  );
}
