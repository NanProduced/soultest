import type { QuizRuntimeConfig, AccessPolicy } from "./types"

export function parseJson<T>(json: string | null | undefined, fallback: T): T {
  if (!json) {
    return fallback
  }

  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function isExpired(dateStr: string | null | undefined): boolean {
  if (!dateStr) {
    return false
  }

  try {
    return new Date(dateStr) < new Date()
  } catch {
    return false
  }
}

export function hasCompleteRuntimeConfig(runtime?: QuizRuntimeConfig) {
  return Boolean(runtime && runtime.questions.length > 0 && runtime.results.length > 0)
}

export function normalizeRuntimeConfig(runtime?: QuizRuntimeConfig) {
  if (!runtime || runtime.meta.slug !== "bigfive") {
    return runtime
  }

  const rawQuestions = Array.isArray(runtime.questions) ? runtime.questions : []
  const questions = rawQuestions.map((question, index) => {
    const existingOptions = Array.isArray(question.options) ? question.options : []
    if (existingOptions.length > 0) {
      return question
    }

    const id = typeof question.id === "string" ? question.id : `Q${index + 1}`
    const title = typeof question.title === "string"
      ? question.title
      : typeof question.text === "string"
        ? question.text
        : `第 ${index + 1} 题`
    const trait = typeof question.trait === "string" ? question.trait : undefined
    const reverse = question.reverse === true

    if (!trait) {
      return {
        ...question,
        id,
        type: "single_choice",
        title,
        leftLabel: "非常不像我",
        rightLabel: "非常像我",
        options: ["非常不像我", "不太像我", "一般", "比较像我", "非常像我"].map((label, optionIndex) => ({
          id: `${id}_option_${optionIndex + 1}`,
          label,
          value: { score: optionIndex + 1 },
        })),
      }
    }

    return {
      ...question,
      id,
      type: "single_choice",
      title,
      leftLabel: "非常不像我",
      rightLabel: "非常像我",
      options: ["非常不像我", "不太像我", "一般", "比较像我", "非常像我"].map((label, optionIndex) => ({
        id: `${id}_option_${optionIndex + 1}`,
        label,
        value: {
          [trait]: reverse ? 5 - optionIndex : optionIndex + 1,
        },
      })),
    }
  })

  const primaryResult = runtime.results[0] ?? {
    key: "bigfive-result",
    title: "你的大五人格画像",
    summary: "这份结果会展示你在外向性、宜人性、尽责性、神经质与开放性五个维度上的相对分布。",
  }

  return {
    ...runtime,
    runtime: {
      ...runtime.runtime,
      rendererKey: "generic",
      scoringKey: "radar",
      resultTemplateKey: runtime.runtime.resultTemplateKey ?? "story-card",
    },
    questions,
    results: [
      {
        ...primaryResult,
        key: primaryResult.key ?? "bigfive-result",
        title: primaryResult.title ?? "你的大五人格画像",
        summary:
          primaryResult.summary ??
          "这份结果会展示你在外向性、宜人性、尽责性、神经质与开放性五个维度上的相对分布。",
        highlights:
          primaryResult.highlights ??
          [
            "不是把你归进单一类型，而是看见五个维度上的稳定偏好。",
            "适合结合关系、工作与压力情境一起理解自己。",
            "更适合作为长期自我观察的坐标，而不是一次性的标签结论。",
          ],
        strengths:
          primaryResult.strengths ??
          [
            "高分维度往往是你最自然、最省力的行为方式。",
            "五维分布能帮助你看见自己在关系与协作中的舒适区。",
            "结果可作为后续职业、沟通与自我管理的参考基线。",
          ],
        blindSpots:
          primaryResult.blindSpots ??
          [
            "低分维度不代表缺点，而是提醒你哪些场景更容易消耗自己。",
            "高分维度如果过度使用，也可能在压力下变成固执或失衡。",
            "结合具体生活情境理解分数，通常比单看结论更有帮助。",
          ],
        relationshipNotes:
          primaryResult.relationshipNotes ?? ["你在关系中的互动节奏、表达方式与安全感来源，往往会和高分维度保持一致。"],
        workNotes:
          primaryResult.workNotes ?? ["你更自然的协作方式、推进节奏与决策偏好，会在工作场景里更明显地呈现出来。"],
        stressNotes:
          primaryResult.stressNotes ?? ["当压力上来时，低分维度往往更容易成为卡点，也更值得被提前照顾。"],
        growthNotes:
          primaryResult.growthNotes ?? ["把高分维度当作优势，把低分维度当作提醒区，通常比追求“完美人格”更有效。"],
      },
    ],
    extensions: {
      ...runtime.extensions,
      scoring: {
        ...runtime.extensions?.scoring,
        dimensions: [
          { key: "E", label: "外向性" },
          { key: "A", label: "宜人性" },
          { key: "C", label: "尽责性" },
          { key: "N", label: "神经质" },
          { key: "O", label: "开放性" },
        ],
      },
      share: {
        ...runtime.extensions?.share,
        captionTone: runtime.extensions?.share?.captionTone ?? "insightful",
      },
    },
  } satisfies QuizRuntimeConfig
}

export function normalizeEditableAccessPolicy(policy: AccessPolicy): AccessPolicy {
  return {
    scopeMode: policy.scopeMode ?? "full_product",
    allowQuizSlugs: policy.scopeMode === "custom_scope" ? policy.allowQuizSlugs : undefined,
    tokenTtlDays: policy.tokenTtlDays ?? 30,
  }
}

export function buildBatchStrategyType(productType: string, policy: AccessPolicy): string {
  const parts = [productType]

  if (policy.scopeMode === "custom_scope") {
    parts.push("custom")
  }

  return parts.join("_")
}

export function createVerificationCode(prefix: string, length: number, existingCodes: Set<string>): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code: string

  do {
    let codeBody = ""
    for (let i = 0; i < length; i += 1) {
      codeBody += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    code = prefix ? `${prefix}-${codeBody}` : codeBody
  } while (existingCodes.has(code))

  existingCodes.add(code)
  return code
}

export function normalizeCodePrefix(prefix: string | undefined): string {
  return (prefix ?? "").trim().toUpperCase().replaceAll(/[^A-Z0-9-]/g, "").slice(0, 8)
}

export function normalizeExpiryDate(dateStr: string | undefined): string | null {
  if (!dateStr) {
    return null
  }

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return null
    }
    return date.toISOString()
  } catch {
    return null
  }
}