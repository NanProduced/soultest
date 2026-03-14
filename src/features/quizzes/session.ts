import type { StoredQuizResult, VerifyAccessResponse } from "@/features/quizzes/types"

const ACCESS_SESSION_KEY = "soultest.access-session"

interface QuizDraft {
  slug: string
  answers: Record<string, string>
  activeIndex: number
  updatedAt: string
}

function isBrowser() {
  return typeof window !== "undefined"
}

export function readAccessSession() {
  if (!isBrowser()) {
    return undefined
  }

  const raw = window.sessionStorage.getItem(ACCESS_SESSION_KEY)

  if (!raw) {
    return undefined
  }

  try {
    return JSON.parse(raw) as VerifyAccessResponse
  } catch {
    return undefined
  }
}

export function writeAccessSession(session: VerifyAccessResponse) {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.setItem(ACCESS_SESSION_KEY, JSON.stringify(session))
}

export function clearAccessSession() {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.removeItem(ACCESS_SESSION_KEY)
}

export function writeStoredQuizResult(result: StoredQuizResult) {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.setItem(`soultest.result.${result.submissionId}`, JSON.stringify(result))
}

export function readStoredQuizResult(submissionId: string) {
  if (!isBrowser()) {
    return undefined
  }

  const raw = window.sessionStorage.getItem(`soultest.result.${submissionId}`)

  if (!raw) {
    return undefined
  }

  try {
    return JSON.parse(raw) as StoredQuizResult
  } catch {
    return undefined
  }
}

function getDraftKey(slug: string) {
  return `soultest.draft.${slug}`
}

export function readQuizDraft(slug: string) {
  if (!isBrowser()) {
    return undefined
  }

  const raw = window.localStorage.getItem(getDraftKey(slug))

  if (!raw) {
    return undefined
  }

  try {
    return JSON.parse(raw) as QuizDraft
  } catch {
    return undefined
  }
}

export function writeQuizDraft(draft: Omit<QuizDraft, "updatedAt">) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(
    getDraftKey(draft.slug),
    JSON.stringify({
      ...draft,
      updatedAt: new Date().toISOString(),
    } satisfies QuizDraft),
  )
}

export function clearQuizDraft(slug: string) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(getDraftKey(slug))
}
