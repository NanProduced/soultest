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
    case "hexaco":
    case "riasec":
    case "enneagram":
    case "tarot":
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

  // Create array with all dimensions and sort by score descending
  const results = Array.from(labels.entries()).map(([key, label]) => {
    return scoreMap.find((item) => item.key === key) ?? { key, label, score: 0 }
  })
  
  // Sort by score descending for dominant dimension detection
  return results.sort((a, b) => b.score - a.score)
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

function calculateHexacoScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const labels = getDimensionLabels(runtime)
  const scoreMap = new Map<string, number>()
  const countMap = new Map<string, number>()

  for (const question of runtime.questions) {
    if (typeof question.trait !== "string") {
      continue
    }

    const rawScore = getQuestionScore(question, answers)

    if (rawScore === undefined) {
      continue
    }

    const normalized = question.reverse ? 6 - rawScore : rawScore
    const trait = question.trait
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
      band
    }
  })
}

function calculateTarotScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const dimensions = runtime.extensions?.scoring?.dimensions ?? []
  const scoreMap = new Map<string, number>()
  
  // Initial scores
  dimensions.forEach(d => scoreMap.set(d.key, 0))

  for (const question of runtime.questions) {
    const selectedId = getSelectedOptionIds(answers[String(question.id)])[0]
    if (!selectedId) continue

    const option = (question.options as any[])?.find(o => String(o.id) === selectedId)
    if (!option?.value) continue

    for (const [dimKey, weight] of Object.entries(option.value)) {
      if (typeof weight === "number") {
        scoreMap.set(dimKey, (scoreMap.get(dimKey) ?? 0) + weight)
      }
    }
  }

  // Normalization to [1, 5]
  // Based on doc: D1-D3: [-15, 15], D4-D5: [-14, 14]
  return dimensions.map(d => {
    const raw = scoreMap.get(d.key) ?? 0
    const range = (d.key === "D4" || d.key === "D5") ? 14 : 15
    const normalized = ((raw - (-range)) / (range - (-range))) * 4 + 1
    const clamped = Math.max(1, Math.min(5, normalized))
    
    return {
      key: d.key,
      label: d.label,
      score: raw,
      avg: clamped,
      display: Math.round(((clamped - 1) / 4) * 100)
    }
  })
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

function findTarotMatchingResult(runtime: QuizRuntimeConfig, scoreBreakdown: ScoreBreakdownItem[], answers: Record<string, unknown>) {
  const userVector = ["D1", "D2", "D3", "D4", "D5"].map(key => 
    scoreBreakdown.find(s => s.key === key)?.avg ?? 3
  )

  const resultsWithSim = runtime.results.map(result => {
    const cardVector = (result as any).vector as number[]
    if (!cardVector) return { result, similarity: 0 }
    
    let similarity = cosineSimilarity(userVector, cardVector)
    
    // Tie-breaker with zodiac
    const userZodiac = String(answers["zodiac"] ?? "")
    const cardZodiac = (result as any).zodiac as string
    if (userZodiac && cardZodiac && userZodiac === cardZodiac) {
      similarity += 0.015
    }

    return { result, similarity }
  })

  resultsWithSim.sort((a, b) => b.similarity - a.similarity)
  
  const topMatch = resultsWithSim[0].result
  const echoes = resultsWithSim.slice(1, 5).map(r => r.result.key)

  return {
    ...topMatch,
    matchSimilarity: resultsWithSim[0].similarity,
    echoes
  }
}

function calculateRiasecScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const labels = getDimensionLabels(runtime)
  const scoreMap = new Map<string, number>()
  const countMap = new Map<string, number>()

  for (const question of runtime.questions) {
    const trait = question.trait as string
    if (!trait) continue

    const rawScore = getQuestionScore(question, answers)
    if (rawScore === undefined) continue

    scoreMap.set(trait, (scoreMap.get(trait) ?? 0) + rawScore)
    countMap.set(trait, (countMap.get(trait) ?? 0) + 1)
  }

  return Array.from(labels.entries()).map(([key, label]) => {
    const raw = scoreMap.get(key) ?? 0
    const count = countMap.get(key) ?? 1
    const avg = raw / count
    const display = Math.round(((avg - 1) / 4) * 100)
    
    let band = "mid"
    if (avg < 2.6) band = "low"
    else if (avg >= 3.6) band = "high"

    return {
      key,
      label,
      score: raw,
      avg,
      display,
      band
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
    case "hexaco":
      return calculateHexacoScores(runtime, answers)
    case "riasec":
      return calculateRiasecScores(runtime, answers)
    case "enneagram":
      return calculateEnneagramScores(runtime, answers)
    case "tarot":
      return calculateTarotScores(runtime, answers)
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
    case "hexaco": {
      result = findDominantDimensionResult(runtime, scoreBreakdown)
      break
    }
    case "riasec": {
      result = findDominantDimensionResult(runtime, scoreBreakdown)
      break
    }
    case "enneagram": {
      result = findDominantDimensionResult(runtime, scoreBreakdown)
      break
    }
    case "tarot": {
      result = findTarotMatchingResult(runtime, scoreBreakdown, answers)
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


