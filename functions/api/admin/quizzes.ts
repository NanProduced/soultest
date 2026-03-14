import { json } from "../../_lib/http"
import { listAdminQuizzes } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env }) => {
  const items = await listAdminQuizzes(env)

  return json({
    items,
    authMode: "stub",
    source: env.API_STUB_MODE,
  })
}
