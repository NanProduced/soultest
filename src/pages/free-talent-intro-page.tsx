import { ArrowRight, Sparkles, Lightbulb, Target, TrendingUp } from "lucide-react"
import { Link } from "react-router"
import { motion } from "framer-motion"

export function FreeTalentIntroPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white selection:bg-amber-500/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(251,191,36,0.15),_transparent_40%),radial-gradient(circle_at_80%_70%,_rgba(139,92,246,0.1),_transparent_40%)]" />
      
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 backdrop-blur-md mb-8">
            <Sparkles className="size-4" />
            天赋探索实验室 · 免费体验
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-serif">
            你的隐藏天赋是什么？
          </h1>
          
          <p className="text-lg md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            每个人都有未被发现的超能力。
            <br className="hidden md:block" />
            基于六维天赋模型，3分钟找到你的天赋密码。
          </p>

          <Link
            to="/free/talent/test"
            className="group relative inline-flex h-14 md:h-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-10 md:px-12 text-base md:text-lg font-bold text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)]"
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
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/20">
                <Target className="size-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-300">20 道情境题</h3>
            </div>
            <p className="text-base text-white/50 leading-relaxed">深入日常生活的选择，摒弃刻板印象，真实还原你的天赋倾向。</p>
          </div>
          
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md text-left transition hover:bg-white/[0.05] hover:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/20">
                <Lightbulb className="size-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-300">六维天赋模型</h3>
            </div>
            <p className="text-base text-white/50 leading-relaxed">洞察力、共情力、创造力、表达力、行动力、感知力，全面解析你的天赋构成。</p>
          </div>
          
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md text-left transition hover:bg-white/[0.05] hover:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/20">
                <TrendingUp className="size-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-300">12 种天赋原型</h3>
            </div>
            <p className="text-base text-white/50 leading-relaxed">主天赋 + 副天赋组合，展现你的独特性，每一种都值得肯定和发挥。</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 md:mt-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/40 backdrop-blur-md">
            <Sparkles className="size-4" />
            已有 128,420 人完成测试
          </div>
        </motion.div>
      </div>
    </div>
  )
}
