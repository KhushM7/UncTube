"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ImmersiveTranscriptionProps {
  text: string;
  isPlaying: boolean;
  className?: string;
}

export function ImmersiveTranscription({
  text,
  isPlaying,
  className,
}: ImmersiveTranscriptionProps) {
  const [visibleWordIndex, setVisibleWordIndex] = useState(-1);
  const [isRevealing, setIsRevealing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  // Reveal words one by one when playing
  useEffect(() => {
    if (!isPlaying || words.length === 0) {
      if (!isPlaying && text) {
        setVisibleWordIndex(words.length - 1);
        setIsRevealing(false);
      }
      return;
    }

    setIsRevealing(true);
    setVisibleWordIndex(-1);

    // Calculate timing: roughly match speech synthesis speed
    const avgWordDuration = 280; // ms per word (approx speaking pace)
    let currentIndex = 0;

    const revealNext = () => {
      if (currentIndex < words.length) {
        setVisibleWordIndex(currentIndex);
        currentIndex++;
        
        // Add extra delay for punctuation
        const currentWord = words[currentIndex - 1] || "";
        const extraDelay = /[.!?]$/.test(currentWord) ? 200 : /[,;:]$/.test(currentWord) ? 100 : 0;
        
        setTimeout(revealNext, avgWordDuration + extraDelay);
      } else {
        setIsRevealing(false);
      }
    };

    const timer = setTimeout(revealNext, 400); // Initial delay
    return () => clearTimeout(timer);
  }, [text, isPlaying]);

  // Auto-scroll to latest content
  useEffect(() => {
    if (containerRef.current && isRevealing) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleWordIndex, isRevealing]);

  const getWordStyle = useCallback((index: number) => {
    if (index > visibleWordIndex) {
      return {
        opacity: 0,
        transform: "translateY(10px) scale(0.95)",
        filter: "blur(4px)",
      };
    }
    
    const distanceFromCurrent = visibleWordIndex - index;
    
    if (isRevealing && distanceFromCurrent === 0) {
      // Current word being spoken - highlighted
      return {
        opacity: 1,
        transform: "translateY(0) scale(1.05)",
        filter: "blur(0)",
        textShadow: "0 0 30px rgba(255, 200, 150, 0.8), 0 0 60px rgba(255, 180, 120, 0.4)",
        color: "#fff5e6",
      };
    }
    
    if (isRevealing && distanceFromCurrent <= 2) {
      // Recent words - slightly emphasized
      const fade = 1 - distanceFromCurrent * 0.15;
      return {
        opacity: fade,
        transform: "translateY(0) scale(1)",
        filter: "blur(0)",
        textShadow: `0 0 ${15 - distanceFromCurrent * 5}px rgba(255, 200, 150, ${0.4 - distanceFromCurrent * 0.1})`,
      };
    }
    
    // Older words - settled
    return {
      opacity: 0.7,
      transform: "translateY(0) scale(1)",
      filter: "blur(0)",
    };
  }, [visibleWordIndex, isRevealing]);

  if (!text) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Ambient glow behind text */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: isRevealing
            ? "radial-gradient(ellipse at 50% 50%, rgba(255, 180, 120, 0.08) 0%, transparent 60%)"
            : "transparent",
          transition: "background 1s ease",
        }}
      />

      {/* Main container */}
      <div
        ref={containerRef}
        className="relative max-h-64 overflow-y-auto scrollbar-hide px-8"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="py-8">
          {/* Opening flourish */}
          <div className="flex justify-center mb-6">
            <svg
              width="60"
              height="20"
              viewBox="0 0 60 20"
              className={cn(
                "transition-opacity duration-1000",
                visibleWordIndex >= 0 ? "opacity-40" : "opacity-0"
              )}
            >
              <path
                d="M0 10 Q15 0, 30 10 Q45 20, 60 10"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-amber-200/40"
              />
            </svg>
          </div>

          {/* Quote text */}
          <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-center">
            {/* Opening quote mark */}
            <span
              className={cn(
                "inline-block text-4xl md:text-5xl font-serif text-amber-200/30 mr-1 transition-all duration-700",
                visibleWordIndex >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ lineHeight: 0.5 }}
            >
              &ldquo;
            </span>

            {/* Words */}
            {words.map((word, index) => {
              const style = getWordStyle(index);
              return (
                <span
                  key={`${word}-${index}`}
                  className="inline-block transition-all duration-300 ease-out text-amber-100"
                  style={style}
                >
                  {word}
                  {index < words.length - 1 && (
                    <span className="inline-block w-[0.3em]" />
                  )}
                </span>
              );
            })}

            {/* Closing quote mark */}
            <span
              className={cn(
                "inline-block text-4xl md:text-5xl font-serif text-amber-200/30 ml-1 transition-all duration-700",
                !isRevealing && visibleWordIndex >= words.length - 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ lineHeight: 0.5 }}
            >
              &rdquo;
            </span>
          </blockquote>

          {/* Closing flourish */}
          <div className="flex justify-center mt-6">
            <svg
              width="60"
              height="20"
              viewBox="0 0 60 20"
              className={cn(
                "transition-opacity duration-1000 rotate-180",
                !isRevealing && visibleWordIndex >= words.length - 1 ? "opacity-40" : "opacity-0"
              )}
            >
              <path
                d="M0 10 Q15 0, 30 10 Q45 20, 60 10"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-amber-200/40"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Speaking indicator */}
      {isRevealing && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-0.5 bg-amber-200/50 rounded-full animate-pulse"
                style={{
                  height: `${6 + Math.sin((Date.now() / 100 + i) % 10) * 4}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.3s",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
