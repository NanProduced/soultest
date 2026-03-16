import { getAdminSession } from "../../_lib/admin-auth"
import { errorResponse, json, readJson } from "../../_lib/http"
import { listAdminCodeBatches, updateAdminCodeBatchPolicy } from "../../_lib/repository"
import type { AccessPolicy, CloudflareEnv } from "../../_lib/types"

interface UpdateCodeBatchPolicyPayload {
  batchId?: string
  policy?: AccessPolicy
}

class PolicyValidationError extends Error {
  code: string
  status: number

  constructor(code: string, message: string, status = 400) {
    super(message)
    this.name = "PolicyValidationError"
    this.code = code
    this.status = status
  }
}

function normalizePolicyInput(input: AccessPolicy | undefined, availableQuizSlugs: string[]): AccessPolicy {
  const verificationMode = input?.verificationMode
  const scopeMode = input?.scopeMode
  const rawAllowQuizSlugs = Array.isArray(input?.allowQuizSlugs) ? input.allowQuizSlugs : []
  const allowQuizSlugs = Array.from(
    new Set(
      rawAllowQuizSlugs
        .map((slug) => slug.trim())
        .filter((slug) => slug.length > 0 && availableQuizSlugs.includes(slug)),
    ),
  )

  if (!verificationMode || !["shared_code", "unique_code", "none"].includes(verificationMode)) {
    throw new PolicyValidationError("INVALID_VERIFICATION_MODE", "请选择有效的验证码验证方式")
  }

  if (!scopeMode || !["product", "custom_scope"].includes(scopeMode)) {
    throw new PolicyValidationError("INVALID_SCOPE_MODE", "请选择有效的生效范围")
  }

  if (scopeMode === "custom_scope" && allowQuizSlugs.length === 0) {
    throw new PolicyValidationError("MISSING_SCOPE_QUIZZES", "指定题集模式下，至少需要选择一个可访问题集")
  }

  const tokenTtlDays = input?.tokenTtlDays

  if (tokenTtlDays !== undefined && tokenTtlDays !== null) {
    if (!Number.isInteger(tokenTtlDays) || tokenTtlDays < 1 || tokenTtlDays > 365) {
      throw new PolicyValidationError("INVALID_TOKEN_TTL", "会话有效期必须是 1 到 365 之间的整数天数")
    }
  }

  if (input?.notes && input.notes.trim().length > 300) {
    throw new PolicyValidationError("NOTES_TOO_LONG", "策略备注请控制在 300 个字符以内")
  }

  return {
    scopeMode,
    allowQuizSlugs: scopeMode === "custom_scope" ? allowQuizSlugs : undefined,
    verificationMode,
    tokenTtlDays: tokenTtlDays ?? undefined,
    introVisible: input?.introVisible ?? true,
    notes: input?.notes?.trim() ?? "",
  }
}

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  const session = await getAdminSession(request, env)

  if (!session) {
    return errorResponse(401, "ADMIN_UNAUTHORIZED", "请先登录管理后台")
  }

  const items = await listAdminCodeBatches(env)

  return json({
    items,
    authMode: "session",
    admin: {
      username: session.username,
    },
    source: env.API_STUB_MODE,
  })
}

export const onRequestPatch: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  const session = await getAdminSession(request, env)

  if (!session) {
    return errorResponse(401, "ADMIN_UNAUTHORIZED", "请先登录管理后台")
  }

  if (env.API_STUB_MODE === "mock") {
    return errorResponse(501, "ADMIN_STRATEGY_READ_ONLY", "当前环境只支持浏览，不支持保存验证码策略")
  }

  let payload: UpdateCodeBatchPolicyPayload

  try {
    payload = await readJson<UpdateCodeBatchPolicyPayload>(request)
  } catch {
    return errorResponse(400, "INVALID_JSON", "策略保存请求格式不正确")
  }

  const batchId = payload.batchId?.trim() ?? ""

  if (!batchId) {
    return errorResponse(400, "MISSING_BATCH_ID", "请选择需要更新的验证码批次")
  }

  const currentItems = await listAdminCodeBatches(env)
  const currentItem = currentItems.find((item) => item.id === batchId)

  if (!currentItem) {
    return errorResponse(404, "BATCH_NOT_FOUND", "未找到对应的验证码批次")
  }

  try {
    const nextPolicy = normalizePolicyInput(
      payload.policy,
      currentItem.linkedQuizzes.map((quiz) => quiz.slug),
    )

    await updateAdminCodeBatchPolicy(batchId, nextPolicy, env)

    const nextItems = await listAdminCodeBatches(env)
    const nextItem = nextItems.find((item) => item.id === batchId)

    if (!nextItem) {
      return errorResponse(500, "BATCH_REFRESH_FAILED", "策略已保存，但刷新最新批次信息失败")
    }

    return json({
      item: nextItem,
      authMode: "session",
      admin: {
        username: session.username,
      },
      source: env.API_STUB_MODE,
    })
  } catch (error) {
    if (error instanceof PolicyValidationError) {
      return errorResponse(error.status, error.code, error.message)
    }

    return errorResponse(500, "BATCH_POLICY_UPDATE_FAILED", "验证码策略保存失败，请稍后重试")
  }
}
