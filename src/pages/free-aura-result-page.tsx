import { useRef, useState } from "react"
import { Navigate, useSearchParams, Link } from "react-router"
import { ArrowLeft, ArrowRight, Download, Sparkles, Heart, Users, Briefcase, Zap, Compass } from "lucide-react"

import { FreeQuizRuntimeLoadingScreen, FreeQuizRuntimeUnavailableScreen, useFreeQuizRuntime } from "@/features/free-quizzes/runtime"
import { exportNodeAsPng } from "@/lib/export-node-as-image"

export function FreeAuraResultPage() {
  const [searchParams] = useSearchParams()
  const resultKey = searchParams.get("key")
  const { freeRuntime, isLoading, error } = useFreeQuizRuntime("free/aura")
  const auraResults = (freeRuntime?.resultMap ?? {}) as Record<string, any>
  const result = resultKey ? auraResults[resultKey] : null
  const posterRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  if (isLoading) {
    return <FreeQuizRuntimeLoadingScreen className="bg-[#060010] text-white" />
  }

  if (error || Object.keys(auraResults).length === 0) {
    return <FreeQuizRuntimeUnavailableScreen className="bg-[#060010] text-white" backTo="/free/aura" />
  }

  if (!result) {
    return <Navigate replace to="/free/aura" />
  }

  const handleExport = async () => {
    if (!posterRef.current || isExporting) return
    setIsExporting(true)
    try {
      await exportNodeAsPng(posterRef.current, {
        filename: `SoulTest-Aura-${result.name}.png`,
        backgroundColor: '#060010', // Important to fix black image issues
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      })
    } catch (err) {
      console.error("Export failed", err)
      alert("淇濆瓨娴锋姤澶辫触锛岃閲嶈瘯")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div 
      className="text-white selection:bg-white/30 font-sans"
      style={{ background: result.bgGradient }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-24 md:px-8">
        
        {/* Desktop Layout Wrapper: Image on left, Content on right */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
          
          {/* Main Poster Content (this is the element we export) */}
          <div className="w-full lg:w-[480px] shrink-0">
            
            {/* Desktop Actions (above the poster on desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-6">
               <Link
                to="/free/aura"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
              >
                <ArrowLeft className="size-4" /> 閲嶆柊娴嬭瘯
              </Link>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Download className="size-4" />
                {isExporting ? "鐢熸垚涓?.." : "淇濆瓨楂樻竻娴锋姤"}
              </button>
            </div>

            <div 
              ref={posterRef} 
              className="w-full overflow-hidden rounded-[32px] bg-[#060010] border border-white/10 shadow-2xl relative"
            >
              {/* Internal Glow for the card */}
              <div 
                className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[80px] opacity-50 pointer-events-none"
                style={{ background: result.shadowColor }}
              />

              <div className="relative p-6 sm:p-8">
                <div className="text-center mb-10 mt-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 mb-6">
                    绋€鏈夊害 {result.rarity}
                  </div>
                  <h2 className="text-lg text-white/60 mb-2 font-medium">你的 Aura 是</h2>
                  <h1 className={`text-5xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br ${result.gradient} pb-2`}>
                    {result.colorName}
                  </h1>
                  <p className="mt-4 text-lg font-serif italic text-white/90">
                    "{result.tagline}"
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {result.keywords.map((kw: string, i: number) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 ${result.textColor}`}
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* 鐏甸瓊鐢诲儚 */}
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: result.shadowColor }} />
                  <p className="text-sm leading-relaxed text-white/80 italic font-serif relative z-10">
                    {result.portrait}
                  </p>
                </div>

                {/* 娣卞害瑙ｈ */}
                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-base font-bold mb-4">
                    <Sparkles className={`size-4 ${result.textColor}`} />
                    娣卞害鐏甸瓊瑙ｈ
                  </h3>
                  <div className="space-y-3 text-sm leading-relaxed text-white/70">
                    {result.interpretation.split('\\n').map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* 鍏夎姃鏃跺埢 */}
                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-base font-bold mb-4">
                    <Zap className={`size-4 ${result.textColor}`} />
                    浣犵殑鍏夎姃鏃跺埢
                  </h3>
                  <ul className="space-y-3">
                    {result.moments.map((moment: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                        <span className={`mt-0.5 ${result.textColor}`}>✦</span>
                        <span className="leading-relaxed">{moment}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 鏌旇蒋涔嬪 */}
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 mb-8">
                  <h3 className="text-sm font-bold text-white/50 mb-3 uppercase tracking-widest">隐藏的柔软</h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    {result.softSpot}
                  </p>
                </div>

                {/* 鍦烘櫙琛ㄧ幇 */}
                <div className="grid grid-cols-1 gap-3 mb-8">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex gap-4">
                    <div className={`mt-1 p-2 rounded-full bg-white/5 ${result.textColor} shrink-0`}><Heart className="size-4"/></div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">恋爱中</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{result.scenes.love}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex gap-4">
                    <div className={`mt-1 p-2 rounded-full bg-white/5 ${result.textColor} shrink-0`}><Users className="size-4"/></div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">友情中</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{result.scenes.friendship}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex gap-4">
                    <div className={`mt-1 p-2 rounded-full bg-white/5 ${result.textColor} shrink-0`}><Briefcase className="size-4"/></div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">职场中</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{result.scenes.work}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 mb-6">
                  <h3 className="text-sm font-bold mb-4">Aura 鑳介噺琛ュ厖鎸囧崡</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-white/50 mb-1">馃攱 涓撳睘鍏呯數浠紡</p>
                      <p className="text-sm text-white/80">{result.ritual}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-1">馃帶 鐏甸瓊棰戠巼</p>
                      <p className="text-sm text-white/80">{result.playlist}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mb-8">
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">最佳拍档</p>
                    <p className="text-sm font-medium text-white/90">{result.bestMatch}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">澶╃敓鍏嬫槦</p>
                    <p className="text-sm font-medium text-white/90">{result.nemesis}</p>
                  </div>
                </div>

                {/* Footer for the generated image */}
                <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-white text-black">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest">SOULTEST</p>
                      <p className="text-[9px] text-white/50">灵魂光谱实验室</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40">闀挎寜淇濆瓨鍥剧墖</p>
                    <p className="text-[10px] text-white/40">搜索「灵测」测测你的 Aura</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Right Side / Mobile Bottom Actions */}
          <div className="w-full lg:w-80 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Mobile Actions */}
            <div className="flex lg:hidden flex-col gap-4 w-full mt-2">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-bold text-slate-950 transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Download className="size-5" />
                {isExporting ? "鐢熸垚涓?.." : "淇濆瓨楂樻竻娴锋姤"}
              </button>
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/50 px-6 py-4 text-base font-medium text-white backdrop-blur-md transition hover:bg-white/10"
              >
                <Compass className="size-5" />
                鎺㈢储鏇村娣卞害娴嬭瘯
              </Link>
            </div>

            {/* Desktop Side Recommendations */}
            <div className="hidden lg:block w-full">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif">
                <Sparkles className="size-5 text-fuchsia-400" />
                缁х画鎺㈢储鑷繁
              </h3>
              
              <div className="space-y-4">
                <Link
                  to="/"
                  className="group flex flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all hover:border-fuchsia-500/50 hover:bg-black/60"
                >
                  <div className="p-5 flex flex-col flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] text-white/70 mb-3 w-max">
                      鏈€鍙楁杩?                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-fuchsia-300 transition-colors">16 型人格深度图谱</h4>
                    <p className="text-[13px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      鍩轰簬 OEJTS 妗嗘灦锛岃秴璇︾粏瑙ｈ浣犵殑鎭嬬埍銆佽亴鍦轰笌鍘嬪姏搴斿妯″紡銆?                    </p>
                    <div className="mt-auto flex items-center text-fuchsia-400 text-xs font-medium">
                      鍘荤湅鐪?<ArrowRight className="size-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


