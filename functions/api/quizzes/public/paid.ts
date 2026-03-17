import { json } from "../../../_lib/http"
import { listPublicQuizzes } from "../../../_lib/repository"
import type { CloudflareEnv } from "../../../_lib/types"

function parseLimit(request: Request) {
  const value = Number.parseInt(new URL(request.url).searchParams.get("limit") ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : undefined
}

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env, request }) => {
  const limit = parseLimit(request)
  const items = await listPublicQuizzes(env, "paid")

  return json({
    items: limit ? items.slice(0, limit) : items,
    source: env.API_STUB_MODE === "mock" ? "mock" : "catalog",
  })
}
