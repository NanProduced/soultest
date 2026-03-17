import { AlertTriangle, BarChart3, Package, ShieldCheck, SquareLibrary, Ticket } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { ComponentType } from "react"
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
import { formatAdminDate, isExpiringWithin } from "@/features/admin/display"
import { fetchAdminCodeBatches, fetchAdminOverview, fetchAdminProducts, fetchAdminQuizzes } from "@/features/quizzes/api"
import type { AdminCodeBatch, AdminOverview, AdminProduct, AdminQuizItem } from "@/features/quizzes/types"

function QuickLinkItem({ description, icon, title, to }: { description: string; icon: ComponentType<{ className?: string }>; title: string; to: string }) {
  const Icon = icon
  return (
    <Link className="rounded-[2rem] border border-border/40 bg-background p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5" to={to}>
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
        <div>
          <div className="font-black text-foreground">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
    </Link>
  )
}

function getBatchStatusVariant(status: string) {
  if (status === "active") return "success" as const
  if (status === "paused") return "warning" as const
  if (status === "revoked") return "danger" as const
  return "neutral" as const
}

export function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview>()
  const [quizzes, setQuizzes] = useState<AdminQuizItem[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [batches, setBatches] = useState<AdminCodeBatch[]>([])
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

        if (!active) return

        setOverview(overviewData)
        setQuizzes(quizData)
        setProducts(productData)
        setBatches(batchData)
        setErrorMessage(undefined)
      } catch (error) {
        if (!active) return
        setErrorMessage(error instanceof Error ? error.message : "管理台数据加载失败")
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  const paidQuizzes = useMemo(() => quizzes.filter((quiz) => quiz.accessType === "paid"), [quizzes])
  const activeBatches = useMemo(() => batches.filter((batch) => batch.status === "active"), [batches])
  const expiringSoonBatches = useMemo(() => batches.filter((batch) => isExpiringWithin(batch.expiresAt, 14)), [batches])
  const productsWithoutActiveBatch = useMemo(
    () => products.filter((product) => !activeBatches.some((batch) => batch.productId === product.id)),
    [activeBatches, products],
  )
  const pendingPaidQuizzes = useMemo(() => paidQuizzes.filter((quiz) => quiz.source !== "d1"), [paidQuizzes])

  const priorities = useMemo(
    () => [
      { title: "即将到期批次", value: expiringSoonBatches.length, tone: expiringSoonBatches.length > 0 ? "warning" : "success", description: "建议优先续期或切换到新批次。" },
      { title: "待建批次商品", value: productsWithoutActiveBatch.length, tone: productsWithoutActiveBatch.length > 0 ? "warning" : "success", description: "商品已存在，但还没有活跃批次承接发码。" },
      { title: "待接入付费题", value: pendingPaidQuizzes.length, tone: pendingPaidQuizzes.length > 0 ? "warning" : "success", description: "题页存在，但商品或批次还没接上。" },
    ],
    [expiringSoonBatches.length, pendingPaidQuizzes.length, productsWithoutActiveBatch.length],
  )

  return (
    <AdminPage>
      <AdminPageHeader
        actions={<div className="flex flex-wrap gap-2"><Button asChild className="rounded-full" size="lg"><Link to={buildAdminPortalPath("batches")}>批次工作台</Link></Button><Button asChild className="rounded-full" size="lg" variant="outline"><Link to={buildAdminPortalPath("analytics")}>数据分析</Link></Button></div>}
        badge="Operations"
        description="总览页只保留当前状态、待处理事项和工作入口；趋势与图表已拆到单独分析页。"
        title="运营总览"
      />

      {errorMessage ? <AdminNotice description={errorMessage} variant="danger" /> : null}

      <AdminMetricGrid>
        <AdminStatCard helper="后台可见题集总数" label="资源题集" value={loading ? "-" : overview?.quizzes ?? quizzes.length} />
        <AdminStatCard helper="后台可管商品数" label="商品" value={loading ? "-" : overview?.products ?? products.length} />
        <AdminStatCard helper="当前批次总数" label="批次" value={loading ? "-" : overview?.codeBatches ?? batches.length} />
        <AdminStatCard helper="提交总量" label="总提交" tone="info" value={loading ? "-" : overview?.submissions?.toLocaleString() ?? 0} />
      </AdminMetricGrid>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminPanel className="space-y-5">
          <AdminSectionTitle description="先处理会影响发码与访问有效性的事项。" title="当前待处理" />
          <div className="grid gap-4 md:grid-cols-3">
            {priorities.map((item) => (
              <div className="rounded-2xl border border-border/40 bg-background p-5" key={item.title}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-foreground">{item.title}</div>
                  <AdminBadge variant={item.tone === "warning" ? "warning" : "success"}>{item.value}</AdminBadge>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{item.description}</div>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel className="space-y-5">
          <AdminSectionTitle description="核心页面直接进入，不在总览重复堆内容。" title="快捷入口" />
          <div className="grid gap-3">
            <QuickLinkItem description="管理免费与付费题集。" icon={SquareLibrary} title="题集" to={buildAdminPortalPath("quizzes")} />
            <QuickLinkItem description="查看商品绑题与发码承接。" icon={Package} title="商品" to={buildAdminPortalPath("products")} />
            <QuickLinkItem description="创建、冻结、作废验证码批次。" icon={Ticket} title="批次" to={buildAdminPortalPath("batches")} />
            <QuickLinkItem description="看趋势、排行和分布图。" icon={BarChart3} title="分析" to={buildAdminPortalPath("analytics")} />
            <QuickLinkItem description="查看入口保护与会话状态。" icon={ShieldCheck} title="安全" to={buildAdminPortalPath("security")} />
          </div>
        </AdminPanel>
      </section>

      <AdminPanel className="space-y-5">
        <AdminSectionTitle description="只展示需要马上看的风险批次。" title="风险批次" />
        {expiringSoonBatches.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {expiringSoonBatches.slice(0, 4).map((batch) => (
              <div className="rounded-2xl border border-border/40 bg-background p-5" key={batch.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-foreground">{batch.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{batch.productName}</div>
                  </div>
                  <AdminBadge variant="warning">{formatAdminDate(batch.expiresAt)} 到期</AdminBadge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminBadge variant="neutral">{batch.codeCount} 个码</AdminBadge>
                  <AdminBadge variant={batch.status === "active" ? "success" : "warning"}>{batch.status}</AdminBadge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AdminEmptyState description="当前没有近 14 天到期的活跃批次。" title="风险稳定" />
        )}
      </AdminPanel>

      <AdminNotice
        description={loading ? "正在同步后台数据。" : `当前共有 ${products.length} 个商品、${batches.length} 个批次，分析图表请在数据分析页查看。`}
        icon={<AlertTriangle className="size-4" />}
        title="当前说明"
        variant="info"
      />
    </AdminPage>
  )
}
