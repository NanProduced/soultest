import React from "react"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface QuizAccessBoxProps {
  onStart: () => void
  title?: string
  description?: string
  buttonLabel?: string
  accentColor?: string
}

export function QuizAccessBox({ 
  onStart, 
  title = "验证码开启深度探索", 
  description = "请输入你在小红书购买后获得的 10 位验证码。有效期内支持中断后继续，进度将自动保存。",
  buttonLabel = "开始测试",
  accentColor = "fuchsia"
}: QuizAccessBoxProps) {
  const accentGlow = accentColor === "fuchsia" ? "bg-fuchsia-500/10" : "bg-sky-500/10"
  const shadowStyle = accentColor === "fuchsia" ? "shadow-[0_20px_40px_rgba(168,85,247,0.15)]" : "shadow-[0_20px_40px_rgba(56,189,248,0.15)]"

  return (
    <div className="p-8 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-64 h-64 ${accentGlow} rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-110`} />
      
      <div className="relative z-10 lg:flex lg:items-center lg:justify-between gap-8">
        <div className="mb-8 lg:mb-0">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <Zap className="size-5 text-amber-400" />
            {title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        <div className="w-full lg:w-64">
          <Button
            onClick={onStart}
            className={`w-full h-16 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 transition-all font-bold text-lg ${shadowStyle} group`}
          >
            {buttonLabel}
            <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="mt-3 text-[10px] text-slate-500 text-center uppercase tracking-widest">支持多设备进度同步</p>
        </div>
      </div>
    </div>
  )
}
