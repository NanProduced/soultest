import { errorResponse, getAccessToken, json } from "../../../_lib/http"
import { getAccessSession, getRuntimeConfig } from "../../../_lib/repository"
import type { CloudflareEnv } from "../../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env, params, request }) => {
  const rawSlug = params.slug
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug

  if (!slug) {
    return errorResponse(400, "missing_slug", "缺少题集 slug")
  }

  const accessToken = getAccessToken(request)

  if (!accessToken) {
    return errorResponse(401, "missing_access_token", "请先调用 /api/access/verify 获取访问凭证")
  }

  const session = await getAccessSession(accessToken, env)

  if (!session) {
    return errorResponse(401, "invalid_access_token", "访问凭证不存在或已过期")
  }

  const allowed = session.allowedQuizzes.some((quiz) => quiz.slug === slug)

  if (!allowed) {
    return errorResponse(403, "quiz_not_allowed", "当前访问凭证不包含该题集权限")
  }

  const runtime = await getRuntimeConfig(slug, env)

  if (!runtime) {
    return errorResponse(404, "runtime_not_found", "当前题集尚未生成运行时配置")
  }

  return json({
    runtime,
    access: {
      product: session.product,
      expiresAt: session.expiresAt,
      code: session.code,
    },
    source: env.API_STUB_MODE,
  })
}
