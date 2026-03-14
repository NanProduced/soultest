import { BarChart3, Layers3, Package, ShieldCheck, Ticket } from "lucide-react"
import { useEffect, useState } from "react"

import {
  fetchAdminCodeBatches,
  fetchAdminOverview,
  fetchAdminProducts,
  fetchAdminQuizzes,
} from "@/features/quizzes/api"
import type { AdminCodeBatch, AdminOverview, AdminProduct, QuizCatalogItem } from "@/features/quizzes/types"

function MetricCard({ title, value, description }: { title: string; value: string | number; description: string }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-4 text-3xl font-semibold text-white">{value}</h3>
      <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>
    </article>
  )
}

export function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview>()
  const [quizzes, setQuizzes] = useState<QuizCatalogItem[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [codeBatches, setCodeBatches] = useState<AdminCodeBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [overviewData, quizData, productData, batchData] = await Promise.all([
          fetchAdminOverview(),
          fetchAdminQuizzes(),
          fetchAdminProducts(),
          fetchAdminCodeBatches(),
        ])

        if (!active) {
          return
        }

        setOverview(overviewData)
        setQuizzes(quizData)
        setProducts(productData)
        setCodeBatches(batchData)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "管理台数据加载失败")
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[32px] border border-white/10 bg-white/5 p-7">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Admin</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">当前运营概览</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            这一页只保留当前 MVP 所需的信息：题集、产品、验证码批次与基础概览。
          </p>
        </article>

        <article className="rounded-[32px] border border-white/10 bg-white/5 p-7">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <ShieldCheck className="size-4 text-violet-300" />
            当前策略
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <p>首套测试采用「通用答题引擎 + OEJTS 评分插件 + 专用结果模板」的混合策略。</p>
            <p>验证码当前为单题集通用口令模式，后续可无痛切到一单一码。</p>
          </div>
        </article>
      </section>

      {errorMessage ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{errorMessage}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard description="已接入前台题集数量" title="题集" value={loading ? "-" : overview?.quizzes ?? 0} />
        <MetricCard description="当前可售卖的产品数量" title="产品" value={loading ? "-" : overview?.products ?? 0} />
        <MetricCard description="验证码批次数量" title="批次" value={loading ? "-" : overview?.codeBatches ?? 0} />
        <MetricCard description="当前仍可使用的口令数" title="有效口令" value={loading ? "-" : overview?.activeCodes ?? 0} />
        <MetricCard description="累计提交记录" title="提交数" value={loading ? "-" : overview?.submissions ?? 0} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-[30px] border border-white/10 bg-white/5 p-6 xl:col-span-1">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Layers3 className="size-4 text-violet-300" />
            题集
          </div>
          <div className="mt-5 space-y-3">
            {quizzes.map((quiz) => (
              <div className="rounded-[22px] border border-white/10 bg-slate-900/60 px-4 py-4" key={quiz.id}>
                <p className="text-sm font-medium text-white">{quiz.title}</p>
                <p className="mt-2 text-xs leading-6 text-slate-400">{quiz.questionCount} 题 · {quiz.durationMinutes} 分钟</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/5 p-6 xl:col-span-1">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Package className="size-4 text-violet-300" />
            产品
          </div>
          <div className="mt-5 space-y-3">
            {products.map((product) => (
              <div className="rounded-[22px] border border-white/10 bg-slate-900/60 px-4 py-4" key={product.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-white">{product.name}</p>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                    {product.status}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">{product.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/5 p-6 xl:col-span-1">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Ticket className="size-4 text-violet-300" />
            验证码批次
          </div>
          <div className="mt-5 space-y-3">
            {codeBatches.map((batch) => (
              <div className="rounded-[22px] border border-white/10 bg-slate-900/60 px-4 py-4" key={batch.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-white">{batch.name}</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                    {batch.strategyType}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">{batch.productName}</p>
                <p className="mt-1 text-xs leading-6 text-slate-400">{batch.codeCount} 个口令 · 到期 {batch.expiresAt ? new Date(batch.expiresAt).toLocaleDateString("zh-CN") : "无"}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <BarChart3 className="size-4 text-violet-300" />
          本地状态
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          最后一次载入时间：{overview?.lastSeedAt ? new Date(overview.lastSeedAt).toLocaleString("zh-CN") : "-"}
        </p>
      </section>
    </div>
  )
}
