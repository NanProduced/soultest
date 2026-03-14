import { json } from "../../_lib/http"
import { listAdminCodeBatches } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env }) => {
  const items = await listAdminCodeBatches(env)

  return json({
    items,
    authMode: "stub",
    source: env.API_STUB_MODE,
  })
}
