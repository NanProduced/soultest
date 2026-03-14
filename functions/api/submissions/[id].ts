import { errorResponse, json } from "../../_lib/http"
import { getSubmissionDetail } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env, params }) => {
  const rawId = params.id
  const submissionId = Array.isArray(rawId) ? rawId[0] : rawId

  if (!submissionId) {
    return errorResponse(400, "missing_submission_id", "缺少提交记录 ID")
  }

  const detail = await getSubmissionDetail(submissionId, env)

  if (!detail) {
    return errorResponse(404, "submission_not_found", "未找到对应结果记录")
  }

  return json(detail)
}
