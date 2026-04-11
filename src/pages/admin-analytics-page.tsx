import { BarChart3, LineChart, Package, Ticket } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"

import {
  AdminBadge,
  AdminEmptyState,
  AdminMetricGrid,
  AdminNotice,
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionTitle,
  AdminStatCard,
} from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import { buildAdminPortalPath } from "@/features/admin/constants"
import { fetchAdminCodeBatches, fetchAdminOverview, fetchAdminProducts } from "@/features/quizzes/api"
import type { AdminCodeBatch, AdminOverview, AdminProduct } from "@/features/quizzes/types"

function TrendChart({ data }: { data: AdminOverview["analytics"]["recentDailySubmissions"] }) {
  if (data.length === 0) {
    return <AdminEmptyState description="提交数据累积后会自动生成趋势图。" title="暂无趋势数据" />
  }

  const maxValue = Math.max(...data.map((item) => item.submissions), 1)
  const width = 520
  const height = 180
  const step = data.length === 1 ? width : width / (data.length - 1)
  const points = data
    .map((item, index) => {
      const x = index * step
      const y = height - (item.submissions / maxValue) * (height - 24) - 12
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <svg className="min-w-[520px]" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
          <polyline fill="none" points={points} stroke="currentColor" strokeWidth="3" className="text-primary" />
          {data.map((item, index) => {
            const x = index * step
            const y = height - (item.submissions / maxValue) * (height - 24) - 12
            return <circle className="fill-primary" cx={x} cy={y} key={item.date} r="4" />
          })}
        </svg>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {data.map((item) => (
          <div key={item.date}>
            <div>{item.date.slice(5)}</div>
            <div className="mt-1 font-medium text-foreground">{item.submissions}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DistributionChart({ items }: { items: Array<{ label: string; value: number; tone: string }> }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div className="space-y-2" key={item.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">{item.label}</span>
            <span className="font-medium text-foreground">{item.value}</span>
          </div>
          <div className="h-3 rounded-full bg-muted/40">
            <div
              className={item.tone}
              style={{ width: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 6 : 0)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<AdminOverview>()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [batches, setBatches] = useState<AdminCodeBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [overviewData, productData, batchData] = await Promise.all([
          fetchAdminOverview(),
          fetchAdminProducts(),
          fetchAdminCodeBatches(),
        ])

        if (!active) return

        setOverview(overviewData)
        setProducts(productData)
        setBatches(batchData)
        setErrorMessage(undefined)
      } catch (error) {
        if (!active) return
        setErrorMessage(error instanceof Error ? error.message : "分析面板加载失败")
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  const analytics = overview?.analytics
  const productsWithoutActiveBatch = useMemo(
    () => products.filter((product) => !batches.some((batch) => batch.productId === product.id && batch.status === "active")),
    [batches, products],
  )

  const statusDistribution = useMemo(
    () => [
      { label: "生效中", value: batches.filter((batch) => batch.status === "active").length, tone: "rounded-full bg-success" },
      { label: "已冻结", value: batches.filter((batch) => batch.status === "paused").length, tone: "rounded-full bg-warning" },
      { label: "已作废", value: batches.filter((batch) => batch.status === "revoked").length, tone: "rounded-full bg-destructive" },
      { label: "草稿/其他", value: batches.filter((batch) => !["active", "paused", "revoked"].includes(batch.status)).length, tone: "rounded-full bg-muted-foreground" },
    ],
    [batches],
  )

  const verificationDistribution = useMemo(
    () => [
      { label: "通用口令", value: batches.filter((batch) => (batch.policy.verificationMode ?? "shared_code") === "shared_code").length, tone: "rounded-full bg-primary" },
      { label: "一单一码", value: batches.filter((batch) => batch.policy.verificationMode === "unique_code").length, tone: "rounded-full bg-info" },    ],
    [batches],
  )

  return (
    <AdminPage>
      <AdminPageHeader
        actions={<div className="flex flex-wrap gap-2"><Button asChild className="rounded-full" size="lg" variant="outline"><Link to={buildAdminPortalPath()}>返回总览</Link></Button><Button asChild className="rounded-full" size="lg"><Link to={buildAdminPortalPath("batches")}>去批次工作台</Link></Button></div>}
        badge="Analytics"
        description="单独查看趋势、分布和发码健康度，不把分析内容堆回总览页。"
        title="数据分析"
      />

      {errorMessage ? <AdminNotice description={errorMessage} variant="danger" /> : null}

      <AdminMetricGrid columns={4}>
        <AdminStatCard helper="最近 24 小时新增提交" label="24h 提交" value={loading ? "-" : (analytics?.submissions24h ?? 0).toLocaleString()} />
        <AdminStatCard helper="最近 7 天累计提交" label="7d 提交" tone="info" value={loading ? "-" : (analytics?.submissions7d ?? 0).toLocaleString()} />
        <AdminStatCard helper="最近 30 天累计提交" label="30d 提交" value={loading ? "-" : (analytics?.submissions30d ?? 0).toLocaleString()} />
        <AdminStatCard helper="结果进入分享链路的占比" label="分享率" tone="success" value={loading ? "-" : `${analytics?.shareRate ?? 0}%`} />
      </AdminMetricGrid>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminPanel className="space-y-5">
          <AdminSectionTitle description="基于 D1 submissions 的最近 7 天提交走势。" title="提交趋势" />
          <TrendChart data={analytics?.recentDailySubmissions ?? []} />
        </AdminPanel>

        <AdminPanel className="space-y-5">
          <AdminSectionTitle description="先看当前发码状态是否健康。" title="批次状态分布" />
          <DistributionChart items={statusDistribution} />
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminPanel className="space-y-5">
          <AdminSectionTitle description="看当前平台主要采用哪种发码方式。" title="验证方式分布" />
          <DistributionChart items={verificationDistribution} />
        </AdminPanel>

        <AdminPanel className="space-y-5">
          <AdminSectionTitle description="优先补齐这些商品的发码承接。" title="待补批次商品" />
          {productsWithoutActiveBatch.length > 0 ? (
            <div className="space-y-3">
              {productsWithoutActiveBatch.slice(0, 6).map((product) => (
                <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-background px-4 py-3" key={product.id}>
                  <div>
                    <div className="font-medium text-foreground">{product.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">绑定 {product.linkedQuizzes.length} 套题集</div>
                  </div>
                  <AdminBadge variant="warning">待建批次</AdminBadge>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState description="当前所有商品都有活跃批次承接。" title="发码健康" />
          )}
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminPanel className="space-y-5">
          <AdminSectionTitle description="当前提交量最高的题集。" title="热门题集" />
          {analytics?.topQuizzes && analytics.topQuizzes.length > 0 ? (
            <div className="space-y-3">
              {analytics.topQuizzes.map((quiz, index) => (
                <div className="flex items-center gap-4 rounded-2xl border border-border/40 bg-background px-4 py-3" key={quiz.quizId}>
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 font-black text-primary">#{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">{quiz.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">/{quiz.slug}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{quiz.submissions}</div>
                    <div className="text-xs text-muted-foreground">提交</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState description="当前还没有足够的提交记录。" title="暂无排行" />
          )}
        </AdminPanel>

        <AdminPanel className="space-y-5">
          <AdminSectionTitle description="分析面板只保留关键结论，不堆大量说明。" title="经营摘要" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/40 bg-background p-5">
              <div className="flex items-center gap-3 text-foreground"><LineChart className="size-4 text-info" />平均作答时长</div>
              <div className="mt-3 text-3xl font-black text-foreground">{loading ? "-" : analytics?.avgDurationSec ? `${analytics.avgDurationSec}s` : "暂无"}</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background p-5">
              <div className="flex items-center gap-3 text-foreground"><BarChart3 className="size-4 text-info" />分享次数</div>
              <div className="mt-3 text-3xl font-black text-foreground">{loading ? "-" : (analytics?.shareCount ?? 0).toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background p-5">
              <div className="flex items-center gap-3 text-foreground"><Ticket className="size-4 text-info" />批次总数</div>
              <div className="mt-3 text-3xl font-black text-foreground">{loading ? "-" : batches.length}</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background p-5">
              <div className="flex items-center gap-3 text-foreground"><Package className="size-4 text-info" />商品总数</div>
              <div className="mt-3 text-3xl font-black text-foreground">{loading ? "-" : products.length}</div>
            </div>
          </div>
        </AdminPanel>
      </section>
    </AdminPage>
  )
}
