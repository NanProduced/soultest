import {
  getMockAccessGrant,
  getMockAdminOverview,
  getMockCatalogItems,
  getMockCodeBatches,
  getMockProducts,
  getMockQuizIntro,
  getMockRuntimeConfig,
} from "./mock-data"
import type {
  AccessGrant,
  AccessPolicy,
  AccessSession,
  AdminCodeBatch,
  AdminOverview,
  AdminProduct,
  AllowedQuiz,
  CloudflareEnv,
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

function normalizeCatalogItem(row: QuizRow): QuizCatalogItem {
  const fallback = getMockCatalogItems().find((item) => item.slug === row.slug)
  const runtime = parseJson<QuizRuntimeConfig | null>(row.config_json, null)

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? fallback?.category ?? runtime?.meta.category ?? "未分类",
    summary: row.summary ?? fallback?.summary ?? runtime?.meta.summary ?? "",
    tagline: fallback?.tagline ?? runtime?.meta.summary ?? row.summary ?? "",
    priceLabel:
      fallback?.priceLabel ?? ((row.price ?? 0) <= 0 ? "免费体验" : "单测体验"),
    durationMinutes:
      fallback?.durationMinutes ?? runtime?.meta.estimatedMinutes ?? runtime?.questions.length ?? 0,
    questionCount: fallback?.questionCount ?? runtime?.questions.length ?? 0,
    accessSummary: fallback?.accessSummary ?? "支持动态验证码策略",
    tags: fallback?.tags ?? runtime?.meta.tags ?? [],
    valuePoints: fallback?.valuePoints ?? ["后续可映射 D1 发布版本与扩展配置"],
    flowSteps: fallback?.flowSteps ?? ["输入验证码", "完成测试", "查看结果"],
  }
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
        v.config_json
      FROM quizzes q
      LEFT JOIN quiz_versions v ON v.id = q.current_published_version_id
      WHERE q.slug = ?1
      LIMIT 1
    `,
  )
    .bind(slug)
    .first<QuizRow>()

  if (!row) {
    return undefined
  }

  const fallback = getMockQuizIntro(slug)
  const normalized = normalizeCatalogItem(row)

  return {
    ...normalized,
    detailSections: fallback?.detailSections ?? [],
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

  return result.results.map((row) => ({
    id: row.id,
    name: row.name,
    productType: row.product_type,
    status: row.status,
    quizCount: row.quiz_count ?? 0,
    description: row.description ?? "",
  })) satisfies AdminProduct[]
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
        COUNT(c.code) AS code_count
      FROM code_batches cb
      JOIN products p ON p.id = cb.product_id
      LEFT JOIN codes c ON c.batch_id = cb.id
      GROUP BY cb.id
      ORDER BY cb.created_at DESC
    `,
  ).all<CodeBatchRow>()

  return result.results.map((row) => ({
    id: row.id,
    name: row.name,
    productId: row.product_id,
    productName: row.product_name,
    strategyType: row.strategy_type,
    status: row.status,
    codeCount: row.code_count ?? 0,
    expiresAt: row.expires_at,
  })) satisfies AdminCodeBatch[]
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

export async function listPublicQuizzes(env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockCatalogItems()
  }

  try {
    const items = await listPublicQuizzesFromD1(env)

    if (items.length > 0) {
      return items
    }
  } catch {
    // fall through to mock data
  }

  return getMockCatalogItems()
}

export async function getQuizIntro(slug: string, env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockQuizIntro(slug)
  }

  try {
    const item = await getQuizIntroFromD1(slug, env)

    if (item) {
      return item
    }
  } catch {
    // fall through to mock data
  }

  return getMockQuizIntro(slug)
}

export async function getRuntimeConfig(slug: string, env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockRuntimeConfig(slug)
  }

  try {
    const runtime = await getRuntimeConfigFromD1(slug, env)

    if (runtime) {
      return runtime
    }
  } catch {
    // fall through to mock data
  }

  return getMockRuntimeConfig(slug)
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
    // fall through to mock data
  }

  return getMockAccessGrant(normalizedCode)
}

export async function getAdminOverview(env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockAdminOverview()
  }

  try {
    const [quizzes, products, codeBatches, activeCodes, submissions] = await Promise.all([
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM quizzes").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM products").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM code_batches").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM codes WHERE status = 'active'").first<{ value: number }>(),
      env.SOULTEST_DB.prepare("SELECT COUNT(*) AS value FROM submissions").first<{ value: number }>(),
    ])

    return {
      quizzes: quizzes?.value ?? 0,
      products: products?.value ?? 0,
      codeBatches: codeBatches?.value ?? 0,
      activeCodes: activeCodes?.value ?? 0,
      submissions: submissions?.value ?? 0,
      lastSeedAt: new Date().toISOString(),
    } satisfies AdminOverview
  } catch {
    return getMockAdminOverview()
  }
}

export async function listAdminQuizzes(env: CloudflareEnv) {
  return listPublicQuizzes(env)
}

export async function listAdminProducts(env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockProducts()
  }

  try {
    const products = await listAdminProductsFromD1(env)

    if (products.length > 0) {
      return products
    }
  } catch {
    // fall through to mock data
  }

  return getMockProducts()
}

export async function listAdminCodeBatches(env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockCodeBatches()
  }

  try {
    const batches = await listAdminCodeBatchesFromD1(env)

    if (batches.length > 0) {
      return batches
    }
  } catch {
    // fall through to mock data
  }

  return getMockCodeBatches()
}

export async function issueAccessSession(grant: AccessGrant, env: CloudflareEnv) {
  const ttlDays = grant.policy.tokenTtlDays ?? Number(env.ACCESS_TOKEN_TTL_DAYS || "30")
  const ttlSeconds = ttlDays * 24 * 60 * 60
  const issuedAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString()
  const token = `st_${crypto.randomUUID().replaceAll("-", "")}`

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

  const runtime = parseJson<QuizRuntimeConfig | undefined>(row.config_json, undefined)

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




