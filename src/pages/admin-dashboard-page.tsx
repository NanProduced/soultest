import { BarChart3, Check, Layers3, LockKeyhole, Package, Save, ShieldCheck, Ticket } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"

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
  fetchAdminCodeBatches,
  fetchAdminOverview,
  fetchAdminProducts,
  fetchAdminQuizzes,
  updateAdminCodeBatchPolicy,
} from "@/features/quizzes/api"
import type { AdminCodeBatch, AdminCodeBatchPolicy, AdminOverview, AdminProduct, AdminQuizItem } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

const verificationModeLabels = {
  none: "免验证码",
  shared_code: "通用口令",
  unique_code: "一单一码",
} as const

const scopeModeLabels = {
  product: "整个产品内可访问",
  custom_scope: "仅允许指定题集",
} as const

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

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString("zh-CN") : "无"
}

function formatDateTime(value?: string) {
  return value ? new Date(value).toLocaleString("zh-CN") : "-"
}

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

export function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview>()
  const [quizzes, setQuizzes] = useState<AdminQuizItem[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [codeBatches, setCodeBatches] = useState<AdminCodeBatch[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState<string>()
  const [policyForm, setPolicyForm] = useState<CodeBatchPolicyFormState>()
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [policyErrorMessage, setPolicyErrorMessage] = useState<string>()
  const [policySuccessMessage, setPolicySuccessMessage] = useState<string>()
  const [savingPolicy, setSavingPolicy] = useState(false)

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
        setSelectedBatchId((currentBatchId) => currentBatchId ?? batchData[0]?.id)
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

  const selectedBatch = useMemo(
    () => codeBatches.find((batch) => batch.id === selectedBatchId) ?? codeBatches[0],
    [codeBatches, selectedBatchId],
  )

  useEffect(() => {
    if (!selectedBatch && codeBatches.length > 0) {
      setSelectedBatchId(codeBatches[0].id)
      return
    }

    if (!selectedBatch) {
      setPolicyForm(undefined)
      return
    }

    setPolicyForm(createPolicyFormState(selectedBatch))
  }, [codeBatches, selectedBatch])

  function handleSelectBatch(batchId: string) {
    setSelectedBatchId(batchId)
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
    const nextTokenTtlDays = trimmedTokenTtlDays ? Number.parseInt(trimmedTokenTtlDays, 10) : undefined
    const hasInvalidTokenTtlDays =
      trimmedTokenTtlDays.length > 0 && (!Number.isInteger(nextTokenTtlDays) || (nextTokenTtlDays ?? 0) <= 0)

    if (hasInvalidTokenTtlDays) {
      setSavingPolicy(false)
      setPolicyErrorMessage("会话有效期请输入正整数天数；留空则沿用系统默认值。")
      return
    }

    if (policyForm.scopeMode === "custom_scope" && policyForm.allowQuizSlugs.length === 0) {
      setSavingPolicy(false)
      setPolicyErrorMessage("指定题集模式下，至少需要勾选一个题集。")
      return
    }

    try {
      const nextPolicy: AdminCodeBatchPolicy = {
        verificationMode: policyForm.verificationMode,
        scopeMode: policyForm.scopeMode,
        tokenTtlDays: nextTokenTtlDays,
        introVisible: policyForm.introVisible,
        notes: policyForm.notes.trim(),
        allowQuizSlugs: policyForm.scopeMode === "custom_scope" ? policyForm.allowQuizSlugs : undefined,
      }

      const updatedBatch = await updateAdminCodeBatchPolicy(selectedBatch.id, nextPolicy)

      setCodeBatches((currentBatches) =>
        currentBatches.map((batch) => (batch.id === updatedBatch.id ? updatedBatch : batch)),
      )
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
          description="当前管理台先聚焦运营最常用的能力：题集、产品、验证码批次以及验证码策略管理，方便快速确认并调整线上验证规则。"
          eyebrow="Overview"
          title="当前运营概览"
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <AdminBadge variant="info">策略可编辑</AdminBadge>
          <AdminBadge variant="success">会话校验</AdminBadge>
          <AdminBadge variant="warning">失败限流</AdminBadge>
        </div>
      </AdminPanel>

      {errorMessage ? (
        <div className="rounded-[24px] border border-warning/20 bg-warning/10 px-5 py-4 text-sm text-warning">{errorMessage}</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard description="已接入前台题集数量" title="题集" value={loading ? "-" : overview?.quizzes ?? 0} />
        <AdminMetricCard description="当前可售卖的产品数量" title="产品" value={loading ? "-" : overview?.products ?? 0} />
        <AdminMetricCard description="验证码批次数量" title="批次" value={loading ? "-" : overview?.codeBatches ?? 0} />
        <AdminMetricCard description="当前仍可使用的验证码数量" title="有效码" value={loading ? "-" : overview?.activeCodes ?? 0} />
        <AdminMetricCard description="累计提交记录" title="提交数" value={loading ? "-" : overview?.submissions ?? 0} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <AdminPanel>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Layers3 className="size-4 text-info" />
            测试题
          </div>
          <div className="mt-5 space-y-3">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div className="rounded-[22px] border border-border bg-background/70 px-4 py-4" key={quiz.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{quiz.title}</p>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">
                        {quiz.questionCount} 题 · {quiz.durationMinutes} 分钟
                      </p>
                    </div>
                    <AdminBadge variant={quiz.accessType === "free" ? "success" : "info"}>{quiz.accessType === "free" ? "免费" : "付费"}</AdminBadge>
                  </div>
                </div>
              ))
            ) : (
              <AdminEmptyState description="当前还没有可展示的测试题。" title="暂无数据" />
            )}
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Package className="size-4 text-info" />
            产品
          </div>
          <div className="mt-5 space-y-3">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="rounded-[22px] border border-border bg-background/70 px-4 py-4" key={product.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">{product.description}</p>
                    </div>
                    <AdminBadge variant={product.status === "active" ? "success" : "warning"}>{product.status}</AdminBadge>
                  </div>
                </div>
              ))
            ) : (
              <AdminEmptyState description="当前还没有可展示的产品。" title="暂无产品" />
            )}
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Ticket className="size-4 text-info" />
            验证码批次
          </div>
          <div className="mt-5 space-y-3">
            {codeBatches.length > 0 ? (
              codeBatches.map((batch) => (
                <div className="rounded-[22px] border border-border bg-background/70 px-4 py-4" key={batch.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{batch.name}</p>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">{batch.productName}</p>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground">
                        {batch.codeCount} 个口令 · 到期 {formatDate(batch.expiresAt)}
                      </p>
                    </div>
                    <AdminBadge variant="info">{batch.strategyType}</AdminBadge>
                  </div>
                </div>
              ))
            ) : (
              <AdminEmptyState description="当前还没有验证码批次。" title="暂无批次" />
            )}
          </div>
        </AdminPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AdminPanel>
          <AdminSectionHeading
            description="策略配置仍然挂在验证码批次上；左侧选择批次，右侧直接调整当前验证模式、会话有效期和可访问题集范围。"
            eyebrow="Policy"
            title="验证码策略管理"
          />

          <div className="mt-6 space-y-3">
            {codeBatches.length > 0 ? (
              codeBatches.map((batch) => {
                const isActive = batch.id === selectedBatch?.id
                const verificationMode = (batch.policy.verificationMode ?? "shared_code") as EditableVerificationMode
                const scopeMode = (batch.policy.scopeMode === "custom_scope" ? "custom_scope" : "product") as EditableScopeMode

                return (
                  <button
                    className={cn(
                      "w-full rounded-[24px] border px-4 py-4 text-left transition",
                      isActive
                        ? "border-info/30 bg-info/10 shadow-[0_16px_40px_rgba(59,130,246,0.10)]"
                        : "border-border bg-background/70 hover:border-info/20 hover:bg-background",
                    )}
                    key={batch.id}
                    onClick={() => handleSelectBatch(batch.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{batch.name}</p>
                        <p className="mt-2 text-xs leading-6 text-muted-foreground">{batch.productName}</p>
                        <p className="mt-2 text-xs leading-6 text-muted-foreground">
                          {verificationModeLabels[verificationMode]} · {scopeModeLabels[scopeMode]}
                        </p>
                      </div>
                      <AdminBadge variant={isActive ? "info" : batch.status === "active" ? "success" : "warning"}>
                        {isActive ? "编辑中" : batch.status}
                      </AdminBadge>
                    </div>
                  </button>
                )
              })
            ) : (
              <AdminEmptyState description="当前没有可配置的验证码批次。" title="暂无策略对象" />
            )}
          </div>
        </AdminPanel>

        <AdminPanel>
          {selectedBatch && policyForm ? (
            <form className="space-y-6" onSubmit={handlePolicySubmit}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <AdminBadge variant="invert">正在编辑</AdminBadge>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{selectedBatch.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selectedBatch.productName} · {selectedBatch.strategyType} · 到期 {formatDate(selectedBatch.expiresAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge variant={selectedBatch.status === "active" ? "success" : "warning"}>{selectedBatch.status}</AdminBadge>
                  <AdminBadge variant="info">{selectedBatch.codeCount} 个有效口令样本</AdminBadge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">验证模式</span>
                  <select
                    className={adminSelectClassName}
                    onChange={(event) =>
                      setPolicyForm((current) => (current ? { ...current, verificationMode: event.target.value as EditableVerificationMode } : current))
                    }
                    value={policyForm.verificationMode}
                  >
                    <option value="shared_code">通用口令</option>
                    <option value="unique_code">一单一码</option>
                    <option value="none">免验证码</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">生效范围</span>
                  <select
                    className={adminSelectClassName}
                    onChange={(event) =>
                      setPolicyForm((current) =>
                        current
                          ? {
                              ...current,
                              scopeMode: event.target.value as EditableScopeMode,
                              allowQuizSlugs: event.target.value === "custom_scope" ? current.allowQuizSlugs : [],
                            }
                          : current,
                      )
                    }
                    value={policyForm.scopeMode}
                  >
                    <option value="product">整个产品</option>
                    <option value="custom_scope">指定题集</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">会话有效期（天）</span>
                  <input
                    className={adminInputClassName}
                    inputMode="numeric"
                    min={1}
                    onChange={(event) =>
                      setPolicyForm((current) => (current ? { ...current, tokenTtlDays: event.target.value } : current))
                    }
                    placeholder="留空则沿用系统默认值"
                    value={policyForm.tokenTtlDays}
                  />
                </label>

                <label className="flex items-center gap-3 rounded-[20px] border border-border bg-background/70 px-4 py-3 sm:mt-7">
                  <input
                    checked={policyForm.introVisible}
                    className="size-4 rounded border-border accent-[hsl(var(--info))]"
                    onChange={(event) =>
                      setPolicyForm((current) => (current ? { ...current, introVisible: event.target.checked } : current))
                    }
                    type="checkbox"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">详情页保持可见</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">关闭后，可在后续迭代中进一步限制结果页之前的介绍信息暴露。</p>
                  </div>
                </label>
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

              <div className="rounded-[24px] border border-border bg-background/70 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Ticket className="size-4 text-info" />
                  当前批次信息
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    码规则：{selectedBatch.codePrefix ?? "未配置前缀"} · 长度 {selectedBatch.codeLength}
                  </div>
                  <div className="rounded-[20px] border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    当前绑定题集：{selectedBatch.linkedQuizzes.length} 个
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

              <div className="rounded-[24px] border border-border bg-background/70 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Check className="size-4 text-success" />
                  可访问题集范围
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  当前产品下的题集如下；切换到“指定题集”后，可以按需勾选真正可访问的题集范围。
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selectedBatch.linkedQuizzes.map((quiz) => {
                    const checked =
                      policyForm.scopeMode === "product" || policyForm.allowQuizSlugs.includes(quiz.slug)

                    return (
                      <label className="flex items-start gap-3 rounded-[20px] border border-border bg-background px-4 py-3" key={quiz.slug}>
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
                <div className="rounded-[20px] border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">{policyErrorMessage}</div>
              ) : null}

              {policySuccessMessage ? (
                <div className="rounded-[20px] border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{policySuccessMessage}</div>
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

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <AdminPanel>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShieldCheck className="size-4 text-success" />
            当前后台安全策略
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-border bg-background/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <LockKeyhole className="size-4 text-info" />
                入口防护
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">使用隐蔽入口路径与 HttpOnly 会话，避免普通用户误入并直接操作后台。</p>
            </div>
            <div className="rounded-[22px] border border-border bg-background/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="size-4 text-success" />
                身份校验
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">登录要求账号、密码和访问密钥三项同时正确后才可创建后台会话。</p>
            </div>
            <div className="rounded-[22px] border border-border bg-background/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <BarChart3 className="size-4 text-warning" />
                失败限流
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">连续失败会触发短时锁定，降低公网暴露场景下的撞库与爆破风险。</p>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BarChart3 className="size-4 text-info" />
            当前状态
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">最后一次数据载入时间：{formatDateTime(overview?.lastSeedAt)}</p>
        </AdminPanel>
      </section>
    </div>
  )
}




