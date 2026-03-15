export interface CloudflareEnv {
  APP_ENV: string
  API_STUB_MODE: string
  ACCESS_TOKEN_TTL_DAYS: string
  SOULTEST_DB: D1Database
  SOULTEST_CACHE: KVNamespace
  SOULTEST_ASSETS: R2Bucket
}

export type QuizRendererKey = "generic" | "custom"
export type ScoringModelKey = "accumulate" | "dimension" | "range" | "branch" | "radar" | "oejts"
export type ResultTemplateKey =
  | "story-card"
  | "relationship-story"
  | "career-energy"
  | "radar-profile"
  | "match-meter"
  | "classification-tag"
  | "oejts-profile"
  | (string & {})

export interface QuizCatalogItem {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  tagline: string
  priceLabel: string
  durationMinutes: number
  questionCount: number
  accessSummary: string
  tags: string[]
  valuePoints: string[]
  flowSteps: string[]
}

export interface QuizIntro extends QuizCatalogItem {
  detailSections: Array<{
    title: string
    description: string
  }>
}

export interface QuizResultDefinition {
  key: string
  title: string
  summary: string
  dimensionKey?: string
  subtitle?: string
  nickname?: string
  typeCode?: string
  alias?: string
  keywords?: string[]
  firstImpression?: string
  overview?: string
  strengthSummary?: string
  blindSpotSummary?: string
  relationshipStyle?: string
  workStyle?: string
  stressMode?: string
  growthAdvice?: string
  posterTags?: string[]
  highlights?: string[]
  strengths?: string[]
  blindSpots?: string[]
  relationshipNotes?: string[]
  workNotes?: string[]
  stressNotes?: string[]
  growthNotes?: string[]
  shareCopy?: string
}

export interface ScoreBreakdownItem {
  key: string
  label: string
  score: number
}

export interface QuizRuntimeConfig {
  meta: {
    slug: string
    title: string
    summary?: string
    estimatedMinutes?: number
    tags?: string[]
    category?: string
  }
  runtime: {
    renderer?: QuizRendererKey | string
    rendererKey?: QuizRendererKey | string
    resultTemplate?: ResultTemplateKey
    resultTemplateKey?: ResultTemplateKey
    scoringModel?: ScoringModelKey | string
    scoringKey?: ScoringModelKey | string
  }
  presentation?: {
    themeKey?: string
    storyMode?: boolean
    screenCount?: number
    shareCardKey?: string
  } & Record<string, unknown>
  questions: Array<Record<string, unknown>>
  results: QuizResultDefinition[]
  extensions?: {
    scoring?: {
      dimensions?: Array<{ key: string; label: string }>
      ranges?: Array<{ min?: number; max?: number; resultKey: string }>
      branches?: Array<{
        when: Record<string, string | string[]>
        resultKey: string
      }>
    }
    share?: {
      captionTone?: string
    }
  } & Record<string, unknown>
}

export interface AllowedQuiz {
  slug: string
  title: string
}

export interface AccessProduct {
  id: string
  name: string
  productType: string
}

export interface AccessPolicy {
  scopeMode: string
  allowQuizSlugs?: string[]
  verificationMode?: "shared_code" | "unique_code" | "none"
  tokenTtlDays?: number
  introVisible?: boolean
  notes?: string
}

export interface AccessGrant {
  code: string
  product: AccessProduct
  allowedQuizzes: AllowedQuiz[]
  policy: AccessPolicy
}

export interface AccessSession {
  token: string
  code: string
  product: AccessProduct
  allowedQuizzes: AllowedQuiz[]
  issuedAt: string
  expiresAt: string
}

export interface AdminOverview {
  quizzes: number
  products: number
  codeBatches: number
  activeCodes: number
  submissions: number
  lastSeedAt: string
}

export interface AdminProduct {
  id: string
  name: string
  productType: string
  status: string
  quizCount: number
  description: string
}

export interface AdminCodeBatch {
  id: string
  name: string
  productId: string
  productName: string
  strategyType: string
  status: string
  codeCount: number
  expiresAt: string | null
}

export interface SubmissionInput {
  slug: string
  answers: Record<string, unknown>
  durationSec?: number
  clientInfo?: Record<string, unknown>
}

export interface StoredQuizResult {
  submissionId: string
  slug: string
  quizTitle: string
  resultKey: string
  resultTitle: string
  resultSummary: string
  scoreBreakdown: ScoreBreakdownItem[]
  submittedAt: string
  highlights?: string[]
}

export interface SubmissionDetail {
  submission: StoredQuizResult
  runtime: QuizRuntimeConfig
  result: QuizResultDefinition
}
