import { Compass, Search, Brain, Heart, Sparkles, User } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

// --- Sub-preview components ---

function TarotPreview() {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div className="relative w-full aspect-[3/4] perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front: Card Back Design */}
        <div className="absolute inset-0 backface-hidden rounded-[32px] border-4 border-amber-500/30 bg-[#1a1409] flex flex-col items-center justify-center p-8 overflow-hidden shadow-2xl" style={{ backfaceVisibility: "hidden" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at center, #f59e0b 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <Compass className="size-20 text-amber-500/40 mb-6 animate-pulse" />
          <div className="text-[10px] uppercase tracking-[0.5em] text-amber-500/60 font-serif">Reveal Your Soul</div>
          <div className="mt-8 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400">点击揭开牌面</div>
        </div>

        {/* Back: The Result Card */}
        <div className="absolute inset-0 backface-hidden rounded-[32px] border-4 border-amber-500/40 bg-[#0c0a09] [transform:rotateY(180deg)] flex flex-col items-center p-8 text-center shadow-2xl" style={{ backfaceVisibility: "hidden" }}>
          <div className="text-5xl font-serif text-amber-500/10 absolute top-6 left-8">IX</div>
          <div className="mt-8 mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <Search className="size-12 text-amber-400" />
          </div>
          <h3 className="text-3xl font-serif tracking-widest text-amber-100 mb-2">隐者</h3>
          <p className="text-xs text-amber-500/60 uppercase tracking-[0.3em] mb-6">The Hermit</p>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent mb-6" />
          <p className="text-[13px] leading-relaxed text-amber-100/70 italic">
            「独自爬上山顶点一盏灯——不为被看见，而为照亮来路。」
          </p>
          <div className="mt-auto flex gap-2">
            {["#独行智者", "#内在宇宙"].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-stone-400">{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function HexacoPreview() {
  const dimensions = [
    { label: "诚实", value: 85, color: "bg-emerald-400" },
    { label: "情绪", value: 40, color: "bg-teal-400" },
    { label: "外向", value: 65, color: "bg-cyan-400" },
    { label: "宜人", value: 72, color: "bg-sky-400" },
    { label: "尽责", value: 88, color: "bg-blue-400" },
    { label: "开放", value: 55, color: "bg-indigo-400" },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {dimensions.map((d, i) => (
          <motion.div 
            key={d.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{d.label}</span>
              <span className="text-xs font-bold text-white/80">{d.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${d.value}%` }}
                className={`h-full rounded-full ${d.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="size-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-100">核心特质</span>
        </div>
        <p className="text-[13px] leading-relaxed text-emerald-100/70">
          你在诚实谦逊维度得分极高，意味着你对名利持有天然的审慎，更看重真实的连接与原则。
        </p>
      </div>
    </div>
  )
}

function RelationshipPreview() {
  return (
    <div className="relative w-full space-y-6">
      <div className="flex justify-center -space-x-4">
        {[
          { icon: <Heart className="size-6 text-rose-400" />, label: "精心的时刻", deg: "-6deg" },
          { icon: <Sparkles className="size-6 text-amber-400" />, label: "肯定的言辞", deg: "2deg" },
          { icon: <User className="size-6 text-blue-400" />, label: "服务的行动", deg: "8deg" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            className="w-32 aspect-[3/4] rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center p-4 text-center"
            style={{ rotate: card.deg }}
          >
            <div className="mb-3 p-3 rounded-full bg-white/5">{card.icon}</div>
            <div className="text-[11px] font-bold text-white/80 leading-tight">{card.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="text-center pt-4">
        <p className="text-xs text-rose-300 font-medium">✨ 发现你的 5 种爱之语言</p>
      </div>
    </div>
  )
}

function EnneagramPreview() {
  const rows = [
    { label: "4 型个性者", value: 80, color: "bg-pink-400" },
    { label: "9 型和平者", value: 73, color: "bg-violet-400" },
    { label: "5 型观察者", value: 70, color: "bg-indigo-400" },
    { label: "1 型改革者", value: 63, color: "bg-white/35" },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-white/40">主型结果样例</div>
            <div className="mt-3 text-3xl font-semibold text-white">4 型个性者</div>
            <p className="mt-3 max-w-[240px] text-sm leading-7 text-white/72">更在意真实感、意义感，以及自己有没有被真正理解。</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-right">
            <div className="text-[10px] tracking-[0.2em] text-white/35">情感中心</div>
            <div className="mt-2 text-sm font-semibold text-white">更关注自我感受与关系回应</div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex justify-between text-[11px] text-white/50">
              <span>{row.label}</span>
              <span>{row.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
          <div className="text-[10px] text-white/35 tracking-[0.2em]">翼倾向</div>
          <div className="mt-2 text-sm font-semibold text-white">4w5</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
          <div className="text-[10px] text-white/35 tracking-[0.2em]">压力时更像</div>
          <div className="mt-2 text-sm font-semibold text-white">2 型助人者</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
          <div className="text-[10px] text-white/35 tracking-[0.2em]">成长时更像</div>
          <div className="mt-2 text-sm font-semibold text-white">1 型改革者</div>
        </div>
      </div>
    </div>
  )
}

function RiasecPreview() {
  const dimensions = [
    { label: "R 现实型", value: 82, color: "bg-orange-400" },
    { label: "I 研究型", value: 90, color: "bg-blue-400" },
    { label: "A 艺术型", value: 75, color: "bg-pink-400" },
    { label: "S 社会型", value: 45, color: "bg-emerald-400" },
    { label: "E 企业型", value: 60, color: "bg-amber-400" },
    { label: "C 常规型", value: 30, color: "bg-slate-400" },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {dimensions.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{d.label}</span>
              <span className="text-xs font-bold text-white/80">{d.value}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.value}%` }}
                className={`h-full rounded-full ${d.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="size-4 text-blue-400" />
          <span className="text-xs font-bold text-blue-100">核心三码：IRA</span>
        </div>
        <p className="text-[13px] leading-relaxed text-blue-100/70">
          你表现出极强的研究欲望与动手能力，同时保留了艺术表达的独立空间。
        </p>
      </div>
    </div>
  )
}

function StressLoadPreview() {
  const dimensions = [
    { label: "任务超载", value: 78, color: "bg-rose-400" },
    { label: "掌控流失", value: 65, color: "bg-orange-400" },
    { label: "预警常开", value: 82, color: "bg-amber-400" },
    { label: "恢复断电", value: 70, color: "bg-blue-400" },
    { label: "情绪磨损", value: 58, color: "bg-violet-400" },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-center py-4">
        <div className="relative">
          <svg className="size-32 rotate-[-90deg]">
            <circle cx="64" cy="64" r="56" className="stroke-slate-800 fill-none" strokeWidth="10" />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              className="stroke-fuchsia-500 fill-none"
              strokeWidth="10"
              strokeDasharray={351}
              initial={{ strokeDashoffset: 351 }}
              animate={{ strokeDashoffset: 90 }}
              transition={{ duration: 1.5, ease: "circOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">71</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest">SLI 指数</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {dimensions.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-[10px] text-white/40 w-16">{d.label}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.value}%` }}
                className={`h-full rounded-full ${d.color}`}
              />
            </div>
            <span className="text-[10px] text-white/60 w-8 text-right">{d.value}%</span>
          </motion.div>
        ))}
      </div>
      <div className="p-4 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="size-4 text-fuchsia-400" />
          <span className="text-xs font-bold text-fuchsia-100">高压积载</span>
        </div>
        <p className="text-[11px] leading-relaxed text-fuchsia-100/70">
          压力正在累积，多个维度出现明显超载信号。
        </p>
      </div>
    </div>
  )
}

function DesireCompositionPreview() {
  const dimensions = [
    { label: "爱情欲", value: 32, emoji: "💕", color: "#FF69B4" },
    { label: "财富欲", value: 24, emoji: "💰", color: "#FFD700" },
    { label: "美貌欲", value: 18, emoji: "✨", color: "#BF55EC" },
    { label: "美食欲", value: 12, emoji: "🍽️", color: "#FF9A56" },
    { label: "权力欲", value: 8, emoji: "👑", color: "#FF4444" },
    { label: "求知欲", value: 4, emoji: "🧠", color: "#4A90D9" },
    { label: "安逸欲", value: 2, emoji: "🌿", color: "#2ECC71" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Pie Chart */}
      <div className="flex items-center justify-center py-2">
        <svg width="160" height="160" className="-rotate-90">
          {dimensions.reduce(
            (acc, item, idx) => {
              const total = dimensions.reduce((s, d) => s + d.value, 0)
              const percentage = item.value / total
              const angle = percentage * 360
              const startAngle = acc.currentAngle
              const endAngle = startAngle + angle
              const largeArc = angle > 180 ? 1 : 0
              const r = 70
              const cx = 80
              const cy = 80
              const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180)
              const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180)
              const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180)
              const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180)
              acc.paths.push(
                <motion.path
                  key={item.label}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  stroke="#0a0a1a"
                  strokeWidth="2"
                />
              )
              acc.currentAngle = endAngle
              return acc
            },
            { paths: [] as React.ReactNode[], currentAngle: 0 }
          ).paths}
          <circle cx="80" cy="80" r="30" fill="#0a0a1a" />
        </svg>
      </div>

      {/* Top 3 Dimensions */}
      <div className="space-y-2">
        {dimensions.slice(0, 3).map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-lg">{d.emoji}</span>
            <span className="text-[10px] text-white/40 w-12">{d.label}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.value * 2}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: d.color }}
              />
            </div>
            <span className="text-[10px] text-white/60 w-8 text-right">{d.value}%</span>
          </motion.div>
        ))}
      </div>

      {/* Personality Card */}
      <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="size-4 text-pink-400" />
          <span className="text-xs font-bold text-pink-100">浪漫至死</span>
        </div>
        <p className="text-[11px] leading-relaxed text-pink-100/70">
          你的灵魂是用爱做的，这辈子最大的欲望就是好好爱一个人，也被一个人好好爱着。
        </p>
      </div>
    </div>
  )
}

// --- Main component ---

export function ResultPreviewCard({ quizSlug }: { quizSlug: string }) {
  let content
  let themeClass = "bg-slate-950/90"
  let badge = "Preview"
  let title = "结果样例"

  if (quizSlug === "soul-tarot") {
    content = <TarotPreview />
    themeClass = "bg-[#191309]/95"
    badge = "Tarot"
    title = "灵魂牌面"
  } else if (quizSlug === "hexaco-60") {
    content = <HexacoPreview />
    themeClass = "bg-[#091913]/95"
    badge = "Hexaco"
    title = "六维画像"
  } else if (quizSlug === "relationship-preference-test") {
    content = <RelationshipPreview />
    themeClass = "bg-[#190913]/95"
    badge = "Love"
    title = "爱之语言"
  } else if (quizSlug === "enneagram") {
    content = <EnneagramPreview />
    themeClass = "bg-[#130d1a]/95"
    badge = "九型人格"
    title = "驱动力地图"
  } else if (quizSlug === "riasec-48") {
    content = <RiasecPreview />
    themeClass = "bg-[#091319]/95"
    badge = "RIASEC"
    title = "职业兴趣"
  } else if (quizSlug === "stress-load-test") {
    content = <StressLoadPreview />
    themeClass = "bg-[#1a0a1a]/95"
    badge = "Stress"
    title = "压力负荷"
  } else if (quizSlug === "desire-composition") {
    content = <DesireCompositionPreview />
    themeClass = "bg-[#1a0a1a]/95"
    badge = "Desire"
    title = "欲望组成"
  } else {
    content = (
      <div className="space-y-4">
        {[
          { label: "内向 / 外向", value: 72 },
          { label: "实感 / 直觉", value: 68 },
          { label: "情感 / 思考", value: 79 },
        ].map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex justify-between text-[11px] text-white/50">
              <span>{row.label}</span>
              <span>{row.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-fuchsia-400" style={{ width: `${row.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    )
    badge = "OEJTS"
    title = "16 型人格"
  }

  return (
    <div aria-hidden="true" className="relative hidden w-full max-w-[336px] lg:block xl:max-w-[360px]">
      <div className="absolute -inset-10 rounded-[48px] bg-white/5 blur-[80px]" />
      <div className={`relative rounded-[40px] border border-white/10 p-2 shadow-2xl ${themeClass}`}>
        <div className="flex h-full flex-col rounded-[34px] border border-white/5 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.3em] text-white/40">
              {badge}
            </div>
            <div className="text-[10px] tracking-[0.26em] text-white/20">结果样例</div>
          </div>

          <h3 className="mb-2 text-2xl font-semibold tracking-tight text-white">{title}</h3>
          <p className="mb-10 text-xs leading-relaxed text-white/40">
            完成后你将获得包含深度解析、个性化建议及专属分享海报的完整报告。
          </p>

          <div className="flex flex-1 flex-col justify-center">{content}</div>

          <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-400" />
              <span className="text-[10px] tracking-[0.2em] text-white/30">可保存分享长图</span>
            </div>
            <div className="text-[10px] text-white/20">适合保存 / 分享</div>
          </div>
        </div>
      </div>
    </div>
  )
}
