import { getAdminSession } from "../../_lib/admin-auth"
import { errorResponse, json } from "../../_lib/http"
import { listAdminQuizzes } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  const session = await getAdminSession(request, env)

  if (!session) {
    return errorResponse(401, "ADMIN_UNAUTHORIZED", "请先登录管理后台")
  }

  const items = await listAdminQuizzes(env)

  return json({
    items,
    authMode: "session",
    admin: {
      username: session.username,
    },
    source: env.API_STUB_MODE,
  })
}
