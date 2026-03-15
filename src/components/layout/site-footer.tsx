import { useEffect, useState } from "react"
import { Link } from "react-router"
import { fetchPublicQuizzes } from "@/features/quizzes/api"
import type { QuizCatalogItem } from "@/features/quizzes/types"

export function SiteFooter() {
  const [quizzes, setQuizzes] = useState<QuizCatalogItem[]>([])

  useEffect(() => {
    let active = true
    fetchPublicQuizzes()
      .then((items) => { if (active) setQuizzes(items) })
      .catch(() => {/* footer links are non-critical */})
    return () => { active = false }
  }, [])

  return (
    <footer className="border-t border-slate-200/80 bg-white/72">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-800">© 2026 SoulTest</p>
          <p className="mt-1 text-xs text-slate-500">结果仅供自我探索与娱乐参考。</p>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <Link className="transition hover:text-slate-900" to="/">
            主页
          </Link>
          {quizzes.map((quiz) => (
            <Link
              key={quiz.slug}
              className="transition hover:text-slate-900"
              to={`/${quiz.slug}`}
            >
              {quiz.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
