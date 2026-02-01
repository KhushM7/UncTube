"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AncestorPresenceProps {
  name: string;
  isSpeaking: boolean;
  isThinking: boolean;
  className?: string;
}

export function AncestorPresence({
  name,
  isSpeaking,
  isThinking,
  className,
}: AncestorPresenceProps) {
  const [breathePhase, setBreathePhase] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathePhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Simulate audio visualization when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setAudioLevels([0, 0, 0, 0, 0, 0, 0, 0]);
      return;
    }

    const interval = setInterval(() => {
      setAudioLevels(
        Array.from({ length: 8 }, () => Math.random() * 0.6 + 0.2)
      );
    }, 80);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Ethereal aura canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const intensity = isSpeaking ? 1.2 : isThinking ? 0.8 : 0.5;

      // Draw multiple flowing aura rings
      for (let ring = 0; ring < 5; ring++) {
        const baseRadius = 80 + ring * 35;
        const waveAmplitude = (isSpeaking ? 15 : 8) + ring * 3;
        
        ctx.beginPath();
        for (let angle = 0; angle < 360; angle += 2) {
          const rad = (angle * Math.PI) / 180;
          const wave = Math.sin(rad * 6 + time * (0.02 - ring * 0.003)) * waveAmplitude;
          const radius = baseRadius + wave;
          
          const x = centerX + Math.cos(rad) * radius;
          const y = centerY + Math.sin(rad) * radius;
          
          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        
        const alpha = (0.15 - ring * 0.025) * intensity;
        const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius - 20, centerX, centerY, baseRadius + 40);
        gradient.addColorStop(0, `rgba(255, 200, 150, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 180, 120, ${alpha * 0.7})`);
        gradient.addColorStop(1, `rgba(255, 160, 100, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Inner glow pulse
      const pulseRadius = 60 + Math.sin(time * 0.03) * (isSpeaking ? 15 : 8);
      const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      innerGradient.addColorStop(0, `rgba(255, 220, 180, ${0.4 * intensity})`);
      innerGradient.addColorStop(0.5, `rgba(255, 200, 150, ${0.2 * intensity})`);
      innerGradient.addColorStop(1, "rgba(255, 180, 120, 0)");
      
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [isSpeaking, isThinking]);

  const breatheScale = 1 + Math.sin((breathePhase * Math.PI) / 180) * 0.015;
  const glowIntensity = isSpeaking ? 1 : isThinking ? 0.6 : 0.35;

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Ethereal aura canvas */}
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none"
        style={{
          width: 350,
          height: 350,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.9,
        }}
      />

      {/* Portrait frame with presence */}
      <div
        className="relative z-10 transition-transform duration-500"
        style={{ transform: `scale(${breatheScale})` }}
      >
        {/* Outer ethereal ring */}
        <div
          className="absolute -inset-8 rounded-full transition-all duration-700"
          style={{
            background: `radial-gradient(circle, rgba(255, 200, 150, ${glowIntensity * 0.2}) 0%, transparent 70%)`,
            filter: `blur(${isSpeaking ? 15 : 10}px)`,
          }}
        />

        {/* Ornate vintage frame */}
        <div className="relative">
          {/* Frame shadow */}
          <div
            className="absolute -inset-5 rounded-full"
            style={{
              boxShadow: `
                0 0 60px rgba(139, 115, 85, ${glowIntensity * 0.4}),
                0 0 100px rgba(255, 180, 120, ${glowIntensity * 0.2})
              `,
            }}
          />

          {/* Outer decorative frame */}
          <div
            className="absolute -inset-4 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #8B7355, #D4A574, #8B7355, #A08060, #8B7355)",
              boxShadow: "inset 0 2px 4px rgba(255, 220, 180, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.4)",
            }}
          />

          {/* Inner frame groove */}
          <div
            className="absolute -inset-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, #5B4334 0%, #7B6354 50%, #5B4334 100%)",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)",
            }}
          />

          {/* Portrait container */}
          <div
            className="relative w-36 h-36 rounded-full overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #1a1510 0%, #0d0a08 100%)",
              boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.9)",
            }}
          >
            {/* Inner glow effect */}
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: `radial-gradient(circle at 50% 35%, rgba(255, 200, 150, ${isSpeaking ? 0.5 : 0.2}) 0%, transparent 50%)`,
              }}
            />

            {/* Ethereal figure */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-28 h-28 transition-all duration-700"
                style={{
                  filter: `
                    drop-shadow(0 0 ${isSpeaking ? 20 : 10}px rgba(255, 200, 150, ${glowIntensity}))
                    drop-shadow(0 0 ${isSpeaking ? 40 : 20}px rgba(255, 180, 120, ${glowIntensity * 0.5}))
                  `,
                }}
              >
                <defs>
                  <radialGradient id="spiritGradient" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor={`rgba(255, 230, 200, ${isSpeaking ? 1 : 0.8})`} />
                    <stop offset="40%" stopColor={`rgba(220, 180, 140, ${isSpeaking ? 0.8 : 0.5})`} />
                    <stop offset="100%" stopColor="rgba(139, 115, 85, 0.2)" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Head with gentle animation */}
                <ellipse
                  cx="50"
                  cy="35"
                  rx="18"
                  ry="22"
                  fill="url(#spiritGradient)"
                  filter="url(#glow)"
                  style={{
                    transform: `translateY(${Math.sin(breathePhase * Math.PI / 180) * 1}px)`,
                    transformOrigin: "center",
                  }}
                />
                
                {/* Shoulders */}
                <ellipse
                  cx="50"
                  cy="90"
                  rx="38"
                  ry="28"
                  fill="url(#spiritGradient)"
                  style={{ opacity: 0.7 }}
                />

                {/* Subtle face features when speaking */}
                {(isSpeaking || isThinking) && (
                  <>
                    {/* Eyes - subtle glints */}
                    <circle cx="43" cy="32" r="1.5" fill="rgba(255, 240, 220, 0.6)" />
                    <circle cx="57" cy="32" r="1.5" fill="rgba(255, 240, 220, 0.6)" />
                  </>
                )}
              </svg>
            </div>

            {/* Speaking mouth glow animation */}
            {isSpeaking && (
              <div className="absolute left-1/2 top-[48%] -translate-x-1/2">
                <div
                  className="w-6 h-3 rounded-full animate-pulse"
                  style={{
                    background: "radial-gradient(ellipse, rgba(255, 200, 150, 0.8) 0%, transparent 70%)",
                    filter: "blur(2px)",
                    animationDuration: "150ms",
                  }}
                />
              </div>
            )}

            {/* Thinking swirl */}
            {isThinking && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-full border-2 border-transparent animate-spin"
                  style={{
                    borderTopColor: "rgba(255, 200, 150, 0.3)",
                    animationDuration: "2s",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio visualizer - shows when speaking */}
      {isSpeaking && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8 z-20">
          {audioLevels.map((level, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-75"
              style={{
                height: `${8 + level * 20}px`,
                background: `linear-gradient(to top, rgba(255, 180, 120, 0.8), rgba(255, 220, 180, ${0.4 + level * 0.4}))`,
                boxShadow: `0 0 ${4 + level * 4}px rgba(255, 200, 150, ${0.3 + level * 0.3})`,
              }}
            />
          ))}
        </div>
      )}

      {/* Name and status */}
      <div className="mt-12 text-center relative z-10">
        <div
          className="px-8 py-2.5 rounded-sm relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(139, 115, 85, 0.9) 0%, rgba(100, 80, 60, 0.9) 100%)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 220, 180, 0.2)",
          }}
        >
          {/* Subtle shine effect */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255, 220, 180, 0.1) 50%, transparent 100%)",
            }}
          />
          <p className="font-serif text-xl tracking-wider text-amber-100 relative">
            {name}
          </p>
        </div>

        {/* Status with presence indicator */}
        <div className="mt-4 flex flex-col items-center gap-2">
          {isThinking ? (
            <div className="flex items-center gap-3">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-200/70 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
                  />
                ))}
              </span>
              <span className="text-sm text-amber-200/70 font-serif italic">
                Reaching through the veil...
              </span>
            </div>
          ) : isSpeaking ? (
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200/50" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-200/80" />
              </span>
              <span className="text-sm text-amber-200/80 font-serif">
                Speaking from beyond...
              </span>
            </div>
          ) : (
            <span className="text-sm text-amber-200/40 font-serif italic">
              Present and listening...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
