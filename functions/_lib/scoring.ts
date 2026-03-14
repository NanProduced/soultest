import type {
  QuizResultDefinition,
  QuizRuntimeConfig,
  ScoreBreakdownItem,
  ScoringModelKey,
} from "./types"

interface BranchRule {
  when: Record<string, string | string[]>
  resultKey: string
}

interface RangeRule {
  min?: number
  max?: number
  resultKey: string
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

function getQuestionOptions(question: QuizRuntimeConfig["questions"][number]) {
  const options = Array.isArray(question.options) ? question.options : []
  return options.map((option) => ({
    id: typeof option.id === "string" ? option.id : "",
    value: option.value,
  }))
}

function getQuestionScore(question: QuizRuntimeConfig["questions"][number], answers: Record<string, unknown>) {
  const selectedOptionId = getSelectedOptionIds(answers[String(question.id ?? "")])[0]

  if (!selectedOptionId) {
    return undefined
  }

  const option = Array.isArray(question.options)
    ? question.options.find((item) => String(item.id ?? "") === selectedOptionId)
    : undefined
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
    const questionId = String(question.id ?? "")
    const selectedOptionIds = getSelectedOptionIds(answers[questionId])

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
    const questionId = String(question.id ?? "")
    const selectedOptionIds = getSelectedOptionIds(answers[questionId])
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
    if (typeof question.axisKey !== "string") {
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

function findDominantDimensionResult(runtime: QuizRuntimeConfig, scoreBreakdown: ScoreBreakdownItem[]) {
  const topScore = scoreBreakdown[0]?.score ?? 0
  const dominantKeys = new Set(scoreBreakdown.filter((item) => item.score === topScore).map((item) => item.key))

  return runtime.results.find((item) => item.dimensionKey && dominantKeys.has(item.dimensionKey))
}

function fallbackResult(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const serialized = JSON.stringify(answers)
  const fallbackIndex = runtime.results.length === 0 ? 0 : serialized.length % runtime.results.length

  return runtime.results[fallbackIndex] ?? runtime.results[0]
}

function getOejtsType(scoreBreakdown: ScoreBreakdownItem[]) {
  const byKey = new Map(scoreBreakdown.map((item) => [item.key, item.score]))
  const ie = (byKey.get("ie") ?? 0) > 24 ? "E" : "I"
  const sn = (byKey.get("sn") ?? 0) > 24 ? "N" : "S"
  const ft = (byKey.get("ft") ?? 0) > 24 ? "T" : "F"
  const jp = (byKey.get("jp") ?? 0) > 24 ? "P" : "J"

  return `${ie}${sn}${ft}${jp}`
}

export function calculateScoreBreakdown(
  runtime: QuizRuntimeConfig,
  answers: Record<string, unknown>,
): ScoreBreakdownItem[] {
  switch (resolveScoringModel(runtime)) {
    case "accumulate": {
      const totalScore = calculateTotalScore(runtime, answers)
      return [{ key: "total", label: "综合得分", score: totalScore }]
    }
    case "range": {
      const totalScore = calculateTotalScore(runtime, answers)
      return [{ key: "total", label: "综合得分", score: totalScore }]
    }
    case "branch":
      return []
    case "radar":
      return calculateRadarScores(runtime, answers)
    case "oejts":
      return calculateOejtsScores(runtime, answers)
    case "dimension":
    default:
      return calculateDimensionScores(runtime, answers)
  }
}

export function scoreSubmission(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const scoringModel = resolveScoringModel(runtime)
  const scoreBreakdown = calculateScoreBreakdown(runtime, answers)
  let result: QuizResultDefinition | undefined

  switch (scoringModel) {
    case "branch": {
      const matchedRule = getBranchRules(runtime).find((rule) => matchBranchRule(rule, answers))
      result = findResultByKey(runtime, matchedRule?.resultKey)
      break
    }
    case "range":
    case "accumulate": {
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
      result = findResultByKey(runtime, getOejtsType(scoreBreakdown))
      break
    }
    case "radar":
    case "dimension":
    default:
      result = findDominantDimensionResult(runtime, scoreBreakdown)
      break
  }

  return {
    scoreBreakdown,
    result: result ?? fallbackResult(runtime, answers),
  }
}
