import React from "react"
import type { LucideIcon } from "lucide-react"

export interface QuizFeatureItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  sub: string
  iconClass?: string
}

export function QuizFeatureCard({ icon: Icon, label, sub, iconClass }: QuizFeatureItem) {
  return (
    <div className="p-4 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10">
      <div className="mb-3">
        <Icon className={iconClass || "size-5 text-fuchsia-400"} />
      </div>
      <div className="text-sm font-bold text-white mb-0.5">{label}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-widest">{sub}</div>
    </div>
  )
}

export function QuizFeatureGrid({ items }: { items: QuizFeatureItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <QuizFeatureCard key={i} {...item} />
      ))}
    </div>
  )
}
