import { Database, ExternalLink, Eye, EyeOff, Search, ShieldCheck, Ticket, Unplug } from "lucide-react"
import { useDeferredValue, useEffect, useMemo, useState } from "react"
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
import { scopeModeLabels, verificationModeLabels } from "@/features/admin/display"
import { fetchAdminQuizzes } from "@/features/quizzes/api"
import type { AdminQuizItem } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

type QuizFilterMode = "all" | "live" | "free" | "paid" | "pending"

const filterItems: Array<{ key: QuizFilterMode; label: string }> = [
  { key: "all", label: "全部" },
  { key: "live", label: "Landing 展示中" },
  { key: "free", label: "免费题" },
  { key: "paid", label: "付费题" },
  { key: "pending", label: "待接入" },
]

const quizStatusLabels: Record<string, string> = {
  active: "生效中",
  archived: "已下线",
  draft: "草稿",
  paused: "已暂停",
  published: "已发布",
}

function getQuizStatusLabel(status: string) {
  return quizStatusLabels[status] ?? status
}

function isQuizLiveOnLanding(quiz: Pick<AdminQuizItem, "landingVisible" | "liveOnLanding" | "source" | "status">) {
  if (typeof quiz.liveOnLanding === "boolean") {
    return quiz.liveOnLanding
  }

  if (quiz.source === "d1") {
    return quiz.status === "published" && quiz.landingVisible === true
  }

  return quiz.status === "published"
}

function isPendingConnection(quiz: AdminQuizItem) {
  return quiz.accessType === "paid" && quiz.source !== "d1"
}

function getQuizSourceMeta(source: AdminQuizItem["source"]) {
  if (source === "d1") {
    return { label: "后台已接入", variant: "success" as const }
  }

  if (source === "static") {
    return { label: "代码题库", variant: "neutral" as const }
  }

  return { label: "演示数据", variant: "warning" as const }
}

function getDataBadge(items: AdminQuizItem[]) {
  const sources = new Set(items.map((item) => item.source))

  if (sources.size === 0) {
    return { label: "题集数据", variant: "neutral" as const }
  }

  if (sources.has("mock")) {
    return { label: "演示数据", variant: "warning" as const }
  }

  if (sources.size === 1 && sources.has("d1")) {
    return { label: "后台数据", variant: "success" as const }
  }

  if (sources.size === 1 && sources.has("static")) {
    return { label: "代码题库", variant: "neutral" as const }
  }

  return { label: "代码题库 + 后台接入", variant: "info" as const }
}

function getVerificationSummary(quiz: AdminQuizItem) {
  if (quiz.accessType === "free") {
    return {
      detail: "站内直接访问",
      sampleCode: undefined,
      title: "免验证码",
    }
  }

  if (!quiz.verification) {
    return {
      detail: "题页已开发，批次还未接入后台",
      sampleCode: undefined,
      title: "待接入验证码批次",
    }
  }

  const verificationMode = quiz.verification.verificationMode
  const scopeMode = quiz.verification.scopeMode
  const sampleCode = quiz.verification.sampleCodes.find((item) => item.status === "active")?.code ?? quiz.verification.sampleCodes[0]?.code

  return {
    detail:
      quiz.verification.batchName ??
      [
        scopeMode ? scopeModeLabels[scopeMode as keyof typeof scopeModeLabels] ?? scopeMode : undefined,
        typeof quiz.verification.activeCodeCount === "number" ? `${quiz.verification.activeCodeCount} 个有效码` : undefined,
      ]
        .filter(Boolean)
        .join(" · "),
    sampleCode,
    title:
      verificationMode && verificationMode !== "unknown"
        ? verificationModeLabels[verificationMode] ?? verificationMode
        : "验证码访问",
  }
}

function getConnectionMeta(quiz: AdminQuizItem) {
  if (quiz.accessType === "free") {
    return {
      icon: Database,
      note: "站内直接提供",
      tone: "neutral" as const,
    }
  }

  if (quiz.source === "d1") {
    return {
      icon: ShieldCheck,
      note: "产品与批次已接入",
      tone: "success" as const,
    }
  }

  return {
    icon: Unplug,
    note: quiz.source === "mock" ? "当前为演示配置" : "题页已开发，待接入后台",
    tone: "warning" as const,
  }
}

function sortQuizzes(left: AdminQuizItem, right: AdminQuizItem) {
  const liveDelta = Number(isQuizLiveOnLanding(right)) - Number(isQuizLiveOnLanding(left))
  if (liveDelta !== 0) {
    return liveDelta
  }

  const paidDelta = Number(right.accessType === "paid") - Number(left.accessType === "paid")
  if (paidDelta !== 0) {
    return paidDelta
  }

  return left.title.localeCompare(right.title, "zh-CN")
}

function buildBatchManagementPath(quiz: AdminQuizItem) {
  const batchId = quiz.verification?.batchId

  if (!batchId) {
    return buildAdminPortalPath("batches")
  }

  return `${buildAdminPortalPath("batches")}?batchId=${encodeURIComponent(batchId)}`
}

export function AdminQuizzesPage() {
  const [items, setItems] = useState<AdminQuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [filterMode, setFilterMode] = useState<QuizFilterMode>("all")
  const [searchValue, setSearchValue] = useState("")
  const [selectedQuizId, setSelectedQuizId] = useState<string>()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const deferredSearchValue = useDeferredValue(searchValue)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)

      try {
        const nextItems = await fetchAdminQuizzes()

        if (!active) {
          return
        }

        setItems(nextItems)
        setErrorMessage(undefined)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "题集数据加载失败")
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

  const liveItems = useMemo(() => items.filter((item) => isQuizLiveOnLanding(item)), [items])
  const freeItems = useMemo(() => items.filter((item) => item.accessType === "free"), [items])
  const paidItems = useMemo(() => items.filter((item) => item.accessType === "paid"), [items])
  const pendingItems = useMemo(() => items.filter((item) => isPendingConnection(item)), [items])
  const sourceSummary = useMemo(
    () => ({
      d1: items.filter((item) => item.source === "d1").length,
      mock: items.filter((item) => item.source === "mock").length,
      static: items.filter((item) => item.source === "static").length,
    }),
    [items],
  )
  const dataBadge = useMemo(() => getDataBadge(items), [items])

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredSearchValue.trim().toLowerCase()

    return [...items]
      .sort(sortQuizzes)
      .filter((item) => {
        if (filterMode === "live" && !isQuizLiveOnLanding(item)) {
          return false
        }

        if ((filterMode === "free" || filterMode === "paid") && item.accessType !== filterMode) {
          return false
        }

        if (filterMode === "pending" && !isPendingConnection(item)) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        return [item.title, item.slug, item.category, item.priceLabel, ...item.tags]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedQuery))
      })
  }, [deferredSearchValue, filterMode, items])

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedQuizId(undefined)
      return
    }

    if (selectedQuizId && filteredItems.some((item) => item.id === selectedQuizId)) {
      return
    }

    // Don't auto-select if we just want a list
    // setSelectedQuizId(filteredItems[0].id)
  }, [filteredItems, selectedQuizId])

  function handleSelectQuiz(quizId: string) {
    setSelectedQuizId(quizId)
    setIsDetailOpen(true)
  }

  const selectedQuiz = useMemo(
    () => filteredItems.find((item) => item.id === selectedQuizId) ?? items.find((item) => item.id === selectedQuizId),
    [filteredItems, items, selectedQuizId],
  )

  const selectedVerificationSummary = selectedQuiz ? getVerificationSummary(selectedQuiz) : undefined
  const selectedSourceMeta = selectedQuiz ? getQuizSourceMeta(selectedQuiz.source) : undefined
  const selectedConnectionMeta = selectedQuiz ? getConnectionMeta(selectedQuiz) : undefined
  const SelectedConnectionIcon = selectedConnectionMeta?.icon

  return (
    <AdminPage>
      <AdminPageHeader
        actions={
          <Button asChild className="rounded-full" size="lg" variant="outline">
            <Link to={buildAdminPortalPath("batches")}>管理验证码策略</Link>
          </Button>
        }
        badge={<AdminBadge variant={dataBadge.variant}>{dataBadge.label}</AdminBadge>}
        description="统一查看题集的对外展示、访问方式与后台接入状态，便于从单个题集快速追踪到对应的验证策略。"
        title="题集"
      />

      {errorMessage ? <AdminNotice description={errorMessage} variant="danger" /> : null}

      <AdminMetricGrid columns={5}>
        <AdminStatCard helper="包含免费题、付费题和待接入题集。" label="已开发题集" value={loading ? "-" : items.length} />
        <AdminStatCard helper="当前在 Landing 对外可见的题集。" label="Landing 展示中" tone="success" value={loading ? "-" : liveItems.length} />
        <AdminStatCard helper="无需验证码即可直接访问。" label="免费题" value={loading ? "-" : freeItems.length} />
        <AdminStatCard helper="需要验证码或访问控制策略。" label="付费题" tone="info" value={loading ? "-" : paidItems.length} />
        <AdminStatCard helper="题页已开发，但后台策略尚未落库。" label="待接入后台" tone="warning" value={loading ? "-" : pendingItems.length} />
      </AdminMetricGrid>

      <AdminPanel className="space-y-5">
        <AdminToolbar className="items-start gap-4">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={cn(adminInputClassName, "pl-11")}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="搜索题集标题、slug 或标签"
              type="search"
              value={searchValue}
            />
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
            <div className="text-sm text-muted-foreground">
              当前结果 {filteredItems.length} / {items.length}
            </div>
            <div className="flex flex-wrap gap-2">
              {filterItems.map((item) => (
                <AdminFilterPill active={filterMode === item.key} key={item.key} onClick={() => setFilterMode(item.key)}>
                  {item.label}
                </AdminFilterPill>
              ))}
            </div>
          </div>
        </AdminToolbar>

        {filteredItems.length > 0 ? (
          <AdminDataTable>
            <AdminTableHead>
              <tr>
                <AdminTableHeaderCell>题集</AdminTableHeaderCell>
                <AdminTableHeaderCell>业务状态</AdminTableHeaderCell>
                <AdminTableHeaderCell>展示与验证</AdminTableHeaderCell>
                <AdminTableHeaderCell className="text-right">操作</AdminTableHeaderCell>
              </tr>
            </AdminTableHead>

            <AdminTableBody>
              {filteredItems.map((quiz) => {
                const isLive = isQuizLiveOnLanding(quiz)
                const sourceMeta = getQuizSourceMeta(quiz.source)
                const verificationSummary = getVerificationSummary(quiz)
                const connectionMeta = getConnectionMeta(quiz)
                const isSelected = selectedQuizId === quiz.id

                return (
                  <AdminTableRow
                    className={cn(isSelected ? "bg-info/5" : undefined)}
                    interactive
                    key={quiz.id}
                    onClick={() => handleSelectQuiz(quiz.id)}
                  >
                    <AdminTableCell className="min-w-[270px] py-5">
                      <div className="space-y-2.5">
                        <div className="font-medium text-foreground">{quiz.title}</div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full border border-border bg-muted/10 px-3 py-1 font-mono text-[11px] text-foreground">{quiz.slug}</span>
                          <span>{quiz.category}</span>
                          <span>{quiz.questionCount} 题</span>
                          <span>{quiz.durationMinutes} 分钟</span>
                        </div>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="min-w-[190px] py-5">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap gap-2">
                          <AdminBadge variant={quiz.accessType === "free" ? "success" : "info"}>{quiz.accessType === "free" ? "免费" : "付费"}</AdminBadge>
                          <AdminBadge variant={quiz.status === "published" || quiz.status === "active" ? "success" : "warning"}>{getQuizStatusLabel(quiz.status)}</AdminBadge>
                          {isPendingConnection(quiz) ? <AdminBadge variant="warning">待接入</AdminBadge> : null}
                        </div>
                        <div className="text-sm text-foreground">{quiz.priceLabel}</div>
                        <div className="text-sm text-muted-foreground">{connectionMeta.note}</div>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="min-w-[260px] py-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          {isLive ? <Eye className="size-4 text-success" /> : <EyeOff className="size-4 text-muted-foreground" />}
                          <span className="font-medium text-foreground">{isLive ? "Landing 展示中" : "Landing 未展示"}</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="font-medium text-foreground">{verificationSummary.title}</div>
                          <div className="text-sm leading-6 text-muted-foreground">{verificationSummary.detail}</div>
                          <div className="flex flex-wrap gap-2">
                            <AdminBadge variant={sourceMeta.variant}>{sourceMeta.label}</AdminBadge>
                            {verificationSummary.sampleCode ? <AdminBadge variant="neutral">示例码已配置</AdminBadge> : null}
                          </div>
                        </div>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="w-[188px] py-5 text-right">
                      <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                        <Button asChild className="rounded-full" size="sm" variant="outline">
                          <Link to={quiz.introPath}>
                            介绍页
                            <ExternalLink className="size-4" />
                          </Link>
                        </Button>
                        {quiz.accessType === "paid" ? (
                          <Button asChild className="rounded-full" size="sm" variant="outline">
                            <Link to={buildBatchManagementPath(quiz)}>
                              策略
                              <Ticket className="size-4" />
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                )
              })}
            </AdminTableBody>
          </AdminDataTable>
        ) : (
          <AdminEmptyState description="换个筛选条件试试，或者清空搜索词。" title="没有匹配的题集" />
        )}
      </AdminPanel>

      <AdminDialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="题集详情">
        {selectedQuiz ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-border/50 bg-muted/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{selectedQuiz.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">/{selectedQuiz.slug}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AdminBadge variant={selectedQuiz.accessType === "free" ? "success" : "info"}>{selectedQuiz.accessType === "free" ? "免费" : "付费"}</AdminBadge>
                    <AdminBadge variant={isQuizLiveOnLanding(selectedQuiz) ? "success" : "neutral"}>{isQuizLiveOnLanding(selectedQuiz) ? "正在展示" : "未展示"}</AdminBadge>
                    <AdminBadge variant={selectedQuiz.status === "published" || selectedQuiz.status === "active" ? "success" : "warning"}>{getQuizStatusLabel(selectedQuiz.status)}</AdminBadge>
                  </div>
                </div>

                {selectedQuiz.accessType === "paid" ? (
                  <Button asChild className="rounded-full" size="sm" variant="outline">
                    <Link to={buildBatchManagementPath(selectedQuiz)}>
                      调整验证码策略
                      <Ticket className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/50 bg-background px-4 py-4 text-sm shadow-sm">
                <div className="text-muted-foreground">题目数量</div>
                <div className="mt-2 text-lg font-semibold text-foreground">{selectedQuiz.questionCount}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background px-4 py-4 text-sm shadow-sm">
                <div className="text-muted-foreground">预计时长</div>
                <div className="mt-2 text-lg font-semibold text-foreground">{selectedQuiz.durationMinutes} 分钟</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background px-4 py-4 text-sm shadow-sm">
                <div className="text-muted-foreground">类目</div>
                <div className="mt-2 text-lg font-semibold text-foreground">{selectedQuiz.category}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background px-4 py-4 text-sm shadow-sm">
                <div className="text-muted-foreground">价格展示</div>
                <div className="mt-2 text-lg font-semibold text-foreground">{selectedQuiz.priceLabel}</div>
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-background p-5 shadow-sm">
              <AdminSectionTitle
                description={
                  selectedQuiz.accessType === "paid"
                    ? "付费题的访问控制由商品与验证码批次共同决定。"
                    : "免费题不依赖验证码，可直接进入测试页。"
                }
                title="访问策略"
              />

              {selectedQuiz.accessType === "paid" ? (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <AdminBadge variant="info">{selectedVerificationSummary?.title}</AdminBadge>
                    {selectedQuiz.verification?.productName ? <AdminBadge variant="neutral">{selectedQuiz.verification.productName}</AdminBadge> : null}
                    {selectedQuiz.verification?.batchName ? <AdminBadge variant="neutral">{selectedQuiz.verification.batchName}</AdminBadge> : null}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">当前说明</div>
                      <div className="mt-1 font-medium text-foreground">{selectedVerificationSummary?.detail ?? "待接入"}</div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border/50 bg-muted/10 px-4 py-3">
                        <div className="text-muted-foreground">会话有效期</div>
                        <div className="mt-1 font-medium text-foreground">
                          {selectedQuiz.verification?.tokenTtlDays ? `${selectedQuiz.verification.tokenTtlDays} 天` : "沿用系统默认"}
                        </div>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-muted/10 px-4 py-3">
                        <div className="text-muted-foreground">当前有效码</div>
                        <div className="mt-1 font-medium text-foreground">{selectedQuiz.verification?.activeCodeCount ?? 0} 个</div>
                      </div>
                    </div>
                    {selectedVerificationSummary?.sampleCode ? (
                      <div className="rounded-lg border border-border/50 bg-muted/10 px-4 py-3">
                        <div className="text-muted-foreground">示例码</div>
                        <div className="mt-1 font-mono text-sm font-medium text-foreground">{selectedVerificationSummary.sampleCode}</div>
                      </div>
                    ) : null}
                    {selectedQuiz.verification?.notes ? (
                      <div className="rounded-lg border border-border/50 bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
                        {selectedQuiz.verification.notes}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-success/20 bg-success/10 px-4 py-4 text-sm text-success">
                  当前题集直接面向站内访问，不需要验证码校验。
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border/50 bg-background p-5 shadow-sm">
              <AdminSectionTitle description="查看前台入口与后台接入路径是否完整。" title="入口与接入" />

              <div className="mt-4 space-y-4 text-sm">
                {SelectedConnectionIcon ? (
                  <div className="flex items-center gap-2 text-foreground">
                    <SelectedConnectionIcon className="size-4 text-info" />
                    <span>{selectedConnectionMeta?.note}</span>
                  </div>
                ) : null}
                <div className="grid gap-3">
                  <div className="rounded-lg border border-border/50 bg-muted/10 px-4 py-3">
                    <div className="text-muted-foreground">介绍页路径</div>
                    <div className="mt-1 font-medium text-foreground">{selectedQuiz.introPath}</div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-muted/10 px-4 py-3">
                    <div className="text-muted-foreground">测试页路径</div>
                    <div className="mt-1 font-medium text-foreground">{selectedQuiz.testPath}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild className="rounded-full" size="sm" variant="outline">
                    <Link to={selectedQuiz.introPath}>
                      打开介绍页
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild className="rounded-full" size="sm" variant="outline">
                    <Link to={selectedQuiz.testPath}>
                      打开测试页
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12">
             <AdminEmptyState description="请选择一个对象即可查看完整详情。" title="未选中对象" />
          </div>
        )}
      </AdminDialog>
    </AdminPage>
  )
}
