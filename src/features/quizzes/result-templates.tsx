import type { ReactNode } from "react"
import {
  BriefcaseBusiness,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Waves,
} from "lucide-react"
import { motion } from "framer-motion"

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

function DefaultStoryTemplate({ submission, result, theme }: QuizResultTemplateProps) {
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
        {(result.strengths ?? []).length > 0 ? (
          <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <TrendingUp className={`size-4 ${theme.accentText}`} />
              更自然的优势
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {(result.strengths ?? []).map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        ) : null}
        {(result.blindSpots ?? []).length > 0 ? (
          <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldAlert className={`size-4 ${theme.accentText}`} />
              容易卡住的地方
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {(result.blindSpots ?? []).map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  )
}

function RelationshipStoryTemplate(props: QuizResultTemplateProps) {
  return <DefaultStoryTemplate {...props} />
}

function CareerEnergyTemplate(props: QuizResultTemplateProps) {
  return <DefaultStoryTemplate {...props} />
}

function getAxisPercent(score: number) {
  const min = 8
  const max = 40
  const clamped = Math.min(Math.max(score, min), max)
  return ((clamped - min) / (max - min)) * 100
}

function getAxisNarrative(axisKey: string, score: number) {
  const meta = getOejtsAxisMeta(axisKey)

  if (!meta) {
    return ""
  }

  const diff = score - 24
  const leaningToHigh = diff > 0
  const edgeLabel = leaningToHigh ? meta.highLabel : meta.lowLabel
  const absolute = Math.abs(diff)

  if (absolute <= 1) {
    return `这条维度非常接近中线，你在 ${meta.lowLabel} 与 ${meta.highLabel} 两侧都可能随情境切换。`
  }

  if (absolute <= 4) {
    return `这条维度略偏向 ${edgeLabel}，但在熟悉或高压场景下，另一侧偏好也可能明显出现。`
  }

  return `这条维度更稳定地偏向 ${edgeLabel}，它会较明显地影响你的沟通、决策与做事节奏。`
}

function OejtsAxisCard({ item }: { item: ScoreBreakdownItem }) {
  const meta = getOejtsAxisMeta(item.key)

  if (!meta) {
    return null
  }

  const percent = getAxisPercent(item.score)
  const leaningLabel = item.score > 24 ? meta.highLabel : item.score < 24 ? meta.lowLabel : "中线附近"
  const leaningPercent = Math.round(Math.abs(item.score - 24) * 6.25 + 50) // Normalize 24 as 50%, 40 as 100%

  return (
    <article className="rounded-[30px] border border-black/5 bg-white/92 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400 font-bold">{item.label}</p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {leaningLabel} <span className="text-sm font-medium text-slate-400 ml-1">{leaningPercent}%</span>
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {item.score} / 40
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>{meta.lowLabel}</span>
          <span>{meta.highLabel}</span>
        </div>
        <div className="relative mt-3 h-3 rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-300 z-10" />
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-500 to-sky-400 transition-all duration-1000 ease-out"
            style={{ width: `${percent}%` }}
          />
          <motion.div
            initial={{ left: "50%" }}
            animate={{ left: `calc(${percent}% - 10px)` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 size-5 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 shadow-[0_10px_25px_rgba(15,23,42,0.2)] z-20"
          />
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-600 font-medium italic">
          “{getAxisNarrative(item.key, item.score)}”
        </p>
      </div>
    </article>
  )
}

function ResultSection({
  title,
  icon,
  items,
  variant = "default",
}: {
  title: string
  icon: ReactNode
  items?: string[]
  variant?: "default" | "dark" | "success" | "warning" | "danger" | "info" | "primary"
}) {
  if (!items || items.length === 0) {
    return null
  }

  const variants = {
    default: "bg-white/90 border-black/5 text-slate-600 title:text-slate-950",
    dark: "bg-slate-950 border-white/10 text-white/80 title:text-white",
    success: "bg-emerald-50/80 border-emerald-100 text-emerald-900/80 title:text-emerald-950",
    warning: "bg-amber-50/80 border-amber-100 text-amber-900/80 title:text-amber-950",
    danger: "bg-rose-50/80 border-rose-100 text-rose-900/80 title:text-rose-950",
    info: "bg-blue-50/80 border-blue-100 text-blue-900/80 title:text-blue-950",
    primary: "bg-purple-50/80 border-purple-100 text-purple-900/80 title:text-purple-950",
  }

  const currentVariant = variants[variant]
  const isDark = variant === "dark"

  return (
    <article
      className={cn(
        "rounded-[32px] border p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)] transition-transform hover:scale-[1.01]",
        currentVariant
      )}
    >
      <div className={cn("flex items-center gap-2 text-sm font-bold", isDark ? "text-white" : "text-slate-950")}>
        {icon}
        {title}
      </div>
      <div className="mt-5 space-y-4 text-sm leading-7 font-medium">
        {items.map((item) => (
          <p key={item} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:rounded-full before:bg-current before:opacity-30">
            {item}
          </p>
        ))}
      </div>
    </article>
  )
}

function OejtsProfileTemplate({ result, submission, theme }: QuizResultTemplateProps) {
  const scoreBreakdown = submission.scoreBreakdown ?? []
  const strongestAxes = [...scoreBreakdown]
    .sort((left, right) => Math.abs(right.score - 24) - Math.abs(left.score - 24))
    .slice(0, 3)
    .map((item) => {
      const meta = getOejtsAxisMeta(item.key)
      if (!meta) {
        return item.label
      }

      if (item.score === 24) {
        return `${meta.lowLetter}/${meta.highLetter} 接近中线`
      }

      return item.score > 24
        ? `${meta.highLetter} ${meta.highLabel}`
        : `${meta.lowLetter} ${meta.lowLabel}`
    })

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[40px] border border-black/5 bg-white/92 p-7 shadow-[0_30px_100px_rgba(15,23,42,0.10)] md:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.16),_transparent_58%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <Sparkles className={`size-4 ${theme.accentText}`} />
              你的四字母类型
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">{result.title}</h1>
            {result.subtitle ? <p className="mt-4 text-lg font-medium text-slate-800">{result.subtitle}</p> : null}
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{result.summary}</p>
            {(result.highlights ?? []).length > 0 ? (
              <div className="mt-6">
                <StoryHighlights highlights={result.highlights ?? []} />
              </div>
            ) : null}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">结果速览</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">提交时间</p>
                <p className="mt-2 text-sm text-white/88">{new Date(submission.submittedAt).toLocaleString("zh-CN")}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">更明显的偏好</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {strongestAxes.map((item) => (
                    <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/88" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-7 text-white/75">
                这份结果展示的是四条偏好维度的位置，不代表能力高低，也不等于固定不变的人格结论。
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {scoreBreakdown.map((item) => (
          <OejtsAxisCard item={item} key={item.key} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ResultSection icon={<TrendingUp className={`size-4 ${theme.accentText}`} />} items={result.strengths} title="你更自然的优势" variant="success" />
        <ResultSection icon={<ShieldAlert className={`size-4 ${theme.accentText}`} />} items={result.blindSpots} title="容易卡住的地方" variant="warning" />
        <ResultSection icon={<HeartHandshake className={`size-4 ${theme.accentText}`} />} items={result.relationshipNotes} title="关系里的你" variant="danger" />
        <ResultSection icon={<BriefcaseBusiness className={`size-4 ${theme.accentText}`} />} items={result.workNotes} title="工作里的你" variant="info" />
        <ResultSection icon={<Waves className={`size-4 ${theme.accentText}`} />} items={result.stressNotes} title="压力上来时" variant="dark" />
        <ResultSection icon={<Sparkles className={`size-4 ${theme.accentText}`} />} items={result.growthNotes} title="更舒服的成长方向" variant="primary" />
      </section>
    </div>
  )
}

export {
  CareerEnergyTemplate,
  DefaultStoryTemplate,
  OejtsProfileTemplate,
  RelationshipStoryTemplate,
}

