import { KeyRound, Link2, LockKeyhole, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"

import {
  AdminBadge,
  AdminEmptyState,
  AdminPanel,
  AdminSectionHeading,
} from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import { fetchAdminQuizzes } from "@/features/quizzes/api"
import type { AdminQuizItem } from "@/features/quizzes/types"

const verificationModeLabels: Record<NonNullable<AdminQuizItem["verification"]>["verificationMode"], string> = {
  none: "无需验证",
  shared_code: "通用口令",
  unique_code: "一单一码",
  unknown: "待确认",
}

function SourceBadge({ source }: { source: AdminQuizItem["source"] }) {
  const mapping = {
    d1: "D1",
    mock: "Mock",
    static: "Static",
  } satisfies Record<AdminQuizItem["source"], string>

  return <AdminBadge variant={source === "d1" ? "info" : "neutral"}>{mapping[source]}</AdminBadge>
}

function AccessBadge({ accessType }: { accessType: AdminQuizItem["accessType"] }) {
  return <AdminBadge variant={accessType === "free" ? "success" : "info"}>{accessType === "free" ? "免费" : "付费"}</AdminBadge>
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === "published" || status === "active" ? "success" : "warning"
  return <AdminBadge variant={variant}>{status}</AdminBadge>
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString("zh-CN") : "无"
}

function FreeQuizCard({ quiz }: { quiz: AdminQuizItem }) {
  return (
    <AdminPanel className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <AccessBadge accessType={quiz.accessType} />
            <SourceBadge source={quiz.source} />
          </div>
          <h4 className="mt-4 text-lg font-semibold text-foreground">{quiz.title}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{quiz.category}</p>
        </div>
        <StatusBadge status={quiz.status} />
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">{quiz.summary}</p>
      <p className="mt-4 text-sm leading-7 text-foreground">
        {quiz.questionCount} 题 · {quiz.durationMinutes} 分钟 · {quiz.priceLabel}
      </p>
      <p className="mt-2 text-sm leading-7 text-success">{quiz.accessSummary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {quiz.tags.map((tag) => (
          <span className="rounded-full border border-border bg-background/75 px-3 py-1 text-xs text-muted-foreground" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="rounded-full" size="lg" variant="outline">
          <Link to={quiz.introPath}>查看介绍页</Link>
        </Button>
        <Button asChild className="rounded-full" size="lg" variant="outline">
          <Link to={quiz.testPath}>打开测试页</Link>
        </Button>
      </div>
    </AdminPanel>
  )
}

function PaidQuizCard({ quiz }: { quiz: AdminQuizItem }) {
  const verification = quiz.verification

  return (
    <AdminPanel className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <AccessBadge accessType={quiz.accessType} />
            <SourceBadge source={quiz.source} />
          </div>
          <h4 className="mt-4 text-lg font-semibold text-foreground">{quiz.title}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{quiz.category}</p>
        </div>
        <StatusBadge status={quiz.status} />
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">{quiz.summary}</p>

      <div className="mt-5 rounded-[24px] border border-info/15 bg-info/6 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LockKeyhole className="size-4 text-info" />
          当前验证策略
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[20px] border border-border bg-background/75 p-4">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">验证模式</p>
            <p className="mt-2 text-sm font-medium text-foreground">{verification ? verificationModeLabels[verification.verificationMode] : "待确认"}</p>
          </div>
          <div className="rounded-[20px] border border-border bg-background/75 p-4">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">会话有效期</p>
            <p className="mt-2 text-sm font-medium text-foreground">{verification?.tokenTtlDays ? `${verification.tokenTtlDays} 天` : "未配置"}</p>
          </div>
          <div className="rounded-[20px] border border-border bg-background/75 p-4">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">批次信息</p>
            <p className="mt-2 text-sm font-medium text-foreground">{verification?.batchName ?? "未绑定"}</p>
            {verification?.batchStrategyType ? <p className="mt-1 text-xs text-muted-foreground">策略：{verification.batchStrategyType}</p> : null}
          </div>
          <div className="rounded-[20px] border border-border bg-background/75 p-4">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">当前有效码数</p>
            <p className="mt-2 text-sm font-medium text-foreground">{verification?.activeCodeCount ?? 0}</p>
            {verification?.scopeMode ? <p className="mt-1 text-xs text-muted-foreground">范围：{verification.scopeMode}</p> : null}
          </div>
        </div>

        {verification?.notes ? (
          <div className="mt-4 rounded-[20px] border border-border bg-background/75 p-4 text-sm leading-7 text-muted-foreground">{verification.notes}</div>
        ) : null}

        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <KeyRound className="size-4 text-warning" />
            验证码样例
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(verification?.sampleCodes ?? []).length > 0 ? (
              (verification?.sampleCodes ?? []).map((codeItem) => (
                <div className="rounded-2xl border border-border bg-background/80 px-3 py-2" key={codeItem.code}>
                  <p className="font-mono text-sm text-foreground">{codeItem.code}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {codeItem.status} · 到期 {formatDate(codeItem.expiresAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">当前没有可展示的有效验证码</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="rounded-full" size="lg" variant="outline">
          <Link to={quiz.introPath}>
            <Link2 className="size-4" />
            查看介绍页
          </Link>
        </Button>
        <Button asChild className="rounded-full" size="lg" variant="outline">
          <Link to={quiz.testPath}>打开测试页</Link>
        </Button>
      </div>
    </AdminPanel>
  )
}

export function AdminQuizzesPage() {
  const [items, setItems] = useState<AdminQuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const quizItems = await fetchAdminQuizzes()

        if (!active) {
          return
        }

        setItems(quizItems)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "测试题列表加载失败")
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

  const freeItems = useMemo(() => items.filter((item) => item.accessType === "free"), [items])
  const paidItems = useMemo(() => items.filter((item) => item.accessType === "paid"), [items])

  return (
    <div className="space-y-8">
      <AdminPanel>
        <AdminSectionHeading
          description="先做最小管理能力：把免费题与付费题拆开浏览。付费题额外展示当前验证方式、口令有效期、批次说明和验证码样例，方便运营同学快速确认线上状态。"
          eyebrow="Quiz Management"
          title="测试题列表浏览"
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <AdminBadge variant="success">免费 {loading ? "-" : freeItems.length}</AdminBadge>
          <AdminBadge variant="info">付费 {loading ? "-" : paidItems.length}</AdminBadge>
          <AdminBadge variant="warning">只读浏览</AdminBadge>
        </div>
      </AdminPanel>

      {errorMessage ? (
        <div className="rounded-[24px] border border-warning/20 bg-warning/10 px-5 py-4 text-sm text-warning">{errorMessage}</div>
      ) : null}

      <section className="space-y-5">
        <div>
          <h3 className="text-xl font-semibold text-foreground">免费测试</h3>
          <p className="mt-1 text-sm text-muted-foreground">适合做前端传播和冷启动引流的免费题。</p>
        </div>

        {freeItems.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {freeItems.map((quiz) => (
              <FreeQuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <AdminEmptyState description="当前没有可展示的免费测试。" title="暂无免费测试" />
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2 text-foreground">
          <Sparkles className="size-5 text-warning" />
          <div>
            <h3 className="text-xl font-semibold">付费测试</h3>
            <p className="mt-1 text-sm text-muted-foreground">展示付费测试当前的验证方式、批次和验证码样例。</p>
          </div>
        </div>

        {paidItems.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {paidItems.map((quiz) => (
              <PaidQuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <AdminEmptyState description="当前没有可展示的付费测试。" title="暂无付费测试" />
        )}
      </section>
    </div>
  )
}