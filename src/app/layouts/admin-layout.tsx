import { AnimatePresence, motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { BarChart3, Info, LayoutDashboard, LogOut, Package, RefreshCcw, ShieldCheck, SquareLibrary, Ticket } from "lucide-react"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, NavLink, Outlet } from "react-router"

import { AdminNotice, AdminPanel, adminInputClassName } from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import { buildAdminPortalPath } from "@/features/admin/constants"
import { formatAdminDateTime } from "@/features/admin/display"
import { ApiError, createAdminSession, deleteAdminSession, fetchAdminSession } from "@/features/quizzes/api"
import type { AdminSessionSummary } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

export interface AdminLayoutOutletContext {
  session: AdminSessionSummary
}

interface NavigationItem {
  description: string
  end: boolean
  icon: LucideIcon
  label: string
  to: string
}

interface NavigationGroup {
  items: NavigationItem[]
  title: string
}

const navigationGroups: NavigationGroup[] = [
  {
    title: "概览",
    items: [
      {
        to: buildAdminPortalPath(),
        label: "运营总览",
        description: "看当前状态、风险和待处理事项",
        icon: LayoutDashboard,
        end: true,
      },
      {
        to: buildAdminPortalPath("analytics"),
        label: "数据分析",
        description: "查看趋势、排行与发码分布",
        icon: BarChart3,
        end: false,
      },
    ],
  },
  {
    title: "资源",
    items: [
      {
        to: buildAdminPortalPath("quizzes"),
        label: "题集",
        description: "查看免费题与付费题",
        icon: SquareLibrary,
        end: false,
      },
      {
        to: buildAdminPortalPath("products"),
        label: "商品",
        description: "查看商品覆盖与权益",
        icon: Package,
        end: false,
      },
      {
        to: buildAdminPortalPath("batches"),
        label: "验证码批次",
        description: "管理批次、范围与时效",
        icon: Ticket,
        end: false,
      },
    ],
  },
  {
    title: "安全",
    items: [
      {
        to: buildAdminPortalPath("security"),
        label: "安全中心",
        description: "查看入口、会话与防护",
        icon: ShieldCheck,
        end: false,
      },
    ],
  },
]

function AdminLoginPanel({
  initialErrorMessage,
  onAuthenticated,
}: {
  initialErrorMessage?: string
  onAuthenticated: (session: AdminSessionSummary) => void
}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [accessKey, setAccessKey] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(initialErrorMessage)

  useEffect(() => {
    setErrorMessage(initialErrorMessage)
  }, [initialErrorMessage])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage(undefined)

    try {
      const session = await createAdminSession(username, password, accessKey)
      onAuthenticated(session)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "后台身份校验失败，请稍后重试")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
      >
        <AdminPanel className="w-full max-w-sm rounded-[2.5rem] border-border/40 p-8 shadow-2xl shadow-primary/5 sm:p-10">
          <div className="mb-10 space-y-3 text-center">
            <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <ShieldCheck className="size-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">SoulTest Admin</h1>
            <p className="text-sm font-medium text-muted-foreground">身份验证工作台</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60" htmlFor="admin-username">
                  管理员账号
                </label>
                <input
                  autoComplete="username"
                  className={cn(adminInputClassName, "h-12 rounded-xl border-border/50 bg-muted/5 font-bold shadow-inner focus:ring-primary/20")}
                  id="admin-username"
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                  value={username}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60" htmlFor="admin-password">
                  登录密码
                </label>
                <input
                  autoComplete="current-password"
                  className={cn(adminInputClassName, "h-12 rounded-xl border-border/50 bg-muted/5 font-bold shadow-inner focus:ring-primary/20")}
                  id="admin-password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  type="password"
                  value={password}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60" htmlFor="admin-access-key">
                  私域访问密钥
                </label>
                <input
                  autoComplete="one-time-code"
                  className={cn(adminInputClassName, "h-12 rounded-xl border-border/50 bg-muted/5 font-bold shadow-inner focus:ring-primary/20")}
                  id="admin-access-key"
                  onChange={(event) => setAccessKey(event.target.value)}
                  placeholder="••••••••"
                  type="password"
                  value={accessKey}
                />
              </div>
            </div>

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl bg-destructive/10 p-3 text-xs font-bold text-destructive"
                  initial={{ opacity: 0, x: -10 }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <Button className="h-14 w-full rounded-2xl text-base font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-[0.98]" disabled={submitting} type="submit">
              {submitting ? (
                <RefreshCcw className="mr-2 size-5 animate-spin" />
              ) : (
                "进入管理系统"
              )}
            </Button>
          </form>
        </AdminPanel>
      </motion.div>
    </div>
  )
}

export function AdminLayout() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading")
  const [session, setSession] = useState<AdminSessionSummary>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    let active = true

    async function loadSession() {
      try {
        const currentSession = await fetchAdminSession()

        if (!active) {
          return
        }

        setSession(currentSession)
        setErrorMessage(undefined)
        setAuthStatus("authenticated")
      } catch (error) {
        if (!active) {
          return
        }

        if (error instanceof ApiError && error.status === 401) {
          setAuthStatus("unauthenticated")
          setSession(undefined)
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "后台会话校验失败")
        setAuthStatus("unauthenticated")
      }
    }

    void loadSession()

    return () => {
      active = false
    }
  }, [])

  async function handleLogout() {
    setLoggingOut(true)

    try {
      await deleteAdminSession()
    } finally {
      setLoggingOut(false)
      setSession(undefined)
      setAuthStatus("unauthenticated")
    }
  }

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          className="mb-8 flex size-20 items-center justify-center rounded-[2.5rem] bg-primary shadow-2xl shadow-primary/20"
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShieldCheck className="size-10 text-primary-foreground" />
        </motion.div>
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-black tracking-tight text-foreground uppercase">正在校验身份</h2>
          <div className="flex items-center justify-center gap-1.5">
            <div className="size-1.5 animate-bounce rounded-full bg-primary" />
            <div className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
            <div className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    )
  }

  if (authStatus === "unauthenticated" || !session) {
    return (
      <AdminLoginPanel
        initialErrorMessage={errorMessage}
        onAuthenticated={(currentSession) => {
          setSession(currentSession)
          setErrorMessage(undefined)
          setAuthStatus("authenticated")
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/5 text-foreground">
      {/* Sidebar (Desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border/40 bg-background lg:flex">
        <div className="flex h-20 items-center px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <ShieldCheck className="size-6" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase text-foreground">SoulTest <span className="text-primary/60">Admin</span></span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-10">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{group.title}</p>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )
                      }
                      end={item.end}
                      key={item.to}
                      to={item.to}
                    >
                      <Icon className={cn("size-5 transition-transform duration-300 group-hover:scale-110")} />
                      {item.label}
                      <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="size-1 rounded-full bg-current" />
                      </div>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-3xl border border-border/40 bg-muted/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-background border border-border/50 shadow-sm text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-foreground truncate">{session.username}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">系统管理员</p>
              </div>
            </div>
            <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter bg-background/50 rounded-lg px-2 py-1.5 truncate">
              有效至: {formatAdminDateTime(session.expiresAt)}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button asChild className="flex-1 rounded-xl h-10 text-xs font-bold" variant="outline">
              <Link to="/">前台</Link>
            </Button>
            <Button className="flex-1 rounded-xl h-10 text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={loggingOut} onClick={handleLogout} variant="ghost">
              {loggingOut ? <RefreshCcw className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              退出
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex w-full flex-col lg:pl-72">
        {/* Top Header (Mobile & Desktop) */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/40 bg-background/80 px-8 backdrop-blur-xl lg:px-10">
          <div className="flex items-center gap-4 text-sm lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <span className="text-base font-black tracking-tighter uppercase">SoulTest</span>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="size-3" />
            </div>
            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">私域资源管理工作台 · 系统运行中</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/50 bg-muted/5 px-4 py-1.5">
              <div className="size-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service Healthy</span>
            </div>
            <div className="flex items-center lg:hidden gap-2">
               <Button className="size-10 rounded-xl" disabled={loggingOut} onClick={handleLogout} variant="ghost">
                 <LogOut className="size-5" />
               </Button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="flex overflow-x-auto border-b border-border/40 bg-background/50 px-6 py-3 lg:hidden no-scrollbar backdrop-blur-md">
           {navigationGroups.flatMap(g => g.items).map((item) => {
             const Icon = item.icon
             return (
               <NavLink
                 className={({ isActive }) =>
                   cn(
                     "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all mr-3",
                     isActive
                       ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                       : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                   )
                 }
                 end={item.end}
                 key={item.to}
                 to={item.to}
               >
                 <Icon className="size-3.5" />
                 {item.label}
               </NavLink>
             )
           })}
        </div>

        <main className="flex-1 p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              initial={{ opacity: 0, y: 20 }}
              key={window.location.pathname}
              transition={{ duration: 0.3 }}
            >
              {errorMessage ? <AdminNotice className="mb-8" description={errorMessage} variant="warning" /> : null}
              <Outlet context={{ session }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
