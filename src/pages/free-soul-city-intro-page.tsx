import { ArrowRight, Sparkles, MapPin, Compass, Heart } from "lucide-react"
import { Link } from "react-router"
import { motion } from "framer-motion"

const featuredCities = [
  { name: "巴黎", emoji: "🗼", color: "from-rose-400 to-amber-300" },
  { name: "东京", emoji: "🏯", color: "from-rose-400 to-red-300" },
  { name: "纽约", emoji: "🗽", color: "from-amber-400 to-orange-500" },
  { name: "成都", emoji: "🐼", color: "from-emerald-400 to-green-300" },
  { name: "京都", emoji: "⛩️", color: "from-lime-400 to-green-300" },
  { name: "大理", emoji: "🌿", color: "from-teal-400 to-cyan-300" },
]

export function FreeSoulCityIntroPage() {
  return (
    <div className="relative min-h-screen bg-[#050510] text-white selection:bg-sky-500/30 overflow-hidden">
      {/* Background Cover Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/soul-city/cover.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-[#050510]/60 to-[#050510]" />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(14,165,233,0.15),_transparent_50%),radial-gradient(ellipse_at_70%_80%,_rgba(249,115,22,0.1),_transparent_50%)]" />
      
      {/* Floating City Elements - Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: [100, -100, 100], 
              opacity: [0.05, 0.1, 0.05],
              x: [0, 20, 0]
            }}
            transition={{ 
              duration: 15 + i * 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <div className="text-6xl blur-[1px]">
              {featuredCities[i]?.emoji}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-orange-500 blur-[30px] opacity-30" />
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] p-8 rounded-full border border-white/10">
                <MapPin className="size-16 text-sky-400" strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-300 backdrop-blur-md mb-8">
            <Sparkles className="size-4" />
            灵魂地图实验室 · 免费体验
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-serif">
            你的灵魂属于
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-orange-400 bg-clip-text text-transparent">
              哪座城市？
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            每个人的灵魂都有一座城市在等你。
            <br className="hidden md:block" />
            30道情境题，揭示你与18座全球城市的灵魂共鸣。
          </p>

          <Link
            to="/free/soul-city/test"
            className="group relative inline-flex h-14 md:h-16 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-10 md:px-12 text-base md:text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_60px_rgba(14,165,233,0.5)]"
          >
            开始探索 <ArrowRight className="ml-2 size-5 md:size-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Featured Cities Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20"
        >
          <p className="text-sm text-white/40 mb-6 uppercase tracking-widest">探索 18 座灵魂城市</p>
          <div className="flex flex-wrap justify-center gap-4">
            {featuredCities.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${city.color} bg-opacity-10 border border-white/10 backdrop-blur-sm`}
              >
                <span className="text-xl">{city.emoji}</span>
                <span className="text-sm font-medium text-white/80">{city.name}</span>
              </motion.div>
            ))}
            <div className="flex items-center px-4 py-2 rounded-full border border-white/5">
              <span className="text-sm text-white/40">+12 更多</span>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md text-left transition hover:bg-white/[0.05] hover:border-white/10 group">
            <div className="mb-4 p-3 rounded-2xl bg-sky-500/20 w-max group-hover:bg-sky-500/30 transition-colors">
              <Compass className="size-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-sky-300 mb-3">30 道情境题</h3>
            <p className="text-base text-white/50 leading-relaxed">5大章节，沉浸式场景体验，在故事中自然暴露你的性格特质。</p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md text-left transition hover:bg-white/[0.05] hover:border-white/10 group">
            <div className="mb-4 p-3 rounded-2xl bg-orange-500/20 w-max group-hover:bg-orange-500/30 transition-colors">
              <MapPin className="size-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-orange-300 mb-3">18 座全球城市</h3>
            <p className="text-base text-white/50 leading-relaxed">从巴黎到东京，从成都到纽约，每座城市都有独特的灵魂底色。</p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-md text-left transition hover:bg-white/[0.05] hover:border-white/10 group">
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/20 w-max group-hover:bg-rose-500/30 transition-colors">
              <Heart className="size-6 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-rose-300 mb-3">五维灵魂匹配</h3>
            <p className="text-base text-white/50 leading-relaxed">基于大五人格理论，算法精准匹配你的城市灵魂共鸣。</p>
          </div>
        </motion.div>

        {/* Test Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-white/40"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sky-500" />
            <span>预计耗时 5-7 分钟</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span>免费测试</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span>长图分享结果</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
