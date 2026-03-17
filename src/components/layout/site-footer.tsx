import { Link } from "react-router"

const footerLinks = [
  { label: "主页", to: "/" },
  { label: "免费测试", to: "/quizzes?type=free" },
  { label: "付费测试", to: "/quizzes?type=paid" },
  { label: "浏览全部题集", to: "/quizzes" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/72">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-800">© 2026 SoulTest</p>
          <p className="mt-1 text-xs text-slate-500">结果仅供自我探索与娱乐参考。</p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {footerLinks.map((link) => (
            <Link key={link.to} className="transition hover:text-slate-900" to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
