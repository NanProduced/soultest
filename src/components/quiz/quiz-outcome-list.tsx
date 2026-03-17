import React from "react"

export interface QuizOutcomeListProps {
  items: string[]
  title?: string
  accentColor?: "fuchsia" | "sky" | "violet" | "amber"
}

export function QuizOutcomeList({ 
  items, 
  title = "完成后你将看到", 
  accentColor = "fuchsia" 
}: QuizOutcomeListProps) {
  const dotColors: Record<string, string> = {
    fuchsia: "bg-fuchsia-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]",
    sky: "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]",
    violet: "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]",
    amber: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
  }

  const dotClass = dotColors[accentColor] || dotColors.fuchsia

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-6">{title}</p>
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300 transition-colors hover:text-white">
            <div className={`size-1.5 rounded-full ${dotClass}`} />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
