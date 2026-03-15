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
import {
  RELATIONSHIP_PREFERENCE_DIMENSIONS,
  RELATIONSHIP_PREFERENCE_PAIR_NARRATIVES,
  RELATIONSHIP_PREFERENCE_RESULT_ORDER,
  relationshipPreferenceQuestionContent,
  relationshipPreferenceResultContent,
} from "./relationship-preference-content"

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

const relationshipPreferenceQuestions = relationshipPreferenceQuestionContent.map((question) => ({
  id: question.id,
  type: "single_choice" as const,
  title: question.title,
  description: "按第一反应选择更有感觉的一项即可，不需要刻意平衡答案。",
  options: [
    {
      id: `${question.id}_a`,
      label: question.optionA,
      value: { [question.dimensionA]: 1 },
    },
    {
      id: `${question.id}_b`,
      label: question.optionB,
      value: { [question.dimensionB]: 1 },
    },
  ],
}))

const relationshipPreferenceResults = RELATIONSHIP_PREFERENCE_RESULT_ORDER.map((key) => ({
  key,
  ...relationshipPreferenceResultContent[key],
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
  {
    id: "quiz_relationship_preference_test",
    slug: "relationship-preference-test",
    title: "亲密关系偏好测试",
    category: "关系 / 亲密关系",
    summary:
      "这是一套基于五种爱情语言模型改编的关系偏好测试，帮助你看见在亲密关系里最有感觉的被爱方式、次要通道与容易错位的表达差异。",
    tagline: "30 题正式版，支持结果回看、分享与一键导出关系海报。",
    priceLabel: "30 题正式版",
    durationMinutes: 6,
    questionCount: 30,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["关系偏好", "五维分布", "30 题", "可导出海报"],
    valuePoints: ["主语言 / 次语言判断", "五维分布与失落触发点", "伴侣行动建议 + 可导出海报"],
    flowSteps: ["输入验证码", "完成 30 题二选一", "查看完整结果"],
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
  "relationship-preference-test": [
    {
      title: "亲密关系偏好测试是什么",
      description:
        "亲密关系偏好测试以“五种爱情语言”模型为参考，围绕肯定的言辞、精心的时刻、接受礼物、服务的行动、身体的接触五种关系表达维度，观察一个人在亲密关系中最容易感到被爱、被理解与被放在心上的通道。它更适合帮助你解释“为什么明明对方有表达，但自己仍觉得不够”的关系错位，也适合给伴侣提供更具体、可执行的表达建议。",
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
  "relationship-preference-test": {
    meta: {
      slug: "relationship-preference-test",
      title: "亲密关系偏好测试",
      summary:
        "这是一套基于五种爱情语言模型改编的关系偏好测试，帮助你看见在亲密关系里最有感觉的被爱方式、次要通道与容易错位的表达差异。",
      estimatedMinutes: 6,
      tags: ["关系偏好", "30 题正式版", "五维分布", "适合保存结果海报"],
      category: "关系 / 亲密关系",
    },
    runtime: {
      rendererKey: "generic",
      resultTemplateKey: "relationship-story",
      scoringKey: "radar",
    },
    presentation: {
      themeKey: "rose-map",
      storyMode: true,
      screenCount: 4,
      shareCardKey: "relationship-preference-poster",
    },
    questions: relationshipPreferenceQuestions,
    results: relationshipPreferenceResults,
    extensions: {
      scoring: {
        dimensions: RELATIONSHIP_PREFERENCE_DIMENSIONS.map((item) => ({
          key: item.key,
          label: item.label,
        })),
      },
      share: {
        captionTone: "warm",
      },
      intro: {
        tagline: "30 题正式版，结果页支持回看、分享与一键导出关系海报。",
        priceLabel: "30 题正式版",
        accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
        valuePoints: ["主语言 / 次语言判断", "五维分布与失落触发点", "伴侣行动建议 + 可导出海报"],
        flowSteps: ["输入验证码", "完成 30 题二选一", "查看完整结果"],
        detailSections: introSections["relationship-preference-test"],
      },
      relationshipPreference: {
        dimensionOrder: RELATIONSHIP_PREFERENCE_DIMENSIONS.map((item) => item.key),
        maxScorePerDimension: 12,
        dualPrimaryDelta: 1,
        balancedSpreadDelta: 2,
        pairNarratives: RELATIONSHIP_PREFERENCE_PAIR_NARRATIVES,
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
  {
    id: "product_relationship_preference_shared",
    name: "亲密关系偏好测试",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "正式版第二套题，先使用一套题一个随机验证码的稳定交付方案。",
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
  {
    id: "batch_relationship_preference_shared",
    name: "亲密关系偏好测试首发批次",
    productId: "product_relationship_preference_shared",
    productName: "亲密关系偏好测试",
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
  "RPREF-8Q4M-2T7K": {
    code: "RPREF-8Q4M-2T7K",
    product: {
      id: "product_relationship_preference_shared",
      name: "亲密关系偏好测试",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "relationship-preference-test", title: "亲密关系偏好测试" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "亲密关系偏好测试正式版随机验证码。",
    },
  },
  "ST-LOVE-BETA": {
    code: "ST-LOVE-BETA",
    product: {
      id: "product_relationship_preference_shared",
      name: "亲密关系偏好测试",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "relationship-preference-test", title: "亲密关系偏好测试" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "亲密关系偏好测试本地联调演示验证码。",
    },
  },
}

const mockPurchaseMeta: Record<string, { salesChannel: string; purchaseUrl: string }> = {
  "oejts-personality-map": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/oejts",
  },
  "relationship-preference-test": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/relationship-preference",
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
    salesChannel: mockPurchaseMeta[slug]?.salesChannel,
    purchaseUrl: mockPurchaseMeta[slug]?.purchaseUrl,
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


