import React from "react"
import { ArrowRight, ShoppingBag, Zap, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface QuizUnifiedPortalProps {
  onStart: () => void
  purchaseUrl?: string
  salesChannel?: string
  accentColor?: "fuchsia" | "sky" | "violet" | "emerald"
  className?: string
  centered?: boolean
}

export function QuizUnifiedPortal({ 
  onStart, 
  purchaseUrl = "https://xhslink.com/m/8Hcapw8hyDn",
  salesChannel,
  accentColor = "sky",
  className,
  centered = false
}: QuizUnifiedPortalProps) {
  const isXHS = salesChannel === "xiaohongshu" || purchaseUrl.includes("xhslink.com")
  
  const accentColors = {
    fuchsia: "text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/10",
    sky: "text-sky-400 border-sky-500/20 bg-sky-500/10",
    violet: "text-violet-400 border-violet-500/20 bg-violet-500/10",
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  }

  return (
    <div className={cn(
      "relative group max-w-5xl w-full",
      className
    )}>
      {/* Dynamic Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-[42px] blur-sm opacity-50 group-hover:opacity-100 transition duration-1000" />
      
      <div className="relative grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-px rounded-[40px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Left Section: Activation */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-black/20">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn("p-2.5 rounded-2xl border", accentColors[accentColor])}>
              <Zap className="size-5 fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">建立档案</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Verification Required</p>
            </div>
          </div>
          
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
            输入小红书购买后获得的 10 位验证码，开启你的深度测评报告。
          </p>

          <Button
            onClick={onStart}
            className="h-16 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 transition-all font-bold text-lg shadow-[0_20px_50px_rgba(255,255,255,0.12)] group"
          >
            输入验证码
            <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Right Section: Shop / QR */}
        <div className="p-10 flex flex-col items-center justify-center text-center bg-white/[0.02] border-l border-white/5">
          <div className="relative group/qr">
            <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-700" />
            <div className="relative size-36 md:size-40 rounded-[32px] bg-white p-3 shadow-2xl transition-transform duration-500 group-hover/qr:scale-105 group-hover/qr:rotate-1">
              <img 
                src="/images/soultest-qrcode.jpg" 
                alt="小红书二维码" 
                className="size-full object-contain rounded-2xl"
              />
            </div>
          </div>
          
          <div className="mt-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
              <QrCode className="size-3" />
              Scan to Follow
            </div>
            <p className="text-sm font-bold text-white">灵测 SoulTest 店铺</p>
          </div>

          <a 
            href={purchaseUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 text-[11px] font-bold text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-0.5"
          >
            直接打开店铺链接
          </a>
        </div>
      </div>
    </div>
  )
}
