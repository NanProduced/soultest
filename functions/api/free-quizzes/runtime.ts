import { errorResponse, json } from "../../_lib/http"
import { getPrimaryQuizIntro, getPrimaryRuntimeConfig } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env, request }) => {
  const url = new URL(request.url)
  const slug = url.searchParams.get("slug")?.trim()

  if (!slug) {
    return errorResponse(400, "missing_slug", "缺少题集 slug")
  }

  const intro = await getPrimaryQuizIntro(slug, env)

  if (!intro) {
    return errorResponse(404, "quiz_not_found", "未找到对应题集")
  }

  if (intro.accessType !== "free") {
    return errorResponse(403, "free_runtime_only", "当前接口仅支持免费题运行时")
  }

  const runtime = await getPrimaryRuntimeConfig(slug, env)

  if (!runtime?.extensions?.freeRuntime) {
    return errorResponse(404, "runtime_not_found", "当前题集尚未生成免费题运行时配置")
  }

  return json({
    runtime,
    source: env.API_STUB_MODE === "mock" ? "mock" : "d1",
  })
}
