import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router"
import { ArrowRight, Download, Sparkles } from "lucide-react"

import type { CustomQuizResultPageProps } from "@/features/quizzes/custom-pages"
import { sd3Archetypes } from "@/features/quizzes/sd3-content"

function RadarChart({ scores }: { scores: { mach: number, narc: number, psych: number } }) {
  // A simple pure CSS/SVG representation of the radar chart or a simple horizontal bar chart
  // Since we don't have a charting library guaranteed, we'll use horizontal bars which are cleaner for mobile.
  return (
    <div className="space-y-4">
      {[
        { key: "mach", label: "策略操盘倾向 (Mach)", color: "bg-[#4A3B6B]", value: scores.mach },
        { key: "narc", label: "聚光主场倾向 (Narc)", color: "bg-[#C5A029]", value: scores.narc },
        { key: "psych", label: "冷感冒险倾向 (Psych)", color: "bg-[#8B1A1A]", value: scores.psych },
      ].map(trait => (
        <div key={trait.key} className="relative">
          <div className="flex justify-between text-xs mb-1 text-slate-300">
            <span>{trait.label}</span>
            <span className="font-mono">{trait.value.toFixed(2)}</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(trait.value / 5) * 100}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className={`h-full ${trait.color} rounded-full`}
             />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DarkTriadResultPage({ submission }: CustomQuizResultPageProps) {
  const [exporting, setExporting] = useState(false)
  const clientInfo = submission.clientInfo as any
  const { archetypeCode, avgs } = clientInfo || { archetypeCode: "A8", avgs: { mach: 3, narc: 3, psych: 3 } }
  const archetype = sd3Archetypes.find(a => a.code === archetypeCode) || sd3Archetypes[7]

  const sortedTraits = [
    { key: "mach", label: "策略操盘", score: avgs.mach },
    { key: "narc", label: "聚光主场", score: avgs.narc },
    { key: "psych", label: "冷感冒险", score: avgs.psych }
  ].sort((a, b) => b.score - a.score)

  const primary = sortedTraits[0]

  async function handleExport() {
    try {
      setExporting(true)
      const { exportNodeAsPng } = await import("@/lib/export-node-as-image")
      const node = document.getElementById("sd3-poster")
      if (node) {
        await exportNodeAsPng(node, {
          filename: `dark-triad-${archetypeCode}.png`,
          backgroundColor: "#09090B",
          pixelRatio: 2
        })
      }
    } catch (e) {
      console.error(e)
      alert("生成长图失败，请稍后重试")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-purple-500/30 font-sans pb-24">
      <div id="sd3-poster">
        {/* Hero Section */}
        <section className="relative px-6 pt-12 pb-16 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top right, ${archetype.color}, transparent 60%)` }} />
          <div className="max-w-xl mx-auto relative z-10 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-slate-300 mb-6">
                暗面力量测试结果
             </div>
             
             <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
               <span className="block text-xl md:text-2xl text-slate-400 font-normal mb-2">你的结果偏向</span>
               {archetype.name}
             </h1>
             <p className="text-lg md:text-xl text-slate-300 font-medium italic mb-8">
               "{archetype.tagline}"
             </p>

             <div className="flex flex-wrap justify-center gap-2 mb-10">
                <span className="px-3 py-1 bg-white/10 rounded-md text-xs font-medium border border-white/5">{sortedTraits[0].label}主导</span>
                <span className="px-3 py-1 bg-white/5 rounded-md text-xs text-slate-400 border border-white/5">次高维: {sortedTraits[1].label}</span>
             </div>

             <div className="p-6 bg-[#121216] rounded-[24px] border border-white/5 shadow-2xl text-left">
                <h3 className="text-sm font-medium text-slate-400 mb-6 flex items-center gap-2">
                   <Sparkles className="size-4" /> 三维结构分布
                </h3>
                <RadarChart scores={avgs} />
                <p className="mt-6 text-xs text-slate-500 leading-relaxed">
                   你的最高维是 {primary.label} ({primary.score.toFixed(2)})。如果两维分差很小，更适合把你理解为混合倾向，而不是单一标签。
                </p>
             </div>
          </div>
        </section>

        {/* Deep Dive Section */}
        <section className="px-6 py-8">
          <div className="max-w-xl mx-auto space-y-6">
             
             <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#1A1A1A] to-[#121216] border border-white/5">
                <h2 className="text-xl font-bold mb-4 text-white">主导特征解析</h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                   在人际与竞争中，你更依赖 <strong>{primary.label}</strong> 倾向。这意味着你通常会优先从这个视角理解局势、处理冲突和保护自己。
                </p>
                <div className="space-y-3">
                   <div className="p-4 rounded-xl bg-white/5">
                      <h4 className="text-xs font-bold text-slate-400 mb-1">优势面</h4>
                      <p className="text-sm text-slate-200">这赋予了你在特定高压或复杂环境下的存活能力，别人容易退让的地方，你往往能站住脚或看清本质。</p>
                   </div>
                   <div className="p-4 rounded-xl bg-white/5">
                      <h4 className="text-xs font-bold text-slate-400 mb-1">潜在代价</h4>
                      <p className="text-sm text-slate-200">当这种倾向过度使用时，往往会在不经意间推高你的人际信任成本或情绪消耗。</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[20px] bg-[#121216] border border-white/5">
                   <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">在关系中</h4>
                   <p className="text-xs text-slate-300 leading-relaxed">你往往不是毫无保留地交出底牌，而是通过观察、试探或建立自己的主场来确认安全感。</p>
                </div>
                <div className="p-5 rounded-[20px] bg-[#121216] border border-white/5">
                   <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">在竞争中</h4>
                   <p className="text-xs text-slate-300 leading-relaxed">你比一般人更懂得如何保护自己的核心利益，在面对冲突时不太容易轻易妥协。</p>
                </div>
             </div>

          </div>
        </section>
      </div>

      {/* CTA Section (Not part of the poster) */}
      <section className="px-6 py-12 text-center">
         <div className="max-w-md mx-auto">
            <p className="text-xs text-slate-500 mb-6">这是一份人格倾向报告，不是临床诊断，也不等于道德评判。</p>
            <div className="flex flex-col gap-3">
               <button onClick={handleExport} disabled={exporting} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50">
                  <Download className="size-4" />
                  {exporting ? "正在生成..." : "保存结果长图"}
               </button>
               <Link to="/quizzes" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#1A1A1A] text-white font-bold text-sm border border-white/5 hover:bg-[#222] transition-colors">
                  返回题集中心
               </Link>
            </div>
         </div>
      </section>
    </div>
  )
}
