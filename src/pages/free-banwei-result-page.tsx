import { useRef, useState } from "react"
import { Navigate, useSearchParams, Link } from "react-router"
import { ArrowLeft, ArrowRight, Download, Sparkles, Compass, Beaker, Pill, AlertTriangle, ScanLine, Activity, FlaskConical } from "lucide-react"

import { banweiResults, calculateDimensionPercent, DIMENSION_NAMES } from "@/features/free-quizzes/banwei-data"
import { exportNodeAsPng } from "@/lib/export-node-as-image"

export function FreeBanweiResultPage() {
  const [searchParams] = useSearchParams()
  const resultKey = searchParams.get("key")
  const totalScoreStr = searchParams.get("score")
  const dimsStr = searchParams.get("dims")
  
  const result = resultKey ? banweiResults[resultKey] : null
  const posterRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  if (!result || !totalScoreStr || !dimsStr) {
    return <Navigate replace to="/free/banwei" />
  }

  const dims = dimsStr.split('-').map(Number)
  const dimPercents = {
    caffeine: calculateDimensionPercent(dims[0]),
    kpiInvasion: calculateDimensionPercent(dims[1]),
    mentalDrain: calculateDimensionPercent(dims[2]),
    deskBond: calculateDimensionPercent(dims[3]),
    lifeFade: calculateDimensionPercent(dims[4]),
  }

  const handleExport = async () => {
    if (!posterRef.current || isExporting) return
    setIsExporting(true)
    try {
      await exportNodeAsPng(posterRef.current, {
        filename: `SoulTest-Banwei-${result.name}.png`,
        backgroundColor: '#f8fafc', // slate-50
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      })
    } catch (err) {
      console.error("Export failed", err)
      alert("保存报告失败，请重试")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-slate-100 text-slate-900 selection:bg-sky-500/30 font-sans relative">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-24 md:px-8">
        
        {/* Desktop Layout Wrapper */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
          
          {/* Main Poster Content (this is the element we export) */}
          <div className="w-full lg:w-[480px] shrink-0">
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center justify-between mb-6">
               <Link
                to="/free/banwei"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
              >
                <ArrowLeft className="size-4" /> 重新检测
              </Link>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:scale-105 active:scale-95 shadow-md"
              >
                <Download className="size-4" />
                {isExporting ? "生成中..." : "保存检测报告"}
              </button>
            </div>

            {/* REPORT CARD */}
            <div 
              ref={posterRef} 
              className="w-full overflow-hidden bg-white border border-slate-200 shadow-xl relative"
            >
              {/* Header */}
              <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <Beaker className="size-32 -mt-8 -mr-8" />
                </div>
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-slate-400 mb-1">SOULTEST LAB</h2>
                    <h1 className="text-2xl font-black tracking-tight">班味浓度检测报告</h1>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-slate-400">NO. BW-2026-T1</div>
                    <div className="text-[10px] text-slate-500 mt-1">CONFIDENTIAL</div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 relative">
                
                {/* Tube / Concentration Visual */}
                <div className="flex items-center gap-6 mb-10">
                  {/* Tube graphic */}
                  <div className="w-12 h-32 rounded-full border-4 border-slate-200 bg-slate-50 relative overflow-hidden shrink-0 flex items-end">
                    {/* Liquid */}
                    <div 
                      className={`w-full transition-all duration-1000 ease-out ${result.colorClass}`}
                      style={{ height: result.concentrationRange.split('-')[1] }} // Use the max value roughly as height
                    >
                      {/* Bubbles */}
                      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white/40 animate-ping"></div>
                      <div className="absolute bottom-6 right-2 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse"></div>
                    </div>
                    {/* Measurement marks */}
                    <div className="absolute inset-0 flex flex-col justify-between py-2 items-center opacity-30">
                      <div className="w-4 h-[2px] bg-slate-400"></div>
                      <div className="w-2 h-[1px] bg-slate-400"></div>
                      <div className="w-4 h-[2px] bg-slate-400"></div>
                      <div className="w-2 h-[1px] bg-slate-400"></div>
                      <div className="w-4 h-[2px] bg-slate-400"></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        {result.level}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Score: {totalScoreStr}/60</span>
                    </div>
                    <h2 className={`text-4xl font-black tracking-tight mb-2 ${result.textColor}`}>
                      {result.emoji} {result.name}
                    </h2>
                    <p className="text-sm font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{result.tagline}"
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {result.keywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1 rounded-md text-xs font-bold border ${result.bgColor} ${result.textColor} border-current/20`}
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                    <Activity className="size-4" /> 实验室概述
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-serif italic">
                    {result.overview}
                  </p>
                </div>

                {/* Dimension Analysis */}
                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
                    <FlaskConical className="size-4" /> 五维成分分析
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'caffeine', label: DIMENSION_NAMES.caffeine.name, icon: DIMENSION_NAMES.caffeine.emoji, val: dimPercents.caffeine },
                      { key: 'kpiInvasion', label: DIMENSION_NAMES.kpiInvasion.name, icon: DIMENSION_NAMES.kpiInvasion.emoji, val: dimPercents.kpiInvasion },
                      { key: 'mentalDrain', label: DIMENSION_NAMES.mentalDrain.name, icon: DIMENSION_NAMES.mentalDrain.emoji, val: dimPercents.mentalDrain },
                      { key: 'deskBond', label: DIMENSION_NAMES.deskBond.name, icon: DIMENSION_NAMES.deskBond.emoji, val: dimPercents.deskBond },
                      { key: 'lifeFade', label: DIMENSION_NAMES.lifeFade.name, icon: DIMENSION_NAMES.lifeFade.emoji, val: dimPercents.lifeFade },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-700">{item.icon} {item.label}</span>
                          <span className="font-mono text-slate-500">{item.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${result.colorClass}`} 
                            style={{ width: `${item.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manifestations */}
                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
                    <Sparkles className="size-4" /> 临床表现
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-400 mb-1">上班时</div>
                      <div className="text-xs text-slate-700 leading-relaxed">{result.manifestations.work}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-400 mb-1">下班后</div>
                      <div className="text-xs text-slate-700 leading-relaxed">{result.manifestations.afterWork}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-400 mb-1">周末时</div>
                      <div className="text-xs text-slate-700 leading-relaxed">{result.manifestations.weekend}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="text-[10px] font-bold text-slate-400 mb-1">假期时</div>
                      <div className="text-xs text-slate-700 leading-relaxed">{result.manifestations.holiday}</div>
                    </div>
                  </div>
                </div>

                {/* Medical Advice */}
                <div className="mb-8 bg-[#fffcf0] border border-[#fef08a] p-5 rounded-2xl relative shadow-sm">
                  <div className="absolute -top-3 -right-3 size-12 bg-[#fef08a] rounded-full opacity-20 blur-md" />
                  <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-3">
                    <Pill className="size-4" /> 专家医嘱
                  </h3>
                  <p className="text-sm text-amber-900/80 leading-relaxed font-serif">
                    {result.medicalAdvice}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-amber-200/50">
                    <div className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1">
                      <AlertTriangle className="size-3" /> 解药配方
                    </div>
                    <ul className="space-y-1.5">
                      {result.antidote.map((item, i) => (
                        <li key={i} className="text-xs text-amber-900/70 flex gap-2">
                          <span className="text-amber-500 font-bold">·</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quote */}
                <div className="mb-8 text-center px-4">
                  <div className="text-3xl text-slate-200 font-serif leading-none h-4">"</div>
                  <p className="text-sm font-bold text-slate-700 italic">
                    {result.quote}
                  </p>
                  <div className="text-3xl text-slate-200 font-serif leading-none h-4 text-right">"</div>
                </div>

                {/* Best Match */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 shrink-0">🤝</div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-0.5">最佳共鸣搭子</div>
                    <div className="text-sm text-slate-700 leading-relaxed">{result.bestMatch}</div>
                  </div>
                </div>

                {/* Footer for Image */}
                <div className="border-t-2 border-dashed border-slate-200 pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <ScanLine className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-widest text-slate-900">SOULTEST LAB</p>
                      <p className="text-[9px] text-slate-500">打工人精神状态实验室</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-slate-400">长按保存检测报告</p>
                    <p className="text-[10px] text-slate-400">搜索「灵测」开始检测</p>
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 text-base font-bold text-white transition hover:scale-105 active:scale-95 shadow-lg"
              >
                <Download className="size-5" />
                {isExporting ? "生成中..." : "保存高清报告图"}
              </button>
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 text-base font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Compass className="size-5" />
                探索更多深度测试
              </Link>
            </div>

            {/* Desktop Side Recommendations */}
            <div className="hidden lg:block w-full">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                <Sparkles className="size-5 text-sky-500" />
                继续探索自己
              </h3>
              
              <div className="space-y-4">
                <Link
                  to="/"
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-sky-300 hover:shadow-lg"
                >
                  <div className="p-5 flex flex-col flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-[10px] text-sky-700 font-bold mb-3 w-max">
                      最受欢迎
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-wide group-hover:text-sky-600 transition-colors">16 型人格深度图谱</h4>
                    <p className="text-[13px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      基于 OEJTS 框架，超详细解读你的恋爱、职场与压力应对模式。
                    </p>
                    <div className="mt-auto flex items-center text-sky-600 text-xs font-bold">
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
