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

import { Noise } from "@/components/ui/noise"
import { cn } from "@/lib/utils"
import { getOejtsAxisMeta, getQuizPosterExportId, type QuizThemePreset } from "@/features/quizzes/engine"
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

const relationshipDimensionOrder = [
  "words_of_affirmation",
  "quality_time",
  "receiving_gifts",
  "acts_of_service",
  "physical_touch",
] as const

type RelationshipPreferenceExtension = {
  dimensionOrder?: string[]
  maxScorePerDimension?: number
  dualPrimaryDelta?: number
  balancedSpreadDelta?: number
  pairNarratives?: Record<string, string>
}

function getRelationshipPreferenceExtension(runtime: QuizRuntimeConfig) {
  return (runtime.extensions?.relationshipPreference ?? {}) as RelationshipPreferenceExtension
}

function getRelationshipDimensionOrder(runtime: QuizRuntimeConfig) {
  const extension = getRelationshipPreferenceExtension(runtime)
  return Array.isArray(extension.dimensionOrder) && extension.dimensionOrder.length > 0
    ? extension.dimensionOrder
    : [...relationshipDimensionOrder]
}

function getRelationshipMaxScore(runtime: QuizRuntimeConfig) {
  const extension = getRelationshipPreferenceExtension(runtime)
  return typeof extension.maxScorePerDimension === "number" ? extension.maxScorePerDimension : 12
}

function getRelationshipResult(runtime: QuizRuntimeConfig, key: string | undefined) {
  if (!key) {
    return undefined
  }

  return runtime.results.find((item) => item.dimensionKey === key || item.key === key)
}

function sortRelationshipScoreBreakdown(runtime: QuizRuntimeConfig, scoreBreakdown: ScoreBreakdownItem[]) {
  const labels = new Map(
    (runtime.extensions?.scoring?.dimensions ?? [])
      .filter(
        (item): item is { key: string; label: string } =>
          typeof item === "object" && item !== null && typeof item.key === "string" && typeof item.label === "string",
      )
      .map((item) => [item.key, item.label]),
  )

  const scoreMap = new Map(scoreBreakdown.map((item) => [item.key, item]))

  return getRelationshipDimensionOrder(runtime)
    .map((key) => scoreMap.get(key) ?? { key, label: labels.get(key) ?? key, score: 0 })
    .sort((left, right) => right.score - left.score)
}

function getRelationshipPairKey(firstKey: string, secondKey: string, order: string[]) {
  const filtered = order.filter((item) => item === firstKey || item === secondKey)
  return filtered.length === 2 ? filtered.join("|") : [firstKey, secondKey].sort().join("|")
}

function RelationshipPosterCard({
  result,
  runtime,
  scoreBreakdown,
  secondaryTitle,
  theme,
}: {
  result: QuizResultDefinition
  runtime: QuizRuntimeConfig
  scoreBreakdown: ScoreBreakdownItem[]
  secondaryTitle?: string
  theme: QuizThemePreset
}) {
  const posterExportId = getQuizPosterExportId(runtime) ?? "relationship-preference-poster"
  const maxScore = getRelationshipMaxScore(runtime)

  return (
    <article
      className="relative mx-auto w-full max-w-[380px] overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(95,22,52,0.98),rgba(35,10,22,1))] p-5 text-white shadow-[0_28px_100px_rgba(15,23,42,0.28)]"
      id={posterExportId}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.24),transparent_42%),radial-gradient(circle_at_84%_24%,rgba(251,191,36,0.14),transparent_26%)]" />
      <div className="relative flex min-h-[620px] flex-col">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/72">
          <Sparkles className="size-3.5" />
          SoulTest · 亲密关系偏好测试
        </div>

        <div className="mt-7">
          <p className="text-sm font-medium text-white/62">你的关系偏好主通道</p>
          <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">{result.title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/74">{result.firstImpression ?? result.summary}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs text-white/86">主语言</span>
          {secondaryTitle ? (
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs text-white/78">次语言 · {secondaryTitle}</span>
          ) : null}
        </div>

        <div className="mt-7 space-y-3 rounded-[24px] border border-white/10 bg-white/6 p-4">
          {scoreBreakdown.map((item) => {
            const percent = Math.round((item.score / Math.max(maxScore, 1)) * 100)

            return (
              <div key={item.key}>
                <div className="flex items-center justify-between gap-3 text-[11px] text-white/66">
                  <span>{item.label}</span>
                  <span>
                    {item.score}/{maxScore}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 rounded-full bg-white/10">
                  <div className={`h-full rounded-full bg-gradient-to-r ${theme.accentGradient}`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-auto pt-7">
          <p className="text-sm leading-7 text-white/72">{result.shareCopy ?? result.summary}</p>
          <div className="mt-4 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.28em] text-white/42">
            <span>Relationship Poster</span>
            <span>Ready to Export</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function RelationshipStoryTemplate({ result, runtime, submission, theme }: QuizResultTemplateProps) {
  const scoreBreakdown = sortRelationshipScoreBreakdown(runtime, submission.scoreBreakdown ?? [])
  const extension = getRelationshipPreferenceExtension(runtime)
  const maxScore = getRelationshipMaxScore(runtime)
  const primaryKey = result.dimensionKey ?? result.key
  const secondaryItem = scoreBreakdown[1]
  const lowestItem = [...scoreBreakdown].reverse()[0]
  const secondaryResult = getRelationshipResult(runtime, secondaryItem?.key)
  const lowestResult = getRelationshipResult(runtime, lowestItem?.key)
  const dualPrimaryDelta = typeof extension.dualPrimaryDelta === "number" ? extension.dualPrimaryDelta : 1
  const balancedSpreadDelta = typeof extension.balancedSpreadDelta === "number" ? extension.balancedSpreadDelta : 2
  const topScore = scoreBreakdown[0]?.score ?? 0
  const secondScore = secondaryItem?.score ?? 0
  const lowestScore = lowestItem?.score ?? 0
  const isDualPrimary = topScore - secondScore <= dualPrimaryDelta
  const isBalanced = topScore - lowestScore <= balancedSpreadDelta
  const pairNarratives = extension.pairNarratives ?? {}
  const pairNarrative =
    secondaryItem && secondaryResult
      ? pairNarratives[getRelationshipPairKey(primaryKey, secondaryItem.key, getRelationshipDimensionOrder(runtime))]
      : undefined

  const presentationTags = [
    `主语言 · ${result.title}`,
    secondaryResult ? `次语言 · ${secondaryResult.title}` : undefined,
    isDualPrimary ? "双主导偏好" : undefined,
    isBalanced ? "整体偏均衡" : undefined,
  ].filter((item): item is string => Boolean(item))

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[40px] border border-black/5 bg-white/92 p-7 shadow-[0_30px_100px_rgba(15,23,42,0.10)] md:p-10"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Noise />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.14),transparent_60%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <HeartHandshake className={`size-4 ${theme.accentText}`} />
              亲密关系偏好结果
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-5xl">
              {isDualPrimary && secondaryResult
                ? `你是「${result.title} × ${secondaryResult.title}」双主导偏好`
                : `你的关系偏好主通道是「${result.title}」`}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{result.firstImpression ?? result.summary}</p>

            <div className="mt-6">
              <StoryHighlights highlights={presentationTags} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-[28px] border border-rose-100 bg-[linear-gradient(180deg,rgba(255,241,242,0.9),rgba(255,255,255,0.96))] p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">主语言深读</p>
                <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">{result.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{result.overview ?? result.summary}</p>
              </article>

              <article className="rounded-[28px] border border-amber-100 bg-[linear-gradient(180deg,rgba(255,251,235,0.96),rgba(255,255,255,0.98))] p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">次语言补充</p>
                <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">{secondaryResult?.title ?? "等待更多样本"}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {secondaryResult?.relationshipStyle ?? "你的次语言会和主语言一起，构成你在关系里的第二需求通道。"}
                </p>
              </article>
            </div>
          </div>

          <RelationshipPosterCard
            result={result}
            runtime={runtime}
            scoreBreakdown={scoreBreakdown}
            secondaryTitle={secondaryResult?.title}
            theme={theme}
          />
        </div>
      </motion.section>

      <section className="grid gap-4 xl:grid-cols-[1.06fr_0.94fr]">
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-black/5 bg-white/92 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.05, duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Waves className={`size-4 ${theme.accentText}`} />
            五维分布
          </div>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            分数表示你在这套题里对不同表达方式的相对敏感度，不代表关系能力高低，也不是对你的固定定义。
          </p>

          <div className="mt-6 space-y-4">
            {scoreBreakdown.map((item) => {
              const percent = Math.round((item.score / Math.max(maxScore, 1)) * 100)
              const itemResult = getRelationshipResult(runtime, item.key)

              return (
                <article className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4" key={item.key}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                      <p className="mt-1 text-xs leading-6 text-slate-500">{itemResult?.subtitle ?? "看你更容易被哪一种表达方式击中。"}</p>
                    </div>
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", theme.accentSoft)}>
                      {item.score}/{maxScore}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-slate-200">
                    <div className={`h-full rounded-full bg-gradient-to-r ${theme.accentGradient}`} style={{ width: `${percent}%` }} />
                  </div>
                </article>
              )
            })}
          </div>
        </motion.article>

        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-black/5 bg-white/92 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Sparkles className={`size-4 ${theme.accentText}`} />
            一句话看你的关系偏好
          </div>
          <p className="mt-4 text-base font-semibold leading-8 text-slate-950">{result.shareCopy ?? result.summary}</p>

          {pairNarrative ? (
            <div className="mt-6 rounded-[24px] border border-rose-100 bg-[linear-gradient(180deg,rgba(255,241,242,0.88),rgba(255,255,255,0.98))] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">主语言 × 次语言</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pairNarrative}</p>
            </div>
          ) : null}

          <div className="mt-6 rounded-[24px] border border-amber-100 bg-[linear-gradient(180deg,rgba(255,251,235,0.96),rgba(255,255,255,0.98))] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">低敏感区提醒</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {lowestResult?.stressMode ?? "分数较低，不代表你完全不需要它，只是相较之下没有那么容易直接击中你。"}
            </p>
            {lowestItem ? (
              <p className="mt-3 text-xs text-slate-500">
                当前相对低敏感维度：{lowestItem.label} · {lowestItem.score}/{maxScore}
              </p>
            ) : null}
          </div>
        </motion.article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[32px] border border-black/5 bg-white/92 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <TrendingUp className={`size-4 ${theme.accentText}`} />
            什么最容易让你有“被爱感”
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            {(result.strengths ?? []).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          {(result.relationshipNotes ?? []).length > 0 ? (
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">常见误解</p>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                {(result.relationshipNotes ?? []).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <article className="rounded-[32px] border border-black/5 bg-white/92 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <ShieldAlert className={`size-4 ${theme.accentText}`} />
            关系里，你最容易卡住的点
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            {(result.blindSpots ?? []).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          {result.blindSpotSummary ? <p className="mt-5 text-sm leading-7 text-slate-500">{result.blindSpotSummary}</p> : null}
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[32px] border border-black/5 bg-white/92 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <HeartHandshake className={`size-4 ${theme.accentText}`} />
            如果想让你更有被爱感，可以这样做
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            {(result.growthNotes ?? []).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          {result.growthAdvice ? <p className="mt-5 text-sm leading-7 text-slate-500">{result.growthAdvice}</p> : null}
        </article>

        <article className="rounded-[32px] border border-black/5 bg-white/92 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Waves className={`size-4 ${theme.accentText}`} />
            结果提示
          </div>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            这套结果更适合帮助你理解“你更容易被哪一种表达方式击中”，而不是给关系下绝对结论。真正重要的，不是谁更会爱，而是彼此有没有把对方最有感觉的通道对上。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(result.posterTags ?? []).map((item) => (
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", theme.accentSoft)} key={item}>
                {item}
              </span>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
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

  if (absolute <= 8) {
    return `这条维度已经比较明确地偏向 ${edgeLabel}，会影响你沟通、判断和处理事情的默认节奏。`
  }

  return `这条维度更稳定地偏向 ${edgeLabel}，这种偏好通常会较明显地影响你的做事方式与互动习惯。`
}

function getAxisLeaningLabel(axisKey: string, score: number) {
  const meta = getOejtsAxisMeta(axisKey)

  if (!meta) {
    return "接近中线"
  }

  const diff = score - 24
  const absolute = Math.abs(diff)

  if (absolute <= 1) {
    return `${meta.lowLabel} / ${meta.highLabel} 接近中线`
  }

  const edgeLabel = diff > 0 ? meta.highLabel : meta.lowLabel

  if (absolute <= 4) {
    return `轻微偏向 ${edgeLabel}`
  }

  if (absolute <= 8) {
    return `明显偏向 ${edgeLabel}`
  }

  return `稳定偏向 ${edgeLabel}`
}

const oejtsAxisOrder = ["ie", "sn", "ft", "jp"] as const

function sortOejtsScoreBreakdown(items: ScoreBreakdownItem[]) {
  const orderMap = new Map<string, number>(oejtsAxisOrder.map((key, index) => [key, index]))

  return [...items].sort((left, right) => {
    return (orderMap.get(left.key) ?? Number.POSITIVE_INFINITY) - (orderMap.get(right.key) ?? Number.POSITIVE_INFINITY)
  })
}

function getAxisBiasPercent(score: number) {
  return Math.round((Math.abs(score - 24) / 16) * 100)
}

function getAxisDominantSummary(axisKey: string, score: number) {
  const meta = getOejtsAxisMeta(axisKey)

  if (!meta) {
    return undefined
  }

  const diff = score - 24

  if (Math.abs(diff) <= 1) {
    return {
      letter: "≈",
      label: `${meta.lowLabel} / ${meta.highLabel}`,
    }
  }

  return diff > 0
    ? {
        letter: meta.highLetter,
        label: meta.highLabel,
      }
    : {
        letter: meta.lowLetter,
        label: meta.lowLabel,
      }
}

function getAxisFormulaNarrative(axisKey: string, score: number) {
  const meta = getOejtsAxisMeta(axisKey)

  if (!meta) {
    return ""
  }

  const diff = score - 24
  const absolute = Math.abs(diff)

  if (absolute <= 1) {
    return `这条维度非常接近中线，你会在 ${meta.lowLabel} 与 ${meta.highLabel} 之间随场景切换。`
  }

  const edgeLabel = diff > 0 ? meta.highLabel : meta.lowLabel

  if (absolute <= 4) {
    return `这次结果轻微偏向 ${edgeLabel}，说明你会更常以这一侧的方式进入状态。`
  }

  if (absolute <= 8) {
    return `你的默认节奏更偏向 ${edgeLabel}，这一点已经会稳定影响沟通和决策。`
  }

  return `${edgeLabel} 是你非常稳定的一侧偏好，很多第一反应都会从这里出发。`
}

function OejtsAxisCard({ item, theme }: { item: ScoreBreakdownItem; theme: QuizThemePreset }) {
  const meta = getOejtsAxisMeta(item.key)

  if (!meta) {
    return null
  }

  const percent = getAxisPercent(item.score)
  const biasPercent = getAxisBiasPercent(item.score)
  const dominant = getAxisDominantSummary(item.key, item.score)

  return (
    <article className="overflow-hidden rounded-[30px] border border-black/5 bg-white/92 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-xl font-semibold tracking-tight text-slate-950">{getAxisLeaningLabel(item.key, item.score)}</p>
            {dominant ? (
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", theme.accentSoft)}>{dominant.letter}</span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">偏向度</p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{biasPercent}%</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>
            {meta.lowLetter} · {meta.lowLabel}
          </span>
          <span>
            {meta.highLetter} · {meta.highLabel}
          </span>
        </div>
        <div className="relative mt-3 h-3 rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-300/90" />
          <div className="absolute inset-y-0 left-0 rounded-full bg-slate-200" style={{ width: `${percent}%` }} />
          <div
            className={cn(
              "absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_8px_20px_rgba(15,23,42,0.16)]",
              theme.accentStrong,
            )}
            style={{ left: `calc(${percent}% - 0.5rem)` }}
          />
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600">{getAxisNarrative(item.key, item.score)}</p>
    </article>
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

function OejtsPosterCard({
  result,
  scoreBreakdown,
  theme,
}: {
  result: QuizResultDefinition
  scoreBreakdown: ScoreBreakdownItem[]
  theme: QuizThemePreset
}) {
  const posterExportId = "oejts-result-poster"
  const posterTags = result.posterTags ?? []
  const typeCode = result.typeCode ?? result.title.split(" · ")[0] ?? result.title
  const alias = result.alias ?? result.nickname ?? result.title.replace(`${typeCode} · `, "")

  return (
    <article
      aria-label="适合截图分享的人格海报"
      className="relative isolate overflow-hidden rounded-[36px] border border-slate-900 bg-slate-950 p-6 text-white shadow-[0_32px_120px_rgba(15,23,42,0.18)] md:p-7"
      id={posterExportId}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b ${theme.heroGlow}`} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(15,23,42,0.04)_18%,rgba(15,23,42,0.5)_100%)]" />

      <div className="relative flex min-h-[520px] flex-col">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/68">
            OEJTS Personality Poster
          </div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">支持一键导出 PNG</p>
        </div>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.28em] text-white/45">人格海报</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-6xl font-semibold tracking-[-0.08em] md:text-7xl">{typeCode}</span>
            <span className="pb-2 text-lg text-white/64">{alias}</span>
          </div>
          <p className="mt-5 max-w-md text-base leading-8 text-white/86">
            {result.shareCopy ?? result.firstImpression ?? result.subtitle}
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          {sortOejtsScoreBreakdown(scoreBreakdown).map((item) => {
            const meta = getOejtsAxisMeta(item.key)

            if (!meta) {
              return null
            }

            const percent = getAxisPercent(item.score)
            const dominant = getAxisDominantSummary(item.key, item.score)

            return (
              <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3" key={item.key}>
                <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-white/60">
                  <span>
                    {meta.lowLetter} / {meta.highLetter}
                  </span>
                  <span>{dominant?.label ?? getAxisLeaningLabel(item.key, item.score)}</span>
                </div>
                <div className="relative mt-3 h-2 rounded-full bg-white/10">
                  <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/18" />
                  <div
                    className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border border-white bg-white shadow-[0_8px_18px_rgba(255,255,255,0.18)]"
                    style={{ left: `calc(${percent}% - 0.375rem)` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {posterTags.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {posterTags.map((item) => (
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/88" key={item}>
                {item}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.28em] text-white/42">
            <span>SoulTest · OEJTS 16 型人格图谱</span>
            <span>{typeCode} Personality Poster</span>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/60">
            这张卡片聚焦你的类型代号、四维偏好与一句话气质，适合直接分享，也支持一键导出为图片。
          </p>
        </div>
      </div>
    </article>
  )
}
function OejtsProfileTemplate({ result, submission, theme }: QuizResultTemplateProps) {
  const scoreBreakdown = sortOejtsScoreBreakdown(submission.scoreBreakdown ?? [])
  const rankedByContrast = [...scoreBreakdown].sort(
    (left, right) => Math.abs(right.score - 24) - Math.abs(left.score - 24),
  )
  const strongestAxes = rankedByContrast.slice(0, 3).map((item) => {
    const meta = getOejtsAxisMeta(item.key)

    if (!meta) {
      return item.label
    }

    if (Math.abs(item.score - 24) <= 1) {
      return `${meta.lowLetter}/${meta.highLetter} 接近中线`
    }

    return item.score > 24 ? `${meta.highLetter} · ${meta.highLabel}` : `${meta.lowLetter} · ${meta.lowLabel}`
  })
  const strongestAxis = rankedByContrast[0]
  const mostFlexibleAxis = [...rankedByContrast].reverse()[0]

  const keywords = result.keywords ?? result.highlights ?? []
  const typeCode = result.typeCode ?? result.title.split(" · ")[0] ?? result.title
  const alias = result.alias ?? result.nickname ?? result.title.replace(`${typeCode} · `, "")

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[40px] border border-black/5 bg-white/92 p-7 shadow-[0_30px_100px_rgba(15,23,42,0.10)] md:p-10"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Noise />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.14),transparent_60%)]" />
        <div className="pointer-events-none absolute -right-16 top-10 h-44 w-44 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <Sparkles className={`size-4 ${theme.accentText}`} />
              OEJTS 16 型人格结果
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-3">
              <span className="text-5xl font-semibold tracking-[-0.06em] text-slate-950 md:text-6xl">{typeCode}</span>
              <span className="pb-1 text-lg font-medium text-slate-500 md:text-xl">{alias}</span>
            </div>

            {result.firstImpression ? <p className="mt-4 text-base font-medium text-slate-800">{result.firstImpression}</p> : null}
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{result.summary}</p>

            {keywords.length > 0 ? (
              <div className="mt-6">
                <StoryHighlights highlights={keywords} />
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {strongestAxis ? (
                <article className="rounded-[28px] border border-black/5 bg-slate-50/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">最稳定的偏好</p>
                  <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
                    {getAxisLeaningLabel(strongestAxis.key, strongestAxis.score)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {getAxisFormulaNarrative(strongestAxis.key, strongestAxis.score)}
                  </p>
                </article>
              ) : null}

              {mostFlexibleAxis ? (
                <article className="rounded-[28px] border border-fuchsia-100 bg-[linear-gradient(180deg,rgba(253,244,255,0.96),rgba(255,255,255,0.98))] p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">最灵活的一维</p>
                  <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
                    {getAxisLeaningLabel(mostFlexibleAxis.key, mostFlexibleAxis.score)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {getAxisFormulaNarrative(mostFlexibleAxis.key, mostFlexibleAxis.score)}
                  </p>
                </article>
              ) : null}
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-500">
              OEJTS 关注四条偏好维度的位置与组合，帮助你理解自己的默认节奏，而不是给你贴上固定不变的标签。
            </p>
          </div>

          <OejtsPosterCard result={result} scoreBreakdown={scoreBreakdown} theme={theme} />
        </div>
      </motion.section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-black/5 bg-white/92 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.05, duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Sparkles className={`size-4 ${theme.accentText}`} />
            你的类型是怎么形成的
          </div>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            这次结果不是由某一道题决定的，而是由四条偏好维度共同组成。每个字母都代表你更自然的默认节奏。
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {scoreBreakdown.map((item) => {
              const meta = getOejtsAxisMeta(item.key)
              const dominant = getAxisDominantSummary(item.key, item.score)

              if (!meta || !dominant) {
                return null
              }

              return (
                <article className="rounded-[24px] border border-black/5 bg-slate-50/90 p-5" key={item.key}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                        {meta.lowLetter} / {meta.highLetter}
                      </p>
                      <div className="mt-3 flex items-end gap-3">
                        <span className="text-4xl font-semibold tracking-[-0.06em] text-slate-950">{dominant.letter}</span>
                        <span className="pb-1 text-sm font-medium text-slate-500">{dominant.label}</span>
                      </div>
                    </div>
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", theme.accentSoft)}>
                      偏向度 {getAxisBiasPercent(item.score)}%
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{getAxisFormulaNarrative(item.key, item.score)}</p>
                </article>
              )
            })}
          </div>
        </motion.article>

        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-black/5 bg-white/92 p-7 shadow-[0_16px_50px_rgba(15,23,42,0.04)]"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Sparkles className={`size-4 ${theme.accentText}`} />
            结果解读
          </div>
          <p className="mt-4 text-sm leading-8 text-slate-600">{result.overview ?? result.summary}</p>

          <div className="mt-6 rounded-[24px] border border-fuchsia-100 bg-[linear-gradient(180deg,rgba(253,244,255,0.96),rgba(255,255,255,0.98))] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">一句话看你</p>
            <p className="mt-3 text-lg font-semibold leading-8 text-slate-950">
              {result.shareCopy ?? result.firstImpression ?? result.subtitle}
            </p>
          </div>

          {strongestAxes.length > 0 ? (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">偏好更明显的维度</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {strongestAxes.map((item) => (
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", theme.accentSoft)} key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <p className="mt-6 text-sm leading-7 text-slate-500">
            本页展示的是四条偏好维度的位置与对应描述，不代表能力高低，也不等于固定不变的人格结论。
          </p>
        </motion.article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {scoreBreakdown.map((item) => (
          <OejtsAxisCard item={item} key={item.key} theme={theme} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BulletSection
          icon={<TrendingUp className={`size-4 ${theme.accentText}`} />}
          items={result.strengths}
          summary={result.strengths?.length ? undefined : result.strengthSummary}
          title="你更自然的优势"
        />
        <BulletSection
          icon={<ShieldAlert className={`size-4 ${theme.accentText}`} />}
          items={result.blindSpots}
          summary={result.blindSpots?.length ? undefined : result.blindSpotSummary}
          title="容易卡住的地方"
          variant="warning"
        />
        <NarrativeSection
          body={result.relationshipStyle ?? result.relationshipNotes?.[0]}
          icon={<HeartHandshake className={`size-4 ${theme.accentText}`} />}
          title="关系里的你"
        />
        <NarrativeSection
          body={result.workStyle ?? result.workNotes?.[0]}
          icon={<BriefcaseBusiness className={`size-4 ${theme.accentText}`} />}
          title="工作 / 学习中的你"
        />
        <NarrativeSection
          body={result.stressMode ?? result.stressNotes?.[0]}
          icon={<Waves className={`size-4 ${theme.accentText}`} />}
          title="高压状态"
          variant="dark"
        />
        <NarrativeSection
          body={result.growthAdvice ?? result.growthNotes?.[0]}
          icon={<Sparkles className={`size-4 ${theme.accentText}`} />}
          title="成长提醒"
          variant="soft"
        />
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


