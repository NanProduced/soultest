"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

// Deterministic color from name string
const AVATAR_COLORS = [
  "bg-violet-500", "bg-purple-500", "bg-indigo-500",
  "bg-pink-500", "bg-rose-500", "bg-fuchsia-500",
  "bg-sky-500", "bg-teal-500",
]
function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
function avatarInitial(name: string) {
  // Strip leading @ and take first real character
  const clean = name.replace(/^@/, "").trim()
  return clean.charAt(0).toUpperCase()
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  useEffect(() => {
    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        getDirection();
        getSpeed();
        setStart(true);
      }
    }
    const getDirection = () => {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "forwards"
          );
        } else {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "reverse"
          );
        }
      }
    };
    const getSpeed = () => {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "20s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    };
    addAnimation();
  }, [direction, speed]);

  return (
    <>
      <style>{`
        @keyframes scroll {
          to { transform: translate(calc(-50% - 0.5rem)) }
        }
        .animate-scroll {
          animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
        }
      `}</style>
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]",
          className
        )}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            " flex min-w-full shrink-0 gap-4 py-4 w-fit flex-nowrap",
            start && "animate-scroll ",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
        >
          {items.map((item) => (
            <li
              className="w-[350px] max-w-full relative rounded-xl border border-white/5 border-l-4 border-l-[#A855F7] flex-shrink-0 px-8 py-6 md:w-[450px] bg-black/60 backdrop-blur-md shadow-2xl"
              key={item.name}
            >
              <blockquote>
                <div
                  aria-hidden="true"
                  className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>
                <span className=" relative z-20 text-sm md:text-base leading-[1.6] text-white/90 font-medium">
                  {item.quote}
                </span>
                <div className="relative z-20 mt-6 flex flex-row items-center gap-3">
                  <div className={cn("flex-shrink-0 size-9 rounded-full flex items-center justify-center text-sm font-bold text-white", avatarColor(item.name))}>
                    {avatarInitial(item.name)}
                  </div>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm leading-[1.6] text-white font-bold">
                      {item.name}
                    </span>
                    {item.title && (
                      <span className="text-xs leading-[1.6] text-white/50 font-normal">
                        {item.title}
                      </span>
                    )}
                  </span>
                </div>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
