import { Ban, Play, Plus, RefreshCcw, Search, Snowflake, Ticket } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Link, useSearchParams } from "react-router"

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
  adminSelectClassName,
  adminTextareaClassName,
} from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import { buildAdminPortalPath } from "@/features/admin/constants"
import { formatAdminDate, isExpiringWithin, scopeModeLabels, verificationModeLabels } from "@/features/admin/display"
import { createAdminCodeBatch, fetchAdminCodeBatches, fetchAdminProducts, updateAdminCodeBatchPolicy, updateAdminCodeBatchStatus } from "@/features/quizzes/api"
import type { AdminCodeBatch, AdminCodeBatchAction, AdminCodeBatchPolicy, AdminProduct, CreateAdminCodeBatchInput } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

type BatchFilterMode = "all" | "active" | "paused" | "expiring" | "custom_scope"
type EditableVerificationMode = "shared_code" | "unique_code"
type EditableScopeMode = "product" | "custom_scope"

interface BatchFormState {
  allowQuizSlugs: string[]
  introVisible: boolean
  notes: string
  scopeMode: EditableScopeMode
  tokenTtlDays: string
  verificationMode: EditableVerificationMode
}

interface CreateBatchFormState extends BatchFormState {
  codeCount: string
  codeLength: string
  codePrefix: string
  expiresAt: string
  name: string
  productId: string
}

const filterItems: Array<{ key: BatchFilterMode; label: string }> = [
  { key: "all", label: "全部批次" },
  { key: "active", label: "生效中" },
  { key: "paused", label: "已冻结" },
  { key: "expiring", label: "即将到期" },
  { key: "custom_scope", label: "指定范围" },
]

function createBatchFormState(batch: AdminCodeBatch): BatchFormState {
  return {
    verificationMode: (batch.policy.verificationMode ?? "shared_code") as EditableVerificationMode,
    scopeMode: (batch.policy.scopeMode === "custom_scope" ? "custom_scope" : "product") as EditableScopeMode,
    tokenTtlDays: batch.policy.tokenTtlDays ? String(batch.policy.tokenTtlDays) : "",
    introVisible: batch.policy.introVisible ?? true,
    notes: batch.policy.notes ?? "",
    allowQuizSlugs: batch.policy.allowQuizSlugs?.length ? batch.policy.allowQuizSlugs : batch.linkedQuizzes.map((quiz) => quiz.slug),
  }
}

function defaultCreateForm(productId?: string): CreateBatchFormState {
  return {
    productId: productId ?? "",
    name: "",
    codeCount: "50",
    codeLength: "8",
    codePrefix: "",
    expiresAt: "",
    verificationMode: "shared_code",
    scopeMode: "product",
    tokenTtlDays: "30",
    introVisible: true,
    notes: "",
    allowQuizSlugs: [],
  }
}

function getBatchStatusVariant(status: string) {
  if (status === "active") return "success" as const
  if (status === "paused") return "warning" as const
  if (status === "revoked") return "danger" as const
  return "neutral" as const
}

function buildBatchPolicy(form: BatchFormState, availableQuizSlugs: string[]): AdminCodeBatchPolicy {
  return {
    verificationMode: form.verificationMode,
    scopeMode: form.scopeMode,
    allowQuizSlugs: form.scopeMode === "custom_scope" ? form.allowQuizSlugs.filter((slug) => availableQuizSlugs.includes(slug)) : undefined,
    tokenTtlDays: form.tokenTtlDays ? Number(form.tokenTtlDays) : undefined,
    introVisible: form.introVisible,
    notes: form.notes.trim() || undefined,
  }
}

function buildCreatePath(productId?: string) {
  const params = new URLSearchParams()
  if (productId) params.set("productId", productId)
  params.set("create", "1")
  return `${buildAdminPortalPath("batches")}?${params.toString()}`
}

export function AdminBatchesPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [batches, setBatches] = useState<AdminCodeBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [filterMode, setFilterMode] = useState<BatchFilterMode>("all")
  const [searchValue, setSearchValue] = useState("")
  const [selectedBatchId, setSelectedBatchId] = useState<string>()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formState, setFormState] = useState<BatchFormState>()
  const [createState, setCreateState] = useState<CreateBatchFormState>(defaultCreateForm())
  const [saving, setSaving] = useState(false)
  const [createSaving, setCreateSaving] = useState(false)
  const [feedback, setFeedback] = useState<string>()
  const [createError, setCreateError] = useState<string>()
  const [detailError, setDetailError] = useState<string>()
  const [actionLoading, setActionLoading] = useState<AdminCodeBatchAction>()
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedProductId = searchParams.get("productId") ?? undefined
  const requestedBatchId = searchParams.get("batchId") ?? undefined
  const requestedCreate = searchParams.get("create") === "1"

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [productItems, batchItems] = await Promise.all([fetchAdminProducts(), fetchAdminCodeBatches()])
      setProducts(productItems)
      setBatches(batchItems)
      setErrorMessage(undefined)
    } catch (loadError) {
      setErrorMessage(loadError instanceof Error ? loadError.message : "批次数据加载失败")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    if (requestedCreate) {
      setIsCreateOpen(true)
      setCreateState(defaultCreateForm(requestedProductId))
    }
  }, [requestedCreate, requestedProductId])

  const scopedBatches = useMemo(() => (requestedProductId ? batches.filter((batch) => batch.productId === requestedProductId) : batches), [batches, requestedProductId])
  const filteredBatches = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()
    return scopedBatches.filter((batch) => {
      if (filterMode === "active" && batch.status !== "active") return false
      if (filterMode === "paused" && batch.status !== "paused") return false
      if (filterMode === "expiring" && !isExpiringWithin(batch.expiresAt, 14)) return false
      if (filterMode === "custom_scope" && batch.policy.scopeMode !== "custom_scope") return false
      if (!keyword) return true
      return [batch.name, batch.productName, batch.id].some((field) => field.toLowerCase().includes(keyword))
    })
  }, [filterMode, scopedBatches, searchValue])

  useEffect(() => {
    if (requestedBatchId && scopedBatches.some((batch) => batch.id === requestedBatchId)) {
      setSelectedBatchId(requestedBatchId)
    }
  }, [requestedBatchId, scopedBatches])

  const selectedBatch = useMemo(() => scopedBatches.find((batch) => batch.id === selectedBatchId), [scopedBatches, selectedBatchId])
  const createProduct = useMemo(() => products.find((product) => product.id === createState.productId), [createState.productId, products])

  useEffect(() => {
    if (selectedBatch) setFormState(createBatchFormState(selectedBatch))
  }, [selectedBatch])

  const activeCount = scopedBatches.filter((batch) => batch.status === "active").length
  const pausedCount = scopedBatches.filter((batch) => batch.status === "paused").length
  const expiringCount = scopedBatches.filter((batch) => isExpiringWithin(batch.expiresAt, 14)).length
  const revokedCount = scopedBatches.filter((batch) => batch.status === "revoked").length

  function updateBatch(nextBatch: AdminCodeBatch) {
    setBatches((current) => {
      const exists = current.some((batch) => batch.id === nextBatch.id)
      return exists ? current.map((batch) => (batch.id === nextBatch.id ? nextBatch : batch)) : [nextBatch, ...current]
    })
  }

  function selectBatch(batchId: string) {
    setSelectedBatchId(batchId)
    setIsDetailOpen(true)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("batchId", batchId)
    setSearchParams(nextParams, { replace: true })
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!createProduct) {
      setCreateError("请选择商品")
      return
    }
    const policy = buildBatchPolicy(createState, createProduct.linkedQuizzes.map((quiz) => quiz.slug))
    if (policy.scopeMode === "custom_scope" && (policy.allowQuizSlugs?.length ?? 0) === 0) {
      setCreateError("指定范围模式下至少选择一个题集")
      return
    }
    const payload: CreateAdminCodeBatchInput = {
      productId: createProduct.id,
      name: createState.name.trim(),
      codeCount: Number(createState.codeCount),
      codeLength: Number(createState.codeLength),
      codePrefix: createState.codePrefix.trim() || undefined,
      expiresAt: createState.expiresAt ? new Date(createState.expiresAt).toISOString() : undefined,
      policy,
    }
    setCreateSaving(true)
    setCreateError(undefined)
    try {
      const createdBatch = await createAdminCodeBatch(payload)
      updateBatch(createdBatch)
      setSelectedBatchId(createdBatch.id)
      setIsCreateOpen(false)
      setIsDetailOpen(true)
      setFeedback("批次已创建并立即生效")
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete("create")
      nextParams.set("productId", createdBatch.productId)
      nextParams.set("batchId", createdBatch.id)
      setSearchParams(nextParams, { replace: true })
    } catch (createError) {
      setCreateError(createError instanceof Error ? createError.message : "批次创建失败")
    } finally {
      setCreateSaving(false)
    }
  }

  async function handlePolicySave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBatch || !formState) return
    const policy = buildBatchPolicy(formState, selectedBatch.linkedQuizzes.map((quiz) => quiz.slug))
    setSaving(true)
    setDetailError(undefined)
    try {
      const savedBatch = await updateAdminCodeBatchPolicy(selectedBatch.id, policy)
      updateBatch(savedBatch)
      setFormState(createBatchFormState(savedBatch))
      setFeedback("批次策略已保存并立即生效")
    } catch (saveError) {
      setDetailError(saveError instanceof Error ? saveError.message : "批次策略保存失败")
    } finally {
      setSaving(false)
    }
  }

  async function handleAction(action: AdminCodeBatchAction) {
    if (!selectedBatch) return
    setActionLoading(action)
    setDetailError(undefined)
    try {
      const updatedBatch = await updateAdminCodeBatchStatus(selectedBatch.id, action)
      updateBatch(updatedBatch)
      setFormState(createBatchFormState(updatedBatch))
      setFeedback(action === "pause" ? "批次已冻结，新验码会立即停止" : action === "activate" ? "批次已恢复启用" : "批次已作废，不再接受验码")
    } catch (actionError) {
      setDetailError(actionError instanceof Error ? actionError.message : "批次状态更新失败")
    } finally {
      setActionLoading(undefined)
    }
  }

  return (
    <AdminPage>
      <AdminPageHeader
        actions={<div className="flex flex-wrap gap-2"><Button className="rounded-full" onClick={() => { setCreateError(undefined); setCreateState(defaultCreateForm(requestedProductId)); setIsCreateOpen(true) }} size="lg"><Plus className="size-4" />新建批次</Button><Button asChild className="rounded-full" size="lg" variant="outline"><Link to={buildAdminPortalPath("products")}>查看商品</Link></Button><Button className="rounded-full" onClick={() => void loadData()} size="lg" variant="outline"><RefreshCcw className="size-4" />刷新</Button></div>}
        badge="Batches"
        description="批次负责发码、冻结和作废；冻结/作废后的新验码会立即按 D1 最新状态执行。"
        title="验证码批次"
      />

      {errorMessage ? <AdminNotice description={errorMessage} variant="danger" /> : null}

      <AdminMetricGrid columns={4}>
        <AdminStatCard helper="可正常验码" label="生效中" tone="success" value={loading ? "-" : activeCount} />
        <AdminStatCard helper="停止新验码" label="已冻结" tone="warning" value={loading ? "-" : pausedCount} />
        <AdminStatCard helper="14 天内到期" label="即将到期" tone="info" value={loading ? "-" : expiringCount} />
        <AdminStatCard helper="不可恢复" label="已作废" value={loading ? "-" : revokedCount} />
      </AdminMetricGrid>

      <AdminPanel className="space-y-5">
        <AdminToolbar className="items-start gap-4">
          <label className="relative block w-full lg:max-w-sm"><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input className={cn(adminInputClassName, "pl-11")} onChange={(event) => setSearchValue(event.target.value)} placeholder="搜索批次、商品或批次 ID" type="search" value={searchValue} /></label>
          <div className="flex flex-wrap gap-2">{filterItems.map((item) => <AdminFilterPill active={filterMode === item.key} key={item.key} onClick={() => setFilterMode(item.key)}>{item.label}</AdminFilterPill>)}</div>
        </AdminToolbar>

        {filteredBatches.length > 0 ? (
          <AdminDataTable>
            <AdminTableHead><tr><AdminTableHeaderCell>批次</AdminTableHeaderCell><AdminTableHeaderCell>商品</AdminTableHeaderCell><AdminTableHeaderCell>策略</AdminTableHeaderCell><AdminTableHeaderCell>码量/到期</AdminTableHeaderCell><AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell></tr></AdminTableHead>
            <AdminTableBody>
              {filteredBatches.map((batch) => {
                const verificationMode = batch.policy.verificationMode ?? "shared_code"
                const scopeMode = (batch.policy.scopeMode ?? "product") as keyof typeof scopeModeLabels
                return (
                  <AdminTableRow interactive key={batch.id} onClick={() => selectBatch(batch.id)}>
                    <AdminTableCell><div className="font-medium text-foreground">{batch.name}</div><div className="mt-1 font-mono text-xs text-muted-foreground">{batch.id}</div></AdminTableCell>
                    <AdminTableCell><div className="text-sm text-foreground">{batch.productName}</div><div className="mt-1 text-xs text-muted-foreground">{batch.strategyType}</div></AdminTableCell>
                    <AdminTableCell><div className="flex flex-wrap gap-2"><AdminBadge variant={getBatchStatusVariant(batch.status)}>{batch.status}</AdminBadge><AdminBadge variant={verificationMode === "unique_code" ? "info" : "neutral"}>{verificationModeLabels[verificationMode]}</AdminBadge><AdminBadge variant="neutral">{scopeModeLabels[scopeMode]}</AdminBadge></div></AdminTableCell>
                    <AdminTableCell><div className="text-sm text-foreground">{batch.codeCount.toLocaleString()} 个码</div><div className={cn("mt-1 text-xs", isExpiringWithin(batch.expiresAt, 14) ? "text-warning" : "text-muted-foreground")}>{formatAdminDate(batch.expiresAt)} 到期</div></AdminTableCell>
                    <AdminTableCell className="text-right"><Button className="rounded-full" size="sm" variant="outline">工作台</Button></AdminTableCell>
                  </AdminTableRow>
                )
              })}
            </AdminTableBody>
          </AdminDataTable>
        ) : (
          <AdminEmptyState action={requestedProductId ? <Button asChild className="rounded-full"><Link to={buildCreatePath(requestedProductId)}>为该商品新建批次</Link></Button> : undefined} description="当前筛选条件下没有可管理的批次。" title="暂无批次" />
        )}
      </AdminPanel>

      <AdminDialog isOpen={isCreateOpen} maxWidth="max-w-3xl" onClose={() => { const nextParams = new URLSearchParams(searchParams); nextParams.delete("create"); setSearchParams(nextParams, { replace: true }); setCreateError(undefined); setIsCreateOpen(false) }} title="新建批次">
        <form className="space-y-5" onSubmit={handleCreate}>
          {createError ? <AdminNotice description={createError} variant="danger" /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-medium">商品</label><select className={adminSelectClassName} onChange={(event) => setCreateState((current) => ({ ...current, productId: event.target.value, allowQuizSlugs: [] }))} value={createState.productId}><option value="">请选择商品</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></div>
            <div className="space-y-2"><label className="text-sm font-medium">批次名称</label><input className={adminInputClassName} onChange={(event) => setCreateState((current) => ({ ...current, name: event.target.value }))} value={createState.name} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">码量</label><input className={adminInputClassName} onChange={(event) => setCreateState((current) => ({ ...current, codeCount: event.target.value }))} value={createState.codeCount} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">长度</label><input className={adminInputClassName} onChange={(event) => setCreateState((current) => ({ ...current, codeLength: event.target.value }))} value={createState.codeLength} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">前缀</label><input className={adminInputClassName} onChange={(event) => setCreateState((current) => ({ ...current, codePrefix: event.target.value }))} value={createState.codePrefix} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">到期时间</label><input className={adminInputClassName} onChange={(event) => setCreateState((current) => ({ ...current, expiresAt: event.target.value }))} type="datetime-local" value={createState.expiresAt} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">验证方式</label><select className={adminSelectClassName} onChange={(event) => setCreateState((current) => ({ ...current, verificationMode: event.target.value as EditableVerificationMode }))} value={createState.verificationMode}><option value="shared_code">通用口令</option><option value="unique_code">一单一码</option></select></div>
            <div className="space-y-2"><label className="text-sm font-medium">生效范围</label><select className={adminSelectClassName} onChange={(event) => setCreateState((current) => ({ ...current, scopeMode: event.target.value as EditableScopeMode, allowQuizSlugs: event.target.value === "product" ? [] : current.allowQuizSlugs }))} value={createState.scopeMode}><option value="product">整个商品</option><option value="custom_scope">指定题集</option></select></div>
          </div>
          {createState.scopeMode === "custom_scope" && createProduct ? <div className="grid gap-3 md:grid-cols-2">{createProduct.linkedQuizzes.map((quiz) => <label className="flex items-center gap-3 rounded-xl border border-border/40 bg-background px-4 py-3 text-sm" key={quiz.slug}><input checked={createState.allowQuizSlugs.includes(quiz.slug)} onChange={(event) => setCreateState((current) => ({ ...current, allowQuizSlugs: event.target.checked ? [...current.allowQuizSlugs, quiz.slug] : current.allowQuizSlugs.filter((item) => item !== quiz.slug) }))} type="checkbox" /><span>{quiz.title}</span></label>)}</div> : null}
          <div className="space-y-2"><label className="text-sm font-medium">备注</label><textarea className={adminTextareaClassName} onChange={(event) => setCreateState((current) => ({ ...current, notes: event.target.value }))} value={createState.notes} /></div>
          <div className="flex justify-end gap-2"><Button className="rounded-full" onClick={() => setIsCreateOpen(false)} type="button" variant="outline">取消</Button><Button className="rounded-full" disabled={createSaving} type="submit">{createSaving ? <RefreshCcw className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}{createSaving ? "创建中..." : "创建并立即生效"}</Button></div>
        </form>
      </AdminDialog>

      <AdminDialog isOpen={isDetailOpen} maxWidth="max-w-5xl" onClose={() => setIsDetailOpen(false)} title="批次工作台">
        {selectedBatch && formState ? (
          <form className="space-y-5" onSubmit={handlePolicySave}>
            {feedback ? <AdminNotice description={feedback} variant="success" /> : null}
            {detailError ? <AdminNotice description={detailError} variant="danger" /> : null}
            <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-muted/5 p-5 lg:flex-row lg:items-start lg:justify-between"><div className="space-y-2"><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Ticket className="size-6" /></div><div><div className="text-xl font-black text-foreground">{selectedBatch.name}</div><div className="text-xs text-muted-foreground">{selectedBatch.id}</div></div></div><div className="flex flex-wrap gap-2"><AdminBadge variant={getBatchStatusVariant(selectedBatch.status)}>{selectedBatch.status}</AdminBadge><AdminBadge variant="neutral">{selectedBatch.productName}</AdminBadge><AdminBadge variant="neutral">{selectedBatch.codeCount} 个码</AdminBadge></div></div><div className="flex flex-wrap gap-2">{selectedBatch.status === "active" ? <Button className="rounded-full" disabled={actionLoading !== undefined} onClick={() => void handleAction("pause")} type="button" variant="outline">{actionLoading === "pause" ? <RefreshCcw className="mr-2 size-4 animate-spin" /> : <Snowflake className="mr-2 size-4" />}冻结</Button> : null}{selectedBatch.status === "paused" ? <Button className="rounded-full" disabled={actionLoading !== undefined} onClick={() => void handleAction("activate")} type="button" variant="outline">{actionLoading === "activate" ? <RefreshCcw className="mr-2 size-4 animate-spin" /> : <Play className="mr-2 size-4" />}启用</Button> : null}{selectedBatch.status !== "revoked" ? <Button className="rounded-full" disabled={actionLoading !== undefined} onClick={() => void handleAction("revoke")} type="button" variant="destructive">{actionLoading === "revoke" ? <RefreshCcw className="mr-2 size-4 animate-spin" /> : <Ban className="mr-2 size-4" />}作废</Button> : null}</div></div>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <AdminPanel className="space-y-4"><AdminSectionTitle title="策略配置" /><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><label className="text-sm font-medium">验证方式</label><select className={adminSelectClassName} onChange={(event) => setFormState((current) => current ? { ...current, verificationMode: event.target.value as EditableVerificationMode } : current)} value={formState.verificationMode}><option value="shared_code">通用口令</option><option value="unique_code">一单一码</option></select></div><div className="space-y-2"><label className="text-sm font-medium">生效范围</label><select className={adminSelectClassName} onChange={(event) => setFormState((current) => current ? { ...current, scopeMode: event.target.value as EditableScopeMode, allowQuizSlugs: event.target.value === "product" ? selectedBatch.linkedQuizzes.map((quiz) => quiz.slug) : current.allowQuizSlugs } : current)} value={formState.scopeMode}><option value="product">整个商品</option><option value="custom_scope">指定题集</option></select></div><div className="space-y-2"><label className="text-sm font-medium">会话有效期（天）</label><input className={adminInputClassName} onChange={(event) => setFormState((current) => current ? { ...current, tokenTtlDays: event.target.value } : current)} value={formState.tokenTtlDays} /></div><label className="flex items-center gap-3 pt-8 text-sm"><input checked={formState.introVisible} onChange={(event) => setFormState((current) => current ? { ...current, introVisible: event.target.checked } : current)} type="checkbox" /><span>保留介绍页</span></label></div>{formState.scopeMode === "custom_scope" ? <div className="grid gap-3 md:grid-cols-2">{selectedBatch.linkedQuizzes.map((quiz) => <label className="flex items-center gap-3 rounded-xl border border-border/40 bg-background px-4 py-3 text-sm" key={quiz.slug}><input checked={formState.allowQuizSlugs.includes(quiz.slug)} onChange={(event) => setFormState((current) => current ? { ...current, allowQuizSlugs: event.target.checked ? [...current.allowQuizSlugs, quiz.slug] : current.allowQuizSlugs.filter((item) => item !== quiz.slug) } : current)} type="checkbox" /><span>{quiz.title}</span></label>)}</div> : null}<div className="space-y-2"><label className="text-sm font-medium">备注</label><textarea className={adminTextareaClassName} onChange={(event) => setFormState((current) => current ? { ...current, notes: event.target.value } : current)} value={formState.notes} /></div><div className="flex justify-end"><Button className="rounded-full" disabled={saving || selectedBatch.status === "revoked"} type="submit">{saving ? <RefreshCcw className="mr-2 size-4 animate-spin" /> : null}{saving ? "保存中..." : "保存策略"}</Button></div></AdminPanel>
              <div className="space-y-5"><AdminPanel className="space-y-4"><AdminSectionTitle title="覆盖题集" /><div className="flex flex-wrap gap-2">{selectedBatch.linkedQuizzes.map((quiz) => <AdminBadge key={quiz.slug} variant="neutral">{quiz.title}</AdminBadge>)}</div></AdminPanel><AdminPanel className="space-y-4"><AdminSectionTitle title="样例码" />{selectedBatch.sampleCodes.length > 0 ? <div className="space-y-3">{selectedBatch.sampleCodes.map((sampleCode) => <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background px-4 py-3" key={sampleCode.code}><div><div className="font-mono text-sm text-foreground">{sampleCode.code}</div><div className="mt-1 text-xs text-muted-foreground">{formatAdminDate(sampleCode.expiresAt)} 到期</div></div><AdminBadge variant={sampleCode.status === "active" ? "success" : sampleCode.status === "revoked" ? "danger" : "warning"}>{sampleCode.status}</AdminBadge></div>)}</div> : <AdminEmptyState description="暂无样例码" title="空批次" />}</AdminPanel></div>
            </div>
          </form>
        ) : <div className="py-12"><AdminEmptyState description="请选择一个批次查看详情。" title="未选中批次" /></div>}
      </AdminDialog>
    </AdminPage>
  )
}
