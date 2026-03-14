import { LayoutDashboard, ShieldCheck } from "lucide-react"
import { Link, Outlet } from "react-router"

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/10 bg-slate-950/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">SoulTest Admin</p>
            <h1 className="mt-1 flex items-center gap-2 text-xl font-semibold">
              <LayoutDashboard className="size-5 text-violet-300" />
              运营管理台
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-200">
              <ShieldCheck className="size-4" />
              本地联调
            </span>
            <Link className="text-slate-300 transition hover:text-white" to="/">
              返回前台
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
