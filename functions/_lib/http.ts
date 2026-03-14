const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
} as const

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, {
    headers: {
      ...JSON_HEADERS,
      ...(init?.headers ?? {}),
    },
    status: init?.status,
    statusText: init?.statusText,
  })
}

export function errorResponse(status: number, code: string, message: string, details?: unknown) {
  return json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  )
}

export async function readJson<T>(request: Request) {
  return (await request.json()) as T
}

export function getAccessToken(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim()
  }

  const url = new URL(request.url)
  return url.searchParams.get("accessToken") ?? undefined
}
