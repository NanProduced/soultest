import { errorResponse, json } from "../../../_lib/http"
import { getQuizIntro } from "../../../_lib/repository"
import type { CloudflareEnv } from "../../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env, params }) => {
  const rawSlug = params.slug
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug

  if (!slug) {
    return errorResponse(400, "missing_slug", "缺少题集 slug")
  }

  const item = await getQuizIntro(slug, env)

  if (!item) {
    return errorResponse(404, "quiz_not_found", "未找到对应题集")
  }

  return json({
    item,
    source: env.API_STUB_MODE,
  })
}
