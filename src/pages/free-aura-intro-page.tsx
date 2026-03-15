import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router"
import { motion } from "framer-motion"

export function FreeAuraIntroPage() {
  return (
    <div className="relative min-h-screen bg-[#060010] text-white selection:bg-fuchsia-500/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(168,85,247,0.15),_transparent_40%),radial-gradient(circle_at_80%_70%,_rgba(245,158,11,0.1),_transparent_40%)]" />
      
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-300 backdrop-blur-md mb-8">
            <Sparkles className="size-4" />
            灵魂光谱实验室 · 免费体验
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-serif">
            你的 Aura 是什么颜色？
          </h1>
          
          <p className="text-lg md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            每个人都有专属的灵魂光谱，测测你散发着怎样的气场。
            <br className="hidden md:block" />
            基于双维度四象限模型，3分钟揭晓你的灵魂底色。
          </p>

          <Link
            to="/free/aura/test"
            className="group relative inline-flex h-14 md:h-16 items-center justify-center rounded-full bg-white px-10 md:px-12 text-base md:text-lg font-bold text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(168,85,247,0.3)]"
          >
            开始探索 <ArrowRight className="ml-2 size-5 md:size-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md text-left transition hover:bg-white/[0.05] hover:border-white/10">
            <h3 className="text-xl font-bold text-fuchsia-300 mb-3">18 道情境题</h3>
            <p className="text-base text-white/50 leading-relaxed">深入潜意识的选择，摒弃刻板印象，真实还原你的情感与逻辑倾向。</p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md text-left transition hover:bg-white/[0.05] hover:border-white/10">
            <h3 className="text-xl font-bold text-amber-300 mb-3">8 种稀有光谱</h3>
            <p className="text-base text-white/50 leading-relaxed">从黄金之光到月光银白，每一种颜色都对应着独一无二的人格特质。</p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md text-left transition hover:bg-white/[0.05] hover:border-white/10">
            <h3 className="text-xl font-bold text-sky-300 mb-3">专属灵魂画像</h3>
            <p className="text-base text-white/50 leading-relaxed">提供多维度解读、高光时刻、充电仪式，并生成可珍藏的精美报告图。</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
