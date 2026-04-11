import { Check, Layers3, Save, Search, ShieldCheck, Ticket } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useSearchParams } from "react-router"

import {
  AdminBadge,
  AdminEmptyState,
  AdminMetricCard,
  AdminPanel,
  AdminSectionHeading,
  adminInputClassName,
} from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import {
  formatAdminDate,
  formatAdminDateTime,
  isExpiringWithin,
  scopeModeLabels,
  verificationModeLabels,
} from "@/features/admin/display"
import { fetchAdminCodeBatches, updateAdminCodeBatchPolicy } from "@/features/quizzes/api"
import type { AdminCodeBatch } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

type EditableVerificationMode = keyof typeof verificationModeLabels

type EditableScopeMode = keyof typeof scopeModeLabels

interface CodeBatchPolicyFormState {
  verificationMode: EditableVerificationMode
  scopeMode: EditableScopeMode
  tokenTtlDays: string
  introVisible: boolean
  notes: string
  allowQuizSlugs: string[]
}

const adminSelectClassName = `${adminInputClassName} pr-10`
const adminTextareaClassName = `${adminInputClassName} min-h-28 py-3`

function createPolicyFormState(batch: AdminCodeBatch): CodeBatchPolicyFormState {
  return {
    verificationMode: (batch.policy.verificationMode ?? "shared_code") as EditableVerificationMode,
    scopeMode: (batch.policy.scopeMode === "custom_scope" ? "custom_scope" : "product") as EditableScopeMode,
    tokenTtlDays: batch.policy.tokenTtlDays ? String(batch.policy.tokenTtlDays) : "",
    introVisible: batch.policy.introVisible ?? true,
    notes: batch.policy.notes ?? "",
    allowQuizSlugs: batch.policy.allowQuizSlugs ?? [],
  }
}

export function AdminPoliciesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [codeBatches, setCodeBatches] = useState<AdminCodeBatch[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(searchParams.get("batch") ?? undefined)
  const [policyForm, setPolicyForm] = useState<CodeBatchPolicyFormState>()
  const [searchValue, setSearchValue] = useState("")
  const [filterMode, setFilterMode] = useState<"all" | "active" | "expiring">("all")
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [policyErrorMessage, setPolicyErrorMessage] = useState<string>()
  const [policySuccessMessage, setPolicySuccessMessage] = useState<string>()
  const [savingPolicy, setSavingPolicy] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const batchData = await fetchAdminCodeBatches()

        if (!active) {
          return
        }

        setCodeBatches(batchData)
        setSelectedBatchId((currentBatchId) => currentBatchId ?? searchParams.get("batch") ?? batchData[0]?.id)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "验证码策略列表加载失败")
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
  }, [searchParams])

  const selectedBatch = useMemo(
    () => codeBatches.find((batch) => batch.id === selectedBatchId) ?? codeBatches[0],
    [codeBatches, selectedBatchId],
  )

  useEffect(() => {
    if (!selectedBatch && codeBatches.length > 0) {
      const nextBatchId = codeBatches[0].id
      setSelectedBatchId(nextBatchId)
      setSearchParams({ batch: nextBatchId }, { replace: true })
      return
    }

    if (!selectedBatch) {
      setPolicyForm(undefined)
      return
    }

    setPolicyForm(createPolicyFormState(selectedBatch))
  }, [codeBatches, selectedBatch, setSearchParams])

  const filteredBatches = useMemo(() => {
    const normalizedKeyword = searchValue.trim().toLowerCase()

    return codeBatches.filter((batch) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        `${batch.name} ${batch.productName}`.toLowerCase().includes(normalizedKeyword)

      if (!matchesKeyword) {
        return false
      }

      if (filterMode === "active") {
        return batch.status === "active"
      }

      if (filterMode === "expiring") {
        return isExpiringWithin(batch.expiresAt, 14)
      }

      return true
    })
  }, [codeBatches, filterMode, searchValue])

  const activeBatchCount = useMemo(() => codeBatches.filter((batch) => batch.status === "active").length, [codeBatches])
  const sharedModeCount = useMemo(
    () => codeBatches.filter((batch) => (batch.policy.verificationMode ?? "shared_code") === "shared_code").length,
    [codeBatches],
  )
  const uniqueModeCount = useMemo(
    () => codeBatches.filter((batch) => batch.policy.verificationMode === "unique_code").length,
    [codeBatches],
  )
  const expiringSoonCount = useMemo(() => codeBatches.filter((batch) => isExpiringWithin(batch.expiresAt, 14)).length, [codeBatches])

  function handleSelectBatch(batchId: string) {
    setSelectedBatchId(batchId)
    setSearchParams({ batch: batchId }, { replace: true })
    setPolicyErrorMessage(undefined)
    setPolicySuccessMessage(undefined)
  }

  async function handlePolicySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedBatch || !policyForm) {
      return
    }

    setSavingPolicy(true)
    setPolicyErrorMessage(undefined)
    setPolicySuccessMessage(undefined)

    const trimmedTokenTtlDays = policyForm.tokenTtlDays.trim()
    const parsedTokenTtlDays = trimmedTokenTtlDays ? Number.parseInt(trimmedTokenTtlDays, 10) : undefined

    try {
      const updatedBatch = await updateAdminCodeBatchPolicy(selectedBatch.id, {
        verificationMode: policyForm.verificationMode,
        scopeMode: policyForm.scopeMode,
        tokenTtlDays: parsedTokenTtlDays,
        introVisible: policyForm.introVisible,
        notes: policyForm.notes.trim() || undefined,
        allowQuizSlugs: policyForm.scopeMode === "custom_scope" ? policyForm.allowQuizSlugs : undefined,
      })

      setCodeBatches((current) => current.map((batch) => (batch.id === updatedBatch.id ? updatedBatch : batch)))
      setSelectedBatchId(updatedBatch.id)
      setPolicyForm(createPolicyFormState(updatedBatch))
      setPolicySuccessMessage("验证码策略已保存，新的验证配置会用于后续会话签发。")
    } catch (error) {
      setPolicyErrorMessage(error instanceof Error ? error.message : "策略保存失败，请稍后重试")
    } finally {
      setSavingPolicy(false)
    }
  }

  return (
    <div className="space-y-8">
      <AdminPanel>
        <AdminSectionHeading
          actions={<AdminBadge variant="info">批次即策略对象</AdminBadge>}
          description="这里是运营同学真正工作的地方：以验证码批次为中心，管理验证方式、访问范围、口令有效期与样例码展示。策略页只关注规则，不再和概览信息混在一起。"
          eyebrow="Verification Policies"
          title="验证码策略工作台"
        />
      </AdminPanel>

      {errorMessage ? (
        <div className="rounded-lg border border-warning/20 bg-warning/10 px-5 py-4 text-sm text-warning">{errorMessage}</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard description="当前可管理的验证码批次数量" title="批次总数" value={loading ? "-" : codeBatches.length} />
        <AdminMetricCard description="状态仍为 active 的批次" title="活跃批次" value={loading ? "-" : activeBatchCount} />
        <AdminMetricCard description="使用通用口令模式的批次" title="通用口令" value={loading ? "-" : sharedModeCount} />
        <AdminMetricCard description="使用一单一码模式的批次" title="一单一码" value={loading ? "-" : uniqueModeCount} />
        <AdminMetricCard description="14 天内到期，需要运营确认是否轮换" title="即将到期" value={loading ? "-" : expiringSoonCount} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminPanel className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">批次列表</p>
              <p className="mt-1 text-sm text-muted-foreground">先定位批次，再在右侧编辑策略。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "全部" },
                { key: "active", label: "仅活跃" },
                { key: "expiring", label: "即将到期" },
              ].map((item) => {
                const isActive = filterMode === item.key

                return (
                  <button
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition",
                      isActive
                        ? "border-info/20 bg-info/10 text-info"
                        : "border-border bg-background/70 text-muted-foreground hover:text-foreground",
                    )}
                    key={item.key}
                    onClick={() => setFilterMode(item.key as typeof filterMode)}
                    type="button"
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={`${adminInputClassName} pl-11`}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="搜索批次名或产品名"
              value={searchValue}
            />
          </label>

          {filteredBatches.length > 0 ? (
            <div className="space-y-3">
              {filteredBatches.map((batch) => {
                const isActive = batch.id === selectedBatch?.id
                const verificationMode = batch.policy.verificationMode ?? "shared_code"
                const isExpiringSoon = isExpiringWithin(batch.expiresAt, 14)

                return (
                  <button
                    className={cn(
                      "w-full rounded-lg border p-4 text-left transition",
                      isActive
                        ? "border-info/25 bg-info/8 shadow-[0_18px_40px_rgba(59,130,246,0.08)]"
                        : "border-border bg-background/75 hover:border-info/15 hover:bg-background",
                    )}
                    key={batch.id}
                    onClick={() => handleSelectBatch(batch.id)}
                    type="button"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-foreground">{batch.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{batch.productName}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <AdminBadge variant={batch.status === "active" ? "success" : "warning"}>{batch.status}</AdminBadge>
                        <AdminBadge variant={verificationMode === "unique_code" ? "info" : "neutral"}>{verificationModeLabels[verificationMode]}</AdminBadge>
                        {isExpiringSoon ? <AdminBadge variant="warning">14 天内到期</AdminBadge> : null}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-background px-3 py-2">策略类型：{batch.strategyType}</div>
                      <div className="rounded-lg border border-border bg-background px-3 py-2">有效码：{batch.codeCount}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <AdminEmptyState description="当前筛选条件下没有找到可管理的验证码批次。" title="暂无批次" />
          )}
        </AdminPanel>

        <AdminPanel>
          {selectedBatch && policyForm ? (
            <form className="space-y-5" onSubmit={handlePolicySubmit}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Ticket className="size-4 text-info" />
                    当前编辑批次
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{selectedBatch.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    所属产品：{selectedBatch.productName} · 最后到期：{formatAdminDate(selectedBatch.expiresAt)}
                  </p>
                </div>
                <AdminBadge variant={selectedBatch.status === "active" ? "success" : "warning"}>{selectedBatch.status}</AdminBadge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">验证方式</span>
                  <select
                    className={adminSelectClassName}
                    onChange={(event) =>
                      setPolicyForm((current) =>
                        current
                          ? {
                              ...current,
                              verificationMode: event.target.value as EditableVerificationMode,
                            }
                          : current,
                      )
                    }
                    value={policyForm.verificationMode}
                  >
                    <option value="shared_code">通用口令</option>
                    <option value="unique_code">一单一码</option>
                    
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">可访范围</span>
                  <select
                    className={adminSelectClassName}
                    onChange={(event) =>
                      setPolicyForm((current) =>
                        current
                          ? {
                              ...current,
                              scopeMode: event.target.value as EditableScopeMode,
                              allowQuizSlugs:
                                event.target.value === "product"
                                  ? selectedBatch.linkedQuizzes.map((quiz) => quiz.slug)
                                  : current.allowQuizSlugs,
                            }
                          : current,
                      )
                    }
                    value={policyForm.scopeMode}
                  >
                    <option value="product">整个产品内可访问</option>
                    <option value="custom_scope">仅允许指定题集</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-foreground">访问有效期（天）</span>
                  <input
                    className={adminInputClassName}
                    inputMode="numeric"
                    min={1}
                    onChange={(event) =>
                      setPolicyForm((current) => (current ? { ...current, tokenTtlDays: event.target.value } : current))
                    }
                    placeholder="例如 30"
                    value={policyForm.tokenTtlDays}
                  />
                </label>

                <div className="rounded-lg border border-border bg-background/70 p-4">
                  <label className="flex items-start gap-3">
                    <input
                      checked={policyForm.introVisible}
                      className="mt-1 size-4 rounded border-border accent-[hsl(var(--info))]"
                      onChange={(event) =>
                        setPolicyForm((current) => (current ? { ...current, introVisible: event.target.checked } : current))
                      }
                      type="checkbox"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">详情页保持可见</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">关闭后，后续可以继续收紧结果前的介绍信息暴露范围。</p>
                    </div>
                  </label>
                </div>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">策略备注</span>
                <textarea
                  className={adminTextareaClassName}
                  maxLength={300}
                  onChange={(event) =>
                    setPolicyForm((current) => (current ? { ...current, notes: event.target.value } : current))
                  }
                  placeholder="例如：首发期使用共享口令，每 7~14 天轮换一次。"
                  value={policyForm.notes}
                />
              </label>

              <div className="rounded-lg border border-border bg-background/70 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldCheck className="size-4 text-success" />
                  批次运行信息
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    码规则：{selectedBatch.codePrefix ?? "未配置前缀"} · 长度 {selectedBatch.codeLength}
                  </div>
                  <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    样例码数量：{selectedBatch.sampleCodes.length}
                  </div>
                  <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    当前有效码：{selectedBatch.codeCount}
                  </div>
                  <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    更新时间参考：{formatAdminDateTime(selectedBatch.expiresAt)}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedBatch.sampleCodes.length > 0 ? (
                    selectedBatch.sampleCodes.map((code) => (
                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground" key={code.code}>
                        {code.code}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground">暂无样例口令</span>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background/70 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Layers3 className="size-4 text-info" />
                  可访问题集范围
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  当前产品下的题集如下；切换到“指定题集”后，可以按需勾选真正可访问的题集范围。
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selectedBatch.linkedQuizzes.map((quiz) => {
                    const checked = policyForm.scopeMode === "product" || policyForm.allowQuizSlugs.includes(quiz.slug)

                    return (
                      <label className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3" key={quiz.slug}>
                        <input
                          checked={checked}
                          className="mt-1 size-4 rounded border-border accent-[hsl(var(--info))]"
                          disabled={policyForm.scopeMode === "product"}
                          onChange={(event) => {
                            setPolicyForm((current) => {
                              if (!current) {
                                return current
                              }

                              const nextAllowQuizSlugs = event.target.checked
                                ? Array.from(new Set([...current.allowQuizSlugs, quiz.slug]))
                                : current.allowQuizSlugs.filter((slug) => slug !== quiz.slug)

                              return {
                                ...current,
                                allowQuizSlugs: nextAllowQuizSlugs,
                              }
                            })
                          }}
                          type="checkbox"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{quiz.title}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{quiz.slug}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {policyErrorMessage ? (
                <div className="rounded-lg border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">{policyErrorMessage}</div>
              ) : null}

              {policySuccessMessage ? (
                <div className="rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{policySuccessMessage}</div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <Button className="rounded-full" disabled={savingPolicy} size="lg" type="submit">
                  <Save className="size-4" />
                  {savingPolicy ? "保存中..." : "保存验证码策略"}
                </Button>
                <Button
                  className="rounded-full"
                  disabled={savingPolicy}
                  onClick={() => setPolicyForm(createPolicyFormState(selectedBatch))}
                  size="lg"
                  type="button"
                  variant="outline"
                >
                  恢复当前值
                </Button>
              </div>
            </form>
          ) : (
            <AdminEmptyState description="先从左侧选择一个验证码批次，再编辑对应的验证策略。" title="请选择批次" />
          )}
        </AdminPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <AdminPanel>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Check className="size-4 text-success" />
            当前策略页的操作逻辑
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
            <li>先按批次管理，而不是直接按题集编辑，避免同一产品下规则分裂。</li>
            <li>保存只影响后续新签发的访问会话，不回溯改写历史结果。</li>
            <li>批次信息、样例码、可访范围放在同一工作区，减少来回切页确认。</li>
          </ul>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShieldCheck className="size-4 text-info" />
            运营提醒
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
            <li>若批次即将到期，建议先新建轮换批次，再同步更新外部发货文案。</li>
            <li>若某产品采用 custom scope，请定期确认题集范围是否仍与商品权益一致。</li>
            <li>样例码仅用于后台确认，不建议直接作为外部传播文案长期使用。</li>
          </ul>
        </AdminPanel>
      </section>
    </div>
  )
}
