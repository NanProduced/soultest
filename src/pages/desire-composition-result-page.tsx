import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import {
  Download,
  Sparkles,
  Share2,
  Crown,
  Heart,
  Gem,
  Brain,
  Leaf,
  UtensilsCrossed,
  Sparkle,
  ArrowUpRight,
  Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getQuizPosterExportId } from "@/features/quizzes/engine"
import type { CustomQuizResultPageProps } from "@/features/quizzes/custom-pages"
import type { ScoreBreakdownItem } from "@/features/quizzes/types"

// Dimension metadata
const dimensionMeta: Record<string, { name: string; emoji: string; color: string; icon: React.ReactNode }> = {
  M: { name: "财富欲", emoji: "💰", color: "#FFD700", icon: <Gem className="size-5" /> },
  P: { name: "权力欲", emoji: "👑", color: "#FF4444", icon: <Crown className="size-5" /> },
  L: { name: "爱情欲", emoji: "💕", color: "#FF69B4", icon: <Heart className="size-5" /> },
  B: { name: "美貌欲", emoji: "✨", color: "#BF55EC", icon: <Sparkle className="size-5" /> },
  F: { name: "美食欲", emoji: "🍽️", color: "#FF9A56", icon: <UtensilsCrossed className="size-5" /> },
  K: { name: "求知欲", emoji: "🧠", color: "#4A90D9", icon: <Brain className="size-5" /> },
  S: { name: "安逸欲", emoji: "🌿", color: "#2ECC71", icon: <Leaf className="size-5" /> },
}

// National average for comparison
const nationalAverage: Record<string, number> = {
  M: 22, P: 10, L: 20, B: 15, F: 13, K: 8, S: 12
}

// Personality data
const personalities: Record<string, {
  title: string
  tagline: string
  description: string[]
  quote: string
  celebrities: string[]
  tags: string[]
}> = {
  M: {
    title: "黄金猎手",
    tagline: "你的灵魂里住着一个华尔街之狼",
    description: [
      "你对金钱有一种天然的敏锐嗅觉——不是贪婪，而是一种对安全感和自由的深层渴望。",
      "你相信\"钱不是万能的，但没有钱是万万不能的\"。你不会为了面子花钱，但你会为了\"让自己的人生有更多选择权\"而努力赚钱。",
      "别人可能觉得你\"太现实\"，但你知道：真正的浪漫，是有底气的浪漫。"
    ],
    quote: "先实现财务自由，再谈诗和远方。",
    celebrities: ["巴菲特", "董明珠", "马斯克"],
    tags: ["现实主义者", "财务敏锐", "追求自由"]
  },
  P: {
    title: "王座收藏家",
    tagline: "你不想被世界选择，你要选择世界",
    description: [
      "你渴望的不是\"权力\"本身，而是\"掌控感\"——对自己人生的掌控，对局面的掌控，对未来的掌控。",
      "你讨厌\"被安排\"的感觉，天生就想做那个\"做决定的人\"。你有天然的领导气质，在人群中不自觉地就会站到C位。",
      "有人说你\"好强\"，但你知道：弱者才需要妥协，强者创造规则。"
    ],
    quote: "这个世界是我的，也是你们的，但归根结底是我的。",
    celebrities: ["武则天", "奥普拉", "拿破仑"],
    tags: ["掌控欲强", "领导气质", "创造规则"]
  },
  L: {
    title: "浪漫至死",
    tagline: "你的灵魂是用爱做的",
    description: [
      "你这辈子最大的欲望，就是好好爱一个人，也被一个人好好爱着。你相信爱情，相信灵魂伴侣的存在。",
      "你可能在物质上不那么在意，但在感情上，你极度\"贪心\"——你想要100分的心动、100分的陪伴、100分的理解。",
      "有人说你\"恋爱脑\"，但你知道：在爱里全力以赴的人，才是最勇敢的人。"
    ],
    quote: "给我一个人，我可以放弃全世界。（但最好那个人也很有钱。开玩笑的。）",
    celebrities: ["泰勒·斯威夫特", "莎士比亚", "张爱玲"],
    tags: ["情感丰富", "相信爱情", "勇敢追爱"]
  },
  B: {
    title: "颜值至上主义者",
    tagline: "这个世界对好看的人永远有优待",
    description: [
      "你对\"美\"有一种近乎执着的追求——不只是外表，还有品味、气质和整体呈现。",
      "你相信\"好看\"是一种核心竞争力，也是一种自我尊重。你的衣柜可能比书柜大，你的护肤步骤可能比工作流程还复杂。",
      "有人说你\"肤浅\"，但你知道：对美的追求，本身就是人类最高级的本能之一。"
    ],
    quote: "好看就是正义。（不接受反驳。）",
    celebrities: ["Jennie", "范冰冰", "贝克汉姆"],
    tags: ["追求美感", "注重形象", "品味独特"]
  },
  F: {
    title: "灵魂干饭人",
    tagline: "没有什么是一顿好吃的解决不了的",
    description: [
      "你是一个用味蕾感知世界的人。对你来说，美食不只是填饱肚子，而是一种生活哲学。",
      "你可能为了一碗面跨城，为了一家餐厅订好机票，为了一道菜学了三天。你的快乐很简单——吃到好吃的，就是人生巅峰。",
      "有人说你\"贪吃\"，但你知道：认真对待每一餐的人，也在认真对待人生。"
    ],
    quote: "人生苦短，先吃为敬。",
    celebrities: ["蔡澜", "谢霆锋", "Anthony Bourdain"],
    tags: ["美食至上", "生活哲学家", "味觉敏锐"]
  },
  K: {
    title: "灵魂学霸",
    tagline: "你的大脑永远在hunger mode",
    description: [
      "你最上瘾的事，是\"搞懂一个新东西\"的那一刻。你的好奇心像一个永远填不满的黑洞。",
      "今天研究量子力学，明天研究中世纪历史，后天研究咖啡豆的烘焙工艺。你相信\"无知\"才是最可怕的事。",
      "有人说你\"书呆子\"，但你知道：真正有趣的灵魂，来自永不停止的探索。"
    ],
    quote: "这个世界上最性感的器官是大脑。",
    celebrities: ["爱因斯坦", "埃隆·马斯克", "何同学"],
    tags: ["求知欲强", "好奇心旺", "探索精神"]
  },
  S: {
    title: "人间躺赢家",
    tagline: "你的终极欲望，是不被任何欲望绑架",
    description: [
      "你活得通透，看得明白。你不想卷，不想争，不想被社会时钟推着走。",
      "你最大的欲望，就是没有欲望——或者说，你的欲望就是\"自由地做自己\"。你相信人生的意义不在于\"获得更多\"，而在于\"需要更少\"。",
      "有人说你\"佛系\"，但你知道：真正的自由，是不需要向任何人证明自己。"
    ],
    quote: "世界那么大，我只想躺平。（但要躺在马尔代夫。）",
    celebrities: ["李子柒", "梭罗", "五条悟"],
    tags: ["追求自由", "通透豁达", "反内卷"]
  },
}

// Animated Pie Chart Component
function AnimatedPieChart({
  data,
  size = 280,
  dominantKey,
  onAnimationComplete,
}: {
  data: { key: string; value: number; percentage: number }[]
  size?: number
  dominantKey: string
  onAnimationComplete?: () => void
}) {
  const [animatedSegments, setAnimatedSegments] = useState<number>(0)
  const totalSegments = data.length

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedSegments((prev) => {
        if (prev >= totalSegments) {
          clearInterval(timer)
          onAnimationComplete?.()
          return prev
        }
        return prev + 1
      })
    }, 400)
    return () => clearInterval(timer)
  }, [totalSegments, onAnimationComplete])

  const center = size / 2
  const radius = size * 0.38
  let currentAngle = -90 // Start from top

  return (
    <svg width={size} height={size} className="overflow-visible">
      <defs>
        {data.map((item) => (
          <filter key={item.key} id={`glow-${item.key}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>
      {data.map((item, index) => {
        const angle = (item.percentage / 100) * 360
        const endAngle = currentAngle + angle
        const isAnimated = index < animatedSegments
        const isDominant = item.key === dominantKey

        // Calculate path
        const startRad = (currentAngle * Math.PI) / 180
        const endRad = (endAngle * Math.PI) / 180
        const x1 = center + radius * Math.cos(startRad)
        const y1 = center + radius * Math.sin(startRad)
        const x2 = center + radius * Math.cos(endRad)
        const y2 = center + radius * Math.sin(endRad)
        const largeArc = angle > 180 ? 1 : 0

        const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

        // Label position
        const labelAngle = currentAngle + angle / 2
        const labelRad = (labelAngle * Math.PI) / 180
        const labelRadius = radius + 30
        const lx = center + labelRadius * Math.cos(labelRad)
        const ly = center + labelRadius * Math.sin(labelRad)

        currentAngle = endAngle

        return (
          <g key={item.key}>
            <motion.path
              d={pathData}
              fill={dimensionMeta[item.key].color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isAnimated ? 1 : 0.3,
                scale: isAnimated ? 1 : 0.8,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              filter={isDominant && isAnimated ? `url(#glow-${item.key})` : undefined}
              stroke="#0a0a1a"
              strokeWidth="2"
            />
            {isAnimated && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-bold"
                  fill={dimensionMeta[item.key].color}
                >
                  {dimensionMeta[item.key].emoji}
                </text>
                <text
                  x={lx}
                  y={ly + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-medium"
                  fill="#94a3b8"
                >
                  {item.percentage}%
                </text>
              </motion.g>
            )}
          </g>
        )
      })}
      {/* Center circle with personality */}
      <circle cx={center} cy={center} r={radius * 0.45} fill="#0a0a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
    </svg>
  )
}

// Bar Chart Component
function BarChart({ data, dominantKey }: { data: { key: string; percentage: number }[]; dominantKey: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="space-y-3">
      {data.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 text-center text-lg">{dimensionMeta[item.key].emoji}</div>
          <div className="w-14 text-xs text-slate-400">{dimensionMeta[item.key].name}</div>
          <div className="flex-1 h-3 bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: dimensionMeta[item.key].color }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${item.percentage}%` } : {}}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className={cn(
            "w-10 text-right text-xs font-bold",
            item.key === dominantKey ? "text-white" : "text-slate-500"
          )}>
            {item.percentage}%
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Section component with scroll animation
function Section({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export function DesireCompositionResultPage({ result, runtime, submission }: CustomQuizResultPageProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)

  const scoreBreakdown = submission.scoreBreakdown || []

  // Calculate percentages
  const { sortedData, dominantKey, dominantPersonality } = useMemo(() => {
    const total = scoreBreakdown.reduce((sum, item) => sum + (item.score || 0), 0)
    const data = scoreBreakdown.map((item) => ({
      key: item.key,
      value: item.score || 0,
      percentage: total > 0 ? Math.round(((item.score || 0) / total) * 100) : 0,
    }))
    // Sort by percentage descending
    const sorted = data.sort((a, b) => b.percentage - a.percentage)
    const dominant = sorted[0]?.key || "M"
    return {
      sortedData: sorted,
      dominantKey: dominant,
      dominantPersonality: personalities[dominant],
      totalScore: total,
    }
  }, [scoreBreakdown])

  // Calculate comparison with national average
  const comparisonData = useMemo(() => {
    return sortedData.map((item) => {
      const national = nationalAverage[item.key] || 0
      const diff = item.percentage - national
      return { ...item, diff }
    })
  }, [sortedData])

  const maxDiff = comparisonData.reduce((max, item) =>
    Math.abs(item.diff) > Math.abs(max.diff) ? item : max
  , comparisonData[0])

  // Export long image
  const handleExport = async () => {
    if (!posterRef.current) return
    setIsExporting(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: "#0a0a1a",
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement("a")
      link.download = `欲望组成图-${dominantPersonality.title}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  // Share text
  const shareText = `刚测了我的欲望组成图……

${sortedData.slice(0, 3).map(d => `${dimensionMeta[d.key].emoji} ${dimensionMeta[d.key].name} ${d.percentage}%`).join(" | ")}

我居然是「${dominantPersonality.title}」型人格

${maxDiff.diff > 0 ? `比全国平均的${dimensionMeta[maxDiff.key].name}高出${maxDiff.diff}%，果然是${dominantPersonality.tags[0]}本${dominantPersonality.tags[0].slice(-1)}` : ""}

你的欲望组成图是什么样的？

#欲望组成图 #灵测SoulTest #心理测试 #性格测试`

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText)
    setShowShareModal(true)
    setTimeout(() => setShowShareModal(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-slate-200 pb-24">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <Section className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/5 px-4 py-2 mb-6"
          >
            <Sparkles className="size-4 text-fuchsia-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400">
              Your Desire Composition
            </span>
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">你的欲望组成图</h1>
          <p className="text-slate-500">每个人心中都藏着一份欲望配方</p>
        </Section>

        {/* Pie Chart Section */}
        <Section className="mb-12" delay={0.1}>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
            <div className="flex justify-center mb-6">
              <AnimatedPieChart
                data={sortedData}
                size={260}
                dominantKey={dominantKey}
              />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4"
              style={{ backgroundColor: `${dimensionMeta[dominantKey].color}20` }}
            >
              <span className="text-lg">{dimensionMeta[dominantKey].emoji}</span>
              <span className="text-sm font-bold" style={{ color: dimensionMeta[dominantKey].color }}>
                主导欲望：{dimensionMeta[dominantKey].name} {sortedData[0]?.percentage}%
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">「{dominantPersonality.title}」</h2>
            <p className="text-slate-400 mt-2 italic">{dominantPersonality.tagline}</p>
          </div>
        </Section>

        {/* Ranking Section */}
        <Section className="mb-12" delay={0.2}>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Crown className="size-4 text-yellow-400" />
              欲望排行榜
            </h3>
            <BarChart data={sortedData} dominantKey={dominantKey} />
          </div>
        </Section>

        {/* Personality Card */}
        <Section className="mb-12" delay={0.3}>
          <div
            className="rounded-[32px] border p-8 relative overflow-hidden"
            style={{
              borderColor: `${dimensionMeta[dominantKey].color}40`,
              background: `linear-gradient(135deg, ${dimensionMeta[dominantKey].color}10, transparent)`,
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="size-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${dimensionMeta[dominantKey].color}30` }}
                >
                  {dimensionMeta[dominantKey].emoji}
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">欲望人格</h3>
                  <h2 className="text-2xl font-black text-white">{dominantPersonality.title}</h2>
                </div>
              </div>

              <p className="text-lg font-medium text-white/90 mb-6 italic">
                &ldquo;{dominantPersonality.tagline}&rdquo;
              </p>

              <div className="space-y-3 mb-6">
                {dominantPersonality.description.map((desc, i) => (
                  <p key={i} className="text-sm text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {dominantPersonality.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: `${dimensionMeta[dominantKey].color}20`,
                      color: dimensionMeta[dominantKey].color,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
                <Quote className="size-4 text-slate-600 mb-2" />
                <p className="text-sm text-slate-400 italic">{dominantPersonality.quote}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-500 mb-3">灵魂名人</p>
                <div className="flex gap-3">
                  {dominantPersonality.celebrities.map((celeb) => (
                    <span key={celeb} className="text-sm text-slate-300">{celeb}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Comparison Section */}
        <Section className="mb-12" delay={0.4}>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <ArrowUpRight className="size-4 text-blue-400" />
              与全国平均对比
            </h3>
            <div className="text-center mb-6">
              <p className="text-3xl font-black" style={{ color: dimensionMeta[maxDiff.key].color }}>
                {maxDiff.diff > 0 ? "+" : ""}{maxDiff.diff}%
              </p>
              <p className="text-sm text-slate-400 mt-2">
                你的{dimensionMeta[maxDiff.key].name}比全国平均
                {maxDiff.diff > 0 ? "高出" : "低于"} {Math.abs(maxDiff.diff)}%
              </p>
            </div>
            <div className="space-y-2">
              {comparisonData.slice(0, 3).map((item) => (
                <div key={item.key} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{dimensionMeta[item.key].emoji}</span>
                    <span className="text-slate-400">{dimensionMeta[item.key].name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600">全国平均 {nationalAverage[item.key]}%</span>
                    <span className="font-bold" style={{ color: dimensionMeta[item.key].color }}>
                      你 {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Action Buttons */}
        <Section className="mb-12" delay={0.5}>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
            <h3 className="text-lg font-bold text-white mb-2">分享你的欲望组成图</h3>
            <p className="text-sm text-slate-500 mb-6">生成精美长图，分享给朋友测测</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="gap-2 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white hover:opacity-90"
              >
                {isExporting ? (
                  <motion.div
                    className="size-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Download className="size-4" />
                )}
                {isExporting ? "生成中..." : "保存长图"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyShare}
                className="gap-2 border-white/10 hover:bg-white/5"
              >
                <Share2 className="size-4" />
                复制文案
              </Button>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600">
          <p>SoulTest Lab · 基于欲望心理学模型</p>
          <p className="mt-1">已有 12,847 人测过自己的欲望组成</p>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl bg-slate-900 border border-white/10 p-6 text-center"
          >
            <Sparkles className="size-8 text-fuchsia-400 mx-auto mb-3" />
            <p className="text-white font-bold">文案已复制</p>
            <p className="text-sm text-slate-400 mt-1">快去分享给朋友吧</p>
          </motion.div>
        </motion.div>
      )}

      {/* Hidden Poster for Export */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={posterRef}
          className="w-[750px] bg-[#0a0a1a] text-white p-12"
          style={{ minHeight: "1200px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black">你的欲望组成图</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Desire Composition</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-widest">SoulTest Lab</p>
              <p className="text-sm font-bold text-fuchsia-400">EST. 2026</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex justify-center mb-12">
            <svg width="320" height="320" className="-rotate-90">
              {sortedData.reduce(
                (acc, item) => {
                  const total = sortedData.reduce((s, d) => s + d.percentage, 0)
                  const percentage = item.percentage / total
                  const angle = percentage * 360
                  const startAngle = acc.currentAngle
                  const endAngle = startAngle + angle
                  const largeArc = angle > 180 ? 1 : 0
                  const r = 140
                  const cx = 160
                  const cy = 160
                  const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180)
                  const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180)
                  const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180)
                  const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180)
                  acc.paths.push(
                    <path
                      key={item.key}
                      d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={dimensionMeta[item.key].color}
                      stroke="#0a0a1a"
                      strokeWidth="3"
                    />
                  )
                  acc.currentAngle = endAngle
                  return acc
                },
                { paths: [] as React.ReactNode[], currentAngle: 0 }
              ).paths}
              <circle cx="160" cy="160" r="60" fill="#0a0a1a" />
            </svg>
          </div>

          {/* Personality Label */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4"
              style={{ backgroundColor: `${dimensionMeta[dominantKey].color}20` }}
            >
              <span className="text-2xl">{dimensionMeta[dominantKey].emoji}</span>
              <span className="text-lg font-bold" style={{ color: dimensionMeta[dominantKey].color }}>
                {dimensionMeta[dominantKey].name} {sortedData[0]?.percentage}%
              </span>
            </div>
            <h2 className="text-4xl font-black text-white mb-2">「{dominantPersonality.title}」</h2>
            <p className="text-xl text-slate-400 italic">{dominantPersonality.tagline}</p>
          </div>

          {/* Ranking */}
          <div className="mb-12">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">欲望排行榜</h3>
            <div className="space-y-3">
              {sortedData.map((item) => (
                <div key={item.key} className="flex items-center gap-4">
                  <div className="w-10 text-center text-2xl">{dimensionMeta[item.key].emoji}</div>
                  <div className="w-20 text-sm text-slate-400">{dimensionMeta[item.key].name}</div>
                  <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.percentage}%`, backgroundColor: dimensionMeta[item.key].color }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-bold">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Personality Card */}
          <div
            className="rounded-3xl border p-8 mb-12"
            style={{
              borderColor: `${dimensionMeta[dominantKey].color}40`,
              background: `linear-gradient(135deg, ${dimensionMeta[dominantKey].color}10, transparent)`,
            }}
          >
            <h3 className="text-lg font-bold text-white mb-4">{dominantPersonality.title}</h3>
            <p className="text-slate-300 leading-relaxed mb-4">{dominantPersonality.description[0]}</p>
            <div className="flex flex-wrap gap-2">
              {dominantPersonality.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${dimensionMeta[dominantKey].color}20`,
                    color: dimensionMeta[dominantKey].color,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="size-20 bg-white rounded-xl p-2">
                <div className="size-full bg-slate-900 rounded-lg flex items-center justify-center">
                  <Sparkles className="size-8 text-white/20" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">扫码测测你的欲望</p>
                <p className="text-lg font-bold">灵测 SoulTest</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 italic">&ldquo;{dominantPersonality.quote}&rdquo;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
