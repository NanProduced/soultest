import type {
  AccessGrant,
  AccessPolicy,
  AdminCodeBatch,
  AdminCodeBatchAction,
  AdminProduct,
  AllowedQuiz,
  CloudflareEnv,
  CreateAdminCodeBatchInput,
  QuizIntro,
  QuizRuntimeConfig,
  ScoreBreakdownItem,
  SubmissionDetail,
  SubmissionInput,
  AccessSession,
} from "./types"

import { parseJson, isExpired, hasCompleteRuntimeConfig, normalizeRuntimeConfig, normalizeEditableAccessPolicy, buildBatchStrategyType, createVerificationCode } from "./utils"
import { calculateScoreBreakdown, scoreSubmission } from "./scoring"
import { QUERIES } from "./query-builder"

async function getAdminProductForBatch(productId: string, env: CloudflareEnv) {
  const products = await listAdminProductsFromD1(env)
  const product = products.find((p) => p.id === productId)

  if (!product) {
    return undefined
  }

  const linkedQuizzes = await env.SOULTEST_DB.prepare(QUERIES.getLinkedQuizzes)
    .bind(productId)
    .all<{
      slug: string
      title: string
    }>()

  return {
    ...product,
    linkedQuizzes: linkedQuizzes.results ?? [],
  }
}

function normalizeCatalogItem(row: any): any {
  const runtime = parseJson<any | null>(row.config_json, null)
  const accessType = (row.price ?? 0) <= 0 ? "free" : "paid"
  const runtimeQuestionCount = Array.isArray(runtime?.questions) ? runtime.questions.length : 0
  const questionCount = runtime?.extensions?.intro?.questionCount ?? runtimeQuestionCount

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? runtime?.meta?.category ?? "未分类",
    summary: row.summary ?? runtime?.meta?.summary ?? "",
    tagline: runtime?.extensions?.intro?.tagline ?? runtime?.meta?.summary ?? row.summary ?? "",
    priceLabel: runtime?.extensions?.intro?.priceLabel ?? (accessType === "free" ? "免费体验" : "单测体验"),
    durationMinutes: runtime?.meta?.estimatedMinutes ?? questionCount,
    questionCount,
    accessSummary: runtime?.extensions?.intro?.accessSummary ?? "输入测试口令后开始",
    tags: runtime?.meta?.tags ?? [],
    valuePoints: runtime?.extensions?.intro?.valuePoints ?? ["完整结果报告", "支持保存与分享", "口令有效期内可重复进入"],
    flowSteps: runtime?.extensions?.intro?.flowSteps ?? ["输入测试口令", "完成测试", "查看结果"],
    detailSections: runtime?.extensions?.intro?.detailSections ?? [],
    accessType,
    salesChannel: row.sales_channel ?? undefined,
    purchaseUrl: row.purchase_url ?? undefined,
  }
}

function normalizeAdminQuizItem(row: any): any {
  const runtime = parseJson<any | null>(row.config_json, null)
  const accessType = (row.price ?? 0) <= 0 ? "free" : "paid"
  const runtimeQuestionCount = Array.isArray(runtime?.questions) ? runtime.questions.length : 0
  const questionCount = runtime?.extensions?.intro?.questionCount ?? runtimeQuestionCount

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? runtime?.meta?.category ?? "未分类",
    summary: row.summary ?? runtime?.meta?.summary ?? "",
    tagline: runtime?.extensions?.intro?.tagline ?? runtime?.meta?.summary ?? row.summary ?? "",
    priceLabel: runtime?.extensions?.intro?.priceLabel ?? (accessType === "free" ? "免费体验" : "单测体验"),
    durationMinutes: runtime?.meta?.estimatedMinutes ?? questionCount,
    questionCount,
    accessSummary: runtime?.extensions?.intro?.accessSummary ?? "输入测试口令后开始",
    tags: runtime?.meta?.tags ?? [],
    valuePoints: runtime?.extensions?.intro?.valuePoints ?? ["完整结果报告", "支持保存与分享", "口令有效期内可重复进入"],
    flowSteps: runtime?.extensions?.intro?.flowSteps ?? ["输入测试口令", "完成测试", "查看结果"],
    accessType,
    status: row.status,
    landingVisible: row.landing_visible === 1,
  }
}

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

export async function listPublicQuizzesFromD1(env: CloudflareEnv) {
  const result = await env.SOULTEST_DB.prepare(QUERIES.listPublicQuizzes).all<QuizRow>()

  return result.results.map(normalizeCatalogItem)
}

export async function getQuizIntroFromD1(slug: string, env: CloudflareEnv) {
  const row = await env.SOULTEST_DB.prepare(QUERIES.getQuizIntro)
    .bind(slug)
    .first<QuizRow>()

  if (!row) {
    return undefined
  }

  const normalized = normalizeCatalogItem(row)

  return {
    ...normalized,
    salesChannel: row.sales_channel ?? undefined,
    purchaseUrl: row.purchase_url ?? undefined,
  } satisfies QuizIntro
}

export async function getRuntimeConfigFromD1(slug: string, env: CloudflareEnv) {
  const row = await env.SOULTEST_DB.prepare(QUERIES.getRuntimeConfig)
    .bind(slug)
    .first<RuntimeRow>()

  if (!row?.config_json) {
    return undefined
  }

  return parseJson<QuizRuntimeConfig | undefined>(row.config_json, undefined)
}

export async function listAdminProductsFromD1(env: CloudflareEnv) {
  const result = await env.SOULTEST_DB.prepare(QUERIES.listAdminProducts).all<ProductRow>()

  return await Promise.all(
    result.results.map(async (row) => {
      const linkedQuizResult = await env.SOULTEST_DB.prepare(QUERIES.getLinkedQuizzes)
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

export async function listAdminCodeBatchesFromD1(env: CloudflareEnv) {
  const result = await env.SOULTEST_DB.prepare(QUERIES.listAdminCodeBatches).all<CodeBatchRow>()

  return await Promise.all(
    result.results.map(async (row) => {
      const [linkedQuizResult, sampleCodeResult] = await Promise.all([
        env.SOULTEST_DB.prepare(QUERIES.getLinkedQuizzes)
          .bind(row.product_id)
          .all<CodeBatchLinkedQuizRow>(),
        env.SOULTEST_DB.prepare(QUERIES.getSampleCodes)
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
        policy: normalizeEditableAccessPolicy(parseJson<AccessPolicy>(row.policy_json, { scopeMode: "full_product" })),
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

export async function getAdminQuizVerificationSummary(quizId: string, env: CloudflareEnv) {
  const bindingRow = await env.SOULTEST_DB.prepare(QUERIES.getAdminQuizVerification)
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
  const verificationMode = (policy?.verificationMode ?? "unknown") as "none" | "shared_code" | "unique_code" | "unknown"

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
    env.SOULTEST_DB.prepare(QUERIES.getActiveCodeCount).bind(bindingRow.batch_id).first<{ value: number }>(),
    env.SOULTEST_DB.prepare(QUERIES.getActiveSampleCodes)
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

export async function listAdminQuizzesFromD1(env: CloudflareEnv) {
  const result = await env.SOULTEST_DB.prepare(QUERIES.listAdminQuizzes).all<QuizRow>()

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

export async function lookupCodeInD1(code: string, env: CloudflareEnv): Promise<AccessGrant | undefined> {
  const grantRow = await env.SOULTEST_DB.prepare(QUERIES.lookupCode)
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

  const allowedRows = await env.SOULTEST_DB.prepare(QUERIES.getAllowedQuizzes)
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

export async function createAdminCodeBatch(input: CreateAdminCodeBatchInput, env: CloudflareEnv) {
  const productId = input.productId.trim()
  const batchName = input.name.trim()
  const codeCount = Math.trunc(input.codeCount)
  const codeLength = Math.trunc(input.codeLength ?? 8)
  const codePrefix = input.codePrefix ? input.codePrefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) : null
  const expiresAt = input.expiresAt ? new Date(input.expiresAt).toISOString() : null

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

  await env.SOULTEST_DB.prepare(QUERIES.createCodeBatch)
    .bind(batchId, product.id, batchName, strategyType, codePrefix, codeLength, expiresAt, JSON.stringify(policy))
    .run()

  try {
    for (let index = 0; index < codeCount; index += 1) {
      const code = createVerificationCode(codePrefix || "", codeLength, codeSet)

      await env.SOULTEST_DB.prepare(QUERIES.createCode)
        .bind(code, batchId, expiresAt, JSON.stringify({ createdBy: "admin_batch_create" }))
        .run()
    }

    const verification = await env.SOULTEST_DB.prepare(QUERIES.verifyCodeCount)
      .bind(batchId)
      .first<{ count: number }>()

    if ((verification?.count ?? 0) !== codeCount) {
      throw new Error("验证码生成不完整，已终止本次创建")
    }
  } catch (error) {
    await env.SOULTEST_DB.prepare(QUERIES.deleteCodesByBatchId).bind(batchId).run()
    await env.SOULTEST_DB.prepare(QUERIES.deleteCodeBatch).bind(batchId).run()
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
  await env.SOULTEST_DB.prepare(QUERIES.updateCodeBatchPolicy)
    .bind(batchId, JSON.stringify(normalizeEditableAccessPolicy(policy)))
    .run()
}

export async function updateAdminCodeBatchStatus(batchId: string, action: AdminCodeBatchAction, env: CloudflareEnv) {
  const currentBatch = await env.SOULTEST_DB.prepare(QUERIES.getCodeBatch)
    .bind(batchId)
    .first<{ id: string; status: string }>()

  if (!currentBatch) {
    throw new Error("未找到对应批次")
  }

  if (action === "activate" && ["revoked", "expired"].includes(currentBatch.status)) {
    throw new Error("已作废或已过期的批次不能重新启用")
  }

  const nextStatus = action === "pause" ? "paused" : action === "activate" ? "active" : "revoked"

  await env.SOULTEST_DB.prepare(QUERIES.updateCodeBatchStatus)
    .bind(batchId, nextStatus)
    .run()

  if (action === "revoke") {
    await env.SOULTEST_DB.prepare(QUERIES.revokeCodes)
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

export async function recordSubmission(
  input: SubmissionInput,
  accessSession: AccessSession,
  env: CloudflareEnv,
) {
  const runtime = await getRuntimeConfigFromD1(input.slug, env)

  if (!runtime) {
    throw new Error("runtime_not_found")
  }

  if (!input.answers || typeof input.answers !== "object" || Array.isArray(input.answers)) {
    throw new Error("答题数据格式不正确")
  }

  const runtimeQuestions = runtime.questions as Array<{
    id?: unknown
    options?: Array<{ id?: unknown }>
  }>
  const questionIds = new Set(runtimeQuestions.map((question) => String(question.id ?? "")))
  const unknownQuestionIds = Object.keys(input.answers).filter((questionId) => !questionIds.has(questionId))

  if (unknownQuestionIds.length > 0) {
    throw new Error("答题数据包含未知题目")
  }

  const issues = runtimeQuestions.flatMap((question) => {
    const questionId = String(question.id ?? "")
    const answer = input.answers[questionId]
    const selectedOptionId = typeof answer === "string" && answer.trim().length > 0
      ? answer
      : Array.isArray(answer) && answer.length === 1 && typeof answer[0] === "string" && answer[0].trim().length > 0
      ? answer[0]
      : undefined

    if (!questionId) {
      return []
    }

    if (!selectedOptionId) {
      return [{ questionId, code: "missing_answer" }]
    }

    const optionIds = new Set((question.options ?? []).map((option) => String(option.id ?? "")))

    if (!optionIds.has(selectedOptionId)) {
      return [{ questionId, code: "invalid_option", selectedOptionId }]
    }

    return []
  })

  if (issues.length > 0) {
    throw new Error("请完整并正确地完成所有题目后再提交")
  }

  const scoreBreakdown = calculateScoreBreakdown(runtime, input.answers)
  const { result } = scoreSubmission(runtime, input.answers)

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

  if (env.API_STUB_MODE === "mock") {
    await env.SOULTEST_CACHE.put(`submission:${submissionId}`, JSON.stringify(detail), {
      expirationTtl: 60 * 60 * 24 * 30,
    })

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
    const quizRow = await env.SOULTEST_DB.prepare(QUERIES.getQuizById)
      .bind(input.slug)
      .first<{ id: string; current_published_version_id: string | null }>()

    if (quizRow?.current_published_version_id) {
      await env.SOULTEST_DB.prepare(QUERIES.recordSubmission)
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

  await env.SOULTEST_CACHE.put(`submission:${submissionId}`, JSON.stringify(detail), {
    expirationTtl: 60 * 60 * 24 * 30,
  })

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
  const raw = await env.SOULTEST_CACHE.get(`submission:${submissionId}`)

  if (raw) {
    return parseJson<SubmissionDetail | undefined>(raw, undefined)
  }

  if (env.API_STUB_MODE === "mock") {
    return undefined
  }

  const row = await env.SOULTEST_DB.prepare(QUERIES.getSubmissionDetail)
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
    : normalizeRuntimeConfig(await getRuntimeConfigFromD1(row.slug, env)) ?? normalizeRuntimeConfig(parsedRuntime)

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

export async function getAdminOverviewData(env: CloudflareEnv) {
  try {
    return await Promise.all([
      env.SOULTEST_DB.prepare(QUERIES.getActiveCodesCount).first<{ value: number }>(),
      env.SOULTEST_DB.prepare(QUERIES.getSubmissionsCount).first<{ value: number }>(),
      env.SOULTEST_DB.prepare(QUERIES.getSubmissions24h).first<{ value: number }>(),
      env.SOULTEST_DB.prepare(QUERIES.getSubmissions7d).first<{ value: number }>(),
      env.SOULTEST_DB.prepare(QUERIES.getSubmissions30d).first<{ value: number }>(),
      env.SOULTEST_DB.prepare(QUERIES.getAvgDuration).first<{ avgDurationSec: number | null }>(),
      env.SOULTEST_DB.prepare(QUERIES.getShareCount).first<{ shareCount: number }>(),
      env.SOULTEST_DB.prepare(QUERIES.getTopQuizzes).all<{ quizId: string; slug: string; title: string; submissions: number }>(),
      env.SOULTEST_DB.prepare(QUERIES.getDailySubmissions).all<{ date: string; value: number }>(),
    ])
  } catch {
    return []
  }
}
