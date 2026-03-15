"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface FloatingLinesProps {
  className?: string;
  children?: React.ReactNode;
  strokeWidth?: number;
  lineCount?: number;
  speed?: number;
}

export const FloatingLines = ({
  className,
  children,
  strokeWidth = 1,
  lineCount = 12,
  speed = 0.5,
}: FloatingLinesProps) => {
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

    // Line definition
    const lines = Array.from({ length: lineCount }).map((_, i) => ({
      yOffset: (window.innerHeight / lineCount) * i,
      amplitude: 50 + Math.random() * 100,
      frequency: 0.001 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.1 + Math.random() * 0.3,
      color: i % 2 === 0 ? "#A855F7" : "#3B82F6", // Purple or Blue
    }));

    const draw = () => {
      time += speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = strokeWidth;
        ctx.globalAlpha = line.opacity;

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            line.yOffset +
            Math.sin(x * line.frequency + time * 0.01 + line.phase) *
              line.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [lineCount, speed, strokeWidth]);

  return (
    <div className={cn("relative w-full h-screen overflow-hidden bg-slate-950", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-40 pointer-events-none" />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
