import { ArrowLeft, Sparkles } from "lucide-react"
import { Link, useLocation } from "react-router"

export function SiteHeader() {
  const location = useLocation()
  const isHome = location.pathname === "/"
  const isAdmin = location.pathname.startsWith("/admin")

  if (isAdmin) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link className="flex items-center gap-3 text-slate-950" to="/">
          <div className="flex size-11 items-center justify-center rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">SoulTest</p>
            <p className="text-xs text-slate-500">认真做完，再看结果。</p>
          </div>
        </Link>

        {isHome ? (
          <a
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            href="#catalog"
          >
            当前题集
          </a>
        ) : (
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            to="/"
          >
            <ArrowLeft className="size-4" />
            返回主页
          </Link>
        )}
      </div>
    </header>
  )
}
