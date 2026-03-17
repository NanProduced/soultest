import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ArrowRight, Eye, Ghost } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FreeSzondiIntroPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-red-500/30 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-[url('/images/szondi/cover.jpg')] bg-cover bg-center opacity-10 scale-110 blur-lg" 
          aria-hidden="true"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <main className="relative z-10 w-full max-w-4xl px-6 py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="mb-12 relative"
        >
          <div className="relative size-32 md:size-40 flex items-center justify-center">
            {/* The "Opening Eye" animation simplified with Lucide + Framer */}
            <motion.div
              initial={{ scaleY: 0.1, opacity: 0 }}
              animate={{ scaleY: [0.1, 1, 0.1, 1], opacity: 1 }}
              transition={{ 
                duration: 4, 
                times: [0, 0.2, 0.3, 0.5],
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="text-red-600/60"
            >
              <Eye className="size-full stroke-[0.5]" />
            </motion.div>
            <div className="absolute inset-0 bg-red-500/5 rounded-full blur-2xl animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 backdrop-blur-md mb-8">
            <Ghost className="size-4 text-red-500" />
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-red-400">潜意识暗影检测</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-8">
            松迪潜意识测试<br />
            <span className="text-red-700 italic opacity-80 mt-2 block">你的恐惧暴露了你</span>
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-6 text-white/50 text-base md:text-lg leading-relaxed mb-12 font-light">
            <p>
              1935 年，匈牙利精神科医生 Leopold Szondi 发现了一个惊人的秘密——
              我们对某些面孔的恐惧反应，能精准揭示被压抑在潜意识深处的隐藏冲动。
            </p>
            <p className="text-red-400/60 italic">
              「你最害怕的那张脸，藏着你不敢面对的自己」
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <Button
            size="lg"
            onClick={() => navigate("/free/szondi/test")}
            className="h-16 px-12 rounded-none border border-red-900 bg-transparent text-red-500 hover:bg-red-950 hover:text-red-400 transition-all text-xl font-light tracking-[0.2em] group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              开始解码
              <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-red-900/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>

          <div className="flex items-center gap-8 text-white/20 text-xs tracking-widest uppercase mt-4">
            <div className="flex items-center gap-2">
              <span>Scientific Projection</span>
            </div>
            <div className="size-1 rounded-full bg-red-900" />
            <div className="flex items-center gap-2">
              <span>Dark Aesthetics</span>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="absolute bottom-8 text-white/10 text-[10px] tracking-[0.4em] uppercase">
        Szondi Subconscious Lab • Established 1935
      </footer>
    </div>
  )
}
