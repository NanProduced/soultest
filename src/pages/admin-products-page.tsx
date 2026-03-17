import { Package, Search, Sparkles, Ticket } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"

import {
  AdminBadge,
  AdminDataTable,
  AdminDialog,
  AdminEmptyState,
  AdminFilterPill,
  AdminMetricGrid,
  AdminNotice,
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionTitle,
  AdminStatCard,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  AdminToolbar,
  adminInputClassName,
} from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import { buildAdminPortalPath } from "@/features/admin/constants"
import { formatAdminDate, isExpiringWithin, verificationModeLabels } from "@/features/admin/display"
import { fetchAdminCodeBatches, fetchAdminProducts } from "@/features/quizzes/api"
import type { AdminCodeBatch, AdminProduct } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

type ProductFilterMode = "all" | "active" | "needs_batch" | "bundle"

interface ProductWorkbenchItem extends AdminProduct {
  activeBatchCount: number
  expiringSoonCount: number
  primaryBatchId?: string
  relatedBatches: AdminCodeBatch[]
  totalBatchCount: number
  totalCodeCount: number
  verificationModes: string[]
}

const filterItems: Array<{ key: ProductFilterMode; label: string }> = [
  { key: "all", label: "全部商品" },
  { key: "active", label: "已在发码" },
  { key: "needs_batch", label: "待建批次" },
  { key: "bundle", label: "组合商品" },
]

const productStatusLabels: Record<string, string> = {
  active: "生效中",
  archived: "已下线",
  draft: "草稿",
  paused: "已暂停",
  published: "已发布",
}

const productTypeLabels: Record<string, string> = {
  bundle: "组合商品",
  promo: "推广商品",
  single_product: "单题商品",
}

function getProductStatusLabel(status: string) {
  return productStatusLabels[status] ?? status
}

function getProductStatusVariant(status: string) {
  if (status === "active" || status === "published") {
    return "success" as const
  }

  if (status === "draft") {
    return "neutral" as const
  }

  return "warning" as const
}

function getProductTypeLabel(productType: string) {
  return productTypeLabels[productType] ?? productType
}

function getVerificationVariant(mode: string) {
  if (mode === "none") {
    return "warning" as const
  }

  if (mode === "unique_code") {
    return "info" as const
  }

  return "neutral" as const
}

function buildBatchManagementPath(productId: string, batchId?: string) {
  const params = new URLSearchParams()
  params.set("productId", productId)

  if (batchId) {
    params.set("batchId", batchId)
  }

  return `${buildAdminPortalPath("batches")}?${params.toString()}`
}

function buildBatchCreatePath(productId: string) {
  const params = new URLSearchParams()
  params.set("productId", productId)
  params.set("create", "1")
  return `${buildAdminPortalPath("batches")}?${params.toString()}`
}

function createProductViewModel(product: AdminProduct, batches: AdminCodeBatch[]): ProductWorkbenchItem {
  const relatedBatches = batches
    .filter((batch) => batch.productId === product.id)
    .sort((left, right) => Number(right.status === "active") - Number(left.status === "active"))

  const activeBatchCount = relatedBatches.filter((batch) => batch.status === "active").length
  const expiringSoonCount = relatedBatches.filter((batch) => isExpiringWithin(batch.expiresAt, 14)).length
  const primaryBatchId = relatedBatches.find((batch) => batch.status === "active")?.id ?? relatedBatches[0]?.id

  return {
    ...product,
    activeBatchCount,
    expiringSoonCount,
    primaryBatchId,
    relatedBatches,
    totalBatchCount: relatedBatches.length,
    totalCodeCount: relatedBatches.reduce((total, batch) => total + batch.codeCount, 0),
    verificationModes: Array.from(new Set(relatedBatches.map((batch) => batch.policy.verificationMode ?? "shared_code"))),
  }
}

export function AdminProductsPage() {
  const [items, setItems] = useState<ProductWorkbenchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [filterMode, setFilterMode] = useState<ProductFilterMode>("all")
  const [searchValue, setSearchValue] = useState("")
  const [selectedProductId, setSelectedProductId] = useState<string>()
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [products, batches] = await Promise.all([fetchAdminProducts(), fetchAdminCodeBatches()])

        if (!active) {
          return
        }

        setItems(products.map((product) => createProductViewModel(product, batches)))
        setErrorMessage(undefined)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "商品数据加载失败")
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

  const filteredItems = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()

    return items.filter((item) => {
      if (filterMode === "active" && item.activeBatchCount === 0) {
        return false
      }

      if (filterMode === "needs_batch" && item.activeBatchCount > 0) {
        return false
      }

      if (filterMode === "bundle" && item.productType !== "bundle") {
        return false
      }

      if (!keyword) {
        return true
      }

      return [item.name, item.description, ...item.linkedQuizzes.map((quiz) => quiz.title)]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(keyword))
    })
  }, [filterMode, items, searchValue])

  const productsWithActiveBatch = useMemo(() => items.filter((item) => item.activeBatchCount > 0), [items])
  const productsWithoutActiveBatch = useMemo(() => items.filter((item) => item.activeBatchCount === 0), [items])
  const bundleProducts = useMemo(() => items.filter((item) => item.productType === "bundle"), [items])
  const totalCodes = useMemo(() => items.reduce((total, item) => total + item.totalCodeCount, 0), [items])

  const selectedProduct = useMemo(
    () => filteredItems.find((item) => item.id === selectedProductId) ?? items.find((item) => item.id === selectedProductId),
    [filteredItems, items, selectedProductId],
  )

  const primaryBatch = selectedProduct?.relatedBatches.find((batch) => batch.id === selectedProduct.primaryBatchId)

  return (
    <AdminPage>
      <AdminPageHeader
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full" size="lg" variant="outline">
              <Link to={buildAdminPortalPath("batches")}>批次工作台</Link>
            </Button>
          </div>
        }
        badge="Products"
        description="商品负责绑定题集，批次负责发码与生效。这里优先看清每个商品绑了什么、有没有在发码。"
        title="商品"
      />

      {errorMessage ? <AdminNotice description={errorMessage} variant="warning" /> : null}

      <AdminMetricGrid columns={4}>
        <AdminStatCard helper="后台可见商品总数" label="全部商品" value={loading ? "-" : items.length} />
        <AdminStatCard helper="当前至少有一个活跃批次的商品" label="已在发码" tone="success" value={loading ? "-" : productsWithActiveBatch.length} />
        <AdminStatCard helper="已绑定商品但还没有活跃批次" label="待建批次" tone="warning" value={loading ? "-" : productsWithoutActiveBatch.length} />
        <AdminStatCard helper="全部商品累计可用码量" label="总码量" tone="info" value={loading ? "-" : totalCodes.toLocaleString()} />
      </AdminMetricGrid>

      <AdminPanel className="space-y-5">
        <AdminSectionTitle
          description="把商品看成发码容器：先看绑题，再看批次是否承接。"
          title="商品目录"
        />

        <AdminToolbar className="gap-4">
          <label className="relative block w-full xl:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={cn(adminInputClassName, "pl-11")}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="搜索商品或题集"
              type="search"
              value={searchValue}
            />
          </label>

          <div className="space-y-3 xl:text-right">
            <div className="text-sm text-muted-foreground">
              当前结果 {filteredItems.length} / {items.length}
            </div>
            <div className="flex flex-wrap gap-2 xl:justify-end">
              {filterItems.map((item) => (
                <AdminFilterPill active={filterMode === item.key} key={item.key} onClick={() => setFilterMode(item.key)}>
                  {item.label}
                </AdminFilterPill>
              ))}
            </div>
          </div>
        </AdminToolbar>

        {loading ? (
          <div className="text-sm text-muted-foreground">正在加载商品...</div>
        ) : filteredItems.length > 0 ? (
          <AdminDataTable>
            <AdminTableHead>
              <tr>
                <AdminTableHeaderCell>商品</AdminTableHeaderCell>
                <AdminTableHeaderCell>绑定题集</AdminTableHeaderCell>
                <AdminTableHeaderCell>发码状态</AdminTableHeaderCell>
                <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
              </tr>
            </AdminTableHead>

            <AdminTableBody>
              {filteredItems.map((product) => {
                const isSelected = product.id === selectedProductId

                return (
                  <AdminTableRow
                    className={cn(isSelected ? "bg-info/5" : undefined)}
                    interactive
                    key={product.id}
                    onClick={() => {
                      setSelectedProductId(product.id)
                      setIsDetailOpen(true)
                    }}
                  >
                    <AdminTableCell className="min-w-[240px]">
                      <div className="space-y-2">
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <AdminBadge variant={getProductStatusVariant(product.status)}>{getProductStatusLabel(product.status)}</AdminBadge>
                          <AdminBadge variant="neutral">{getProductTypeLabel(product.productType)}</AdminBadge>
                        </div>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="min-w-[280px]">
                      <div className="space-y-2">
                        <div className="text-sm text-foreground">共 {product.linkedQuizzes.length} 套题集</div>
                        <div className="flex flex-wrap gap-2">
                          {product.linkedQuizzes.slice(0, 3).map((quiz) => (
                            <AdminBadge key={quiz.slug} variant="neutral">
                              {quiz.title}
                            </AdminBadge>
                          ))}
                          {product.linkedQuizzes.length > 3 ? <AdminBadge variant="neutral">+{product.linkedQuizzes.length - 3}</AdminBadge> : null}
                        </div>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="min-w-[240px]">
                      <div className="space-y-2 text-sm">
                        <div className="text-foreground">活跃批次 {product.activeBatchCount} / 全部 {product.totalBatchCount}</div>
                        <div className="text-muted-foreground">累计码量 {product.totalCodeCount.toLocaleString()}</div>
                        {product.expiringSoonCount > 0 ? <div className="text-warning">{product.expiringSoonCount} 个批次 14 天内到期</div> : null}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild className="rounded-full" size="sm" variant="outline">
                          <Link to={buildBatchCreatePath(product.id)} onClick={(event) => event.stopPropagation()}>
                            新建批次
                          </Link>
                        </Button>
                        <Button className="rounded-full" size="sm" variant="outline">
                          查看
                        </Button>
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                )
              })}
            </AdminTableBody>
          </AdminDataTable>
        ) : (
          <AdminEmptyState description="当前筛选条件下没有匹配商品。" title="暂无商品" />
        )}
      </AdminPanel>

      <AdminPanel className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/40 bg-background p-5">
          <div className="flex items-center gap-3 text-foreground">
            <Package className="size-4 text-info" />
            <span className="text-sm font-medium">商品 = 绑题对象</span>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">商品决定用户买到的是哪几套题，不直接决定码是否可用。</div>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background p-5">
          <div className="flex items-center gap-3 text-foreground">
            <Ticket className="size-4 text-info" />
            <span className="text-sm font-medium">批次 = 发码对象</span>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">验证码由批次生成，冻结/作废也在批次工作台执行。</div>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background p-5">
          <div className="flex items-center gap-3 text-foreground">
            <Sparkles className="size-4 text-info" />
            <span className="text-sm font-medium">组合商品可绑多题</span>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">`bundle` 商品天然支持多个测试题共用一组码。</div>
        </div>
      </AdminPanel>

      <AdminDialog isOpen={isDetailOpen} maxWidth="max-w-5xl" onClose={() => setIsDetailOpen(false)} title="商品详情">
        {selectedProduct ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="text-2xl font-black text-foreground">{selectedProduct.name}</div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge variant={getProductStatusVariant(selectedProduct.status)}>{getProductStatusLabel(selectedProduct.status)}</AdminBadge>
                  <AdminBadge variant="neutral">{getProductTypeLabel(selectedProduct.productType)}</AdminBadge>
                  <AdminBadge variant={selectedProduct.activeBatchCount > 0 ? "success" : "warning"}>
                    {selectedProduct.activeBatchCount > 0 ? "已在发码" : "待建批次"}
                  </AdminBadge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild className="rounded-full" variant="outline">
                  <Link to={buildBatchCreatePath(selectedProduct.id)}>新建批次</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link to={buildBatchManagementPath(selectedProduct.id, selectedProduct.primaryBatchId)}>进入批次工作台</Link>
                </Button>
              </div>
            </div>

            {selectedProduct.description ? <AdminNotice description={selectedProduct.description} variant="neutral" /> : null}

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-border/40 bg-background p-5">
                <div className="text-xs text-muted-foreground">绑定题集</div>
                <div className="mt-2 text-2xl font-black text-foreground">{selectedProduct.linkedQuizzes.length}</div>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background p-5">
                <div className="text-xs text-muted-foreground">活跃批次</div>
                <div className="mt-2 text-2xl font-black text-foreground">{selectedProduct.activeBatchCount}</div>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background p-5">
                <div className="text-xs text-muted-foreground">累计码量</div>
                <div className="mt-2 text-2xl font-black text-foreground">{selectedProduct.totalCodeCount.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background p-5">
                <div className="text-xs text-muted-foreground">到期风险</div>
                <div className="mt-2 text-2xl font-black text-foreground">{selectedProduct.expiringSoonCount}</div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <AdminPanel className="space-y-4">
                <AdminSectionTitle title="绑定题集" />
                {selectedProduct.linkedQuizzes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.linkedQuizzes.map((quiz) => (
                      <AdminBadge key={quiz.slug} variant="neutral">
                        {quiz.title}
                      </AdminBadge>
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState description="该商品尚未绑定题集。" title="空商品" />
                )}
              </AdminPanel>

              <AdminPanel className="space-y-4">
                <AdminSectionTitle title="发码方式" />
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.verificationModes.length > 0 ? (
                    selectedProduct.verificationModes.map((mode) => (
                      <AdminBadge key={mode} variant={getVerificationVariant(mode)}>
                        {verificationModeLabels[mode as keyof typeof verificationModeLabels] ?? mode}
                      </AdminBadge>
                    ))
                  ) : (
                    <AdminBadge variant="warning">暂无发码策略</AdminBadge>
                  )}
                </div>
              </AdminPanel>
            </div>

            <AdminPanel className="space-y-4">
              <AdminSectionTitle title="相关批次" />
              {selectedProduct.relatedBatches.length > 0 ? (
                <div className="space-y-3">
                  {selectedProduct.relatedBatches.map((batch) => (
                    <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-background p-4 lg:flex-row lg:items-center lg:justify-between" key={batch.id}>
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">{batch.name}</div>
                        <div className="text-xs text-muted-foreground">{batch.id}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <AdminBadge variant={batch.status === "active" ? "success" : batch.status === "paused" ? "warning" : "neutral"}>{batch.status}</AdminBadge>
                        <AdminBadge variant="neutral">{batch.codeCount} 个码</AdminBadge>
                        <AdminBadge variant="neutral">{formatAdminDate(batch.expiresAt)} 到期</AdminBadge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AdminEmptyState description="这个商品还没有任何批次，建议先创建批次再发码。" title="暂无批次" />
              )}
            </AdminPanel>

            {primaryBatch ? (
              <AdminPanel className="space-y-4">
                <AdminSectionTitle title="当前主批次" />
                <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                  <div className="space-y-3">
                    <div className="text-sm text-foreground">{primaryBatch.name}</div>
                    <div className="flex flex-wrap gap-2">
                      <AdminBadge variant={primaryBatch.status === "active" ? "success" : primaryBatch.status === "paused" ? "warning" : "neutral"}>{primaryBatch.status}</AdminBadge>
                      <AdminBadge variant={getVerificationVariant(primaryBatch.policy.verificationMode ?? "shared_code")}>
                        {verificationModeLabels[primaryBatch.policy.verificationMode ?? "shared_code"]}
                      </AdminBadge>
                    </div>
                    {primaryBatch.sampleCodes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {primaryBatch.sampleCodes.map((item) => (
                          <AdminBadge className="font-mono text-[11px]" key={item.code} variant="neutral">
                            {item.code}
                          </AdminBadge>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-border/40 bg-background p-4 text-sm text-muted-foreground">
                    <div>到期：{formatAdminDate(primaryBatch.expiresAt)}</div>
                    <div className="mt-2">码量：{primaryBatch.codeCount}</div>
                  </div>
                </div>
              </AdminPanel>
            ) : null}
          </div>
        ) : (
          <div className="py-12">
            <AdminEmptyState description="请选择一个商品查看详情。" title="未选中商品" />
          </div>
        )}
      </AdminDialog>

      {!loading && bundleProducts.length > 0 ? (
        <AdminNotice
          description={`当前共有 ${bundleProducts.length} 个组合商品，可用于多个测试题共用一组验证码。`}
          title="组合商品提示"
          variant="info"
        />
      ) : null}
    </AdminPage>
  )
}
