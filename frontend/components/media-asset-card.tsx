"use client";

import { MediaAssetOut } from "@/lib/api";

interface MediaAssetCardProps {
  asset: MediaAssetOut;
  onClick?: () => void;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    );
  }
  if (mimeType.startsWith("video/")) {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    );
  }
  if (mimeType.startsWith("audio/")) {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
    );
  }
  if (mimeType === "application/pdf") {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileType(mimeType: string) {
  if (mimeType.startsWith("image/")) return "Photograph";
  if (mimeType.startsWith("video/")) return "Recording";
  if (mimeType.startsWith("audio/")) return "Voice Memo";
  if (mimeType === "application/pdf") return "Document";
  if (mimeType.startsWith("text/")) return "Letter";
  return "Memory";
}

export function MediaAssetCard({ asset, onClick }: MediaAssetCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg transition-all group"
      style={{
        background: "rgba(30, 20, 10, 0.4)",
        border: "1px solid rgba(212, 165, 116, 0.1)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-amber-200/70 flex-shrink-0 transition-all group-hover:text-amber-200"
          style={{
            background: "rgba(139, 115, 85, 0.3)",
            border: "1px solid rgba(212, 165, 116, 0.15)",
          }}
        >
          {getFileIcon(asset.mime_type)}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-amber-100 truncate group-hover:text-amber-50">
            {asset.file_name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(139, 115, 85, 0.2)",
                color: "rgba(212, 165, 116, 0.7)",
              }}
            >
              {getFileType(asset.mime_type)}
            </span>
            <span className="text-xs text-amber-200/40">
              {formatBytes(asset.bytes)}
            </span>
          </div>
        </div>

        <svg
          className="w-5 h-5 text-amber-200/30 flex-shrink-0 group-hover:text-amber-200/60 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}
