type AuraResultKey = string

type TalentScores = Record<string, number>
type SoulCityScores = Record<string, number>
type PaintingScores = Record<string, number>

type PaintingQuestion = {
  options: Array<{
    scores: PaintingScores
  }>
}

type PaintingResult = {
  vector: number[]
  [key: string]: unknown
}

function getHighestDimension(scores: TalentScores) {
  const dimensions = Object.keys(scores)
  const maxScore = Math.max(...Object.values(scores))
  return dimensions.find((dimension) => scores[dimension] === maxScore) ?? dimensions[0] ?? "insight"
}

function getSecondHighestDimension(scores: TalentScores, excludeDimension: string) {
  const filteredEntries = Object.entries(scores).filter(([dimension]) => dimension !== excludeDimension)
  const maxScore = Math.max(...filteredEntries.map(([, value]) => value))
  return filteredEntries.find(([, value]) => value === maxScore)?.[0] ?? filteredEntries[0]?.[0] ?? "creativity"
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let index = 0; index < vecA.length; index += 1) {
    dotProduct += vecA[index] * vecB[index]
    magnitudeA += vecA[index] * vecA[index]
    magnitudeB += vecB[index] * vecB[index]
  }

  const normalizedMagnitudeA = Math.sqrt(magnitudeA)
  const normalizedMagnitudeB = Math.sqrt(magnitudeB)

  if (!normalizedMagnitudeA || !normalizedMagnitudeB) {
    return 0
  }

  return dotProduct / (normalizedMagnitudeA * normalizedMagnitudeB)
}

export function calculateAuraResult(scoreA: number, scoreB: number): AuraResultKey {
  if (scoreA >= 46) {
    if (scoreB <= 33) return "gold"
    if (scoreB <= 45) return "red"
    if (scoreB <= 57) return "orange"
    return "pink"
  }

  if (scoreB <= 33) return "indigo"
  if (scoreB <= 45) return "green"
  if (scoreB <= 57) return "purple"
  return "silver"
}

export function calculateBanweiResult(totalScore: number) {
  const concentration = Math.round(((totalScore - 15) / 45) * 100)
  let levelKey = "lv1"

  if (totalScore <= 22) levelKey = "lv1"
  else if (totalScore <= 30) levelKey = "lv2"
  else if (totalScore <= 38) levelKey = "lv3"
  else if (totalScore <= 46) levelKey = "lv4"
  else if (totalScore <= 54) levelKey = "lv5"
  else levelKey = "lv6"

  return {
    levelKey,
    concentration,
  }
}

export function calculateDimensionPercent(dimScore: number) {
  return Math.round(((dimScore - 3) / 9) * 100)
}

export function calculateTalentResult<T extends { primaryTalent: string; secondaryTalentCondition: string[] }>(
  scores: TalentScores,
  resultMap: Record<string, T>,
) {
  const primaryDimension = getHighestDimension(scores)
  const secondaryDimension = getSecondHighestDimension(scores, primaryDimension)

  for (const [resultKey, resultData] of Object.entries(resultMap)) {
    if (resultData.primaryTalent === primaryDimension && resultData.secondaryTalentCondition.includes(secondaryDimension)) {
      return resultKey
    }
  }

  return "truth_decoder"
}

export function calculateSoulCityResult<T extends { fiveDimension: SoulCityScores }>(
  scores: SoulCityScores,
  resultMap: Record<string, T>,
) {
  const maxScore = 30 * 3
  const normalizedScores = Object.fromEntries(
    Object.entries(scores).map(([dimension, value]) => [dimension, (value / maxScore) * 100]),
  ) as SoulCityScores

  const userVector = Object.fromEntries(
    Object.entries(normalizedScores).map(([dimension, value]) => [dimension, value / 100]),
  ) as SoulCityScores

  let bestMatch = ""
  let bestSimilarity = -1

  for (const [resultKey, result] of Object.entries(resultMap)) {
    const cityVector = Object.fromEntries(
      Object.entries(result.fiveDimension).map(([dimension, value]) => [dimension, value / 100]),
    ) as SoulCityScores

    const dotProduct = Object.keys(cityVector).reduce((sum, dimension) => {
      return sum + (cityVector[dimension] ?? 0) * (userVector[dimension] ?? 0)
    }, 0)

    const cityMagnitude = Math.sqrt(Object.values(cityVector).reduce((sum, value) => sum + value ** 2, 0))
    const userMagnitude = Math.sqrt(Object.values(userVector).reduce((sum, value) => sum + value ** 2, 0))

    if (!cityMagnitude || !userMagnitude) {
      continue
    }

    const similarity = dotProduct / (cityMagnitude * userMagnitude)

    if (similarity > bestSimilarity) {
      bestSimilarity = similarity
      bestMatch = resultKey
    }
  }

  return bestMatch
}

export function calculatePaintingResult<T extends PaintingResult>(
  answers: number[],
  questionSet: PaintingQuestion[],
  resultMap: Record<string, T>,
  dimensionRanges: Record<string, { min: number; max: number }>,
) {
  const rawScores: PaintingScores = { E: 0, A: 0, L: 0, S: 0, T: 0 }

  answers.forEach((choiceIndex, questionIndex) => {
    const optionScores = questionSet[questionIndex]?.options?.[choiceIndex]?.scores ?? {}

    Object.entries(optionScores).forEach(([dimension, value]) => {
      rawScores[dimension] = (rawScores[dimension] ?? 0) + Number(value)
    })
  })

  const userVector = ["E", "A", "L", "S", "T"].map((dimension) => {
    const range = dimensionRanges[dimension]
    const rawScore = rawScores[dimension] ?? 0
    const clampedScore = Math.max(range.min, Math.min(range.max, rawScore))
    return ((clampedScore - range.min) / (range.max - range.min)) * 4 + 1
  })

  const sortedResults = Object.values(resultMap)
    .map((result) => {
      const similarity = cosineSimilarity(userVector, result.vector)
      return {
        ...result,
        similarity,
        matchPercent: Math.round(similarity * 100),
      }
    })
    .sort((left, right) => right.similarity - left.similarity)

  return {
    userVector,
    primary: sortedResults[0],
    similar: sortedResults.slice(1, 4),
    all: sortedResults,
  }
}

export function calculateSzondiResult(scores: Record<string, number>, selectedFacialTypes: string[]) {
  const sorted = Object.entries(scores).sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1]
    }

    const leftFacialCount = selectedFacialTypes.filter((type) => type === left[0]).length
    const rightFacialCount = selectedFacialTypes.filter((type) => type === right[0]).length

    if (leftFacialCount !== rightFacialCount) {
      return rightFacialCount - leftFacialCount
    }

    if (selectedFacialTypes[0] === left[0]) {
      return -1
    }

    if (selectedFacialTypes[0] === right[0]) {
      return 1
    }

    return 0
  })

  return {
    resultType: sorted[0]?.[0] ?? "h",
    score: sorted[0]?.[1] ?? 0,
  }
}
