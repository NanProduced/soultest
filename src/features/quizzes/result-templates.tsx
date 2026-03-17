import type { ReactNode } from "react"
import {
  BriefcaseBusiness,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Waves,
  Users,
  Target,
  Compass,
} from "lucide-react"
import { motion } from "framer-motion"

import { Noise } from "@/components/ui/noise"
import { cn } from "@/lib/utils"
import { getOejtsAxisMeta, type QuizThemePreset } from "@/features/quizzes/engine"
import type {
  QuizResultDefinition,
  QuizRuntimeConfig,
  ScoreBreakdownItem,
  StoredQuizResult,
} from "@/features/quizzes/types"

export interface QuizResultTemplateProps {
  result: QuizResultDefinition
  runtime: QuizRuntimeConfig
  submission: StoredQuizResult
  theme: QuizThemePreset
}

/**
 * --- Shared UI Components ---
 */

function StoryHighlights({ highlights }: { highlights: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {highlights.map((item) => (
        <span
          className="rounded-full border border-black/6 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function BulletSection({
  title,
  icon,
  items,
  summary,
  variant = "default",
}: {
  title: string
  icon: ReactNode
  items?: string[]
  summary?: string
  variant?: "default" | "warning"
}) {
  if ((!items || items.length === 0) && !summary) {
    return null
  }

  const cardClass =
    variant === "warning"
      ? "border-amber-100 bg-[linear-gradient(180deg,rgba(255,251,235,0.96),rgba(255,255,255,0.98))]"
      : "border-emerald-100 bg-[linear-gradient(180deg,rgba(236,253,245,0.96),rgba(255,255,255,0.98))]"

  return (
    <article className={cn("rounded-[32px] border p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]", cardClass)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
        {icon}
        {title}
      </div>
      {summary ? <p className="mt-4 text-sm leading-7 text-slate-600">{summary}</p> : null}
      {items && items.length > 0 ? (
        <div className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
          {items.map((item) => (
            <p
              className="relative pl-4 before:absolute before:left-0 before:top-[0.62rem] before:size-1.5 before:rounded-full before:bg-current before:opacity-35"
              key={item}
            >
              {item}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function NarrativeSection({
  title,
  icon,
  body,
  variant = "default",
}: {
  title: string
  icon: ReactNode
  body?: string
  variant?: "default" | "dark" | "soft"
}) {
  if (!body) {
    return null
  }

  const variants = {
    default: "border-black/5 bg-white/92 text-slate-700",
    dark: "border-slate-900 bg-slate-950 text-white/80",
    soft: "border-fuchsia-100 bg-[linear-gradient(180deg,rgba(253,244,255,0.96),rgba(255,255,255,0.98))] text-slate-700",
  }

  return (
    <article className={cn("rounded-[32px] border p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]", variants[variant])}>
      <div className={cn("flex items-center gap-2 text-sm font-semibold", variant === "dark" ? "text-white" : "text-slate-950")}>
        {icon}
        {title}
      </div>
      <p className={cn("mt-4 text-sm leading-7", variant === "dark" ? "text-white/78" : "text-slate-600")}>{body}</p>
    </article>
  )
}

/**
 * --- OEJTS Profile Helpers ---
 */

function getAxisDominantSummary(key: string, score: number) {
  const meta = getOejtsAxisMeta(key)
  if (!meta) return null
  return score <= 24
    ? { letter: meta.lowLetter, label: meta.lowLabel }
    : { letter: meta.highLetter, label: meta.highLabel }
}

function getAxisBiasPercent(score: number) {
  const midpoint = 24
  const spread = 16
  const rawDiff = Math.abs(score - midpoint)
  return Math.min(Math.round((rawDiff / spread) * 100), 100)
}

function OejtsAxisCard({ item, theme }: { item: ScoreBreakdownItem; theme: QuizThemePreset }) {
  const dominant = getAxisDominantSummary(item.key, item.score)
  if (!dominant) return null

  return (
    <article className="rounded-[32px] border border-black/5 bg-white/92 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("size-10 rounded-2xl flex items-center justify-center text-white font-bold", theme.accentStrong)}>
            {dominant.letter}
          </div>
          <h4 className="text-base font-bold text-slate-900">{dominant.label}</h4>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">偏向度 {getAxisBiasPercent(item.score)}%</span>
      </div>
      <p className="text-sm leading-7 text-slate-600">
        该维度反映了你在日常处理信息与决策时的基本倾向。
      </p>
    </article>
  )
}

/**
 * --- Exported Templates ---
 */

export function DefaultStoryTemplate({ submission, result, theme }: QuizResultTemplateProps) {
  return (
    <section className="rounded-[36px] border border-black/5 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-10">
      <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
        测试结果
      </div>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">{submission.resultTitle}</h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{result.summary}</p>
      {(result.highlights ?? []).length > 0 ? (
        <div className="mt-8">
          <StoryHighlights highlights={result.highlights ?? []} />
        </div>
      ) : null}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <BulletSection icon={<TrendingUp className={`size-4 ${theme.accentText}`} />} items={result.strengths} title="核心特质" />
        <BulletSection icon={<ShieldAlert className={`size-4 ${theme.accentText}`} />} items={result.blindSpots} title="成长提醒" variant="warning" />
      </div>
    </section>
  )
}

export function OejtsProfileTemplate({ result, submission, theme }: QuizResultTemplateProps) {
  const scoreBreakdown = submission.scoreBreakdown ?? []
  const typeCode = result.typeCode || "XXXX"
  const alias = result.alias || "未知人格"

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[40px] border border-black/5 bg-white/92 p-7 shadow-2xl md:p-10"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Noise />
        <div className="relative grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-start text-left">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] uppercase tracking-widest text-slate-500">
              <Sparkles className={`size-4 ${theme.accentText}`} />
              OEJTS 16 型人格结果
            </div>
            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-3">
              <span className="text-5xl font-semibold tracking-tighter text-slate-950 md:text-6xl">{typeCode}</span>
              <span className="pb-1 text-lg font-medium text-slate-500 md:text-xl">{alias}</span>
            </div>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{result.summary}</p>
          </div>
          <div className={cn("rounded-[36px] p-8 text-white flex flex-col items-center justify-center min-h-[240px]", theme.accentStrong)}>
             <h2 className="text-7xl font-black tracking-tighter">{typeCode}</h2>
             <p className="text-xl mt-4 font-bold opacity-80">{alias}</p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {scoreBreakdown.map((item) => (
          <OejtsAxisCard item={item} key={item.key} theme={theme} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <BulletSection icon={<TrendingUp className="size-4" />} items={result.strengths} title="核心优势" />
        <BulletSection icon={<ShieldAlert className="size-4" />} items={result.blindSpots} title="盲点提醒" variant="warning" />
        <NarrativeSection body={result.relationshipStyle} icon={<HeartHandshake className="size-4" />} title="关系风格" />
        <NarrativeSection body={result.workStyle} icon={<BriefcaseBusiness className="size-4" />} title="工作节奏" />
      </section>
    </div>
  )
}

export function BigFiveProfileTemplate({ result, submission, theme }: QuizResultTemplateProps) {
  const scoreBreakdown = submission.scoreBreakdown || []
  
  const getMeta = (key: string) => {
    const metas: any = {
      E: { label: "外向性", icon: <Users className="size-4" />, color: "bg-orange-400" },
      A: { label: "宜人性", icon: <HeartHandshake className="size-4" />, color: "bg-emerald-400" },
      C: { label: "尽责性", icon: <Target className="size-4" />, color: "bg-blue-400" },
      N: { label: "情绪稳定性", icon: <Waves className="size-4" />, color: "bg-rose-400" },
      O: { label: "开放性", icon: <Compass className="size-4" />, color: "bg-violet-400" }
    }
    return metas[key]
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="rounded-[40px] border border-black/5 bg-white p-10 shadow-xl text-left">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">{result.title || "五维人格画像"}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600 max-w-3xl">{result.summary}</p>
      </section>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {scoreBreakdown.map((item) => {
          const meta = getMeta(item.key)
          if (!meta) return null
          const percentage = Math.round((item.score / 5) * 100)
          return (
            <article className="rounded-[32px] border border-black/5 bg-white/92 p-6 shadow-sm" key={item.key}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("size-10 rounded-2xl flex items-center justify-center text-white", meta.color)}>{meta.icon}</div>
                  <h4 className="text-base font-bold text-slate-900">{meta.label}</h4>
                </div>
                <span className="text-2xl font-bold">{percentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={cn("h-full rounded-full", meta.color)} />
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export function RelationshipStoryTemplate(props: QuizResultTemplateProps) { return <DefaultStoryTemplate {...props} /> }
export function CareerEnergyTemplate(props: QuizResultTemplateProps) { return <DefaultStoryTemplate {...props} /> }
export function EnneagramProfileTemplate(props: QuizResultTemplateProps) { return <DefaultStoryTemplate {...props} /> }
export function HexacoProfileTemplate(props: QuizResultTemplateProps) { return <DefaultStoryTemplate {...props} /> }
export function RiasecProfileTemplate(props: QuizResultTemplateProps) { return <DefaultStoryTemplate {...props} /> }
export function TarotProfileTemplate(props: QuizResultTemplateProps) { 
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-stone-950 rounded-[40px] text-white p-10">
      <h1 className="text-4xl font-serif">{props.result.title}</h1>
      <p className="mt-6 text-stone-400 italic">「{props.result.summary}」</p>
    </div>
  )
}
