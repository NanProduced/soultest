import type { LucideIcon } from "lucide-react"
import {
  Clock3,
  Info,
  KeyRound,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
} from "lucide-react"
import { useMemo } from "react"
import { useOutletContext } from "react-router"

import {
  AdminBadge,
  AdminMetricGrid,
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionTitle,
  AdminStatCard,
} from "@/components/admin/admin-ui"
import type { AdminLayoutOutletContext } from "@/app/layouts/admin-layout"
import { ADMIN_API_BASE, ADMIN_PORTAL_BASE } from "@/features/admin/constants"
import { formatAdminDateTime } from "@/features/admin/display"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

interface SessionMeta {
  isExpiringSoon: boolean
  label: string
  remainingHours: number | null
}

interface SecurityItem {
  description: string
  icon: LucideIcon
  title: string
  variant: "info" | "success" | "warning"
}

interface SecurityFact {
  description: string
  label: string
  value: string
}

interface HardeningItem {
  description: string
  priority: "high" | "medium"
  title: string
}

function getSessionMeta(expiresAt: string): SessionMeta {
  const diffMs = new Date(expiresAt).getTime() - Date.now()

  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return {
      isExpiringSoon: true,
      label: "已过期",
      remainingHours: 0,
    }
  }

  const remainingHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)))

  return {
    isExpiringSoon: remainingHours <= 8,
    label: `${remainingHours} 小时`,
    remainingHours,
  }
}

function getPriorityVariant(priority: HardeningItem["priority"]) {
  return priority === "high" ? "warning" : "info"
}

function SecurityCapabilityCard({ item }: { item: SecurityItem }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-background p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      <div className="relative z-10 flex items-center gap-3 text-base font-black uppercase tracking-tight text-foreground">
        <div className={cn(
          "flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          item.variant === "success" ? "bg-success/10 text-success" : item.variant === "warning" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
        )}>
          <item.icon className="size-5" />
        </div>
        {item.title}
      </div>
      <p className="relative z-10 mt-4 text-sm font-medium leading-relaxed text-muted-foreground/70">{item.description}</p>
      <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/5 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  )
}

function SecurityFactCard({ item }: { item: SecurityFact }) {
  return (
    <div className="group rounded-[2rem] border border-border/40 bg-muted/5 p-6 transition-all duration-300 hover:bg-muted/10">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 transition-colors group-hover:text-primary">{item.label}</div>
      <div className="mt-2 break-all font-mono text-sm font-black text-foreground">{item.value}</div>
      <p className="mt-3 text-xs font-medium leading-relaxed text-muted-foreground/60">{item.description}</p>
    </div>
  )
}

function HardeningCard({ item }: { item: HardeningItem }) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-[2.5rem] border border-border/40 bg-background p-8 transition-all duration-300 hover:border-warning/30 hover:shadow-xl hover:shadow-warning/5 lg:flex-row lg:items-center">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-lg font-black tracking-tight text-foreground uppercase">{item.title}</div>
          <AdminBadge className="px-3 py-1 font-black uppercase tracking-widest text-[10px]" variant={getPriorityVariant(item.priority)}>
            {item.priority === "high" ? "Critical" : "Standard"}
          </AdminBadge>
        </div>
        <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground/70">{item.description}</p>
      </div>
      <Button className="h-12 rounded-xl px-6 font-black uppercase tracking-widest transition-all active:scale-95 lg:h-14" variant="outline">
        开始加固
      </Button>
    </div>
  )
}

export function AdminSecurityPage() {
  const { session } = useOutletContext<AdminLayoutOutletContext>()

  const sessionMeta = useMemo(() => getSessionMeta(session.expiresAt), [session.expiresAt])

  const accessFacts: SecurityFact[] = [
    {
      label: "后台入口",
      value: ADMIN_PORTAL_BASE,
      description: "使用隐蔽路径降低普通用户误入概率，但它不是最终安全边界。",
    },
    {
      label: "API 前缀",
      value: ADMIN_API_BASE,
      description: "所有后台读写请求都走同一组私有前缀，便于后续补统一防护。",
    },
    {
      label: "会话载体",
      value: "HttpOnly Cookie",
      description: "会话不暴露给前端脚本，降低浏览器环境下的直接读取风险。",
    },
    {
      label: "对外暴露方式",
      value: "公网入口 + 管理员会话",
      description: "当前仍是公网可达模式，建议下一阶段补零信任入口收紧暴露面。",
    },
  ]

  const protectionItems: SecurityItem[] = [
    {
      icon: LockKeyhole,
      title: "隐蔽路径",
      description: "后台统一收口到 private-room，减少被普通用户无意访问的概率。",
      variant: "info",
    },
    {
      icon: KeyRound,
      title: "三重校验",
      description: "账号、密码、访问密钥全部通过后才会签发后台会话。",
      variant: "success",
    },
    {
      icon: TimerReset,
      title: "限时会话",
      description: "后台状态通过 HttpOnly Cookie 保存，会话过期后需要重新进入受控流程。",
      variant: "warning",
    },
    {
      icon: ShieldCheck,
      title: "失败锁定",
      description: "连续失败尝试会触发按 IP 的临时锁定，降低暴力尝试风险。",
      variant: "success",
    },
  ]

  const hardeningItems: HardeningItem[] = [
    {
      title: "接入零信任访问",
      description: "优先评估 Cloudflare Access，在应用登录之前再加一层入口拦截。",
      priority: "high",
    },
    {
      title: "补操作审计",
      description: "至少记录批次编辑、冻结、撤销、验证码生成等关键动作，便于排查与回溯。",
      priority: "high",
    },
    {
      title: "建立轮换记录",
      description: "把访问密钥与批次轮换时间收口成统一记录，避免运营排查时只能人工追溯。",
      priority: "medium",
    },
  ]

  const prioritySignals = [
    sessionMeta.isExpiringSoon ? `当前会话剩余 ${sessionMeta.label}，建议注意续期节奏。` : `当前会话仍有 ${sessionMeta.label}，访问状态稳定。`,
    "后台仍属于公网可达入口，零信任访问仍是最值得优先补上的加固项。",
    "关键操作的审计记录尚未接入，后续需要补齐变更可追踪性。",
  ]

  return (
    <AdminPage>
      <AdminPageHeader
        badge="Protected"
        description="集中查看后台暴露面、已启用的访问控制与当前管理员会话，明确接下来该先收紧哪里。"
        title="安全中心"
      />

      <AdminMetricGrid columns={4}>
        <AdminStatCard helper="当前管理员会话所使用的账号。" label="管理员" value={session.username} />
        <AdminStatCard helper="按照当前时间估算的会话剩余时长。" label="会话剩余" tone={sessionMeta.isExpiringSoon ? "warning" : "success"} value={sessionMeta.label} />
        <AdminStatCard helper="当前已明确启用的基础保护项。" label="已启用保护" tone="success" value={protectionItems.length} />
        <AdminStatCard helper="下一阶段应优先补齐的加固项。" label="待补强事项" tone="warning" value={hardeningItems.length} />
      </AdminMetricGrid>

      <section className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-12">
          <div className="space-y-8 rounded-[3rem] border border-border/40 bg-muted/5 p-8 lg:p-12">
            <AdminSectionTitle description="先看后台目前的暴露方式与会话健康度，再决定优先加固哪一层。" title="安全态势" />

            <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-background p-8 shadow-xl shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-6">
                  <div className="text-2xl font-black tracking-tight text-foreground uppercase">当前后台已具备基础访问控制。</div>
                  <div className="flex flex-wrap gap-3">
                    <AdminBadge className="px-4 py-1.5 font-black uppercase tracking-widest text-[10px]" variant="info">private-room 入口</AdminBadge>
                    <AdminBadge className="px-4 py-1.5 font-black uppercase tracking-widest text-[10px]" variant="success">三重校验</AdminBadge>
                    <AdminBadge className="px-4 py-1.5 font-black uppercase tracking-widest text-[10px]" variant="success">HttpOnly 会话</AdminBadge>
                    <AdminBadge className="px-4 py-1.5 font-black uppercase tracking-widest text-[10px]" variant="warning">公网暴露</AdminBadge>
                  </div>
                </div>

                <div className="shrink-0 rounded-[2rem] border border-border/40 bg-muted/5 p-6 text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">状态评估</div>
                  <div className={cn("mt-2 text-lg font-black uppercase tracking-tight", sessionMeta.isExpiringSoon ? "text-warning" : "text-success")}>
                    {sessionMeta.isExpiringSoon ? "临近过期" : "状态稳定"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {accessFacts.map((item) => (
                <SecurityFactCard item={item} key={item.label} />
              ))}
            </div>
          </div>

          <div className="space-y-8 rounded-[3rem] border border-border/40 bg-muted/5 p-8 lg:p-12">
            <AdminSectionTitle description="这些是当前已经生效的基础控制项，用来判断后台是否具备最基本的防误入与防暴力尝试能力。" title="已启用控制" />

            <div className="grid gap-4 md:grid-cols-2">
              {protectionItems.map((item) => (
                <SecurityCapabilityCard item={item} key={item.title} />
              ))}
            </div>
          </div>

          <div className="space-y-8 rounded-[3rem] border border-border/40 bg-muted/5 p-8 lg:p-12">
            <AdminSectionTitle description="这些不是实时告警，而是基于当前架构最值得优先补上的安全动作。" title="下一步加固" />

            <div className="space-y-4">
              {hardeningItems.map((item) => (
                <HardeningCard item={item} key={item.title} />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-12">
          <div className="sticky top-12 space-y-12">
            <div className="space-y-8 rounded-[3rem] border border-border/40 bg-background p-8 shadow-2xl shadow-primary/5 lg:p-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <ShieldCheck className="size-6" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight text-foreground uppercase">当前会话</h4>
                </div>
                <AdminBadge className="font-black uppercase tracking-widest text-[10px]" variant={sessionMeta.isExpiringSoon ? "warning" : "success"}>
                  {sessionMeta.isExpiringSoon ? "Check" : "Valid"}
                </AdminBadge>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-border/40 bg-muted/5 p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">管理员账号</div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-foreground">{session.username}</div>
                </div>

                <div className="grid gap-4">
                  {[
                    { label: "登录时间", value: formatAdminDateTime(session.issuedAt), icon: Clock3 },
                    { label: "会话截止", value: formatAdminDateTime(session.expiresAt), icon: TimerReset },
                    { label: "剩余时长", value: sessionMeta.label, tone: sessionMeta.isExpiringSoon ? "warning" : "default" }
                  ].map((item, i) => (
                    <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-background p-5 shadow-sm" key={i}>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{item.label}</p>
                        <p className={cn("text-sm font-black", item.tone === "warning" ? "text-warning" : "text-foreground")}>{item.value}</p>
                      </div>
                      {item.icon && <item.icon className="size-4 text-muted-foreground/20" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[3rem] border border-primary/20 bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/20 lg:p-10">
              <div className="flex gap-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <Info className="size-6" />
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-black uppercase tracking-widest">保护摘要</p>
                  <div className="space-y-4">
                    {protectionItems.slice(0, 3).map((item) => (
                      <div className="flex items-start gap-3 opacity-80" key={item.title}>
                        <div className="mt-1 size-1.5 shrink-0 rounded-full bg-current" />
                        <p className="text-xs font-bold leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </AdminPage>
  )
}
