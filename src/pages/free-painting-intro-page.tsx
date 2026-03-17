import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"

export function FreePaintingIntroPage() {
  const navigate = useNavigate()

  const cards = [
    {
      category: "印象主义",
      title: "星月夜",
      src: "/images/paintings/The_Starry_Night.jpg",
      content: <div className="text-white/80 leading-relaxed">文森特·梵高的代表作，描绘了圣雷米疗养院窗外的深秋景色。流动的线条与旋转的星辰展现了艺术家的内心世界。</div>,
    },
    {
      category: "文艺复兴",
      title: "蒙娜丽莎",
      src: "/images/paintings/Mona_Lisa.webp",
      content: <div className="text-white/80 leading-relaxed">列奥纳多·达·芬奇的杰作，以其神秘的微笑和高超的晕涂法闻名于世，代表了人类文明的巅峰审美。</div>,
    },
    {
      category: "表现主义",
      title: "呐喊",
      src: "/images/paintings/The_Scream.jpg",
      content: <div className="text-white/80 leading-relaxed">爱德华·蒙克的灵魂之作，用强烈的色彩和扭曲的线条捕捉了现代人内心的焦虑与存在主义的恐惧。</div>,
    },
    {
      category: "荷兰黄金时代",
      title: "戴珍珠耳环的少女",
      src: "/images/paintings/Girl_with_a_Pearl_Earring.jpg",
      content: <div className="text-white/80 leading-relaxed">约翰内斯·维米尔的传世之作，其构图简约却极具张力，光影处理细腻，少女的回眸如幻梦般动人。</div>,
    },
    {
      category: "浮世绘",
      title: "神奈川冲浪里",
      src: "/images/paintings/The_Great_Wave_off_Kanagawa.jpg",
      content: <div className="text-white/80 leading-relaxed">葛饰北斋的标志性版画，巨大的浪花与远处的富士山形成鲜明对比，展现了自然的伟力与人生的波澜。</div>,
    },
    {
      category: "超现实主义",
      title: "记忆的永恒",
      src: "/images/paintings/The_Persistence_of_Memory.jpg",
      content: <div className="text-white/80 leading-relaxed">萨尔瓦多·达利的梦境之作，柔软的钟表象征着时间的相对性与无意识领域的奇幻探索。</div>,
    },
  ];

  const carouselItems = cards.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

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

      <main className="relative z-10 w-full max-w-7xl px-6 py-12 flex flex-col items-center text-center">
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

        {/* Feature Preview - Replaced with Apple Cards Carousel */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="w-full mt-12"
        >
          <Carousel items={carouselItems} />
        </motion.div>
      </main>

      <footer className="absolute bottom-8 text-white/20 text-xs tracking-widest uppercase">
        © SoulTest Art Lab • 2026
      </footer>
    </div>
  )
}

