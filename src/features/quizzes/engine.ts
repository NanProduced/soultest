import type {
  QuizQuestion,
  QuizResultDefinition,
  QuizRuntimeConfig,
  ResultTemplateKey,
  ScoreBreakdownItem,
  ScoringModelKey,
} from "@/features/quizzes/types"

interface BranchRule {
  when: Record<string, string | string[]>
  resultKey: string
}

interface RangeRule {
  min?: number
  max?: number
  resultKey: string
}

export interface ResolvedQuizStrategies {
  renderer: string
  resultTemplate: ResultTemplateKey
  scoringModel: ScoringModelKey
}

export interface QuizThemePreset {
  pageBackground: string
  heroSurface: string
  heroGlow: string
  accentText: string
  accentRing: string
  accentGradient: string
  accentSoft: string
  accentStrong: string
  chartStroke: string
  chartFill: string
}

export interface OejtsAxisMeta {
  key: string
  lowLetter: string
  highLetter: string
  lowLabel: string
  highLabel: string
}

const themePresets: Record<string, QuizThemePreset> = {
  "rose-map": {
    pageBackground:
      "bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_36%),radial-gradient(circle_at_80%_18%,_rgba(192,132,252,0.16),_transparent_22%),linear-gradient(180deg,#fff7fb_0%,#ffffff_44%,#fff1f6_100%)]",
    heroSurface: "border-rose-100 bg-white/78 shadow-[0_24px_120px_rgba(244,114,182,0.16)]",
    heroGlow: "from-rose-500/25 via-fuchsia-500/15 to-violet-500/10",
    accentText: "text-rose-600",
    accentRing: "ring-rose-200/70",
    accentGradient: "from-rose-500 via-fuchsia-500 to-violet-500",
    accentSoft: "bg-rose-50 text-rose-700 border border-rose-100",
    accentStrong: "bg-rose-600 text-white",
    chartStroke: "#f43f5e",
    chartFill: "rgba(244, 63, 94, 0.16)",
  },
  "midnight-stress": {
    pageBackground: "bg-[#020617]",
    heroSurface: "border-slate-800 bg-slate-900/50 shadow-[0_24px_120px_rgba(217,70,239,0.1)]",
    heroGlow: "from-fuchsia-600/20 via-blue-600/10 to-transparent",
    accentText: "text-fuchsia-400",
    accentRing: "ring-fuchsia-500/30",
    accentGradient: "from-fuchsia-500 to-blue-600",
    accentSoft: "bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20",
    accentStrong: "bg-fuchsia-600 text-white",
    chartStroke: "#d946ef",
    chartFill: "rgba(217, 70, 239, 0.15)",
  },
  "violet-lab": {
    pageBackground:
      "bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_38%),radial-gradient(circle_at_80%_18%,_rgba(59,130,246,0.12),_transparent_22%),linear-gradient(180deg,#f8f7ff_0%,#ffffff_44%,#eef4ff_100%)]",
    heroSurface: "border-violet-100 bg-white/80 shadow-[0_24px_120px_rgba(124,58,237,0.14)]",
    heroGlow: "from-violet-500/25 via-indigo-500/15 to-sky-500/10",
    accentText: "text-violet-600",
    accentRing: "ring-violet-200/70",
    accentGradient: "from-violet-500 via-indigo-500 to-sky-500",
    accentSoft: "bg-violet-50 text-violet-700 border border-violet-100",
    accentStrong: "bg-violet-600 text-white",
    chartStroke: "#7c3aed",
    chartFill: "rgba(124, 58, 237, 0.16)",
  },
  "amber-work": {
    pageBackground:
      "bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_36%),radial-gradient(circle_at_80%_20%,_rgba(34,197,94,0.12),_transparent_18%),linear-gradient(180deg,#fffbeb_0%,#ffffff_44%,#fefce8_100%)]",
    heroSurface: "border-amber-100 bg-white/82 shadow-[0_24px_120px_rgba(245,158,11,0.16)]",
    heroGlow: "from-amber-500/25 via-orange-500/15 to-emerald-500/10",
    accentText: "text-amber-600",
    accentRing: "ring-amber-200/70",
    accentGradient: "from-amber-500 via-orange-500 to-emerald-500",
    accentSoft: "bg-amber-50 text-amber-700 border border-amber-100",
    accentStrong: "bg-amber-500 text-slate-950",
    chartStroke: "#f59e0b",
    chartFill: "rgba(245, 158, 11, 0.18)",
  },
  "ink-glow": {
    pageBackground:
      "bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.12),_transparent_32%),radial-gradient(circle_at_82%_12%,_rgba(168,85,247,0.10),_transparent_18%),linear-gradient(180deg,#fffafc_0%,#ffffff_42%,#f8fafc_100%)]",
    heroSurface: "border-slate-200 bg-white/88 shadow-[0_28px_120px_rgba(15,23,42,0.10)]",
    heroGlow: "from-fuchsia-500/18 via-violet-500/12 to-sky-500/8",
    accentText: "text-fuchsia-600",
    accentRing: "ring-fuchsia-200/70",
    accentGradient: "from-fuchsia-500 via-violet-500 to-sky-500",
    accentSoft: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100",
    accentStrong: "bg-slate-950 text-white",
    chartStroke: "#db2777",
    chartFill: "rgba(219, 39, 119, 0.14)",
  },
  "editorial-mystic": {
    pageBackground:
      "bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.16),_transparent_34%),radial-gradient(circle_at_82%_12%,_rgba(99,102,241,0.12),_transparent_22%),linear-gradient(180deg,#fffafc_0%,#ffffff_40%,#f6f5ff_100%)]",
    heroSurface: "border-slate-200 bg-white/90 shadow-[0_28px_120px_rgba(15,23,42,0.12)]",
    heroGlow: "from-pink-500/24 via-fuchsia-500/14 to-indigo-500/10",
    accentText: "text-pink-600",
    accentRing: "ring-pink-200/70",
    accentGradient: "from-pink-500 via-fuchsia-500 to-indigo-500",
    accentSoft: "bg-pink-50 text-pink-700 border border-pink-100",
    accentStrong: "bg-slate-950 text-white",
    chartStroke: "#ec4899",
    chartFill: "rgba(236, 72, 153, 0.16)",
  },
  "professional-blue": {
    pageBackground:
      "bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_38%),radial-gradient(circle_at_80%_18%,_rgba(30,58,138,0.08),_transparent_22%),linear-gradient(180deg,#f0f7ff_0%,#ffffff_44%,#e0f2fe_100%)]",
    heroSurface: "border-blue-100 bg-white/85 shadow-[0_24px_120px_rgba(59,130,246,0.12)]",
    heroGlow: "from-blue-600/20 via-indigo-600/12 to-cyan-600/8",
    accentText: "text-blue-600",
    accentRing: "ring-blue-200/70",
    accentGradient: "from-blue-600 via-indigo-600 to-cyan-600",
    accentSoft: "bg-blue-50 text-blue-700 border border-blue-100",
    accentStrong: "bg-blue-600 text-white",
    chartStroke: "#2563eb",
    chartFill: "rgba(37, 99, 235, 0.15)",
  },
}

const oejtsAxisMap: Record<string, OejtsAxisMeta> = {
  ie: {
    key: "ie",
    lowLetter: "I",
    highLetter: "E",
    lowLabel: "内向",
    highLabel: "外向",
  },
  sn: {
    key: "sn",
    lowLetter: "S",
    highLetter: "N",
    lowLabel: "实感",
    highLabel: "直觉",
  },
  ft: {
    key: "ft",
    lowLetter: "F",
    highLetter: "T",
    lowLabel: "情感",
    highLabel: "思考",
  },
  jp: {
    key: "jp",
    lowLetter: "J",
    highLetter: "P",
    lowLabel: "判断",
    highLabel: "感知",
  },
}

function resolveScoringModel(runtime: QuizRuntimeConfig): ScoringModelKey {
  const candidate = runtime.runtime.scoringModel ?? runtime.runtime.scoringKey

  switch (candidate) {
    case "accumulate":
    case "dimension":
    case "range":
    case "branch":
    case "radar":
    case "oejts":
    case "hexaco":
    case "enneagram":
      return candidate
    default:
      return "dimension"
  }
}

function getSelectedOptionIds(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String)
  }

  if (typeof value === "string" && value.length > 0) {
    return [value]
  }

  if (value !== null && value !== undefined) {
    return [String(value)]
  }

  return []
}

function getDimensionLabels(runtime: QuizRuntimeConfig) {
  const labels = new Map<string, string>()
  const dimensions = runtime.extensions?.scoring?.dimensions

  if (!Array.isArray(dimensions)) {
    return labels
  }

  for (const item of dimensions) {
    if (
      typeof item === "object" &&
      item !== null &&
      typeof item.key === "string" &&
      typeof item.label === "string"
    ) {
      labels.set(item.key, item.label)
    }
  }

  return labels
}

function getQuestionOptions(question: QuizQuestion) {
  return question.options.map((option) => ({
    id: option.id,
    value: option.value,
  }))
}

function getQuestionScore(question: QuizQuestion, answers: Record<string, unknown>) {
  const selectedOptionId = getSelectedOptionIds(answers[question.id])[0]

  if (!selectedOptionId) {
    return undefined
  }

  const option = question.options.find((item) => item.id === selectedOptionId)
  const scoreValue = option?.value?.score
  const numericScore = typeof scoreValue === "number" ? scoreValue : Number(scoreValue)

  if (!Number.isFinite(numericScore)) {
    return undefined
  }

  return numericScore
}

function calculateDimensionScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const labels = getDimensionLabels(runtime)
  const scoreMap = new Map<string, number>()

  for (const question of runtime.questions) {
    const selectedOptionIds = getSelectedOptionIds(answers[question.id])

    if (selectedOptionIds.length === 0) {
      continue
    }

    const options = getQuestionOptions(question)

    for (const selectedOptionId of selectedOptionIds) {
      const matched = options.find((option) => option.id === selectedOptionId)

      if (!matched?.value) {
        continue
      }

      for (const [dimensionKey, dimensionValue] of Object.entries(matched.value)) {
        const numericValue = typeof dimensionValue === "number" ? dimensionValue : Number(dimensionValue)

        if (!Number.isFinite(numericValue)) {
          continue
        }

        scoreMap.set(dimensionKey, (scoreMap.get(dimensionKey) ?? 0) + numericValue)
      }
    }
  }

  return Array.from(scoreMap.entries())
    .map(([key, score]) => ({
      key,
      label: labels.get(key) ?? key,
      score,
    }))
    .sort((left, right) => right.score - left.score)
}

function calculateRadarScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const scoreMap = calculateDimensionScores(runtime, answers)
  const labels = getDimensionLabels(runtime)

  if (labels.size === 0) {
    return scoreMap
  }

  return Array.from(labels.entries()).map(([key, label]) => {
    return scoreMap.find((item) => item.key === key) ?? { key, label, score: 0 }
  })
}

function calculateTotalScore(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  let total = 0

  for (const question of runtime.questions) {
    const selectedOptionIds = getSelectedOptionIds(answers[question.id])
    const options = getQuestionOptions(question)

    for (const selectedOptionId of selectedOptionIds) {
      const matched = options.find((option) => option.id === selectedOptionId)

      if (!matched?.value) {
        continue
      }

      for (const value of Object.values(matched.value)) {
        const numericValue = typeof value === "number" ? value : Number(value)

        if (Number.isFinite(numericValue)) {
          total += numericValue
        }
      }
    }
  }

  return total
}

function calculateOejtsScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const labels = getDimensionLabels(runtime)
  const scoreMap = new Map<string, number>()

  for (const question of runtime.questions) {
    if (!question.axisKey) {
      continue
    }

    const rawScore = getQuestionScore(question, answers)

    if (rawScore === undefined) {
      continue
    }

    const normalized = question.reverseScore ? 6 - rawScore : rawScore
    scoreMap.set(question.axisKey, (scoreMap.get(question.axisKey) ?? 0) + normalized)
  }

  return Array.from(labels.entries()).map(([key, label]) => ({
    key,
    label,
    score: scoreMap.get(key) ?? 0,
  }))
}

function calculateHexacoScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const labels = getDimensionLabels(runtime)
  const scoreMap = new Map<string, number>()
  const countMap = new Map<string, number>()

  for (const question of runtime.questions) {
    const trait = (question as QuizQuestion & { trait?: string }).trait
    const reverse = (question as QuizQuestion & { reverse?: boolean }).reverse === true

    if (typeof trait !== "string") {
      continue
    }

    const rawScore = getQuestionScore(question, answers)

    if (rawScore === undefined) {
      continue
    }

    const normalized = reverse ? 6 - rawScore : rawScore
    scoreMap.set(trait, (scoreMap.get(trait) ?? 0) + normalized)
    countMap.set(trait, (countMap.get(trait) ?? 0) + 1)
  }

  return Array.from(labels.entries()).map(([key, label]) => {
    const raw = scoreMap.get(key) ?? 0
    const count = countMap.get(key) ?? 1
    const avg = raw / count
    const display = Math.round(((avg - 1) / 4) * 100)

    let band = "mid"
    if (avg < 2.5) band = "low"
    else if (avg > 3.5) band = "high"

    return {
      key,
      label,
      score: raw,
      avg,
      display,
      band,
    }
  })
}

function calculateEnneagramScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const labels = getDimensionLabels(runtime)
  const baseScores = calculateDimensionScores(runtime, answers)
  const byKey = new Map(baseScores.map((item) => [item.key, item.score]))
  const enneagramConfig = (runtime.extensions?.enneagram ?? {}) as { questionsPerType?: number }
  const questionsPerType =
    typeof enneagramConfig.questionsPerType === "number" && enneagramConfig.questionsPerType > 0
      ? enneagramConfig.questionsPerType
      : 6

  const items = Array.from(labels.entries()).map(([key, label]) => {
    const raw = byKey.get(key) ?? 0
    const avg = raw / questionsPerType

    let band = "mid"
    if (avg < 2.4) band = "low"
    else if (avg >= 3.6) band = "high"

    return {
      key,
      label,
      score: raw,
      avg,
      band,
    }
  })

  const avgValues = items.map((item) => item.avg)
  const maxAvg = avgValues.length > 0 ? Math.max(...avgValues) : 0
  const minAvg = avgValues.length > 0 ? Math.min(...avgValues) : 0
  const spread = maxAvg - minAvg

  return items
    .map((item) => ({
      ...item,
      display: spread < 0.01 ? 50 : Math.round(((item.avg - minAvg) / spread) * 100),
    }))
    .sort((left, right) => right.score - left.score)
}

function getRangeRules(runtime: QuizRuntimeConfig) {
  const ranges = runtime.extensions?.scoring?.ranges

  if (!Array.isArray(ranges)) {
    return [] as RangeRule[]
  }

  return ranges.filter(
    (rule): rule is RangeRule =>
      typeof rule === "object" && rule !== null && typeof rule.resultKey === "string",
  )
}

function getBranchRules(runtime: QuizRuntimeConfig) {
  const branches = runtime.extensions?.scoring?.branches

  if (!Array.isArray(branches)) {
    return [] as BranchRule[]
  }

  return branches.filter(
    (rule): rule is BranchRule =>
      typeof rule === "object" &&
      rule !== null &&
      typeof rule.resultKey === "string" &&
      typeof rule.when === "object" &&
      rule.when !== null,
  )
}

function matchBranchRule(rule: BranchRule, answers: Record<string, unknown>) {
  return Object.entries(rule.when).every(([questionId, expectedValue]) => {
    const currentAnswer = answers[questionId]

    if (Array.isArray(expectedValue)) {
      return expectedValue.map(String).includes(String(currentAnswer ?? ""))
    }

    return String(currentAnswer ?? "") === String(expectedValue)
  })
}

function findResultByKey(runtime: QuizRuntimeConfig, resultKey: string | undefined) {
  if (!resultKey) {
    return undefined
  }

  return runtime.results.find((item) => item.key === resultKey)
}

function findDominantResult(runtime: QuizRuntimeConfig, scoreBreakdown: ScoreBreakdownItem[]) {
  const topScore = scoreBreakdown[0]?.score ?? 0
  const dominantKeys = new Set(
    scoreBreakdown.filter((item) => item.score === topScore).map((item) => item.key),
  )

  return runtime.results.find((item) => item.dimensionKey && dominantKeys.has(item.dimensionKey))
}

function findFallbackResult(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const serialized = JSON.stringify(answers)
  const fallbackIndex = runtime.results.length === 0 ? 0 : serialized.length % runtime.results.length

  return runtime.results[fallbackIndex] ?? runtime.results[0]
}

export function getOejtsAxisMeta(axisKey: string) {
  return oejtsAxisMap[axisKey]
}

export function getOejtsTypeFromBreakdown(scoreBreakdown: ScoreBreakdownItem[]) {
  const byKey = new Map(scoreBreakdown.map((item) => [item.key, item.score]))
  const ie = (byKey.get("ie") ?? 0) > 24 ? "E" : "I"
  const sn = (byKey.get("sn") ?? 0) > 24 ? "N" : "S"
  const ft = (byKey.get("ft") ?? 0) > 24 ? "T" : "F"
  const jp = (byKey.get("jp") ?? 0) > 24 ? "P" : "J"

  return `${ie}${sn}${ft}${jp}`
}

export function resolveQuizStrategies(runtime: QuizRuntimeConfig): ResolvedQuizStrategies {
  return {
    renderer: runtime.runtime.renderer ?? runtime.runtime.rendererKey ?? "generic",
    resultTemplate:
      (runtime.runtime.resultTemplate ?? runtime.runtime.resultTemplateKey ??
        "story-card") as ResultTemplateKey,
    scoringModel: resolveScoringModel(runtime),
  }
}

export function calculateScoreBreakdown(
  runtime: QuizRuntimeConfig,
  answers: Record<string, unknown>,
): ScoreBreakdownItem[] {
  switch (resolveScoringModel(runtime)) {
    case "accumulate": {
      const total = calculateTotalScore(runtime, answers)
      return [{ key: "total", label: "综合得分", score: total }]
    }
    case "range": {
      const total = calculateTotalScore(runtime, answers)
      return [{ key: "total", label: "综合得分", score: total }]
    }
    case "branch":
      return []
    case "radar":
      return calculateRadarScores(runtime, answers)
    case "oejts":
      return calculateOejtsScores(runtime, answers)
    case "hexaco":
      return calculateHexacoScores(runtime, answers)
    case "enneagram":
      return calculateEnneagramScores(runtime, answers)
    case "dimension":
    default:
      return calculateDimensionScores(runtime, answers)
  }
}

export function evaluateQuiz(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const strategies = resolveQuizStrategies(runtime)
  const scoreBreakdown = calculateScoreBreakdown(runtime, answers)
  let result: QuizResultDefinition | undefined

  switch (strategies.scoringModel) {
    case "branch": {
      const matchedRule = getBranchRules(runtime).find((rule) => matchBranchRule(rule, answers))
      result = findResultByKey(runtime, matchedRule?.resultKey)
      break
    }
    case "accumulate":
    case "range": {
      const totalScore = scoreBreakdown[0]?.score ?? 0
      const matchedRule = getRangeRules(runtime).find((rule) => {
        const min = rule.min ?? Number.NEGATIVE_INFINITY
        const max = rule.max ?? Number.POSITIVE_INFINITY
        return totalScore >= min && totalScore <= max
      })
      result = findResultByKey(runtime, matchedRule?.resultKey)
      break
    }
    case "oejts": {
      result = findResultByKey(runtime, getOejtsTypeFromBreakdown(scoreBreakdown))
      break
    }
    case "hexaco":
    case "enneagram": {
      result = findDominantResult(runtime, scoreBreakdown)
      break
    }
    case "radar":
    case "dimension":
    default:
      result = findDominantResult(runtime, scoreBreakdown)
      break
  }

  return {
    scoreBreakdown,
    result: result ?? findFallbackResult(runtime, answers),
  }
}

export function getQuizTheme(runtime?: QuizRuntimeConfig) {
  const themeKey = typeof runtime?.presentation?.themeKey === "string" ? runtime.presentation.themeKey : undefined
  return themePresets[themeKey ?? ""] ?? themePresets["violet-lab"]
}

export function getQuizShareCardKey(runtime?: QuizRuntimeConfig) {
  return typeof runtime?.presentation?.shareCardKey === "string" ? runtime.presentation.shareCardKey : undefined
}

export function getQuizPosterExportId(runtime?: QuizRuntimeConfig) {
  const shareCardKey = getQuizShareCardKey(runtime)

  if (shareCardKey === "oejts-type-poster") {
    return "oejts-result-poster"
  }

  if (shareCardKey === "stress-load-poster") {
    return "stress-load-poster"
  }

  return shareCardKey ? `${shareCardKey}-poster` : undefined
}

export function getTopDimensions(scoreBreakdown: ScoreBreakdownItem[], limit = 3) {
  return [...scoreBreakdown].sort((left, right) => right.score - left.score).slice(0, limit)
}



