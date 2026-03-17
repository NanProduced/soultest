import { useRef, useState } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { motion } from "framer-motion"
import {
  Download,
  ArrowLeft,
  Sparkles,
  Ghost,
  ShieldAlert,
  Zap,
  Compass,
  ArrowRight,
  RefreshCcw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FreeQuizRuntimeLoadingScreen, FreeQuizRuntimeUnavailableScreen, useFreeQuizRuntime } from "@/features/free-quizzes/runtime"
import { exportNodeAsPng } from "@/lib/export-node-as-image"
import { cn } from "@/lib/utils"

export function FreeSzondiResultPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const resultRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const typeId = searchParams.get("type") || "h"
  const score = parseInt(searchParams.get("score") || "10")
  const { freeRuntime, isLoading, error } = useFreeQuizRuntime("free/szondi")
  const szondiFactors = (freeRuntime?.factorMap ?? {}) as Record<string, any>
  const result = szondiFactors[typeId] || szondiFactors.h

  if (isLoading) {
    return <FreeQuizRuntimeLoadingScreen className="bg-[#060010] text-white" />
  }

  if (error || Object.keys(szondiFactors).length === 0) {
    return <FreeQuizRuntimeUnavailableScreen className="bg-[#0A0A0A] text-white" backTo="/free/szondi" />
  }

  // Max score is now 24 (6*3 from faces + 3*2 from situations)
  const shadowConcentration = Math.min(Math.round((score / 24) * 100), 100)
  
  const getConcentrationLevel = (s: number) => {
    if (s >= 80) return { label: "娣卞眰鍘嬫姂", color: "text-red-600", bg: "bg-red-600" }
    if (s >= 60) return { label: "涓害鍘嬫姂", color: "text-orange-500", bg: "bg-orange-500" }
    if (s >= 40) return { label: "杞诲害鍘嬫姂", color: "text-yellow-500", bg: "bg-yellow-500" }
    return { label: "寰噺鐥曡抗", color: "text-green-500", bg: "bg-green-500" }
  }

  const level = getConcentrationLevel(shadowConcentration)

  const handleExport = async () => {
    if (!resultRef.current || isExporting) return
    setIsExporting(true)
    try {
      await exportNodeAsPng(resultRef.current, {
        filename: `SoulTest-Szondi-${result.name}.png`,
        backgroundColor: "#0A0A0A"
      })
    } catch (error) {
      console.error(error)
      alert("淇濆瓨澶辫触锛岃鎴浘淇濆瓨")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-red-500/30 font-sans pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: result.color }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* Header Actions */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/free/szondi")}
          className="rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="size-5 text-white/40" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/free/szondi/test")}
            className="text-white/40 hover:text-white"
          >
            <RefreshCcw className="size-4 mr-2" />
            閲嶆祴
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-red-900/80 hover:bg-red-800 text-white rounded-full px-4"
          >
            {isExporting ? "鐢熸垚涓?.." : "淇濆瓨缁撴灉"}
            <Download className="ml-2 size-4" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 space-y-12">
        
        {/* The Result Card (Exportable) */}
        <div ref={resultRef} className="bg-[#0D0D0D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Ghost className="size-12 text-white" />
          </div>

          <div className="p-8 md:p-12 space-y-8">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{result.symbol}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
                    {result.name}
                  </h1>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/30 font-light">
                    {result.englishName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 w-fit rounded-full">
                 <span className="text-[10px] uppercase tracking-widest text-white/40">
                   {result.originSource}
                 </span>
              </div>
            </header>

            {/* Face Image Overlay */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 group">
               <img 
                 src={`/images/szondi/1${typeId}.jpg`} 
                 className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 transition-opacity"
                 onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x450/000000/333333?text=${result.name}`
                 }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
               <div className="absolute bottom-6 left-6 right-6">
                 <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-relaxed">
                   {result["命题"] ?? result.description}
                 </p>
               </div>
            </div>

            {/* Concentration Index */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">鏆楀奖娴撳害鎸囨暟</span>
                <span className={cn("text-xs font-bold uppercase tracking-widest", level.color)}>
                  {level.label} ({shadowConcentration}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${shadowConcentration}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className={cn("h-full", level.bg)}
                />
              </div>
              <p className="text-[10px] text-white/20 leading-relaxed">
                *鍩轰簬鏉捐开鎶曞皠鐞嗚锛屽緱鍒嗚秺楂樹唬琛ㄨ椹卞姏鍥犲瓙鍦ㄤ綘鐨勬綔鎰忚瘑涓鍘嬫姂寰楄秺娣便€?              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-red-500 font-bold">娣卞眰瑙ｆ瀽鎶ュ憡</h3>
              <p className="text-white/70 leading-relaxed font-light text-base md:text-lg">
                {result.description}
              </p>
            </div>
          </div>

          <div className="bg-white/5 p-6 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-red-500" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">SoulTest Lab · 潜意识解码</span>
             </div>
             <div className="text-[10px] text-white/20 font-mono">ID: {typeId.toUpperCase()}-{score}</div>
          </div>
        </div>

        {/* Detailed Sections (Scroll Only) */}
        <div className="space-y-12">
          
          {/* Origin Analysis */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-900/20 text-red-500">
                <ShieldAlert className="size-5" />
              </div>
              <h3 className="text-lg font-bold tracking-wide">鍘嬫姂鏉ユ簮鍒嗘瀽</h3>
            </div>
            <ul className="grid gap-3">
              {result.analysis.origin.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-red-900 font-bold text-xs mt-1">0{idx+1}</span>
                  <p className="text-white/60 text-sm leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Behavior Patterns */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-900/20 text-red-500">
                <Zap className="size-5" />
              </div>
              <h3 className="text-lg font-bold tracking-wide">鏃ュ父琛屼负琛ㄧ幇</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.analysis.behavior.map((item: string, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-white/50">
                   {item}
                </div>
              ))}
            </div>
          </section>

          {/* Relationship */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-red-900/20 to-transparent border border-red-900/20">
             <h3 className="text-xs uppercase tracking-[0.3em] text-red-500 font-bold mb-4">鍏崇郴妯″紡</h3>
             <p className="text-white/80 leading-relaxed font-light">
               {result.analysis.relationship}
             </p>
          </section>

          {/* Hidden Power */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-900/20 text-red-500">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-lg font-bold tracking-wide">隐藏的力量</h3>
            </div>
            <p className="text-white/60 leading-relaxed italic border-l-2 border-red-900 pl-6 py-2">
              {result.analysis.power}
            </p>
          </section>

          {/* Suggestions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-900/20 text-red-500">
                <Compass className="size-5" />
              </div>
              <h3 className="text-lg font-bold tracking-wide">整合建议</h3>
            </div>
            <div className="grid gap-3">
              {result.analysis.suggestions.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                   <span className="text-sm text-white/70">{item}</span>
                   <ArrowRight className="size-4 text-white/20" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Lead Generation */}
        <div className="pt-12 space-y-8">
           <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">这只是冰山一角</h3>
              <p className="text-white/40 text-sm">鎯宠娣卞叆鎺㈢储浣犵殑鏆楅潰浜烘牸鍚楋紵</p>
           </div>

           <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/quizzes/dark-feminine-energy")}
                className="h-auto p-6 flex flex-col items-start gap-4 rounded-3xl border-red-900/30 bg-red-900/5 hover:bg-red-900/10 transition-all text-left group"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-red-900/40 rounded text-[10px] uppercase tracking-widest">鐑棬鎺ㄨ崘</div>
                  <span className="text-red-500 font-bold">楼5.90</span>
                </div>
                <div>
                   <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">暗面原型测试</h4>
                   <p className="text-xs text-white/40 mt-1">娴嬪嚭浣犵殑鏆楅粦鍘熷瀷锛歋iren / Vampire / Witch...</p>
                </div>
                <ArrowRight className="ml-auto size-5 text-red-900 group-hover:text-red-500 transition-colors" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/quizzes/shadow-personality-deep-report")}
                className="h-auto p-6 flex flex-col items-start gap-4 rounded-3xl border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-white/10 rounded text-[10px] uppercase tracking-widest text-white/40">娣卞害鎶ュ憡</div>
                  <span className="text-white/60 font-bold">楼9.90</span>
                </div>
                <div>
                   <h4 className="text-lg font-bold text-white">闃村奖浜烘牸娣卞害鍒嗘瀽鎶ュ憡</h4>
                   <p className="text-xs text-white/40 mt-1">鑽ｆ牸蹇冪悊瀛﹁儗涔?鈥?绔ュ勾鏉ユ簮杩芥函 鈥?鏁村悎琛屽姩鎸囧崡</p>
                </div>
                <ArrowRight className="ml-auto size-5 text-white/10 group-hover:text-white/30 transition-colors" />
              </Button>
           </div>
        </div>

      </main>

      {/* Fixed Share Overlay (Hidden) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent z-40 md:hidden">
         <Button onClick={handleExport} className="w-full h-12 bg-red-900 hover:bg-red-800 rounded-full">
            淇濆瓨娴嬭瘯鎶ュ憡
         </Button>
      </div>
    </div>
  )
}


