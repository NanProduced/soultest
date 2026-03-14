import { errorResponse, json, readJson } from "../../_lib/http"
import { issueAccessSession, lookupAccessGrant } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

interface VerifyPayload {
  code?: string
}

export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ env, request }) => {
  const payload = await readJson<VerifyPayload>(request)
  const code = payload.code?.trim()

  if (!code) {
    return errorResponse(400, "missing_code", "请输入验证码")
  }

  const grant = await lookupAccessGrant(code, env)

  if (!grant) {
    return errorResponse(404, "code_not_found", "验证码不存在、已失效或当前批次不可用")
  }

  if (grant.allowedQuizzes.length === 0) {
    return errorResponse(403, "empty_scope", "当前验证码未绑定可访问题集")
  }

  const session = await issueAccessSession(grant, env)

  return json({
    accessToken: session.token,
    expiresAt: session.expiresAt,
    product: session.product,
    allowedQuizzes: session.allowedQuizzes,
    code: grant.code,
    source: env.API_STUB_MODE,
  })
}
