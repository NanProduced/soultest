import {
  authenticateAdmin,
  clearFailedAdminLoginAttempts,
  destroyAdminSession,
  getAdminLoginRateLimitState,
  getAdminSession,
  getAdminSessionClearCookieHeader,
  getAdminSessionCookieHeader,
  isAdminAccessKeyConfigured,
  issueAdminSession,
  recordFailedAdminLoginAttempt,
} from "../../_lib/admin-auth"
import { errorResponse, json, readJson } from "../../_lib/http"
import type { CloudflareEnv } from "../../_lib/types"

interface AdminLoginPayload {
  username?: string
  password?: string
  accessKey?: string
}

function createLockMessage(remainingSeconds: number) {
  const minutes = Math.max(1, Math.ceil(remainingSeconds / 60))
  return `尝试次数过多，请在 ${minutes} 分钟后重试`
}

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  const session = await getAdminSession(request, env)

  if (!session) {
    return errorResponse(401, "ADMIN_UNAUTHORIZED", "请先完成后台身份校验")
  }

  return json({
    session: {
      username: session.username,
      issuedAt: session.issuedAt,
      expiresAt: session.expiresAt,
    },
    authMode: "password_access_key",
    source: env.API_STUB_MODE,
  })
}

export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  if (!isAdminAccessKeyConfigured(env)) {
    return errorResponse(503, "ADMIN_AUTH_MISCONFIGURED", "管理后台未配置访问密钥，已禁止公网登录")
  }

  const rateLimitState = await getAdminLoginRateLimitState(request, env)

  if (rateLimitState.locked) {
    return errorResponse(429, "ADMIN_LOGIN_LOCKED", createLockMessage(rateLimitState.remainingSeconds), {
      remainingSeconds: rateLimitState.remainingSeconds,
    })
  }

  let payload: AdminLoginPayload

  try {
    payload = await readJson<AdminLoginPayload>(request)
  } catch {
    return errorResponse(400, "INVALID_JSON", "登录请求格式不正确")
  }

  const username = payload.username?.trim() ?? ""
  const password = payload.password ?? ""
  const accessKey = payload.accessKey?.trim() ?? ""

  if (!username || !password || !accessKey) {
    return errorResponse(400, "MISSING_CREDENTIALS", "请输入管理员账号、密码和访问密钥")
  }

  const admin = await authenticateAdmin(username, password, accessKey, env)

  if (!admin) {
    const nextRateLimitState = await recordFailedAdminLoginAttempt(request, env)

    if (nextRateLimitState.locked) {
      return errorResponse(429, "ADMIN_LOGIN_LOCKED", createLockMessage(nextRateLimitState.remainingSeconds), {
        remainingSeconds: nextRateLimitState.remainingSeconds,
      })
    }

    return errorResponse(401, "ADMIN_AUTH_FAILED", "管理员账号、密码或访问密钥不正确")
  }

  await clearFailedAdminLoginAttempts(request, env)

  const session = await issueAdminSession(admin, env)

  return json(
    {
      session: {
        username: session.username,
        issuedAt: session.issuedAt,
        expiresAt: session.expiresAt,
      },
      authMode: "password_access_key",
      source: env.API_STUB_MODE,
    },
    {
      headers: {
        "set-cookie": getAdminSessionCookieHeader(session.token, session.expiresAt, request),
      },
    },
  )
}

export const onRequestDelete: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  await destroyAdminSession(request, env)

  return json(
    { ok: true },
    {
      headers: {
        "set-cookie": getAdminSessionClearCookieHeader(request),
      },
    },
  )
}