export type VideoSource =
  | { kind: "file"; src: string }
  | { kind: "youtube"; src: string }
  | { kind: "vimeo"; src: string }
  | null;

/**
 * Normalize any user-provided video reference (direct MP4/WebM link,
 * YouTube watch/share/embed URL, or Vimeo link/ID) into a renderable source.
 */
export function parseVideoSource(
  url: string,
  opts: { autoplay?: boolean; muted?: boolean; loop?: boolean } = {}
): VideoSource {
  const u = (url ?? "").trim();
  if (!u) return null;

  const { autoplay = true, muted = true, loop = true } = opts;

  // YouTube (watch / embed / shorts / youtu.be)
  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (yt) {
    const id = yt[1];
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      loop: loop ? "1" : "0",
      playlist: id,
      controls: "1",
      rel: "0",
      modestbranding: "1",
    });
    return { kind: "youtube", src: `https://www.youtube.com/embed/${id}?${params}` };
  }

  // Vimeo (link or numeric ID)
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/) || u.match(/^(\d{6,})$/);
  if (vm) {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      muted: muted ? "1" : "0",
      loop: loop ? "1" : "0",
    });
    return { kind: "vimeo", src: `https://player.vimeo.com/video/${vm[1]}?${params}` };
  }

  // Direct file (mp4/webm/ogg/mov) — or best-effort direct URL
  return { kind: "file", src: u };
}
