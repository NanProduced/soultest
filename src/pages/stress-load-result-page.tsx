import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Download,
  Zap,
  ShieldAlert,
  Brain,
  Activity,
  Lightbulb,
  CheckCircle2,
  Smartphone,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getQuizPosterExportId, getQuizTheme } from "@/features/quizzes/engine"
import { exportNodeAsPng } from "@/lib/export-node-as-image"
import type { CustomResultPageProps } from "@/features/quizzes/pages/registry"
import type { ScoreBreakdownItem } from "@/features/quizzes/types"

// --- Components ---

function RadarChart({
  scoreBreakdown,
  theme,
  size = 300,
}: {
  scoreBreakdown: ScoreBreakdownItem[]
  theme: any
  size?: number
}) {
  const center = size / 2
  const radius = size * 0.35
  const points = scoreBreakdown.map((item, i) => {
    const angle = (i * 2 * Math.PI) / scoreBreakdown.length - Math.PI / 2
    const value = (item.display ?? 50) / 100
    const r = radius * value
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      label: item.label,
    }
  })

  const gridPoints = [0.25, 0.5, 0.75, 1.0].map((v) => {
    return scoreBreakdown
      .map((_, i) => {
        const angle = (i * 2 * Math.PI) / scoreBreakdown.length - Math.PI / 2
        const r = radius * v
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
      })
      .join(" ")
  })

  const pathData = points.map((p) => `${p.x},${p.y}`).join(" ")

  return (
    <div className="relative mx-auto flex items-center justify-center py-6">
      <svg className="overflow-visible" height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid lines */}
        {gridPoints.map((points, i) => (
          <polygon
            key={i}
            points={points}
            className="stroke-slate-800 fill-none"
            strokeDasharray={i === 3 ? "0" : "4 4"}
          />
        ))}
        {/* Axis lines */}
        {scoreBreakdown.map((_, i) => {
          const angle = (i * 2 * Math.PI) / scoreBreakdown.length - Math.PI / 2
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              className="stroke-slate-800"
            />
          )
        })}
        {/* Data polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          points={pathData}
          fill={theme.chartFill}
          stroke={theme.chartStroke}
          strokeWidth="2.5"
          className="drop-shadow-[0_0_8px_rgba(217,70,239,0.3)]"
        />
        {/* Labels */}
        {points.map((p, i) => {
          const angle = (i * 2 * Math.PI) / scoreBreakdown.length - Math.PI / 2
          const lx = center + (radius + 24) * Math.cos(angle)
          const ly = center + (radius + 24) * Math.sin(angle)
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              className="fill-slate-400 text-[10px] font-medium tracking-wider"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {p.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

function GaugeChart({ value, label }: { value: number; label: string }) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg className="size-48 rotate-[-90deg]">
        <circle
          cx="96"
          cy="96"
          r={radius}
          className="stroke-slate-800 fill-none"
          strokeWidth="12"
        />
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          className="stroke-fuchsia-500 fill-none"
          strokeWidth="12"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "circOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black italic tracking-tighter text-white">
          {Math.round(value)}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          {label}
        </span>
      </div>
    </div>
  )
}

// --- Main Component ---

export function StressLoadResultPage({ runtime, submission }: CustomResultPageProps) {
  const [isExporting, setIsExporting] = useState(false)
  const theme = getQuizTheme(runtime)
  const scoreBreakdown = submission.scoreBreakdown || []

  // Logic to calculate SLI and Dominant Profile
  const totalScore = scoreBreakdown.reduce((sum, item) => sum + (item.score || 0), 0)
  const sli = ((totalScore - 25) / 100) * 100
  const normalizedBreakdown = scoreBreakdown.map(item => ({
    ...item,
    display: ((item.score - 5) / 20) * 100
  }))

  const dominantDimension = [...normalizedBreakdown].sort((a, b) => b.score - a.score)[0]
  const levelData = useMemo(() => {
    const levels = (runtime.extensions?.stressLoad as any)?.levels || []
    return levels.find((l: any) => sli >= l.min && sli <= l.max) || levels[0]
  }, [sli, runtime])

  const profileData = useMemo(() => {
    const profiles = (runtime.extensions?.stressLoad as any)?.profiles || []
    return profiles.find((p: any) => p.dimensionKey === dominantDimension?.key) || profiles[0]
  }, [dominantDimension, runtime])

  const handleExport = async () => {
    const exportId = getQuizPosterExportId(runtime) || "stress-load-poster"
    setIsExporting(true)
    try {
      const node = document.getElementById(exportId)
      if (node) {
        await exportNodeAsPng(node, { filename: `SoulTest-StressLoad-${submission.submissionId.slice(0, 8)}.png` })
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        {/* Header Hero */}
        <section className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/5 px-4 py-2 mb-6"
          >
            <Zap className="size-4 text-fuchsia-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400">
              Analysis Report
            </span>
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2 md:text-4xl">
            {levelData.name}
          </h1>
          <p className="text-slate-400 font-medium italic">
            “{levelData.summary}”
          </p>
        </section>

        {/* Gauge & Radar Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="rounded-[32px] border border-slate-800/60 bg-slate-900/40 p-8 flex flex-col items-center justify-center">
            <GaugeChart value={sli} label="SLI Index" />
            <div className="mt-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">系统负荷指数</p>
              <p className="text-xs text-slate-400 px-4">反映最近 30 天您的整体心理压力承载水平</p>
            </div>
          </div>
          <div className="rounded-[32px] border border-slate-800/60 bg-slate-900/40 p-8">
            <RadarChart scoreBreakdown={normalizedBreakdown} theme={theme} size={240} />
            <div className="mt-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">五维负荷图谱</p>
              <p className="text-xs text-slate-400">点击图表查看各维度详细定义</p>
            </div>
          </div>
        </div>

        {/* Dominant Source */}
        <section className="mb-10 rounded-[32px] border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-blue-600/5 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain className="size-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-400 mb-4">
              主导压力来源
            </h3>
            <h2 className="text-2xl font-black text-white mb-3">{profileData.name}</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              {profileData.issue} 您目前最大的消耗点不是单一的任务，而是系统性、底噪式的能量流失。
            </p>
            <div className="flex flex-wrap gap-2">
              {["高警觉", "恢复受阻", "带宽占用"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Level Details */}
        <section className="mb-10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="size-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">这一级负荷意味着什么？</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                <Info className="size-4 text-slate-500" />
                系统运行模式
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                您当前的系统状态更像是一台后台开启了过多程序的设备。它还在跑，但明显变慢、变热、变卡。您内在的带宽已经被占用得很明显，任何新的输入都会带来额外的心累。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                <ShieldAlert className="size-4 text-rose-500" />
                关键风险信号
              </h4>
              <ul className="space-y-2">
                {[
                  "即便睡了一觉，也不太觉得自己真正恢复过来",
                  "听到消息提示音或临时通知时，身体会下意识紧一下",
                  "对社交和回应外界感到明显的耐心不足"
                ].map((item, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <div className="mt-1 size-1 rounded-full bg-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Action Plan */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="size-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">72 小时减压行动卡</h3>
          </div>
          <div className="grid gap-4">
            {[
              { title: "立刻执行", content: "暂停一个非必要的输入源（如静音不重要的工作群、减少刷短视频时间）", icon: Zap },
              { title: "本周优先", content: "给系统证明：不是每一次提示音和等待都值得全线戒备", icon: CheckCircle2 },
              { title: "长期维护", content: "找回“事情可以由我安排”的可预测感，重建恢复边界", icon: ShieldAlert }
            ].map((card, i) => (
              <div key={i} className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-fuchsia-500/30">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-fuchsia-500/20 transition-colors">
                    <card.icon className="size-5 text-slate-400 group-hover:text-fuchsia-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{card.title}</h4>
                    <p className="text-sm text-slate-200">{card.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Export Support Section */}
        <section className="rounded-[32px] border border-white/5 bg-slate-900/20 p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">保存您的压力分析报告</h3>
          <p className="text-sm text-slate-500 mb-6">导出包含五维图谱、等级解读与行动建议的结果长图，适合留存与分享。</p>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full gap-2 bg-white text-black hover:bg-slate-200 font-bold h-12 rounded-2xl"
          >
            {isExporting ? <LoaderCircle className="animate-spin" /> : <Download className="size-4" />}
            {isExporting ? "正在生成..." : "保存结果长图"}
          </Button>
        </section>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Button variant="link" className="text-slate-600 hover:text-slate-400 text-xs">
            SoulTest Professional · 基于感知压力评估模型
          </Button>
        </div>
      </div>

      {/* --- Poster Export Portal (Hidden) --- */}
      <div className="pointer-events-none fixed top-0" style={{ left: -10000 }}>
        <article
          id={getQuizPosterExportId(runtime) || "stress-load-poster"}
          className="relative w-[750px] overflow-hidden bg-[#020617] text-white p-12"
        >
          {/* Export Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.1),transparent_40%)]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-blue-600 flex items-center justify-center">
                  <Brain className="size-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">压力负荷测试</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Psychological Stress Report</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-1">SoulTest Lab</p>
                <p className="text-sm font-bold italic text-fuchsia-500">EST. 2026</p>
              </div>
            </div>

            <div className="flex gap-12 mb-16">
              <div className="flex-1 rounded-[40px] border border-white/10 bg-white/5 p-10 flex flex-col items-center justify-center">
                 <GaugeChart value={sli} label="SLI Index" />
                 <h2 className="text-3xl font-black mt-8">{levelData.name}</h2>
                 <p className="text-slate-400 text-sm mt-2">“{levelData.summary}”</p>
              </div>
              <div className="flex-1 rounded-[40px] border border-white/10 bg-white/5 p-10">
                 <RadarChart scoreBreakdown={normalizedBreakdown} theme={theme} size={280} />
              </div>
            </div>

            <div className="mb-16">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-fuchsia-500 mb-6">主导压力来源解读</h3>
               <div className="rounded-[32px] border border-white/10 bg-white/5 p-10">
                  <h4 className="text-3xl font-black mb-4">{profileData.name}</h4>
                  <p className="text-xl text-slate-300 leading-relaxed italic">
                    {profileData.issue}
                  </p>
                  <div className="mt-8 flex gap-4">
                    {["高警觉", "恢复受阻", "电量补不回"].map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold">#{tag}</span>
                    ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-16">
               <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-6">恢复优先级建议</h3>
                  <div className="space-y-4">
                     {[
                       "暂停一个非必要输入源",
                       "证明系统在没有危险时可以放松",
                       "找回可预测感，重建恢复边界"
                     ].map((text, i) => (
                       <div key={i} className="flex items-center gap-4 text-sm text-slate-300">
                         <div className="size-2 rounded-full bg-blue-500" />
                         {text}
                       </div>
                     ))}
                  </div>
               </div>
               <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-rose-500 mb-6">特别提醒</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    这不是你矫情，是这套系统已经替你扛了太久。如果这种状态持续并明显影响生活，请认真考虑寻求专业支持。
                  </p>
               </div>
            </div>

            <div className="flex justify-between items-end pt-12 border-t border-white/10">
              <div className="flex gap-6 items-center">
                 <div className="size-24 bg-white rounded-2xl p-2">
                    <div className="size-full bg-black rounded-xl flex items-center justify-center">
                       <Smartphone className="size-10 text-white/20" />
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Scan to test yours</p>
                    <p className="text-sm font-bold">灵测 SoulTest</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-sm text-slate-500 italic">“你不是突然累的，你只是很久没松下来了。”</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

function LoaderCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
