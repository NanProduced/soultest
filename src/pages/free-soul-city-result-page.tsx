import { useRef, useState } from "react"
import { Navigate, useSearchParams, Link } from "react-router"
import { ArrowLeft, ArrowRight, Download, Sparkles, MapPin, Compass } from "lucide-react"

import { FreeQuizRuntimeLoadingScreen, FreeQuizRuntimeUnavailableScreen, useFreeQuizRuntime } from "@/features/free-quizzes/runtime"
import { exportNodeAsPng } from "@/lib/export-node-as-image"

const dimensionLabels = {
  R: { name: "生活节奏", low: "慢生活", high: "快节奏" },
  A: { name: "审美取向", low: "自然质朴", high: "精致先锋" },
  S: { name: "社交磁场", low: "独处内省", high: "热闹群聚" },
  O: { name: "秩序感", low: "自由随性", high: "秩序精密" },
  E: { name: "情感浓度", low: "克制留白", high: "浓烈热情" },
}

export function FreeSoulCityResultPage() {
  const [searchParams] = useSearchParams()
  const resultKey = searchParams.get("key")
  const { freeRuntime, isLoading, error } = useFreeQuizRuntime("free/soul-city")
  const soulCityResults = (freeRuntime?.resultMap ?? {}) as Record<string, any>
  const result = resultKey ? soulCityResults[resultKey] : null
  const posterRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  if (isLoading) {
    return <FreeQuizRuntimeLoadingScreen className="bg-[#050510] text-white" />
  }

  if (error || Object.keys(soulCityResults).length === 0) {
    return <FreeQuizRuntimeUnavailableScreen className="bg-[#050510] text-white" backTo="/free/soul-city" />
  }

  if (!result) {
    return <Navigate replace to="/free/soul-city" />
  }

  const handleExport = async () => {
    if (!posterRef.current || isExporting) return
    setIsExporting(true)
    try {
      await exportNodeAsPng(posterRef.current, {
        filename: `SoulTest-City-${result.name}.png`,
        backgroundColor: '#050510',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      })
    } catch (err) {
      console.error("Export failed", err)
      alert("保存海报失败，请重试")
    } finally {
      setIsExporting(false)
    }
  }

  const dimensionValues = result.fiveDimension

  return (
    <div 
      className="min-h-screen text-white selection:bg-white/30 font-sans"
      style={{ background: result.bgGradient }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-24 md:px-8">
        
        {/* Desktop Layout: Image on left, Content on right */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
          
          {/* Main Poster Content */}
          <div className="w-full lg:w-[520px] shrink-0">
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center justify-between mb-6">
               <Link
                to="/free/soul-city"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
              >
                <ArrowLeft className="size-4" /> 重新测试
              </Link>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Download className="size-4" />
                {isExporting ? "生成中..." : "保存高清海报"}
              </button>
            </div>

            {/* Poster Card for Export */}
            <div 
              ref={posterRef} 
              className="w-full overflow-hidden rounded-[32px] bg-[#050510] border border-white/10 shadow-2xl relative"
            >
              {/* Background Effects */}
              <div className="absolute inset-0">
                <div 
                  className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-40 pointer-events-none"
                  style={{ background: result.shadowColor }}
                />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none bg-gradient-to-tr from-sky-500" />
              </div>

              {/* City Illustration */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050510]/50 to-[#050510]" />
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url('/images/soul-city/${result.key}.jpg')`,
                    opacity: 0.5
                  }}
                />
                {/* Fallback gradient if image not available */}
                <div 
                  className="absolute inset-0 opacity-50"
                  style={{ background: result.imageGradient }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl sm:text-9xl drop-shadow-2xl filter">
                    {result.emoji}
                  </div>
                </div>
                {/* City Name Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <span className="text-sm font-medium text-white/90">{result.alias}</span>
                  </div>
                </div>
              </div>

              <div className="relative p-6 sm:p-8">
                {/* Result Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 mb-4">
                    你的灵魂城市
                  </div>
                  <h1 className={`text-5xl sm:text-6xl font-bold tracking-tight mb-2 ${result.textColor}`}>
                    {result.name}
                  </h1>
                  <p className="text-sm text-white/50 uppercase tracking-widest">
                    {result.keywords[0]} · {result.keywords[1]}
                  </p>
                </div>

                {/* Tagline */}
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 mb-6">
                  <p className="text-lg font-serif italic text-center text-white/90 leading-relaxed">
                    "{result.tagline}"
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-sm leading-relaxed text-white/70 text-center mb-4">
                    {result.description}
                  </p>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {result.keywords.map((kw: string, i: number) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/70"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Five Dimension Radar */}
                <div className="mb-8">
                  <h3 className="flex items-center justify-center gap-2 text-sm font-bold mb-4 text-white/60">
                    <Sparkles className={`size-4 ${result.textColor}`} />
                    灵魂五维图谱
                  </h3>
                  <div className="space-y-3">
                    {(Object.keys(dimensionLabels) as Array<keyof typeof dimensionLabels>).map((key) => {
                      const dim = dimensionLabels[key]
                      const value = dimensionValues[key]
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-xs text-white/40 w-12 shrink-0">{dim.name}</span>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${value}%`,
                                background: `linear-gradient(90deg, ${result.shadowColor}, ${result.shadowColor}88)`
                              }}
                            />
                          </div>
                          <span className="text-xs text-white/60 w-16 text-right">{value}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Personality Tags */}
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 mb-6">
                  <h3 className="text-xs font-bold text-white/40 mb-3 uppercase tracking-widest text-center">城市人格</h3>
                  <p className={`text-sm font-bold text-center ${result.textColor}`}>
                    {result.personality}
                  </p>
                </div>

                {/* Portrait */}
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 mb-6">
                  <h3 className="text-xs font-bold text-white/40 mb-3 uppercase tracking-widest">灵魂画像</h3>
                  <p className="text-sm leading-relaxed text-white/80">
                    {result.portrait}
                  </p>
                </div>

                {/* Travel Tip */}
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 mb-6">
                  <h3 className="flex items-center gap-2 text-xs font-bold text-white/40 mb-3 uppercase tracking-widest">
                    <Compass className="size-4" />
                    旅行建议
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    {result.travelTip}
                  </p>
                </div>

                {/* Match Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-[10px] uppercase text-white/40 mb-2">灵魂共鸣</p>
                    <p className="text-sm font-medium text-white/90">{result.bestMatch}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-[10px] uppercase text-white/40 mb-2">灵魂对立</p>
                    <p className="text-sm font-medium text-white/90">{result.oppositeMatch}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest">SOULTEST</p>
                      <p className="text-[9px] text-white/50">灵魂地图实验室</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40">长按保存图片</p>
                    <p className="text-[10px] text-white/40">搜索「灵测」发现更多</p>
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
                {isExporting ? "生成中..." : "保存高清海报"}
              </button>
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/50 px-6 py-4 text-base font-medium text-white backdrop-blur-md transition hover:bg-white/10"
              >
                <Compass className="size-5" />
                探索更多深度测试
              </Link>
            </div>

            {/* Desktop Side Recommendations */}
            <div className="hidden lg:block w-full">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-serif">
                <Sparkles className="size-5 text-sky-400" />
                继续探索自己
              </h3>
              
              <div className="space-y-4">
                <Link
                  to="/"
                  className="group flex flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all hover:border-sky-500/50 hover:bg-black/60"
                >
                  <div className="p-5 flex flex-col flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] text-white/70 mb-3 w-max">
                      最受欢迎
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-sky-300 transition-colors">16 型人格深度图谱</h4>
                    <p className="text-[13px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      基于 OEJTS 框架，超详细解读你的恋爱、职场与压力应对模式。
                    </p>
                    <div className="mt-auto flex items-center text-sky-400 text-xs font-medium">
                      去看看 <ArrowRight className="size-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                <Link
                  to="/free/aura"
                  className="group flex flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all hover:border-fuchsia-500/50 hover:bg-black/60"
                >
                  <div className="p-5 flex flex-col flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] text-white/70 mb-3 w-max">
                      免费测试
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-fuchsia-300 transition-colors">你的 Aura 是什么颜色？</h4>
                    <p className="text-[13px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      探索你的灵魂光谱，发现专属的气场颜色。
                    </p>
                    <div className="mt-auto flex items-center text-fuchsia-400 text-xs font-medium">
                      去看看 <ArrowRight className="size-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
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

