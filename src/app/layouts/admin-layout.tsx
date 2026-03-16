import { KeyRound, LayoutDashboard, LockKeyhole, LogOut, ShieldAlert, ShieldCheck, SquareLibrary } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Link, NavLink, Outlet } from "react-router"

import { AdminBadge, AdminPanel, adminInputClassName } from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import { buildAdminPortalPath } from "@/features/admin/constants"
import { ApiError, createAdminSession, deleteAdminSession, fetchAdminSession } from "@/features/quizzes/api"
import type { AdminSessionSummary } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

const navigationItems = [
  {
    to: buildAdminPortalPath(),
    label: "概览",
    icon: LayoutDashboard,
  },
  {
    to: buildAdminPortalPath("quizzes"),
    label: "测试题",
    icon: SquareLibrary,
  },
] as const

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("zh-CN")
}

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

  const isLocalHost = useMemo(() => {
    if (typeof window === "undefined") {
      return false
    }

    return ["localhost", "127.0.0.1"].includes(window.location.hostname)
  }, [])

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-10 text-foreground">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <AdminPanel className="flex h-full flex-col justify-between gap-8">
          <div>
            <AdminBadge variant="invert">Private Room</AdminBadge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground">锁定后台入口</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
              当前管理平台采用账号、密码、访问密钥三重校验，并对失败尝试做短期限流。所有后台数据接口都要求服务端会话，普通用户即使知道地址，也无法直接读取或操作后台数据。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminPanel className="p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="size-4 text-success" />
                当前已启用的保护
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                <li>后台接口统一要求管理员会话</li>
                <li>登录态以 `HttpOnly` Cookie 保存</li>
                <li>失败尝试会触发按 IP 的临时锁定</li>
              </ul>
            </AdminPanel>

            <AdminPanel className="p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldAlert className="size-4 text-warning" />
                本阶段说明
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                本轮先做好安全入口、数据浏览和验证码策略管理；发布、批次轮换、题集编辑等操作功能放到后续迭代逐步补齐。
              </p>
            </AdminPanel>
          </div>
        </AdminPanel>

        <AdminPanel className="h-fit">
          <div className="flex items-start justify-between gap-4">
            <div>
              <AdminBadge variant="info">受限访问</AdminBadge>
              <h2 className="mt-4 text-2xl font-semibold text-foreground">进入 private-room</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">请输入管理员账号、密码与访问密钥后再进入管理平台。</p>
            </div>
            <div className="rounded-2xl border border-info/20 bg-info/10 p-3 text-info">
              <LockKeyhole className="size-5" />
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">管理员账号</span>
              <input
                autoComplete="username"
                className={adminInputClassName}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="请输入管理员账号"
                value={username}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">密码</span>
              <input
                autoComplete="current-password"
                className={adminInputClassName}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                type="password"
                value={password}
              />
            </label>

            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <KeyRound className="size-4 text-info" />
                访问密钥
              </span>
              <input
                autoComplete="off"
                className={adminInputClassName}
                onChange={(event) => setAccessKey(event.target.value)}
                placeholder="请输入访问密钥"
                spellCheck={false}
                type="password"
                value={accessKey}
              />
            </label>

            {errorMessage ? (
              <div className="rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">{errorMessage}</div>
            ) : null}

            {isLocalHost ? (
              <div className="rounded-2xl border border-info/20 bg-info/10 px-4 py-4 text-sm text-info">
                本地联调：账号 `admin` · 密码 `SoulTestLocal!2026` · 访问密钥 `SoulTestGate!2026`
              </div>
            ) : null}

            <Button className="h-12 w-full rounded-2xl bg-invert text-invert-foreground hover:bg-invert/90" disabled={submitting} type="submit">
              {submitting ? "校验中..." : "进入管理台"}
            </Button>
          </form>
        </AdminPanel>
      </div>
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
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-10">
        <AdminPanel className="max-w-md text-center">
          <AdminBadge variant="info">Private Room</AdminBadge>
          <p className="mt-4 text-lg font-semibold text-foreground">正在校验管理员身份...</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">只有通过后台会话验证的管理员才能进入该区域。</p>
        </AdminPanel>
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <AdminBadge variant="invert">Private Room</AdminBadge>
            <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground">SoulTest 运营管理台</h1>
            <p className="mt-1 text-sm text-muted-foreground">只开放受限访问与核心策略配置能力。</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="rounded-full border border-success/20 bg-success/10 px-4 py-2 text-sm text-success">
              {session.username} · 会话至 {formatDateTime(session.expiresAt)}
            </div>
            <Button asChild className="rounded-full" size="lg" variant="outline">
              <Link to="/">返回前台</Link>
            </Button>
            <Button className="rounded-full" disabled={loggingOut} onClick={handleLogout} size="lg" variant="outline">
              <LogOut className="size-4" />
              {loggingOut ? "退出中..." : "退出登录"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-8 flex flex-wrap gap-3">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-info/25 bg-info/10 text-info"
                    : "border-border bg-background/80 text-muted-foreground hover:border-info/20 hover:bg-info/8 hover:text-foreground",
                )
              }
              end={item.to === buildAdminPortalPath()}
              key={item.to}
              to={item.to}
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {errorMessage ? (
          <div className="mb-6 rounded-[24px] border border-warning/20 bg-warning/10 px-5 py-4 text-sm text-warning">{errorMessage}</div>
        ) : null}

        <Outlet />
      </div>
    </div>
  )
}
