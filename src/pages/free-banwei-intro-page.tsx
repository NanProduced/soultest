import { ArrowRight, Sparkles, Beaker, FlaskConical, Activity } from "lucide-react"
import { Link } from "react-router"
import { motion } from "framer-motion"

export function FreeBanweiIntroPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500/30 overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-sky-100/50 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm mb-8">
            <Beaker className="size-4 text-emerald-500" />
            打工人精神状态实验室 · 免费检测
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900 font-sans">
            你的<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-500">班味</span>浓度检测
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            实验室权威认证，精准测定你被工作「腌入味」的程度。
            <br className="hidden md:block" />
            基于五维成分分析表，2分钟揭晓你的社畜形态。
          </p>

          <Link
            to="/free/banwei/test"
            className="group relative inline-flex h-14 md:h-16 items-center justify-center rounded-full bg-slate-900 px-10 md:px-12 text-base md:text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(15,23,42,0.2)] hover:shadow-[0_15px_50px_rgba(15,23,42,0.3)]"
          >
            开始抽血化验 <ArrowRight className="ml-2 size-5 md:size-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-8 backdrop-blur-md text-left transition hover:bg-white hover:border-slate-300 shadow-sm">
            <div className="size-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
              <FlaskConical className="size-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">15 项生化指标</h3>
            <p className="text-base text-slate-500 leading-relaxed">从周末状态到聊天口头禅，深入潜意识提取你的职场 DNA 样本。</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-8 backdrop-blur-md text-left transition hover:bg-white hover:border-slate-300 shadow-sm">
            <div className="size-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-4">
              <Activity className="size-6 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">五维成分分析</h3>
            <p className="text-base text-slate-500 leading-relaxed">量化你的咖啡因依赖、精神内耗与生活褪色指数，拒绝模糊定性。</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-8 backdrop-blur-md text-left transition hover:bg-white hover:border-slate-300 shadow-sm">
            <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
              <Sparkles className="size-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">硬核医学报告</h3>
            <p className="text-base text-slate-500 leading-relaxed">生成包含临床表现与「医嘱单」的专业级长图报告，一键分享病友群。</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
