"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface MemorySourceDisplayProps {
  sources: string[];
  className?: string;
}

type MediaType = "photo" | "video" | "audio" | "text" | "document" | "unknown";

const EXTENSION_TYPE_MAP: Record<string, MediaType> = {
  jpg: "photo",
  jpeg: "photo",
  png: "photo",
  gif: "photo",
  webp: "photo",
  bmp: "photo",
  mp4: "video",
  webm: "video",
  mov: "video",
  avi: "video",
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  m4a: "audio",
  flac: "audio",
  txt: "text",
  md: "text",
  pdf: "document",
  doc: "document",
  docx: "document",
  rtf: "document",
};

function extractExtension(raw: string): string | null {
  const lower = raw.toLowerCase();
  if (lower.startsWith("s3://")) {
    const key = raw.slice(5);
    const last = key.split("/").pop() || "";
    const dot = last.lastIndexOf(".");
    return dot >= 0 ? last.slice(dot + 1).toLowerCase() : null;
  }

  try {
    const parsed = new URL(raw);
    const keyParam = parsed.searchParams.get("object_key");
    if (keyParam) {
      const decoded = decodeURIComponent(keyParam);
      const last = decoded.split("/").pop() || "";
      const dot = last.lastIndexOf(".");
      if (dot >= 0) return last.slice(dot + 1).toLowerCase();
    }
    const last = parsed.pathname.split("/").pop() || "";
    const dot = last.lastIndexOf(".");
    return dot >= 0 ? last.slice(dot + 1).toLowerCase() : null;
  } catch {
    const queryIndex = lower.indexOf("?object_key=");
    if (queryIndex >= 0) {
      const key = raw.slice(queryIndex + "?object_key=".length).split("&")[0];
      const decoded = decodeURIComponent(key);
      const last = decoded.split("/").pop() || "";
      const dot = last.lastIndexOf(".");
      if (dot >= 0) return last.slice(dot + 1).toLowerCase();
    }
    const last = raw.split("/").pop() || "";
    const dot = last.lastIndexOf(".");
    return dot >= 0 ? last.slice(dot + 1).toLowerCase() : null;
  }
}

function getMediaType(url: string, resolvedUrl?: string): MediaType {
  const ext = extractExtension(url) || (resolvedUrl ? extractExtension(resolvedUrl) : null);
  if (ext && EXTENSION_TYPE_MAP[ext]) return EXTENSION_TYPE_MAP[ext];
  return "unknown";
}

function getMediaLabel(type: MediaType): string {
  switch (type) {
    case "photo": return "A Captured Moment";
    case "video": return "Moving Memory";
    case "audio": return "Voice from the Past";
    case "text": return "Written Words";
    case "document": return "Written Words";
    default: return "Sacred Memory";
  }
}

function getMediaDescription(type: MediaType): string {
  switch (type) {
    case "photo": return "A photograph preserved in time";
    case "video": return "Life captured in motion";
    case "audio": return "Their voice, eternal";
    case "text": return "Words preserved from the past";
    case "document": return "Words written by their hand";
    default: return "A treasured memory";
  }
}

function MediaIcon({ type, isHovered }: { type: MediaType; isHovered: boolean }) {
  const baseClass = cn(
    "w-8 h-8 transition-all duration-500",
    isHovered ? "text-amber-100" : "text-amber-200/50"
  );

  switch (type) {
    case "photo":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="2" />
          <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "video":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="16" height="16" rx="3" />
          <path d="M22 8l-4 3v6l4 3V8z" strokeLinejoin="round" />
        </svg>
      );
    case "audio":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" />
          <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
          <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
        </svg>
      );
    case "document":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    default:
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
}

function resolveSourceUrl(url: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const lower = url.toLowerCase();
  if (lower.startsWith("s3://")) {
    const withoutScheme = url.slice(5);
    const keyStart = withoutScheme.indexOf("/");
    const key = keyStart >= 0 ? withoutScheme.slice(keyStart + 1) : "";
    return `${apiBase}/api/v1/storage/stream?object_key=${encodeURIComponent(key)}`;
  }
  if (lower.includes("amazonaws.com")) {
    try {
      const parsed = new URL(url);
      const key = parsed.pathname.replace(/^\//, "");
      return `${apiBase}/api/v1/storage/stream?object_key=${encodeURIComponent(key)}`;
    } catch {
      return url;
    }
  }
  return url;
}

export function MemorySourceDisplay({
  sources,
  className,
}: MemorySourceDisplayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [textPreview, setTextPreview] = useState<Record<string, string>>({});
  const [textError, setTextError] = useState<Record<string, string>>({});

  const resolvedSources = useMemo(
    () => (sources || []).map((source) => resolveSourceUrl(source)),
    [sources]
  );

  useEffect(() => {
    if (expandedIndex === null) return;
    const source = sources[expandedIndex];
    if (!source) return;
    const type = getMediaType(source);
    if (type !== "text") return;
    const resolvedUrl = resolvedSources[expandedIndex];
    if (textPreview[resolvedUrl] || textError[resolvedUrl]) return;
    let canceled = false;
    fetch(resolvedUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load text (${res.status})`);
        }
        return res.text();
      })
      .then((text) => {
        if (canceled) return;
        setTextPreview((prev) => ({
          ...prev,
          [resolvedUrl]: text.trim().slice(0, 800) || "No text content available.",
        }));
      })
      .catch((err) => {
        if (canceled) return;
        setTextError((prev) => ({
          ...prev,
          [resolvedUrl]: err instanceof Error ? err.message : "Unable to load text.",
        }));
      });
    return () => {
      canceled = true;
    };
  }, [expandedIndex, resolvedSources, sources, textError, textPreview]);

  if (!sources || sources.length === 0) return null;

  return (
    <div className={cn("", className)}>
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-200/30" />
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-amber-200/40">
            <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="currentColor" />
          </svg>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-200/30" />
        </div>
        <p className="text-xs text-amber-200/40 uppercase tracking-[0.2em] font-serif">
          Memories That Spoke
        </p>
      </div>

      {/* Source cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {sources.map((url, index) => {
          const type = getMediaType(url, resolvedSources[index]);
          const isHovered = hoveredIndex === index;
          const isExpanded = expandedIndex === index;
          const resolvedUrl = resolvedSources[index] || url;

          return (
            <div
              key={url}
              className={cn("relative", isExpanded ? "z-20" : "z-10")}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Glow effect */}
              <div
                className={cn(
                  "absolute -inset-4 rounded-2xl transition-all duration-700 pointer-events-none",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                style={{
                  background: "radial-gradient(circle, rgba(255, 200, 150, 0.15) 0%, transparent 70%)",
                }}
              />

              {/* Card container */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className={cn(
                  "relative flex flex-col items-center gap-3 p-5 rounded-xl transition-all duration-500",
                  "border bg-stone-900/40 backdrop-blur-sm",
                  isHovered
                    ? "border-amber-200/40 bg-stone-900/60 scale-105 shadow-xl shadow-amber-900/20"
                    : "border-amber-200/10"
                )}
              >
                {/* Ornate frame around icon */}
                <div className="relative">
                  {/* Frame corners */}
                  <div className="absolute -inset-2">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-200/30" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-200/30" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-200/30" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-200/30" />
                  </div>

                  {/* Icon with inner glow */}
                  <div
                    className="relative w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{
                      background: isHovered
                        ? "radial-gradient(circle, rgba(255, 200, 150, 0.15) 0%, rgba(139, 115, 85, 0.1) 100%)"
                        : "radial-gradient(circle, rgba(139, 115, 85, 0.1) 0%, transparent 100%)",
                    }}
                  >
                    <MediaIcon type={type} isHovered={isHovered} />
                  </div>
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm font-serif transition-colors duration-300",
                    isHovered ? "text-amber-100" : "text-amber-200/50"
                  )}
                >
                  {getMediaLabel(type)}
                </span>

                {/* Expanded state - description and preview (overlay, no layout shift) */}
                <div
                  className={cn(
                    "absolute left-1/2 top-full mt-4 w-80 sm:w-96 -translate-x-1/2",
                    "transition-all duration-300",
                    isExpanded ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2"
                  )}
                >
                  <div className="rounded-xl border border-amber-200/20 bg-stone-950/90 backdrop-blur-md p-4 shadow-xl shadow-amber-900/20">
                    <p className="text-xs text-amber-200/40 mb-3 text-center font-serif italic">
                      {getMediaDescription(type)}
                    </p>
                    <div className="rounded-lg border border-amber-200/10 bg-stone-900/40 p-3">
                      {type === "photo" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolvedUrl}
                          alt="Memory"
                          className="w-full max-h-80 object-contain rounded-md"
                        />
                      )}
                      {type === "video" && (
                        <video
                          src={resolvedUrl}
                          controls
                          className="w-full max-h-80 rounded-md"
                        />
                      )}
                      {type === "audio" && (
                        <audio src={resolvedUrl} controls className="w-full" />
                      )}
                      {type === "text" && (
                        <div className="text-xs text-amber-200/60 whitespace-pre-wrap max-h-72 overflow-auto">
                          {textError[resolvedUrl] ||
                            textPreview[resolvedUrl] ||
                            "Loading text..."}
                        </div>
                      )}
                      {type === "document" && (
                        <iframe
                          src={resolvedUrl}
                          title="Document preview"
                          className="w-full h-72 rounded-md border border-amber-200/10"
                        />
                      )}
                      {type === "unknown" && (
                        <p className="text-xs text-amber-200/40">
                          Preview not available for this format.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom flourish */}
      <div className="flex justify-center mt-8">
        <svg
          width="80"
          height="12"
          viewBox="0 0 80 12"
          className="text-amber-200/20"
        >
          <path
            d="M0 6 Q20 0, 40 6 Q60 12, 80 6"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
