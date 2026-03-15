"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const CanvasShaders = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      time += 0.005;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Create a complex fluid-like gradient
      const gradient = ctx.createRadialGradient(
        width / 2 + Math.sin(time) * 300,
        height / 2 + Math.cos(time * 0.5) * 200,
        0,
        width / 2,
        height / 2,
        width * 0.8
      );

      // Purple/Indigo/Slate palette for "Soul" theme
      gradient.addColorStop(0, "rgba(88, 28, 135, 0.15)"); // Deep Purple
      gradient.addColorStop(0.5, "rgba(15, 23, 42, 0)"); // Transparent Slate
      gradient.addColorStop(1, "rgba(124, 58, 237, 0.1)"); // Violet

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add floating "souls" (soft particles)
      for (let i = 0; i < 3; i++) {
        const x = width / 2 + Math.sin(time + i * 2) * (width * 0.3);
        const y = height / 2 + Math.cos(time * 0.7 + i) * (height * 0.3);
        const radius = width * 0.4;

        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, i === 0 ? "rgba(168, 85, 247, 0.08)" : "rgba(59, 130, 246, 0.05)");
        g.addColorStop(1, "rgba(15, 23, 42, 0)");

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={cn("relative w-full h-screen overflow-hidden bg-slate-950", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-60"
      />
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
