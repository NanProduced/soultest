import { Link } from "react-router"

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/72">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-800">© 2026 SoulTest</p>
          <p className="mt-1 text-xs text-slate-500">结果仅供自我探索与娱乐参考。</p>
        </div>

        <div className="flex items-center gap-5">
          <Link className="transition hover:text-slate-900" to="/">
            主页
          </Link>
          <Link className="transition hover:text-slate-900" to="/oejts-personality-map">
            16 型人格图谱
          </Link>
        </div>
      </div>
    </footer>
  )
}
