import { ArrowRight, Clock3, Layers3, Sparkles } from "lucide-react"
import { Link } from "react-router"

import type { QuizCatalogItem } from "@/features/quizzes/types"

export function QuizCard({ quiz }: { quiz: QuizCatalogItem }) {
  return (
    <article className="group relative overflow-hidden rounded-[36px] border border-black/5 bg-white/92 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_100px_rgba(15,23,42,0.10)] md:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.12),_transparent_58%)]" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{quiz.category}</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{quiz.title}</h3>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-950 px-3 py-1 text-sm font-medium text-white">
            {quiz.priceLabel}
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{quiz.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {quiz.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <Clock3 className="size-4 text-fuchsia-500" />
              {quiz.durationMinutes} 分钟
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">共 {quiz.questionCount} 题</p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <Layers3 className="size-4 text-fuchsia-500" />
              结果包含
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{quiz.valuePoints.join(" · ")}</p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <Sparkles className="size-4 text-fuchsia-500" />
              开始方式
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{quiz.accessSummary}</p>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-end border-t border-slate-100 pt-5">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-fuchsia-600"
            to={`/${quiz.slug}`}
          >
            查看测试
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
