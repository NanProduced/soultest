import { errorResponse, getAccessToken, json, readJson } from "../_lib/http"
import { getAccessSession, recordSubmission, SubmissionValidationError } from "../_lib/repository"
import type { CloudflareEnv, SubmissionInput } from "../_lib/types"

export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ env, request }) => {
  const accessToken = getAccessToken(request)

  if (!accessToken) {
    return errorResponse(401, "missing_access_token", "提交答题前请先完成验证码校验")
  }

  const session = await getAccessSession(accessToken, env)

  if (!session) {
    return errorResponse(401, "invalid_access_token", "访问凭证不存在或已过期")
  }

  const payload = await readJson<SubmissionInput>(request)

  if (!payload.slug) {
    return errorResponse(400, "missing_slug", "提交时必须包含题集 slug")
  }

  if (!session.allowedQuizzes.some((quiz) => quiz.slug === payload.slug)) {
    return errorResponse(403, "quiz_not_allowed", "当前访问凭证不包含该题集权限")
  }

  try {
    const submission = await recordSubmission(payload, session, env)

    return json({
      submissionId: submission.submissionId,
      resultKey: submission.resultKey,
      resultTitle: submission.resultTitle,
      resultSummary: submission.resultSummary,
      scoreBreakdown: submission.scoreBreakdown,
      storedInD1: submission.storedInD1,
      redirectTo: `/${payload.slug}/result/${submission.submissionId}`,
      source: env.API_STUB_MODE,
    })
  } catch (error) {
    if (error instanceof SubmissionValidationError) {
      return errorResponse(400, "invalid_submission_answers", error.message, error.details)
    }

    throw error
  }
}


