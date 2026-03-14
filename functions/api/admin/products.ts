import { json } from "../../_lib/http"
import { listAdminProducts } from "../../_lib/repository"
import type { CloudflareEnv } from "../../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env }) => {
  const items = await listAdminProducts(env)

  return json({
    items,
    authMode: "stub",
    source: env.API_STUB_MODE,
  })
}
