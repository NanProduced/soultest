import type {
  AccessGrant,
  AccessPolicy,
  AdminCodeBatch,
  AdminProduct,
  AdminQuizItem,
  AdminQuizVerificationCode,
  AdminQuizVerificationSummary,
  AllowedQuiz,
  CloudflareEnv,
  QuizCatalogItem,
  QuizIntro,
  QuizRuntimeConfig,
  ScoreBreakdownItem,
} from "./types"
import {
  buildConsumeUniqueCodeQuery,
  buildDeleteCodeBatchQuery,
  buildDeleteCodesByBatchQuery,
  buildGetActiveCodeCountQuery,
  buildGetActiveCodesCountQuery,
  buildGetActiveSampleCodesQuery,
  buildGetAdminQuizVerificationSummaryQuery,
  buildGetAllowedQuizzesQuery,
  buildGetAvgDurationQuery,
  buildGetCodeBatchStatusQuery,
  buildGetLinkedQuizzesQuery,
  buildGetQuizForSubmissionQuery,
  buildGetQuizIntroQuery,
  buildGetRecentDailySubmissionsQuery,
  buildGetRuntimeConfigQuery,
  buildGetSampleCodesQuery,
  buildGetShareCountQuery,
  buildGetSubmissionDetailQuery,
  buildGetSubmissions24hQuery,
  buildGetSubmissions30dQuery,
  buildGetSubmissions7dQuery,
  buildGetTopQuizzesQuery,
  buildGetTotalSubmissionsQuery,
  buildInsertCodeBatchQuery,
  buildInsertCodeQuery,
  buildInsertSubmissionQuery,
  buildListAdminCodeBatchesQuery,
  buildListAdminProductsQuery,
  buildListAdminQuizzesQuery,
  buildListPublicQuizzesQuery,
  buildLookupCodeQuery,
  buildRevokeCodesByBatchQuery,
  buildUpdateCodeBatchPolicyQuery,
  buildUpdateCodeBatchStatusQuery,
  buildVerifyCodeCountQuery,
} from "./query-builder"

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

export async function listPublicQuizzesFromD1(env: CloudflareEnv) {
  const result = await buildListPublicQuizzesQuery(env).all<QuizRow>()
  return result.results.map(normalizeCatalogItem)
}

export async function getQuizIntroFromD1(slug: string, env: CloudflareEnv) {
  const row = await buildGetQuizIntroQuery(slug, env).first<QuizRow>()

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

export async function getRuntimeConfigFromD1(slug: string, env: CloudflareEnv) {
  const row = await buildGetRuntimeConfigQuery(slug, env).first<RuntimeRow>()

  if (!row?.config_json) {
    return undefined
  }

  return parseJson<QuizRuntimeConfig | undefined>(row.config_json, undefined)
}

export async function listAdminProductsFromD1(env: CloudflareEnv) {
  const result = await buildListAdminProductsQuery(env).all<ProductRow>()

  return await Promise.all(
    result.results.map(async (row) => {
      const linkedQuizResult = await buildGetLinkedQuizzesQuery(row.id, env).all<CodeBatchLinkedQuizRow>()

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
  const result = await buildListAdminCodeBatchesQuery(env).all<CodeBatchRow>()

  return await Promise.all(
    result.results.map(async (row) => {
      const [linkedQuizResult, sampleCodeResult] = await Promise.all([
        buildGetLinkedQuizzesQuery(row.product_id, env).all<CodeBatchLinkedQuizRow>(),
        buildGetSampleCodesQuery(row.id, env).all<AdminQuizVerificationCodeRow>(),
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

export async function getAdminQuizVerificationSummary(quizId: string, env: CloudflareEnv) {
  const bindingRow = await buildGetAdminQuizVerificationSummaryQuery(quizId, env).first<AdminQuizVerificationRow>()

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
    buildGetActiveCodeCountQuery(bindingRow.batch_id, env).first<{ value: number }>(),
    buildGetActiveSampleCodesQuery(bindingRow.batch_id, env).all<AdminQuizVerificationCodeRow>(),
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
  const result = await buildListAdminQuizzesQuery(env).all<QuizRow>()

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
  const grantRow = await buildLookupCodeQuery(code, env).first<CodeGrantRow>()

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

  const allowedRows = await buildGetAllowedQuizzesQuery(grantRow.product_id, env).all<AllowedQuiz>()

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

export async function consumeUniqueCodeGrant(grant: AccessGrant, env: CloudflareEnv) {
  if (grant.policy.verificationMode !== "unique_code") {
    return
  }

  const result = await buildConsumeUniqueCodeQuery(grant.code, env).run()

  const changes = Number((result as { meta?: { changes?: number } }).meta?.changes ?? 0)

  if (changes < 1) {
    throw new Error("unique_code_unavailable")
  }
}

export async function getAdminOverviewAnalytics(env: CloudflareEnv) {
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
    buildGetActiveCodesCountQuery(env).first<{ value: number }>(),
    buildGetTotalSubmissionsQuery(env).first<{ value: number }>(),
    buildGetSubmissions24hQuery(env).first<{ value: number }>(),
    buildGetSubmissions7dQuery(env).first<{ value: number }>(),
    buildGetSubmissions30dQuery(env).first<{ value: number }>(),
    buildGetAvgDurationQuery(env).first<{ avgDurationSec: number | null }>(),
    buildGetShareCountQuery(env).first<{ shareCount: number }>(),
    buildGetTopQuizzesQuery(env).all<{ quizId: string; slug: string; title: string; submissions: number }>(),
    buildGetRecentDailySubmissionsQuery(env).all<{ date: string; value: number }>(),
  ])

  return {
    activeCodes: activeCodes?.value ?? 0,
    totalSubmissions: submissions?.value ?? 0,
    submissions24h: submissions24h?.value ?? 0,
    submissions7d: submissions7d?.value ?? 0,
    submissions30d: submissions30d?.value ?? 0,
    avgDurationSec: durationStats?.avgDurationSec ?? null,
    shareCount: shareStats?.shareCount ?? 0,
    topQuizzes: (topQuizRows.results ?? []).map((row) => ({
      quizId: row.quizId,
      slug: row.slug,
      title: row.title,
      submissions: row.submissions,
    })),
    dailyRows: dailyRows.results ?? [],
  }
}

export async function insertCodeBatch(
  batchId: string,
  productId: string,
  batchName: string,
  strategyType: string,
  codePrefix: string | null,
  codeLength: number,
  expiresAt: string,
  policyJson: string,
  env: CloudflareEnv,
) {
  await buildInsertCodeBatchQuery(batchId, productId, batchName, strategyType, codePrefix, codeLength, expiresAt, policyJson, env).run()
}

export async function insertCode(
  code: string,
  batchId: string,
  expiresAt: string,
  metadataJson: string,
  env: CloudflareEnv,
) {
  await buildInsertCodeQuery(code, batchId, expiresAt, metadataJson, env).run()
}

export async function verifyCodeCount(batchId: string, expectedCount: number, env: CloudflareEnv) {
  const verification = await buildVerifyCodeCountQuery(batchId, env).first<{ count: number }>()
  return (verification?.count ?? 0) === expectedCount
}

export async function deleteCodesByBatch(batchId: string, env: CloudflareEnv) {
  await buildDeleteCodesByBatchQuery(batchId, env).run()
}

export async function deleteCodeBatch(batchId: string, env: CloudflareEnv) {
  await buildDeleteCodeBatchQuery(batchId, env).run()
}

export async function updateCodeBatchPolicy(batchId: string, policy: AccessPolicy, env: CloudflareEnv) {
  await buildUpdateCodeBatchPolicyQuery(batchId, JSON.stringify(normalizeEditableAccessPolicy(policy)), env).run()
}

export async function getCodeBatchStatus(batchId: string, env: CloudflareEnv) {
  return await buildGetCodeBatchStatusQuery(batchId, env).first<{ id: string; status: string }>()
}

export async function updateCodeBatchStatus(batchId: string, nextStatus: string, env: CloudflareEnv) {
  await buildUpdateCodeBatchStatusQuery(batchId, nextStatus, env).run()
}

export async function revokeCodesByBatch(batchId: string, env: CloudflareEnv) {
  await buildRevokeCodesByBatchQuery(batchId, env).run()
}

export async function getQuizForSubmission(slug: string, env: CloudflareEnv) {
  return await buildGetQuizForSubmissionQuery(slug, env).first<{ id: string; current_published_version_id: string | null }>()
}

export async function insertSubmission(
  submissionId: string,
  quizId: string,
  quizVersionId: string,
  productId: string,
  code: string,
  resultKey: string,
  scoreBreakdown: ScoreBreakdownItem[],
  answers: Record<string, unknown>,
  durationSec: number | null,
  clientInfo: Record<string, unknown>,
  env: CloudflareEnv,
) {
  await buildInsertSubmissionQuery(
    submissionId,
    quizId,
    quizVersionId,
    productId,
    code,
    resultKey,
    JSON.stringify({
      answers,
      scoringMode: scoreBreakdown.length > 0 ? "dimension" : "fallback",
      scoreBreakdown,
    }),
    durationSec,
    JSON.stringify(clientInfo ?? {}),
    env,
  ).run()
}

export async function getSubmissionDetailFromD1(submissionId: string, env: CloudflareEnv) {
  return await buildGetSubmissionDetailQuery(submissionId, env).first<{
    id: string
    result_key: string | null
    score_json: string | null
    created_at: string
    slug: string
    title: string
    config_json: string | null
  }>()
}
