export type QuizRendererKey = "generic" | "custom"
export type ScoringModelKey = "accumulate" | "dimension" | "range" | "branch" | "radar" | "oejts" | "hexaco" | "enneagram" | "tarot"
export type ResultTemplateKey =
  | "story-card"
  | "relationship-story"
  | "career-energy"
  | "radar-profile"
  | "match-meter"
  | "classification-tag"
  | "oejts-profile"
  | "hexaco-profile"
  | "enneagram-profile"
  | (string & {})

export type QuizAccessType = "free" | "paid"

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
  accessType: QuizAccessType
}

export interface QuizIntro extends QuizCatalogItem {
  salesChannel?: string
  purchaseUrl?: string
  detailSections: Array<{
    title: string
    description: string
  }>
}

export interface QuizOption {
  id: string
  label: string
  description?: string
  value?: Record<string, unknown>
}

export interface QuizQuestion {
  id: string
  type: "single_choice"
  title: string
  description?: string
  leftLabel?: string
  rightLabel?: string
  axisKey?: string
  reverseScore?: boolean
  options: QuizOption[]
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
  heroTitle?: string
  coreMotivation?: string
  coreFear?: string
  centerLabel?: string
  stressDirection?: string
  growthDirection?: string
  posterQuote?: string
  shareCopy?: string
}

export interface ScoreBreakdownItem {
  key: string
  label: string
  score: number
  avg?: number
  display?: number
  band?: string
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
  questions: QuizQuestion[]
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

export interface VerifyAccessResponse {
  accessToken: string
  expiresAt: string
  product: AccessProduct
  allowedQuizzes: AllowedQuiz[]
  code: string
  source: string
}

export interface QuizRuntimeResponse {
  runtime: QuizRuntimeConfig
  access: {
    product: AccessProduct
    expiresAt: string
    code: string
  }
  source: string
}

export interface SubmitQuizResponse {
  submissionId: string
  resultKey: string
  resultTitle: string
  resultSummary: string
  scoreBreakdown: ScoreBreakdownItem[]
  storedInD1: boolean
  redirectTo: string
  source: string
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

export interface SubmissionDetailResponse {
  submission: StoredQuizResult
  runtime: QuizRuntimeConfig
  result: QuizResultDefinition
}

export interface AdminOverviewTrendPoint {
  date: string
  submissions: number
}

export interface AdminOverviewTopQuiz {
  quizId: string
  slug: string
  title: string
  submissions: number
}

export interface AdminOverviewAnalytics {
  submissions24h: number
  submissions7d: number
  submissions30d: number
  avgDurationSec: number | null
  shareCount: number
  shareRate: number
  recentDailySubmissions: AdminOverviewTrendPoint[]
  topQuizzes: AdminOverviewTopQuiz[]
}

export interface AdminOverview {
  quizzes: number
  products: number
  codeBatches: number
  activeCodes: number
  submissions: number
  lastSeedAt: string
  analytics: AdminOverviewAnalytics
}

export interface AdminProductLinkedQuiz {
  slug: string
  title: string
}

export interface AdminProduct {
  id: string
  name: string
  productType: string
  status: string
  quizCount: number
  description: string
  linkedQuizzes: AdminProductLinkedQuiz[]
}

export interface AdminCodeBatchPolicy {
  scopeMode: string
  allowQuizSlugs?: string[]
  verificationMode?: "shared_code" | "unique_code"
  tokenTtlDays?: number
  introVisible?: boolean
  notes?: string
}

export interface AdminCodeBatchLinkedQuiz {
  slug: string
  title: string
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
  codePrefix: string | null
  codeLength: number
  policy: AdminCodeBatchPolicy
  linkedQuizzes: AdminCodeBatchLinkedQuiz[]
  sampleCodes: AdminQuizVerificationCode[]
}

export interface CreateAdminCodeBatchInput {
  productId: string
  name: string
  codeCount: number
  codePrefix?: string
  codeLength?: number
  expiresAt?: string | null
  policy: AdminCodeBatchPolicy
}

export type AdminCodeBatchAction = "activate" | "pause" | "revoke"

export type AdminQuizAccessType = QuizAccessType

export interface AdminQuizVerificationCode {
  code: string
  status: string
  expiresAt: string | null
}

export interface AdminQuizVerificationSummary {
  verificationMode: "shared_code" | "unique_code" | "unknown"
  scopeMode?: string
  batchId?: string
  batchStrategyType?: string
  tokenTtlDays: number | null
  notes?: string
  productName?: string
  batchName?: string
  batchStatus?: string
  activeCodeCount: number
  sampleCodes: AdminQuizVerificationCode[]
}

export interface AdminQuizItem extends QuizCatalogItem {
  status: string
  accessType: AdminQuizAccessType
  source: "d1" | "mock" | "static"
  introPath: string
  testPath: string
  landingVisible?: boolean
  liveOnLanding?: boolean
  verification?: AdminQuizVerificationSummary
}

export interface AdminSessionSummary {
  username: string
  issuedAt: string
  expiresAt: string
}




