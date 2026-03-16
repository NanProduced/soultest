import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FreePaintingIntroPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#060010] text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background with blurred art texture */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000')] bg-cover bg-center opacity-20 scale-110 blur-xl" 
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060010]/60 via-[#060010]/80 to-[#060010]" />
      </div>

      <main className="relative z-10 w-full max-w-4xl px-6 py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <Palette className="size-4 text-indigo-400" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-indigo-300">艺术人格测试</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white/70">
            你的灵魂是哪幅<br /><span className="italic">世界名画？</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12">
            每个人的灵魂深处，都藏着一幅世界名画。<br />
            通过 28 道审美与直觉的对话，发现你跨越时空的艺术映射。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <Button
            size="lg"
            onClick={() => navigate("/free/painting/test")}
            className="h-16 px-10 rounded-full bg-white text-[#060010] hover:bg-indigo-50 transition-all text-lg font-bold group shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            开启探索之旅
            <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="flex items-center gap-8 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <span>28 题深度匹配</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <span>壁纸级结果卡片</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Preview */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-4 w-full opacity-40 hover:opacity-100 transition-opacity duration-700"
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className={`aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 overflow-hidden ${i === 3 ? 'hidden md:block' : ''}`}>
              <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse" />
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="absolute bottom-8 text-white/20 text-xs tracking-widest uppercase">
        © SoulTest Art Lab • 2026
      </footer>
    </div>
  )
}
