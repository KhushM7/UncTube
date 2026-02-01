"use client";

import React from "react";
import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  disabled?: boolean;
}

const ACCEPTED_TYPES = {
  "image/*": "Photographs",
  "video/*": "Recordings",
  "audio/*": "Voice Memos",
  "text/*": "Letters",
  "application/pdf": "Documents",
};

export function FileUpload({
  onFilesSelected,
  accept = "image/*,video/*,audio/*,text/*,application/pdf",
  maxFiles = 10,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [disabled, maxFiles, onFilesSelected]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).slice(0, maxFiles);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [maxFiles, onFilesSelected]
  );

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-lg p-12 transition-all cursor-pointer group",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        background: isDragging
          ? "rgba(60, 40, 20, 0.4)"
          : "rgba(30, 20, 10, 0.3)",
        border: isDragging
          ? "2px dashed rgba(212, 165, 116, 0.5)"
          : "2px dashed rgba(212, 165, 116, 0.2)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={handleFileChange}
        disabled={disabled}
        className="sr-only"
      />

      <div className="flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-105"
          style={{
            background: "rgba(139, 115, 85, 0.3)",
            border: "1px solid rgba(212, 165, 116, 0.2)",
            boxShadow: isDragging
              ? "0 0 30px rgba(255, 200, 150, 0.2)"
              : "none",
          }}
        >
          <svg
            className="w-8 h-8 text-amber-200/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h3 className="font-serif text-lg text-amber-100 mb-2">
          Drop your memories here
        </h3>
        <p className="text-sm text-amber-200/50 mb-4">
          or click to browse from your device
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(ACCEPTED_TYPES).map(([, label]) => (
            <span
              key={label}
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{
                background: "rgba(139, 115, 85, 0.2)",
                color: "rgba(212, 165, 116, 0.7)",
                border: "1px solid rgba(212, 165, 116, 0.1)",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs text-amber-200/30">
          Up to {maxFiles} files, max 100MB each
        </p>
      </div>
    </div>
  );
}
