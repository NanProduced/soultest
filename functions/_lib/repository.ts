import {
  getMockAccessGrant,
  getMockCatalogItems,
  getMockQuizIntro,
  getMockRuntimeConfig,
} from "./mock-data"
import type {
  AccessGrant,
  AccessPolicy,
  AccessSession,
  AdminCodeBatch,
  AdminCodeBatchAction,
  AdminOverview,
  AdminProduct,
  AdminQuizAccessType,
  AdminQuizItem,
  AllowedQuiz,
  CloudflareEnv,
  CreateAdminCodeBatchInput,
  QuizCatalogItem,
  QuizIntro,
  QuizRuntimeConfig,
  ScoreBreakdownItem,
  SubmissionInput,
  SubmissionDetail,
} from "./types"

import { calculateScoreBreakdown, scoreSubmission } from "./scoring"

interface QuizRow {
  id: string
  slug: string
  title: string
  summary: string | null
  category: string | null
  price: number | null
  config_json: string | null
  sales_channel?: string | null
  purchase_url?: string | null
  status?: string | null
  landing_visible?: number | null
}

interface ProductRow {
  id: string
  name: string
  product_type: string
  status: string
  description: string | null
  quiz_count: number | null
}

interface CodeBatchRow {
  id: string
  name: string
  product_id: string
  product_name: string
  strategy_type: string
  status: string
  code_count: number | null
  expires_at: string | null
  code_prefix: string | null
  code_length: number | null
  policy_json: string | null
}

interface CodeBatchLinkedQuizRow {
  slug: string
  title: string
}

interface CodeGrantRow {
  code: string
  code_status: string
  code_expires_at: string | null
  batch_status: string
  batch_expires_at: string | null
  policy_json: string | null
  product_id: string
  product_name: string
  product_type: string
}

interface AdminQuizVerificationRow {
  product_id: string
  product_name: string
  product_status: string
  batch_id: string | null
  batch_name: string | null
  batch_status: string | null
  strategy_type: string | null
  policy_json: string | null
}

interface AdminQuizVerificationCodeRow {
  code: string
  status: string
  expires_at: string | null
}

interface RuntimeRow {
  quiz_id: string
  quiz_title: string
  current_published_version_id: string | null
  config_json: string | null
}

interface SubmissionRecord {
  submissionId: string
  resultKey: string
  resultTitle: string
  resultSummary: string
  scoreBreakdown: ScoreBreakdownItem[]
  storedInD1: boolean
}

function parseJson<T>(value: string | null | undefined, fallback: T) {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function isExpired(isoValue: string | null | undefined) {
  if (!isoValue) {
    return false
  }

  return new Date(isoValue).getTime() < Date.now()
}

interface RuntimeIntroConfig {
  tagline?: string
  priceLabel?: string
  accessSummary?: string
  questionCount?: number
  valuePoints?: string[]
  flowSteps?: string[]
  detailSections?: Array<{ title: string; description: string }>
}

export class SubmissionValidationError extends Error {
  details?: unknown

  constructor(message: string, details?: unknown) {
    super(message)
    this.name = "SubmissionValidationError"
    this.details = details
  }
}

function getRuntimeIntroConfig(runtime: QuizRuntimeConfig | null | undefined): RuntimeIntroConfig {
  const intro = (runtime?.extensions?.intro ?? {}) as RuntimeIntroConfig

  return {
    tagline: typeof intro.tagline === "string" ? intro.tagline : undefined,
    priceLabel: typeof intro.priceLabel === "string" ? intro.priceLabel : undefined,
    accessSummary: typeof intro.accessSummary === "string" ? intro.accessSummary : undefined,
    questionCount: typeof intro.questionCount === "number" ? Math.max(0, Math.trunc(intro.questionCount)) : undefined,
    valuePoints: Array.isArray(intro.valuePoints)
      ? intro.valuePoints.filter((item): item is string => typeof item === "string")
      : undefined,
    flowSteps: Array.isArray(intro.flowSteps)
      ? intro.flowSteps.filter((item): item is string => typeof item === "string")
      : undefined,
    detailSections: Array.isArray(intro.detailSections)
      ? intro.detailSections.filter(
          (item): item is { title: string; description: string } =>
            typeof item === "object" &&
            item !== null &&
            typeof item.title === "string" &&
            typeof item.description === "string",
        )
      : undefined,
  }
}

function getAnswerOptionId(answer: unknown) {
  if (typeof answer === "string" && answer.trim().length > 0) {
    return answer
  }

  if (
    Array.isArray(answer) &&
    answer.length === 1 &&
    typeof answer[0] === "string" &&
    answer[0].trim().length > 0
  ) {
    return answer[0]
  }

  return undefined
}

function validateSubmissionAnswers(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw new SubmissionValidationError("答题数据格式不正确")
  }

  const runtimeQuestions = runtime.questions as Array<{
    id?: unknown
    options?: Array<{ id?: unknown }>
  }>
  const questionIds = new Set(runtimeQuestions.map((question) => String(question.id ?? "")))
  const unknownQuestionIds = Object.keys(answers).filter((questionId) => !questionIds.has(questionId))

  if (unknownQuestionIds.length > 0) {
    throw new SubmissionValidationError("答题数据包含未知题目", { unknownQuestionIds })
  }

  const issues = runtimeQuestions.flatMap((question) => {
    const questionId = String(question.id ?? "")
    const selectedOptionId = getAnswerOptionId(answers[questionId])

    if (!questionId) {
      return [] as Array<Record<string, unknown>>
    }

    if (!selectedOptionId) {
      return [{ questionId, code: "missing_answer" }]
    }

    const optionIds = new Set((question.options ?? []).map((option) => String(option.id ?? "")))

    if (!optionIds.has(selectedOptionId)) {
      return [{ questionId, code: "invalid_option", selectedOptionId }]
    }

    return [] as Array<Record<string, unknown>>
  })

  if (issues.length > 0) {
    throw new SubmissionValidationError("请完整并正确地完成所有题目后再提交", { issues })
  }
}

function normalizeCatalogItem(row: QuizRow): QuizCatalogItem {
  const runtime = parseJson<QuizRuntimeConfig | null>(row.config_json, null)
  const intro = getRuntimeIntroConfig(runtime)
  const accessType: QuizCatalogItem["accessType"] = (row.price ?? 0) <= 0 ? "free" : "paid"
  const runtimeQuestionCount = Array.isArray(runtime?.questions) ? runtime.questions.length : 0
  const questionCount = intro.questionCount ?? runtimeQuestionCount

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? runtime?.meta.category ?? "未分类",
    summary: row.summary ?? runtime?.meta.summary ?? "",
    tagline: intro.tagline ?? runtime?.meta.summary ?? row.summary ?? "",
    priceLabel: intro.priceLabel ?? (accessType === "free" ? "免费体验" : "单测体验"),
    durationMinutes: runtime?.meta.estimatedMinutes ?? questionCount,
    questionCount,
    accessSummary: intro.accessSummary ?? "输入测试口令后开始",
    tags: runtime?.meta.tags ?? [],
    valuePoints: intro.valuePoints ?? ["完整结果报告", "支持保存与分享", "口令有效期内可重复进入"],
    flowSteps: intro.flowSteps ?? ["输入测试口令", "完成测试", "查看结果"],
    accessType,
  }
}

function hasCompleteRuntimeConfig(runtime?: QuizRuntimeConfig) {
  return Boolean(runtime && runtime.questions.length > 0 && runtime.results.length > 0)
}

const bigFiveDimensionMeta = [
  { key: "E", label: "外向性" },
  { key: "A", label: "宜人性" },
  { key: "C", label: "尽责性" },
  { key: "N", label: "神经质" },
  { key: "O", label: "开放性" },
] as const

const bigFiveScaleLabels = ["非常不像我", "不太像我", "一般", "比较像我", "非常像我"] as const

function normalizeRuntimeConfig(runtime?: QuizRuntimeConfig) {
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
        options: bigFiveScaleLabels.map((label, optionIndex) => ({
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
      options: bigFiveScaleLabels.map((label, optionIndex) => ({
        id: `${id}_option_${optionIndex + 1}`,
        label,
        value: {
          [trait]: reverse ? bigFiveScaleLabels.length - optionIndex : optionIndex + 1,
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
        dimensions: bigFiveDimensionMeta.map((item) => ({ ...item })),
      },
      share: {
        ...runtime.extensions?.share,
        captionTone: runtime.extensions?.share?.captionTone ?? "insightful",
      },
    },
  } satisfies QuizRuntimeConfig
}

async function listPublicQuizzesFromD1(env: CloudflareEnv) {
  const result = await env.SOULTEST_DB.prepare(
    `
      SELECT
        q.id,
        q.slug,
        q.title,
        q.summary,
        q.category,
        q.price,
        v.config_json
      FROM quizzes q
      LEFT JOIN quiz_versions v ON v.id = q.current_published_version_id
      WHERE q.status = 'published' AND q.landing_visible = 1
      ORDER BY q.created_at DESC
    `,
  ).all<QuizRow>()

  return result.results.map(normalizeCatalogItem)
}

async function getQuizIntroFromD1(slug: string, env: CloudflareEnv) {
  const row = await env.SOULTEST_DB.prepare(
    `
      SELECT
        q.id,
        q.slug,
        q.title,
        q.summary,
        q.category,
        q.price,
        v.config_json,
        p.sales_channel,
        p.purchase_url
      FROM quizzes q
      LEFT JOIN quiz_versions v ON v.id = q.current_published_version_id
      LEFT JOIN product_quizzes pq ON pq.quiz_id = q.id
      LEFT JOIN products p ON p.id = pq.product_id AND p.status = 'active' AND p.landing_visible = 1
      WHERE q.slug = ?1
      ORDER BY pq.sort_order ASC
      LIMIT 1
    `,
  )
    .bind(slug)
    .first<QuizRow>()

  if (!row) {
    return undefined
  }

  const runtime = parseJson<QuizRuntimeConfig | null>(row.config_json, null)
  const intro = getRuntimeIntroConfig(runtime)
  const normalized = normalizeCatalogItem(row)

  return {
    ...normalized,
    salesChannel: row.sales_channel ?? undefined,
    purchaseUrl: row.purchase_url ?? undefined,
    detailSections: intro.detailSections ?? [],
  } satisfies QuizIntro
}

async function getRuntimeConfigFromD1(slug: string, env: CloudflareEnv) {
  const row = await env.SOULTEST_DB.prepare(
    `
      SELECT
        q.id AS quiz_id,
        q.title AS quiz_title,
        q.current_published_version_id,
        v.config_json
      FROM quizzes q
      LEFT JOIN quiz_versions v ON v.id = q.current_published_version_id
      WHERE q.slug = ?1 AND q.status = 'published'
      LIMIT 1
    `,
  )
    .bind(slug)
    .first<RuntimeRow>()

  if (!row?.config_json) {
    return undefined
  }

  return parseJson<QuizRuntimeConfig | undefined>(row.config_json, undefined)
}

async function listAdminProductsFromD1(env: CloudflareEnv) {
  const result = await env.SOULTEST_DB.prepare(
    `
      SELECT
        p.id,
        p.name,
        p.product_type,
        p.status,
        p.description,
        COUNT(pq.id) AS quiz_count
      FROM products p
      LEFT JOIN product_quizzes pq ON pq.product_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
  ).all<ProductRow>()

  return await Promise.all(
    result.results.map(async (row) => {
      const linkedQuizResult = await env.SOULTEST_DB.prepare(
        `
          SELECT q.slug, q.title
          FROM product_quizzes pq
          JOIN quizzes q ON q.id = pq.quiz_id
          WHERE pq.product_id = ?1
          ORDER BY pq.sort_order ASC, q.created_at DESC
        `,
      )
        .bind(row.id)
        .all<CodeBatchLinkedQuizRow>()

      return {
        id: row.id,
        name: row.name,
        productType: row.product_type,
        status: row.status,
        quizCount: row.quiz_count ?? 0,
        description: row.description ?? "",
        linkedQuizzes: linkedQuizResult.results.map((quiz) => ({
          slug: quiz.slug,
          title: quiz.title,
        })),
      } satisfies AdminProduct
    }),
  )
}

function normalizeEditableAccessPolicy(policy?: AccessPolicy): AccessPolicy {
  return {
    scopeMode: policy?.scopeMode ?? "product",
    allowQuizSlugs: policy?.scopeMode === "custom_scope" ? policy.allowQuizSlugs ?? [] : undefined,
    verificationMode: policy?.verificationMode ?? "shared_code",
    tokenTtlDays: policy?.tokenTtlDays,
    introVisible: policy?.introVisible ?? true,
    notes: policy?.notes ?? "",
  }
}

function normalizeCodePrefix(prefix?: string) {
  if (!prefix) {
    return null
  }

  const normalized = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
  return normalized ? normalized.slice(0, 10) : null
}

function normalizeExpiryDate(expiresAt?: string | null) {
  if (!expiresAt) {
    return null
  }

  const parsed = new Date(expiresAt)

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("批次有效期格式不正确")
  }

  if (parsed.getTime() <= Date.now()) {
    throw new Error("批次有效期必须晚于当前时间")
  }

  return parsed.toISOString()
}

function buildBatchStrategyType(productType: string, policy: AccessPolicy) {
  if (policy.scopeMode === "custom_scope") {
    return "custom_scope"
  }

  if (productType === "bundle" || productType === "promo") {
    return productType
  }

  return "single_product"
}

function createRandomToken(length: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let value = ""

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * alphabet.length)
    value += alphabet[randomIndex]
  }

  return value
}

function createVerificationCode(prefix: string | null, length: number, seen: Set<string>) {
  for (let attempts = 0; attempts < 20; attempts += 1) {
    const token = createRandomToken(length)
    const candidate = prefix ? `${prefix}-${token}` : token

    if (!seen.has(candidate)) {
      seen.add(candidate)
      return candidate
    }
  }

  throw new Error("验证码生成失败，请稍后重试")
}

async function getAdminProductForBatch(productId: string, env: CloudflareEnv) {
  const products = await listAdminProductsFromD1(env)
  return products.find((item) => item.id === productId)
}

async function listAdminCodeBatchesFromD1(env: CloudflareEnv) {
  const result = await env.SOULTEST_DB.prepare(
    `
      SELECT
        cb.id,
        cb.name,
        cb.product_id,
        p.name AS product_name,
        cb.strategy_type,
        cb.status,
        cb.expires_at,
        cb.code_prefix,
        cb.code_length,
        cb.policy_json,
        COUNT(c.code) AS code_count
      FROM code_batches cb
      JOIN products p ON p.id = cb.product_id
      LEFT JOIN codes c ON c.batch_id = cb.id
      GROUP BY cb.id
      ORDER BY cb.created_at DESC
    `,
  ).all<CodeBatchRow>()

  return await Promise.all(
    result.results.map(async (row) => {
      const [linkedQuizResult, sampleCodeResult] = await Promise.all([
        env.SOULTEST_DB.prepare(
          `
            SELECT q.slug, q.title
            FROM product_quizzes pq
            JOIN quizzes q ON q.id = pq.quiz_id
            WHERE pq.product_id = ?1
            ORDER BY pq.sort_order ASC, q.created_at DESC
          `,
        )
          .bind(row.product_id)
          .all<CodeBatchLinkedQuizRow>(),
        env.SOULTEST_DB.prepare(
          `
            SELECT code, status, expires_at
            FROM codes
            WHERE batch_id = ?1
            ORDER BY created_at DESC
            LIMIT 3
          `,
        )
          .bind(row.id)
          .all<AdminQuizVerificationCodeRow>(),
      ])

      return {
        id: row.id,
        name: row.name,
        productId: row.product_id,
        productName: row.product_name,
        strategyType: row.strategy_type,
        status: row.status,
        codeCount: row.code_count ?? 0,
        expiresAt: row.expires_at,
        codePrefix: row.code_prefix,
        codeLength: row.code_length ?? 8,
        policy: normalizeEditableAccessPolicy(parseJson<AccessPolicy | undefined>(row.policy_json, undefined)),
        linkedQuizzes: linkedQuizResult.results.map((quiz) => ({
          slug: quiz.slug,
          title: quiz.title,
        })),
        sampleCodes: sampleCodeResult.results.map((code) => ({
          code: code.code,
          status: code.status,
          expiresAt: code.expires_at,
        })),
      } satisfies AdminCodeBatch
    }),
  )
}

function normalizeAdminQuizItem(row: QuizRow, source: AdminQuizItem["source"] = "d1"): AdminQuizItem {
  const base = normalizeCatalogItem(row)
  const accessType = (row.price ?? 0) <= 0 ? "free" : "paid"
  const status = row.status ?? "published"
  const landingVisible = row.landing_visible === 1

  return {
    ...base,
    status,
    accessType,
    source,
    introPath: `/${row.slug}`,
    testPath: `/${row.slug}/test`,
    landingVisible,
    liveOnLanding: status === "published" && landingVisible,
  }
}

async function getAdminQuizVerificationSummary(quizId: string, env: CloudflareEnv) {
  const bindingRow = await env.SOULTEST_DB.prepare(
    `
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.status AS product_status,
        cb.id AS batch_id,
        cb.name AS batch_name,
        cb.status AS batch_status,
        cb.strategy_type,
        cb.policy_json
      FROM product_quizzes pq
      JOIN products p ON p.id = pq.product_id
      LEFT JOIN code_batches cb ON cb.id = (
        SELECT cb2.id
        FROM code_batches cb2
        WHERE cb2.product_id = p.id
        ORDER BY
          CASE cb2.status
            WHEN 'active' THEN 0
            WHEN 'draft' THEN 1
            WHEN 'paused' THEN 2
            WHEN 'expired' THEN 3
            ELSE 4
          END,
          cb2.created_at DESC
        LIMIT 1
      )
      WHERE pq.quiz_id = ?1
      ORDER BY
        CASE p.status
          WHEN 'active' THEN 0
          WHEN 'draft' THEN 1
          WHEN 'paused' THEN 2
          ELSE 3
        END,
        pq.sort_order ASC
      LIMIT 1
    `,
  )
    .bind(quizId)
    .first<AdminQuizVerificationRow>()

  if (!bindingRow) {
    return {
      verificationMode: "unknown" as const,
      tokenTtlDays: null,
      notes: "当前题集尚未绑定销售产品或验证码批次。",
      activeCodeCount: 0,
      sampleCodes: [],
    }
  }

  const policy = parseJson<AccessPolicy | undefined>(bindingRow.policy_json, undefined)
  const verificationMode = (policy?.verificationMode ?? "unknown") as "shared_code" | "unique_code" | "unknown"

  if (!bindingRow.batch_id) {
    return {
      verificationMode,
      scopeMode: policy?.scopeMode,
      batchId: bindingRow.batch_id ?? undefined,
      batchStrategyType: bindingRow.strategy_type ?? undefined,
      tokenTtlDays: policy?.tokenTtlDays ?? null,
      notes: policy?.notes ?? "当前产品已绑定题集，但尚未配置可用验证码批次。",
      productName: bindingRow.product_name,
      batchName: bindingRow.batch_name ?? undefined,
      batchStatus: bindingRow.batch_status ?? undefined,
      activeCodeCount: 0,
      sampleCodes: [],
    }
  }

  const [activeCountRow, sampleCodeResult] = await Promise.all([
    env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM codes WHERE batch_id = ?1 AND status = 'active'")
      .bind(bindingRow.batch_id)
      .first<{ value: number }>(),
    env.SOULTEST_DB.prepare(
      `
        SELECT code, status, expires_at
        FROM codes
        WHERE batch_id = ?1 AND status = 'active'
        ORDER BY created_at DESC
        LIMIT 3
      `,
    )
      .bind(bindingRow.batch_id)
      .all<AdminQuizVerificationCodeRow>(),
  ])

  return {
    verificationMode,
    scopeMode: policy?.scopeMode,
    batchId: bindingRow.batch_id ?? undefined,
    batchStrategyType: bindingRow.strategy_type ?? undefined,
    tokenTtlDays: policy?.tokenTtlDays ?? null,
    notes: policy?.notes ?? undefined,
    productName: bindingRow.product_name,
    batchName: bindingRow.batch_name ?? undefined,
    batchStatus: bindingRow.batch_status ?? undefined,
    activeCodeCount: activeCountRow?.value ?? 0,
    sampleCodes: sampleCodeResult.results.map((row) => ({
      code: row.code,
      status: row.status,
      expiresAt: row.expires_at,
    })),
  }
}

async function listAdminQuizzesFromD1(env: CloudflareEnv) {
  const result = await env.SOULTEST_DB.prepare(
    `
      SELECT
        q.id,
        q.slug,
        q.title,
        q.summary,
        q.category,
        q.price,
        q.status,
        q.landing_visible,
        COALESCE(published.config_json, draft.config_json) AS config_json
      FROM quizzes q
      LEFT JOIN quiz_versions published ON published.id = q.current_published_version_id
      LEFT JOIN quiz_versions draft ON draft.id = q.current_draft_version_id
      ORDER BY q.created_at DESC
    `,
  ).all<QuizRow>()

  const items = await Promise.all(
    result.results.map(async (row) => {
      const item = normalizeAdminQuizItem(row)

      if (item.accessType === "paid") {
        item.verification = await getAdminQuizVerificationSummary(row.id, env)
      }

      return item
    }),
  )

  return items
}

async function lookupCodeInD1(code: string, env: CloudflareEnv): Promise<AccessGrant | undefined> {
  const grantRow = await env.SOULTEST_DB.prepare(
    `
      SELECT
        c.code,
        c.status AS code_status,
        c.expires_at AS code_expires_at,
        cb.status AS batch_status,
        cb.expires_at AS batch_expires_at,
        cb.policy_json,
        p.id AS product_id,
        p.name AS product_name,
        p.product_type
      FROM codes c
      JOIN code_batches cb ON cb.id = c.batch_id
      JOIN products p ON p.id = cb.product_id
      WHERE c.code = ?1
      LIMIT 1
    `,
  )
    .bind(code)
    .first<CodeGrantRow>()

  if (!grantRow) {
    return undefined
  }

  if (grantRow.code_status !== "active" || grantRow.batch_status !== "active") {
    return undefined
  }

  if (isExpired(grantRow.code_expires_at) || isExpired(grantRow.batch_expires_at)) {
    return undefined
  }

  const policy = parseJson<AccessPolicy>(grantRow.policy_json, {
    scopeMode: "product",
    tokenTtlDays: 30,
    introVisible: true,
  })

  const allowedRows = await env.SOULTEST_DB.prepare(
    `
      SELECT q.slug, q.title
      FROM product_quizzes pq
      JOIN quizzes q ON q.id = pq.quiz_id
      WHERE pq.product_id = ?1
      ORDER BY pq.sort_order ASC, q.created_at ASC
    `,
  )
    .bind(grantRow.product_id)
    .all<AllowedQuiz>()

  const allowedQuizzes =
    policy.scopeMode === "custom_scope" && Array.isArray(policy.allowQuizSlugs)
      ? allowedRows.results.filter((quiz) => policy.allowQuizSlugs?.includes(quiz.slug))
      : allowedRows.results

  return {
    code: grantRow.code,
    product: {
      id: grantRow.product_id,
      name: grantRow.product_name,
      productType: grantRow.product_type,
    },
    allowedQuizzes,
    policy,
  }
}

export async function listPublicQuizzes(env: CloudflareEnv, accessType?: AdminQuizAccessType) {
  if (isMockMode(env)) {
    return getMockCatalogItems().filter((item) => !accessType || item.accessType === accessType)
  }

  try {
    return (await listPublicQuizzesFromD1(env)).filter((item) => !accessType || item.accessType === accessType)
  } catch {
    return []
  }
}

export async function getQuizIntro(slug: string, env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockQuizIntro(slug)
  }

  try {
    return await getQuizIntroFromD1(slug, env)
  } catch {
    return undefined
  }
}

export async function getRuntimeConfig(slug: string, env: CloudflareEnv) {
  if (isMockMode(env)) {
    return normalizeRuntimeConfig(getMockRuntimeConfig(slug))
  }

  try {
    const runtime = normalizeRuntimeConfig(await getRuntimeConfigFromD1(slug, env))
    return hasCompleteRuntimeConfig(runtime) ? runtime : undefined
  } catch {
    return undefined
  }
}

export async function getPrimaryQuizIntro(slug: string, env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockQuizIntro(slug)
  }

  try {
    return await getQuizIntroFromD1(slug, env)
  } catch {
    return undefined
  }
}

export async function getPrimaryRuntimeConfig(slug: string, env: CloudflareEnv) {
  if (isMockMode(env)) {
    return normalizeRuntimeConfig(getMockRuntimeConfig(slug))
  }

  try {
    return normalizeRuntimeConfig(await getRuntimeConfigFromD1(slug, env))
  } catch {
    return undefined
  }
}

export async function lookupAccessGrant(code: string, env: CloudflareEnv) {
  const normalizedCode = code.trim().toUpperCase()

  if (isMockMode(env)) {
    return getMockAccessGrant(normalizedCode)
  }

  try {
    const grant = await lookupCodeInD1(normalizedCode, env)

    if (grant) {
      return grant
    }
  } catch {
    if (!shouldUseLocalStaticAccessGrantFallback(env)) {
      return undefined
    }
  }

  if (shouldUseLocalStaticAccessGrantFallback(env)) {
    return getMockAccessGrant(normalizedCode)
  }

  return undefined
}

async function consumeUniqueCodeGrant(grant: AccessGrant, env: CloudflareEnv) {
  if (grant.policy.verificationMode !== "unique_code") {
    return
  }

  const result = await env.SOULTEST_DB.prepare(
    `
      UPDATE codes
      SET status = 'revoked'
      WHERE code = ?1
        AND status = 'active'
    `,
  )
    .bind(grant.code)
    .run()

  const changes = Number((result as { meta?: { changes?: number } }).meta?.changes ?? 0)

  if (changes < 1) {
    throw new Error("unique_code_unavailable")
  }
}

export async function getAdminOverview(env: CloudflareEnv) {
  const [quizItems, products, codeBatches] = await Promise.all([
    listAdminQuizzes(env),
    listAdminProducts(env),
    listAdminCodeBatches(env),
  ])

  const fallbackActiveCodes = quizItems.reduce((count, item) => count + (item.verification?.activeCodeCount ?? 0), 0)

  const buildRecentDailySubmissions = (dailyRows: Array<{ date: string; value: number }>) => {
    const rowMap = new Map(dailyRows.map((row) => [row.date, row.value]))
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setUTCHours(0, 0, 0, 0)
      date.setUTCDate(date.getUTCDate() - (6 - index))
      const dateKey = formatter.format(date)

      return {
        date: dateKey,
        submissions: rowMap.get(dateKey) ?? 0,
      }
    })
  }

  const emptyAnalytics = {
    submissions24h: 0,
    submissions7d: 0,
    submissions30d: 0,
    avgDurationSec: null,
    shareCount: 0,
    shareRate: 0,
    recentDailySubmissions: buildRecentDailySubmissions([]),
    topQuizzes: [] as AdminOverview["analytics"]["topQuizzes"],
  }

  if (isMockMode(env)) {
    return {
      quizzes: quizItems.length,
      products: products.length,
      codeBatches: codeBatches.length,
      activeCodes: fallbackActiveCodes,
      submissions: 0,
      lastSeedAt: new Date().toISOString(),
      analytics: emptyAnalytics,
    } satisfies AdminOverview
  }

  try {
    const [
      activeCodes,
      submissions,
      submissions24h,
      submissions7d,
      submissions30d,
      durationStats,
      shareStats,
      topQuizRows,
      dailyRows,
    ] = await Promise.all([
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM codes WHERE status = 'active'").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM submissions").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM submissions WHERE datetime(created_at) >= datetime('now', '-1 day')").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM submissions WHERE datetime(created_at) >= datetime('now', '-7 day')").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM submissions WHERE datetime(created_at) >= datetime('now', '-30 day')").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT ROUND(AVG(duration_sec)) AS avgDurationSec FROM submissions WHERE duration_sec IS NOT NULL").first<{ avgDurationSec: number | null }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS shareCount FROM submissions WHERE shared = 1").first<{ shareCount: number }>(),
      env.SOULTEST_DB.prepare(
        `
          SELECT
            q.id AS quizId,
            q.slug AS slug,
            q.title AS title,
            COUNT(*) AS submissions
          FROM submissions s
          JOIN quizzes q ON q.id = s.quiz_id
          GROUP BY q.id, q.slug, q.title
          ORDER BY submissions DESC, MAX(s.created_at) DESC
          LIMIT 5
        `,
      ).all<{ quizId: string; slug: string; title: string; submissions: number }>(),
      env.SOULTEST_DB.prepare(
        `
          SELECT
            substr(created_at, 1, 10) AS date,
            COUNT(*) AS value
          FROM submissions
          WHERE datetime(created_at) >= datetime('now', '-6 day')
          GROUP BY substr(created_at, 1, 10)
          ORDER BY date ASC
        `,
      ).all<{ date: string; value: number }>(),
    ])

    const totalSubmissions = submissions?.value ?? 0
    const shareCount = shareStats?.shareCount ?? 0
    const topQuizzes = (topQuizRows.results ?? []).map((row) => ({
      quizId: row.quizId,
      slug: row.slug,
      title: row.title,
      submissions: row.submissions,
    }))

    return {
      quizzes: quizItems.length,
      products: products.length,
      codeBatches: codeBatches.length,
      activeCodes: activeCodes?.value ?? fallbackActiveCodes,
      submissions: totalSubmissions,
      lastSeedAt: new Date().toISOString(),
      analytics: {
        submissions24h: submissions24h?.value ?? 0,
        submissions7d: submissions7d?.value ?? 0,
        submissions30d: submissions30d?.value ?? 0,
        avgDurationSec: durationStats?.avgDurationSec ?? null,
        shareCount,
        shareRate: totalSubmissions > 0 ? Number(((shareCount / totalSubmissions) * 100).toFixed(1)) : 0,
        recentDailySubmissions: buildRecentDailySubmissions(dailyRows.results ?? []),
        topQuizzes,
      },
    } satisfies AdminOverview
  } catch {
    return {
      quizzes: quizItems.length,
      products: products.length,
      codeBatches: codeBatches.length,
      activeCodes: fallbackActiveCodes,
      submissions: 0,
      lastSeedAt: new Date().toISOString(),
      analytics: emptyAnalytics,
    } satisfies AdminOverview
  }
}

export async function listAdminQuizzes(env: CloudflareEnv) {
  try {
    return await listAdminQuizzesFromD1(env)
  } catch {
    return []
  }
}

export async function listAdminProducts(env: CloudflareEnv) {
  try {
    return await listAdminProductsFromD1(env)
  } catch {
    return []
  }
}

export async function createAdminCodeBatch(input: CreateAdminCodeBatchInput, env: CloudflareEnv) {
  const productId = input.productId.trim()
  const batchName = input.name.trim()
  const codeCount = Math.trunc(input.codeCount)
  const codeLength = Math.trunc(input.codeLength ?? 8)
  const codePrefix = normalizeCodePrefix(input.codePrefix)
  const expiresAt = normalizeExpiryDate(input.expiresAt)

  if (!productId) {
    throw new Error("请选择要发码的商品")
  }

  if (!batchName) {
    throw new Error("请填写批次名称")
  }

  if (codeCount < 1 || codeCount > 500) {
    throw new Error("批次码量需在 1 到 500 之间")
  }

  if (codeLength < 6 || codeLength > 24) {
    throw new Error("验证码长度需在 6 到 24 之间")
  }

  const product = await getAdminProductForBatch(productId, env)

  if (!product) {
    throw new Error("未找到对应商品")
  }

  if (product.linkedQuizzes.length === 0) {
    throw new Error("该商品还没有绑定题集，暂时不能发码")
  }

  const policy = normalizeEditableAccessPolicy(input.policy)
  const availableQuizSlugs = new Set(product.linkedQuizzes.map((quiz) => quiz.slug))

  if (policy.scopeMode === "custom_scope") {
    const nextAllowQuizSlugs = (policy.allowQuizSlugs ?? []).filter((slug) => availableQuizSlugs.has(slug))

    if (nextAllowQuizSlugs.length === 0) {
      throw new Error("指定范围模式下至少要选择一个题集")
    }

    policy.allowQuizSlugs = nextAllowQuizSlugs
  } else {
    policy.allowQuizSlugs = undefined
  }

  const batchId = `batch_${crypto.randomUUID().replaceAll("-", "").slice(0, 16)}`
  const strategyType = buildBatchStrategyType(product.productType, policy)
  const codeSet = new Set<string>()

  await env.SOULTEST_DB.prepare(
    `
      INSERT INTO code_batches (
        id,
        product_id,
        name,
        strategy_type,
        code_prefix,
        code_length,
        status,
        expires_at,
        policy_json
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'active', ?7, ?8)
    `,
  )
    .bind(batchId, product.id, batchName, strategyType, codePrefix, codeLength, expiresAt, JSON.stringify(policy))
    .run()

  try {
    for (let index = 0; index < codeCount; index += 1) {
      const code = createVerificationCode(codePrefix, codeLength, codeSet)

      await env.SOULTEST_DB.prepare(
        `
          INSERT INTO codes (code, batch_id, status, expires_at, metadata_json)
          VALUES (?1, ?2, 'active', ?3, ?4)
        `,
      )
        .bind(code, batchId, expiresAt, JSON.stringify({ createdBy: "admin_batch_create" }))
        .run()
    }

    const verification = await env.SOULTEST_DB.prepare(
      `
        SELECT COUNT(*) AS count
        FROM codes
        WHERE batch_id = ?1
      `,
    )
      .bind(batchId)
      .first<{ count: number }>()

    if ((verification?.count ?? 0) !== codeCount) {
      throw new Error("验证码生成不完整，已终止本次创建")
    }
  } catch (error) {
    await env.SOULTEST_DB.prepare(`DELETE FROM codes WHERE batch_id = ?1`).bind(batchId).run()
    await env.SOULTEST_DB.prepare(`DELETE FROM code_batches WHERE id = ?1`).bind(batchId).run()
    throw error
  }

  const items = await listAdminCodeBatchesFromD1(env)
  const createdBatch = items.find((item) => item.id === batchId)

  if (!createdBatch) {
    throw new Error("批次已创建，但刷新最新数据失败")
  }

  return createdBatch
}

export async function updateAdminCodeBatchPolicy(batchId: string, policy: AccessPolicy, env: CloudflareEnv) {
  await env.SOULTEST_DB.prepare(
    `
      UPDATE code_batches
      SET policy_json = ?2
      WHERE id = ?1
    `,
  )
    .bind(batchId, JSON.stringify(normalizeEditableAccessPolicy(policy)))
    .run()
}

export async function updateAdminCodeBatchStatus(batchId: string, action: AdminCodeBatchAction, env: CloudflareEnv) {
  const currentBatch = await env.SOULTEST_DB.prepare(
    `
      SELECT id, status
      FROM code_batches
      WHERE id = ?1
      LIMIT 1
    `,
  )
    .bind(batchId)
    .first<{ id: string; status: string }>()

  if (!currentBatch) {
    throw new Error("未找到对应批次")
  }

  if (action === "activate" && ["revoked", "expired"].includes(currentBatch.status)) {
    throw new Error("已作废或已过期的批次不能重新启用")
  }

  const nextStatus = action === "pause" ? "paused" : action === "activate" ? "active" : "revoked"

  await env.SOULTEST_DB.prepare(
    `
      UPDATE code_batches
      SET status = ?2
      WHERE id = ?1
    `,
  )
    .bind(batchId, nextStatus)
    .run()

  if (action === "revoke") {
    await env.SOULTEST_DB.prepare(
      `
        UPDATE codes
        SET status = 'revoked'
        WHERE batch_id = ?1
          AND status != 'revoked'
      `,
    )
      .bind(batchId)
      .run()
  }

  const items = await listAdminCodeBatchesFromD1(env)
  const updatedBatch = items.find((item) => item.id === batchId)

  if (!updatedBatch || updatedBatch.status !== nextStatus) {
    throw new Error("批次状态更新后校验失败，请刷新后重试")
  }

  return updatedBatch
}

export async function listAdminCodeBatches(env: CloudflareEnv) {
  try {
    return await listAdminCodeBatchesFromD1(env)
  } catch {
    return []
  }
}

export async function issueAccessSession(grant: AccessGrant, env: CloudflareEnv) {
  const ttlDays = grant.policy.tokenTtlDays ?? Number(env.ACCESS_TOKEN_TTL_DAYS || "30")
  const ttlSeconds = ttlDays * 24 * 60 * 60
  const issuedAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString()
  const token = `st_${crypto.randomUUID().replaceAll("-", "")}`

  await consumeUniqueCodeGrant(grant, env)

  const session: AccessSession = {
    token,
    code: grant.code,
    product: grant.product,
    allowedQuizzes: grant.allowedQuizzes,
    issuedAt,
    expiresAt,
  }

  await env.SOULTEST_CACHE.put(`access:${token}`, JSON.stringify(session), {
    expirationTtl: ttlSeconds,
  })

  return session
}

export async function getAccessSession(accessToken: string, env: CloudflareEnv) {
  const raw = await env.SOULTEST_CACHE.get(`access:${accessToken}`)

  if (!raw) {
    return undefined
  }

  return parseJson<AccessSession | undefined>(raw, undefined)
}

function getDimensionLabels(runtime: QuizRuntimeConfig) {
  const scoring = (runtime.extensions?.scoring ?? {}) as {
    dimensions?: Array<{ key?: string; label?: string }>
  }

  return new Map(
    (scoring.dimensions ?? [])
      .filter((dimension): dimension is { key: string; label: string } =>
        Boolean(dimension?.key && dimension?.label),
      )
      .map((dimension) => [dimension.key, dimension.label]),
  )
}

function calculateDimensionScores(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  void getDimensionLabels(runtime)
  return calculateScoreBreakdown(runtime, answers)
}

function selectResult(runtime: QuizRuntimeConfig, answers: Record<string, unknown>) {
  const scoreBreakdown = calculateDimensionScores(runtime, answers)
  const { result } = scoreSubmission(runtime, answers)

  return {
    result,
    scoreBreakdown,
  }
}

function isMockMode(env: CloudflareEnv) {
  return env.API_STUB_MODE === "mock"
}

function shouldUseLocalStaticAccessGrantFallback(env: CloudflareEnv) {
  return ["local", "development", "dev"].includes(env.APP_ENV)
    && env.ALLOW_STATIC_ACCESS_GRANT_FALLBACK === "true"
}

function getSubmissionCacheKey(submissionId: string) {
  return `submission:${submissionId}`
}

async function writeCachedSubmissionDetail(
  submissionId: string,
  detail: SubmissionDetail,
  env: CloudflareEnv,
) {
  await env.SOULTEST_CACHE.put(getSubmissionCacheKey(submissionId), JSON.stringify(detail), {
    expirationTtl: 60 * 60 * 24 * 30,
  })
}

async function readCachedSubmissionDetail(submissionId: string, env: CloudflareEnv) {
  const raw = await env.SOULTEST_CACHE.get(getSubmissionCacheKey(submissionId))

  return parseJson<SubmissionDetail | undefined>(raw, undefined)
}

export async function recordSubmission(
  input: SubmissionInput,
  accessSession: AccessSession,
  env: CloudflareEnv,
): Promise<SubmissionRecord> {
  const runtime = await getRuntimeConfig(input.slug, env)

  if (!runtime) {
    throw new Error("runtime_not_found")
  }

  validateSubmissionAnswers(runtime, input.answers)

  const { result, scoreBreakdown } = selectResult(runtime, input.answers)
  const submissionId = crypto.randomUUID()
  const submittedAt = new Date().toISOString()
  const detail: SubmissionDetail = {
    submission: {
      submissionId,
      slug: input.slug,
      quizTitle: runtime.meta.title,
      resultKey: result.key,
      resultTitle: result.title,
      resultSummary: result.summary,
      scoreBreakdown,
      submittedAt,
      highlights: result.highlights ?? [],
    },
    runtime,
    result,
  }

  if (isMockMode(env)) {
    await writeCachedSubmissionDetail(submissionId, detail, env)

    return {
      submissionId,
      resultKey: result.key,
      resultTitle: result.title,
      resultSummary: result.summary,
      scoreBreakdown,
      storedInD1: false,
    }
  }

  let storedInD1 = false

  try {
    const quizRow = await env.SOULTEST_DB.prepare(
      `
        SELECT id, current_published_version_id
        FROM quizzes
        WHERE slug = ?1
        LIMIT 1
      `,
    )
      .bind(input.slug)
      .first<{ id: string; current_published_version_id: string | null }>()

    if (quizRow?.current_published_version_id) {
      await env.SOULTEST_DB.prepare(
        `
          INSERT INTO submissions (
            id,
            quiz_id,
            quiz_version_id,
            product_id,
            code,
            result_key,
            score_json,
            duration_sec,
            client_info_json
          ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        `,
      )
        .bind(
          submissionId,
          quizRow.id,
          quizRow.current_published_version_id,
          accessSession.product.id,
          accessSession.code,
          result.key,
          JSON.stringify({
            answers: input.answers,
            scoringMode: scoreBreakdown.length > 0 ? "dimension" : "fallback",
            scoreBreakdown,
          }),
          input.durationSec ?? null,
          JSON.stringify(input.clientInfo ?? {}),
        )
        .run()

      storedInD1 = true
    }
  } catch {
    storedInD1 = false
  }

  await writeCachedSubmissionDetail(submissionId, detail, env)

  return {
    submissionId,
    resultKey: result.key,
    resultTitle: result.title,
    resultSummary: result.summary,
    scoreBreakdown,
    storedInD1,
  }
}

export async function getSubmissionDetail(submissionId: string, env: CloudflareEnv) {
  const cachedDetail = await readCachedSubmissionDetail(submissionId, env)

  if (cachedDetail) {
    return cachedDetail
  }

  if (isMockMode(env)) {
    return undefined
  }

  const row = await env.SOULTEST_DB.prepare(
    `
      SELECT
        s.id,
        s.result_key,
        s.score_json,
        s.created_at,
        q.slug,
        q.title,
        v.config_json
      FROM submissions s
      INNER JOIN quizzes q ON q.id = s.quiz_id
      INNER JOIN quiz_versions v ON v.id = s.quiz_version_id
      WHERE s.id = ?1
      LIMIT 1
    `,
  )
    .bind(submissionId)
    .first<{
      id: string
      result_key: string | null
      score_json: string | null
      created_at: string
      slug: string
      title: string
      config_json: string | null
    }>()

  if (!row?.config_json) {
    return undefined
  }

  const parsedRuntime = parseJson<QuizRuntimeConfig | undefined>(row.config_json, undefined)

  if (!parsedRuntime) {
    return undefined
  }

  const runtime = hasCompleteRuntimeConfig(parsedRuntime)
    ? normalizeRuntimeConfig(parsedRuntime)
    : normalizeRuntimeConfig(await getRuntimeConfig(row.slug, env)) ?? normalizeRuntimeConfig(parsedRuntime)

  if (!runtime) {
    return undefined
  }

  const scorePayload = parseJson<{ scoreBreakdown?: ScoreBreakdownItem[] } | undefined>(
    row.score_json,
    undefined,
  )
  const result = runtime.results.find((item) => item.key === row.result_key) ?? runtime.results[0]

  if (!result) {
    return undefined
  }

  return {
    submission: {
      submissionId: row.id,
      slug: row.slug,
      quizTitle: row.title,
      resultKey: result.key,
      resultTitle: result.title,
      resultSummary: result.summary,
      scoreBreakdown: scorePayload?.scoreBreakdown ?? [],
      submittedAt: row.created_at,
      highlights: result.highlights ?? [],
    },
    runtime,
    result,
  }
}
























