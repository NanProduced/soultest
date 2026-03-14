import { json } from "../../_lib/http"
import { listPublicQuizzes } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env }) => {
  const items = await listPublicQuizzes(env)

  return json({
    items,
    source: env.API_STUB_MODE,
  })
}
