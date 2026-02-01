"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeDirection: number;
  type: "dust" | "orb" | "wisp";
  angle: number;
  angleSpeed: number;
  orbitRadius: number;
  pulsePhase: number;
}

interface AmbientParticlesProps {
  intensity?: "low" | "medium" | "high";
}

export function AmbientParticles({ intensity = "medium" }: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle counts based on intensity
    const counts = {
      low: { dust: 30, orb: 3, wisp: 2 },
      medium: { dust: 50, orb: 6, wisp: 4 },
      high: { dust: 80, orb: 10, wisp: 6 },
    };

    const particleCount = counts[intensity];

    // Initialize dust particles
    const dustParticles: Particle[] = Array.from({ length: particleCount.dust }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.3 - 0.15,
      opacity: Math.random() * 0.35 + 0.1,
      fadeDirection: Math.random() > 0.5 ? 1 : -1,
      type: "dust",
      angle: 0,
      angleSpeed: 0,
      orbitRadius: 0,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Initialize orb particles (larger, glowing)
    const orbParticles: Particle[] = Array.from({ length: particleCount.orb }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 6 + 4,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.1 - 0.05,
      opacity: Math.random() * 0.2 + 0.05,
      fadeDirection: Math.random() > 0.5 ? 1 : -1,
      type: "orb",
      angle: 0,
      angleSpeed: 0,
      orbitRadius: 0,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Initialize wisp particles (flowing, ethereal)
    const wispParticles: Particle[] = Array.from({ length: particleCount.wisp }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.3 + Math.random() * canvas.height * 0.4,
      size: Math.random() * 40 + 20,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: 0,
      opacity: Math.random() * 0.08 + 0.02,
      fadeDirection: Math.random() > 0.5 ? 1 : -1,
      type: "wisp",
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.005,
      orbitRadius: Math.random() * 30 + 10,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    particlesRef.current = [...dustParticles, ...orbParticles, ...wispParticles];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.016; // ~60fps

      particlesRef.current.forEach((particle) => {
        if (particle.type === "dust") {
          // Dust motes - gentle floating
          particle.x += particle.speedX + Math.sin(timeRef.current + particle.pulsePhase) * 0.1;
          particle.y += particle.speedY;

          particle.opacity += particle.fadeDirection * 0.003;
          if (particle.opacity >= 0.45) particle.fadeDirection = -1;
          if (particle.opacity <= 0.05) particle.fadeDirection = 1;

          // Wrap around
          if (particle.x < -10) particle.x = canvas.width + 10;
          if (particle.x > canvas.width + 10) particle.x = -10;
          if (particle.y < -10) particle.y = canvas.height + 10;
          if (particle.y > canvas.height + 10) particle.y = -10;

          // Draw dust with subtle glow
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 220, 180, ${particle.opacity})`;
          ctx.fill();

          // Subtle glow around dust
          const dustGlow = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 4
          );
          dustGlow.addColorStop(0, `rgba(255, 200, 150, ${particle.opacity * 0.4})`);
          dustGlow.addColorStop(1, "rgba(255, 200, 150, 0)");
          ctx.fillStyle = dustGlow;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === "orb") {
          // Larger glowing orbs - slow drift
          particle.x += particle.speedX;
          particle.y += particle.speedY + Math.sin(timeRef.current * 0.5 + particle.pulsePhase) * 0.2;

          particle.opacity += particle.fadeDirection * 0.001;
          if (particle.opacity >= 0.25) particle.fadeDirection = -1;
          if (particle.opacity <= 0.03) particle.fadeDirection = 1;

          // Wrap around
          if (particle.x < -50) particle.x = canvas.width + 50;
          if (particle.x > canvas.width + 50) particle.x = -50;
          if (particle.y < -50) particle.y = canvas.height + 50;
          if (particle.y > canvas.height + 50) particle.y = -50;

          // Pulsing size
          const pulseSize = particle.size * (1 + Math.sin(timeRef.current * 2 + particle.pulsePhase) * 0.15);

          // Draw orb with layered glow
          const orbGlow = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, pulseSize * 3
          );
          orbGlow.addColorStop(0, `rgba(255, 220, 180, ${particle.opacity * 0.8})`);
          orbGlow.addColorStop(0.3, `rgba(255, 200, 150, ${particle.opacity * 0.4})`);
          orbGlow.addColorStop(0.6, `rgba(255, 180, 120, ${particle.opacity * 0.2})`);
          orbGlow.addColorStop(1, "rgba(255, 160, 100, 0)");
          
          ctx.fillStyle = orbGlow;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseSize * 3, 0, Math.PI * 2);
          ctx.fill();

          // Inner bright core
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseSize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 240, 220, ${particle.opacity})`;
          ctx.fill();
        } else if (particle.type === "wisp") {
          // Ethereal wisps - flowing movement
          particle.angle += particle.angleSpeed;
          const offsetX = Math.cos(particle.angle) * particle.orbitRadius;
          const offsetY = Math.sin(particle.angle * 0.7) * particle.orbitRadius * 0.5;
          
          particle.x += particle.speedX;
          
          particle.opacity += particle.fadeDirection * 0.0005;
          if (particle.opacity >= 0.1) particle.fadeDirection = -1;
          if (particle.opacity <= 0.01) particle.fadeDirection = 1;

          // Wrap around
          if (particle.x < -100) particle.x = canvas.width + 100;
          if (particle.x > canvas.width + 100) particle.x = -100;

          const wispX = particle.x + offsetX;
          const wispY = particle.y + offsetY;

          // Draw flowing wisp
          const wispGradient = ctx.createRadialGradient(
            wispX, wispY, 0,
            wispX, wispY, particle.size
          );
          wispGradient.addColorStop(0, `rgba(255, 200, 150, ${particle.opacity})`);
          wispGradient.addColorStop(0.5, `rgba(255, 180, 120, ${particle.opacity * 0.5})`);
          wispGradient.addColorStop(1, "rgba(255, 160, 100, 0)");

          ctx.fillStyle = wispGradient;
          ctx.beginPath();
          ctx.ellipse(wispX, wispY, particle.size * 1.5, particle.size * 0.6, particle.angle, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Add occasional flicker effect (like candlelight)
      if (Math.random() < 0.02) {
        const flickerX = canvas.width * 0.5 + (Math.random() - 0.5) * canvas.width * 0.6;
        const flickerY = canvas.height * 0.3 + Math.random() * canvas.height * 0.4;
        const flickerSize = Math.random() * 150 + 50;
        
        const flickerGradient = ctx.createRadialGradient(
          flickerX, flickerY, 0,
          flickerX, flickerY, flickerSize
        );
        flickerGradient.addColorStop(0, "rgba(255, 200, 150, 0.08)");
        flickerGradient.addColorStop(1, "rgba(255, 180, 120, 0)");
        
        ctx.fillStyle = flickerGradient;
        ctx.beginPath();
        ctx.arc(flickerX, flickerY, flickerSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
