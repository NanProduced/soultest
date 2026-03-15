import type {
  AccessGrant,
  AdminCodeBatch,
  AdminOverview,
  AdminProduct,
  QuizCatalogItem,
  QuizIntro,
  QuizRuntimeConfig,
} from "./types"
import { oejtsQuestionContent } from "./oejts-question-content"
import { OEJTS_RESULT_ORDER, oejtsResultContent } from "./oejts-result-content"

const scaleOptions = (questionId: string) => [
  { id: `${questionId}_1`, label: "明显更接近左边", value: { score: 1 } },
  { id: `${questionId}_2`, label: "略偏左边", value: { score: 2 } },
  { id: `${questionId}_3`, label: "两边差不多", value: { score: 3 } },
  { id: `${questionId}_4`, label: "略偏右边", value: { score: 4 } },
  { id: `${questionId}_5`, label: "明显更接近右边", value: { score: 5 } },
]

const oejtsQuestions = oejtsQuestionContent.map((question) => ({
  ...question,
  type: "single_choice" as const,
  options: scaleOptions(question.id),
}))

const oejtsResults = OEJTS_RESULT_ORDER.map((key) => ({
  key,
  ...oejtsResultContent[key],
})) satisfies QuizRuntimeConfig["results"]

const catalogItems: QuizCatalogItem[] = [
  {
    id: "quiz_oejts_personality_map",
    slug: "oejts-personality-map",
    title: "OEJTS 16 型人格图谱",
    category: "人格 / 性格",
    summary:
      "OEJTS 16 型人格图谱是一套基于四条人格偏好维度的自我探索测试，帮你看见自己的注意力方向、判断方式与行动节奏。",
    tagline: "OEJTS 首发版本，结果页支持回看、保存与分享。",
    priceLabel: "32 题完整版",
    durationMinutes: 8,
    questionCount: 32,
    accessSummary: "输入口令后开始测试，有效期内可重复进入",
    tags: ["OEJTS", "16 型人格", "32 题", "四维度画像"],
    valuePoints: ["16 型结果", "四条维度倾向", "关系 / 工作 / 压力提示"],
    flowSteps: ["输入口令", "完成 32 题", "查看完整结果"],
  },
]

const introSections: Record<string, QuizIntro["detailSections"]> = {
  "oejts-personality-map": [
    {
      title: "OEJTS 是什么",
      description:
        "OEJTS 16 型人格图谱是一套基于 I/E、S/N、F/T、J/P 四条人格偏好维度的自我探索测试。它关注你更自然的注意力方向、判断方式与行动节奏，而不是给你贴上固定不变的标签。",
    },
    {
      title: "这套题适合谁",
      description: "适合想快速了解自己在四条人格维度上更偏向哪一侧，以及这些偏好如何影响关系、沟通与做事方式的人。",
    },
    {
      title: "你会得到什么",
      description: "结果页会展示你的 16 型结果、四条维度位置，以及围绕关系、工作和压力情境的补充解读。",
    },
    {
      title: "答题方式",
      description: "每题都在两种倾向之间做 5 级选择，按第一反应作答即可，不需要刻意追求“最好”的答案。",
    },
  ],
}

const runtimeConfigs: Record<string, QuizRuntimeConfig> = {
  "oejts-personality-map": {
    meta: {
      slug: "oejts-personality-map",
      title: "OEJTS 16 型人格图谱",
      summary:
        "OEJTS 16 型人格图谱是一套基于四条人格偏好维度的自我探索测试，帮你看见自己的注意力方向、判断方式与行动节奏。",
      estimatedMinutes: 8,
      tags: ["OEJTS", "32 题完整版", "16 型人格", "适合保存结果卡片"],
      category: "人格 / 性格",
    },
    runtime: {
      rendererKey: "generic",
      resultTemplateKey: "oejts-profile",
      scoringKey: "oejts",
    },
    presentation: {
      themeKey: "ink-glow",
      storyMode: true,
      screenCount: 5,
      shareCardKey: "oejts-type-poster",
    },
    questions: oejtsQuestions,
    results: oejtsResults,
    extensions: {
      scoring: {
        dimensions: [
          { key: "ie", label: "I 内向 ←→ E 外向" },
          { key: "sn", label: "S 实感 ←→ N 直觉" },
          { key: "ft", label: "F 情感 ←→ T 思考" },
          { key: "jp", label: "J 判断 ←→ P 感知" },
        ],
      },
      share: {
        captionTone: "insightful",
      },
    },
  },
}

const mockProducts: AdminProduct[] = [
  {
    id: "product_oejts_shared",
    name: "OEJTS 16 型人格图谱",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "MVP 阶段先使用单题集通用口令，后续可平滑切换为一单一码。",
  },
]

const mockCodeBatches: AdminCodeBatch[] = [
  {
    id: "batch_oejts_shared",
    name: "OEJTS 主售卖批次",
    productId: "product_oejts_shared",
    productName: "OEJTS 16 型人格图谱",
    strategyType: "single_product",
    status: "active",
    codeCount: 2,
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
]

const mockAccessGrants: Record<string, AccessGrant> = {
  "SOUL-OEJTS-0313": {
    code: "SOUL-OEJTS-0313",
    product: {
      id: "product_oejts_shared",
      name: "OEJTS 16 型人格图谱",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "oejts-personality-map", title: "OEJTS 16 型人格图谱" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "MVP 通用口令模式，有效期内可重复进入。",
    },
  },
  "ST-DEMO-ALPHA": {
    code: "ST-DEMO-ALPHA",
    product: {
      id: "product_oejts_shared",
      name: "OEJTS 16 型人格图谱",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "oejts-personality-map", title: "OEJTS 16 型人格图谱" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "本地联调演示口令。",
    },
  },
}

const mockAdminOverview: AdminOverview = {
  quizzes: catalogItems.length,
  products: mockProducts.length,
  codeBatches: mockCodeBatches.length,
  activeCodes: Object.keys(mockAccessGrants).length,
  submissions: 0,
  lastSeedAt: "2026-03-14T00:00:00.000Z",
}

export function getMockCatalogItems() {
  return catalogItems
}

export function getMockQuizIntro(slug: string): QuizIntro | undefined {
  const item = catalogItems.find((entry) => entry.slug === slug)

  if (!item) {
    return undefined
  }

  return {
    ...item,
    detailSections: introSections[slug] ?? [],
  }
}

export function getMockRuntimeConfig(slug: string) {
  return runtimeConfigs[slug]
}

export function getMockAccessGrant(code: string) {
  return mockAccessGrants[code.trim().toUpperCase()]
}

export function getMockAdminOverview() {
  return mockAdminOverview
}

export function getMockProducts() {
  return mockProducts
}

export function getMockCodeBatches() {
  return mockCodeBatches
}


