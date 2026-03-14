import type {
  AdminCodeBatch,
  AdminOverview,
  AdminProduct,
  QuizCatalogItem,
  QuizIntro,
  QuizRuntimeResponse,
  SubmissionDetailResponse,
  SubmitQuizResponse,
  VerifyAccessResponse,
} from "@/features/quizzes/types"

interface ApiErrorPayload {
  error?: {
    code?: string
    message?: string
  }
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

async function requestJson<T>(input: string, init?: RequestInit) {
  const headers = new Headers(init?.headers ?? undefined)

  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json")
  }

  const response = await fetch(input, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload
    throw new ApiError(
      response.status,
      payload.error?.message ?? "请求失败，请稍后重试",
      payload.error?.code,
    )
  }

  return (await response.json()) as T
}

export async function fetchPublicQuizzes() {
  const response = await requestJson<{ items: QuizCatalogItem[]; source: string }>("/api/quizzes/public", {
    method: "GET",
  })

  return response.items
}

export async function fetchQuizIntro(slug: string) {
  const response = await requestJson<{ item: QuizIntro; source: string }>(`/api/quizzes/${slug}/intro`, {
    method: "GET",
  })

  return response.item
}

export function verifyAccessCode(code: string) {
  return requestJson<VerifyAccessResponse>("/api/access/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
  })
}

export function fetchQuizRuntime(slug: string, accessToken: string) {
  return requestJson<QuizRuntimeResponse>(`/api/quizzes/${slug}/runtime`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })
}

export function submitQuizAnswers(
  slug: string,
  answers: Record<string, string>,
  accessToken: string,
  durationSec?: number,
) {
  return requestJson<SubmitQuizResponse>("/api/submissions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      slug,
      answers,
      durationSec,
      clientInfo: {
        userAgent: navigator.userAgent,
      },
    }),
  })
}

export function fetchSubmissionDetail(submissionId: string) {
  return requestJson<SubmissionDetailResponse>(`/api/submissions/${submissionId}`, {
    method: "GET",
  })
}

export async function fetchAdminOverview() {
  const response = await requestJson<{ overview: AdminOverview; source: string }>("/api/admin/overview", {
    method: "GET",
  })

  return response.overview
}

export async function fetchAdminQuizzes() {
  const response = await requestJson<{ items: QuizCatalogItem[]; source: string }>("/api/admin/quizzes", {
    method: "GET",
  })

  return response.items
}

export async function fetchAdminProducts() {
  const response = await requestJson<{ items: AdminProduct[]; source: string }>("/api/admin/products", {
    method: "GET",
  })

  return response.items
}

export async function fetchAdminCodeBatches() {
  const response = await requestJson<{ items: AdminCodeBatch[]; source: string }>("/api/admin/code-batches", {
    method: "GET",
  })

  return response.items
}
