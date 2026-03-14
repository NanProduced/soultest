import { json } from "../_lib/http"
import type { CloudflareEnv } from "../_lib/types"

export const onRequestGet: PagesFunction<CloudflareEnv> = async ({ env }) => {
  let d1Ready = false

  try {
    const result = await env.SOULTEST_DB.prepare("SELECT 1 AS value").first<{ value: number }>()
    d1Ready = result?.value === 1
  } catch {
    d1Ready = false
  }

  return json({
    ok: true,
    appEnv: env.APP_ENV,
    apiStubMode: env.API_STUB_MODE,
    storage: {
      d1: d1Ready,
      kv: Boolean(env.SOULTEST_CACHE),
      r2: Boolean(env.SOULTEST_ASSETS),
    },
    demoCodes: ["ST-DEMO-ALPHA", "ST-PACK-618", "ST-PROMO-OPEN"],
    endpoints: [
      "/api/quizzes/public",
      "/api/quizzes/:slug/intro",
      "/api/access/verify",
      "/api/quizzes/:slug/runtime",
      "/api/submissions",
      "/api/admin/overview",
    ],
  })
}
