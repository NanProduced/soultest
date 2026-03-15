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
