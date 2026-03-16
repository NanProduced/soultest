import { useMemo, useRef } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { 
  Download, 
  Share2, 
  RefreshCcw, 
  Quote, 
  Thermometer, 
  Palette, 
  Brush,
  Zap,
  Heart,
  Coffee,
  Users,
  Briefcase,
  Music,
  Film,
  Lightbulb,
  Info
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  paintingResults, 
  calculatePaintingResult, 
  DIMENSION_LABELS,
  PAINTING_RELATIONS
} from "@/features/free-quizzes/painting-data"
import { cn } from "@/lib/utils"

export function FreePaintingResultPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const resultRef = useRef<HTMLDivElement>(null)

  const answersStr = searchParams.get("answers") || ""
  const answers = useMemo(() => answersStr.split(",").map(Number), [answersStr])

  const result = useMemo(() => {
    if (answers.length < 28) return null
    return calculatePaintingResult(answers)
  }, [answers])

  if (!result) {
    return (
      <div className="min-h-screen bg-[#060010] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif mb-4">正在追溯你的灵魂轨迹...</h2>
        <Button onClick={() => navigate("/free/painting")}>重新开始</Button>
      </div>
    )
  }

  const { primary, similar, userVector } = result

  // Simple SVG Radar Chart
  const RadarChart = ({ user, target }: { user: number[], target: number[] }) => {
    const size = 200
    const center = size / 2
    const radius = size * 0.4
    const levels = 4
    
    const getPoint = (val: number, i: number) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      const r = (val / 5) * radius
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
    }

    const userPoints = user.map((v, i) => getPoint(v, i)).join(" ")
    const targetPoints = target.map((v, i) => getPoint(v, i)).join(" ")

    return (
      <div className="relative w-full aspect-square max-w-[280px] mx-auto">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          {/* Background Circles */}
          {[...Array(levels)].map((_, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={(radius / levels) * (i + 1)}
              fill="none"
              stroke="white"
              strokeOpacity="0.05"
            />
          ))}
          {/* Axis Lines */}
          {[...Array(5)].map((_, i) => {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(angle)}
                y2={center + radius * Math.sin(angle)}
                stroke="white"
                strokeOpacity="0.1"
              />
            )
          })}
          {/* Polygons */}
          <motion.polygon
            points={targetPoints}
            fill={primary.accentColor}
            fillOpacity="0.1"
            stroke={primary.accentColor}
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.polygon
            points={userPoints}
            fill="white"
            fillOpacity="0.2"
            stroke="white"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </svg>
        
        {/* Dimension Labels */}
        {Object.entries(DIMENSION_LABELS).map(([key, label], i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
          const x = 50 + 45 * Math.cos(angle)
          const y = 50 + 45 * Math.sin(angle)
          return (
            <div 
              key={key}
              className="absolute text-[10px] font-bold tracking-tighter text-white/40 whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {label.high.split(' ')[1]}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060010] text-white selection:bg-white/20 pb-24">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30 blur-[120px] scale-150"
          style={{ 
            background: `radial-gradient(circle at 20% 30%, ${primary.themeColor}, transparent), 
                         radial-gradient(circle at 80% 70%, ${primary.accentColor}, transparent)` 
          }}
        />
        <div className="absolute inset-0 bg-[#060010]/60" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-12" ref={resultRef}>
        {/* Header Section */}
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
          >
            <Zap className="size-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">Soul Match • {primary.matchPercent}%</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-[3/4] w-full max-w-xs mx-auto mb-8 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
              style={{ backgroundImage: `url(${primary.bgImage || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800'})` }}
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 text-left">
              <h1 className="text-2xl font-serif font-bold mb-1 tracking-tight text-white">{primary.name}</h1>
              <p className="text-sm text-white/60 font-medium">{primary.artist} • {primary.year}</p>
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-serif font-bold italic mb-4 leading-tight"
          >
            你的灵魂名画是<br />《{primary.name}》
          </motion.h2>
        </section>

        {/* Soul Portrait */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden"
        >
          <Quote className="absolute top-6 right-8 size-12 text-white/5" />
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6 flex items-center gap-2">
            <div className="h-px w-4 bg-white/20" /> 灵魂画像
          </h3>
          <p className="text-lg md:text-xl leading-relaxed font-medium text-white/90 mb-6">
            {primary.portrait}
          </p>
          <div className="flex flex-wrap gap-2">
            {primary.keywords.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/60">
                #{tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Soul Monologue */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8 p-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 text-center relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-indigo-500 text-[10px] font-bold tracking-[0.2em] uppercase">
            灵魂独白
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold italic text-indigo-100">
            「{primary.quote}」
          </p>
        </motion.section>

        {/* Aesthetic DNA & Radar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-8 flex items-center gap-2">
              <div className="h-px w-4 bg-white/20" /> 审美 DNA
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Palette className="size-5 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">色彩偏好</div>
                  <div className="text-sm font-medium">{primary.aestheticDna.color}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Brush className="size-5 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">表达方式</div>
                  <div className="text-sm font-medium">{primary.aestheticDna.style}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Thermometer className="size-5 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">情绪温度</div>
                  <div className="text-sm font-medium">{primary.aestheticDna.temp}</div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-center"
          >
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4 text-center">
              人格光谱匹配
            </h3>
            <RadarChart user={userVector} target={primary.vector} />
            <div className="mt-4 flex justify-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40">
                <div className="size-2 rounded-full bg-white" /> 你
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40">
                <div className="size-2 rounded-full" style={{ backgroundColor: primary.accentColor }} /> 名画
              </div>
            </div>
          </motion.section>
        </div>

        {/* Life Scenes */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6 px-4 flex items-center gap-2">
            <div className="h-px w-4 bg-white/20" /> 生活场景表现
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Coffee, title: '独处时', content: primary.scenes.solo },
              { icon: Users, title: '社交时', content: primary.scenes.social },
              { icon: Briefcase, title: '工作中', content: primary.scenes.work },
              { icon: Heart, title: '恋爱中', content: primary.scenes.love },
            ].map((scene, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <scene.icon className="size-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white/80">{scene.title}</span>
                </div>
                <p className="text-xs leading-relaxed text-white/50">{scene.content}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Glow & Soft Spot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-indigo-500/10 border border-indigo-500/20"
          >
            <Lightbulb className="size-6 text-indigo-400 mb-4" />
            <h4 className="text-sm font-bold text-indigo-300 mb-2 uppercase tracking-widest">光芒时刻</h4>
            <p className="text-sm leading-relaxed text-white/70">{primary.moments}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20"
          >
            <Heart className="size-6 text-rose-400 mb-4" />
            <h4 className="text-sm font-bold text-rose-300 mb-2 uppercase tracking-widest">柔软之处</h4>
            <p className="text-sm leading-relaxed text-white/70">{primary.softSpot}</p>
          </motion.div>
        </div>

        {/* Echoes (Similar Paintings) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6 px-4 flex items-center gap-2">
            <div className="h-px w-4 bg-white/20" /> 与你灵魂共振的名画
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {similar.map((p, i) => {
              const relationKey = `${primary.id}-${p.id}`
              const relationKeyAlt = `${p.id}-${primary.id}`
              const relation = PAINTING_RELATIONS[relationKey] || PAINTING_RELATIONS[relationKeyAlt] || '你们在灵魂的某个维度上产生了共振'
              
              return (
                <div key={p.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="size-16 rounded-lg overflow-hidden shrink-0">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${p.bgImage || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200'})` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold truncate">《{p.name}》</h4>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{p.matchPercent}%</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2">{relation}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* Rituals & Recommendations */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-8 flex items-center gap-2">
            <div className="h-px w-4 bg-white/20" /> 灵魂补给站
          </h3>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Zap className="size-5 text-indigo-400 mt-1 shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">充电仪式</div>
                <div className="text-sm font-medium">{primary.ritual}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Music className="size-5 text-indigo-400 mt-1 shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">推荐歌单</div>
                <div className="text-sm font-medium">{primary.playlist}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Film className="size-5 text-indigo-400 mt-1 shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">推荐电影</div>
                <div className="text-sm font-medium">{primary.movies}</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Cold Knowledge */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-8 rounded-3xl border border-dashed border-white/20 relative"
        >
          <div className="absolute top-0 left-8 -translate-y-1/2 px-3 py-1 bg-[#060010] flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/40">
            <Info className="size-3" /> 名画冷知识
          </div>
          <p className="text-sm italic leading-relaxed text-white/60">
            {primary.coldKnowledge}
          </p>
        </motion.section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button 
            className="w-full h-14 rounded-2xl bg-white text-[#060010] hover:bg-white/90 text-lg font-bold shadow-xl shadow-white/5"
            onClick={() => {
              // Copy social quote to clipboard
              navigator.clipboard.writeText(`${primary.socialQuote} #灵魂名画测试`)
              alert('文案已复制到剪贴板，快去分享吧！')
            }}
          >
            <Share2 className="mr-2 size-5" /> 分享我的灵魂
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => navigate("/free/painting/test")}
            >
              <RefreshCcw className="mr-2 size-4" /> 重新测试
            </Button>
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                alert('长图生成中...（演示功能）')
              }}
            >
              <Download className="mr-2 size-4" /> 保存长图
            </Button>
          </div>
        </div>
      </main>

      {/* Floating Footer */}
      <footer className="mt-24 pb-12 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
        Art is the only way to run away without leaving home.
      </footer>
    </div>
  )
}
