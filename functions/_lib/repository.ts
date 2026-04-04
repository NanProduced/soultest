import {
  getMockAccessGrant,
  getMockCatalogItems,
  getMockCodeBatches,
  getMockProducts,
} from "./mock-data"
import { getMockAdminQuizzes, getStaticAdminQuizzes } from "./admin-mock-data"
import { getStaticQuizIntro, getStaticRuntimeConfig } from "./official-quiz-content"
import type {
  AccessGrant,
  AccessSession,
  AdminOverview,
  AdminQuizAccessType,
  AdminQuizItem,
  CloudflareEnv,
  QuizCatalogItem,
  QuizIntro,
} from "./types"
import { parseJson, hasCompleteRuntimeConfig, normalizeRuntimeConfig } from "./utils"
import {
  listPublicQuizzesFromD1,
  getQuizIntroFromD1,
  getRuntimeConfigFromD1,
  listAdminProductsFromD1,
  listAdminCodeBatchesFromD1,
  listAdminQuizzesFromD1,
  lookupCodeInD1,
  createAdminCodeBatch,
  updateAdminCodeBatchPolicy,
  updateAdminCodeBatchStatus,
  recordSubmission,
  getSubmissionDetail,
  getAdminOverviewData,
} from "./data-access"

// 重新导出data-access中的函数，以便API路由使用
export {
  createAdminCodeBatch,
  updateAdminCodeBatchPolicy,
  updateAdminCodeBatchStatus,
  recordSubmission,
  getSubmissionDetail,
}

export class SubmissionValidationError extends Error {
  details?: unknown

  constructor(message: string, details?: unknown) {
    super(message)
    this.name = "SubmissionValidationError"
    this.details = details
  }
}







function toPublicCatalogItem(item: AdminQuizItem): QuizCatalogItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    summary: item.summary,
    tagline: item.tagline,
    priceLabel: item.priceLabel,
    durationMinutes: item.durationMinutes,
    questionCount: item.questionCount,
    accessSummary: item.accessSummary,
    tags: [...item.tags],
    valuePoints: [...item.valuePoints],
    flowSteps: [...item.flowSteps],
    accessType: item.accessType,
  }
}

const D1_METADATA_MANAGED_QUIZ_SLUGS = new Set([
  "free/aura",
  "free/banwei",
  "free/painting",
  "free/talent",
  "free/szondi",
  "free/soul-city",
  "oejts-personality-map",
  "relationship-preference-test",
  "enneagram",
  "bigfive",
  "dark-triad",
  "hexaco-60",
  "riasec-48",
  "soul-tarot",
  "stress-load-test",
  "desire-composition",
])

function filterStaticCompatibilityQuizzes<T extends { slug: string }>(items: T[]) {
  return items.filter((item) => !D1_METADATA_MANAGED_QUIZ_SLUGS.has(item.slug))
}

function listStaticPublicQuizzes(accessType?: AdminQuizAccessType) {
  return getStaticAdminQuizzes()
    .filter((item) => {
      const liveOnLanding = item.liveOnLanding ?? (item.status === "published" && item.landingVisible === true)
      return liveOnLanding && (!accessType || item.accessType === accessType)
    })
    .map(toPublicCatalogItem)
}

function mergePublicQuizCollections(staticItems: QuizCatalogItem[], d1Items: QuizCatalogItem[]) {
  const mergedItems = new Map<string, QuizCatalogItem>()

  for (const item of staticItems) {
    mergedItems.set(item.slug, item)
  }

  for (const item of d1Items) {
    const existingItem = mergedItems.get(item.slug)

    if (!existingItem) {
      mergedItems.set(item.slug, item)
      continue
    }

    mergedItems.set(item.slug, {
      ...existingItem,
      ...item,
      tags: item.tags.length > 0 ? item.tags : existingItem.tags,
      valuePoints: item.valuePoints.length > 0 ? item.valuePoints : existingItem.valuePoints,
      flowSteps: item.flowSteps.length > 0 ? item.flowSteps : existingItem.flowSteps,
    })
  }

  return [...mergedItems.values()]
}



function mergeQuizIntro(d1Intro: QuizIntro | undefined, staticIntro: QuizIntro | undefined) {
  if (!d1Intro) {
    return staticIntro
  }

  if (!staticIntro) {
    return d1Intro
  }

  return {
    ...staticIntro,
    ...d1Intro,
    tags: d1Intro.tags.length > 0 ? d1Intro.tags : staticIntro.tags,
    valuePoints: d1Intro.valuePoints.length > 0 ? d1Intro.valuePoints : staticIntro.valuePoints,
    flowSteps: d1Intro.flowSteps.length > 0 ? d1Intro.flowSteps : staticIntro.flowSteps,
    detailSections: d1Intro.detailSections.length > 0 ? d1Intro.detailSections : staticIntro.detailSections,
    salesChannel: d1Intro.salesChannel ?? staticIntro.salesChannel,
    purchaseUrl: d1Intro.purchaseUrl ?? staticIntro.purchaseUrl,
  } satisfies QuizIntro
}





export async function listPublicQuizzes(env: CloudflareEnv, accessType?: AdminQuizAccessType) {
  if (isMockMode(env)) {
    return getMockCatalogItems().filter((item) => !accessType || item.accessType === accessType)
  }

  const staticItems = listStaticPublicQuizzes(accessType)
  const compatibilityItems = filterStaticCompatibilityQuizzes(staticItems)

  try {
    const d1Items = (await listPublicQuizzesFromD1(env)).filter((item) => !accessType || item.accessType === accessType)
    return mergePublicQuizCollections(compatibilityItems, d1Items)
  } catch {
    return compatibilityItems
  }
}

export async function getQuizIntro(slug: string, env: CloudflareEnv) {
  const staticIntro = getStaticQuizIntro(slug)

  if (isMockMode(env)) {
    return staticIntro
  }

  try {
    return mergeQuizIntro(await getQuizIntroFromD1(slug, env), staticIntro)
  } catch {
    return D1_METADATA_MANAGED_QUIZ_SLUGS.has(slug) ? undefined : staticIntro
  }
}

export async function getRuntimeConfig(slug: string, env: CloudflareEnv) {
  const staticRuntime = normalizeRuntimeConfig(getStaticRuntimeConfig(slug))

  if (isMockMode(env)) {
    return staticRuntime
  }

  try {
    const runtime = normalizeRuntimeConfig(await getRuntimeConfigFromD1(slug, env))
    return hasCompleteRuntimeConfig(runtime) ? runtime : staticRuntime
  } catch {
    return D1_METADATA_MANAGED_QUIZ_SLUGS.has(slug) ? undefined : staticRuntime
  }
}

export async function getPrimaryQuizIntro(slug: string, env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getStaticQuizIntro(slug)
  }

  try {
    return await getQuizIntroFromD1(slug, env)
  } catch {
    return undefined
  }
}

export async function getPrimaryRuntimeConfig(slug: string, env: CloudflareEnv) {
  if (isMockMode(env)) {
    return normalizeRuntimeConfig(getStaticRuntimeConfig(slug))
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
    ] = await getAdminOverviewData(env)

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
  if (isMockMode(env)) {
    return getMockAdminQuizzes()
  }

  const staticItems = getStaticAdminQuizzes()
  const compatibilityItems = filterStaticCompatibilityQuizzes(staticItems)

  try {
    const d1Items = await listAdminQuizzesFromD1(env)
    return d1Items
  } catch {
    return compatibilityItems
  }
}

export async function listAdminProducts(env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockProducts()
  }

  try {
    return await listAdminProductsFromD1(env)
  } catch {
    return []
  }
}





export async function listAdminCodeBatches(env: CloudflareEnv) {
  if (isMockMode(env)) {
    return getMockCodeBatches()
  }

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



function isMockMode(env: CloudflareEnv) {
  return env.API_STUB_MODE === "mock"
}

function shouldUseLocalStaticAccessGrantFallback(env: CloudflareEnv) {
  return ["local", "development", "dev"].includes(env.APP_ENV)
    && env.ALLOW_STATIC_ACCESS_GRANT_FALLBACK === "true"
}



























