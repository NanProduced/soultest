import { json } from "../../_lib/http"
import { getAdminOverview } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env }) => {
  const overview = await getAdminOverview(env)

  return json({
    overview,
    authMode: "stub",
    source: env.API_STUB_MODE,
  })
}
