"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type UploadStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "complete"
  | "error";

interface UploadItem {
  id: string;
  file: File;
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  status: UploadStatus;
  progress?: number;
  error?: string;
}

interface UploadProgressProps {
  items: UploadItem[];
  onRemove?: (id: string) => void;
  onUpload?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<UploadItem>) => void;
}

function getStatusLabel(status: UploadStatus) {
  switch (status) {
    case "pending":
      return "Waiting...";
    case "uploading":
      return "Uploading...";
    case "processing":
      return "Preserving...";
    case "complete":
      return "Preserved";
    case "error":
      return "Failed";
  }
}

export function UploadProgress({
  items,
  onRemove,
  onUpload,
  onUpdate,
}: UploadProgressProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-serif text-lg text-amber-100">
        Upload Queue ({items.length})
      </h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg"
            style={{
              background: "rgba(30, 20, 10, 0.4)",
              border: "1px solid rgba(212, 165, 116, 0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-100 truncate max-w-[200px]">
                {item.file.name}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    item.status === "error"
                      ? "bg-red-900/30 text-red-300"
                      : item.status === "complete"
                        ? "bg-amber-900/30 text-amber-200"
                        : "bg-amber-900/20 text-amber-200/70"
                  )}
                >
                  {getStatusLabel(item.status)}
                </span>
                {onRemove &&
                  (item.status === "complete" || item.status === "error") && (
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="text-amber-200/40 hover:text-amber-200/80"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
              </div>
            </div>

            {item.status === "pending" && (
              <div className="grid gap-3 md:grid-cols-2 mb-4">
                <div className="space-y-1">
                  <label className="text-xs text-amber-200/50">
                    Title <span className="text-red-300/80">*</span>
                  </label>
                  <Input
                    value={item.title || ""}
                    onChange={(e) =>
                      onUpdate?.(item.id, { title: e.target.value })
                    }
                    placeholder="e.g., Summer at Lake Louise"
                    className="bg-stone-900/40 border-amber-200/15 text-amber-100 placeholder:text-amber-200/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-amber-200/50">
                    Date <span className="text-red-300/80">*</span>
                  </label>
                  <Input
                    value={item.date || ""}
                    onChange={(e) => onUpdate?.(item.id, { date: e.target.value })}
                    placeholder="e.g., 1989-07-14"
                    className="bg-stone-900/40 border-amber-200/15 text-amber-100 placeholder:text-amber-200/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-amber-200/50">
                    Location <span className="text-red-300/80">*</span>
                  </label>
                  <Input
                    value={item.location || ""}
                    onChange={(e) =>
                      onUpdate?.(item.id, { location: e.target.value })
                    }
                    placeholder="e.g., Vancouver, BC"
                    className="bg-stone-900/40 border-amber-200/15 text-amber-100 placeholder:text-amber-200/30"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-amber-200/50">Description</label>
                  <Textarea
                    value={item.description || ""}
                    onChange={(e) =>
                      onUpdate?.(item.id, { description: e.target.value })
                    }
                    placeholder="Add context you want saved with this upload"
                    className="bg-stone-900/40 border-amber-200/15 text-amber-100 placeholder:text-amber-200/30"
                    rows={3}
                  />
                </div>
                {onUpload && (
                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onUpload(item.id)}
                      disabled={
                        !item.title?.trim() ||
                        !item.date?.trim() ||
                        !item.location?.trim()
                      }
                      className="bg-amber-900/60 text-amber-100 border border-amber-200/20 hover:bg-amber-800/70"
                    >
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            )}

            {(item.status === "uploading" || item.status === "processing") && (
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(139, 115, 85, 0.2)" }}
              >
                <div
                  className={cn(
                    "h-full transition-all duration-300 rounded-full",
                    item.status === "processing" && "animate-pulse"
                  )}
                  style={{
                    width: `${item.progress || (item.status === "processing" ? 100 : 0)}%`,
                    background:
                      "linear-gradient(90deg, rgba(212, 165, 116, 0.6), rgba(255, 200, 150, 0.8))",
                  }}
                />
              </div>
            )}

            {item.error && (
              <p className="mt-2 text-xs text-red-300/80">{item.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export type { UploadItem };
