import { ArrowRight, Clock3, Layers3, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, Navigate, useParams } from "react-router"

import { Button } from "@/components/ui/button"
import { fetchQuizIntro } from "@/features/quizzes/api"
import type { QuizIntro } from "@/features/quizzes/types"

export function QuizDetailPage() {
  const { slug } = useParams()
  const [quiz, setQuiz] = useState<QuizIntro>()
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    if (!slug) {
      return
    }

    const currentSlug = slug
    let active = true

    async function load() {
      try {
        const item = await fetchQuizIntro(currentSlug)

        if (!active) {
          return
        }

        setQuiz(item)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "测试详情加载失败")
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
  }, [slug])

  if (!slug) {
    return <Navigate replace to="/" />
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <div className="h-[520px] rounded-[40px] border border-slate-200 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.04)]" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <div className="rounded-[28px] border border-rose-100 bg-rose-50 px-6 py-5 text-sm text-rose-700">
          {errorMessage ?? "未找到对应测试。"}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <section className="relative overflow-hidden rounded-[42px] border border-black/5 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_120px_rgba(15,23,42,0.12)] md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,_rgba(232,121,249,0.24),_transparent_30%),radial-gradient(circle_at_82%_18%,_rgba(96,165,250,0.18),_transparent_26%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/42">{quiz.category}</p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">{quiz.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 md:text-lg">{quiz.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {quiz.tags.map((tag) => (
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-white/80" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-full bg-white px-6 text-sm font-medium text-slate-950 hover:bg-white/92">
                <Link to={`/${quiz.slug}/test`}>
                  输入口令开始测试
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Link className="inline-flex h-12 items-center rounded-full border border-white/14 bg-white/8 px-6 text-sm font-medium text-white transition hover:bg-white/12" to="/">
                返回题集
              </Link>
            </div>
          </div>

          <aside className="rounded-[34px] border border-white/10 bg-white/8 p-6 backdrop-blur-sm md:p-7">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Clock3 className="size-4 text-fuchsia-300" />
                  测试时长
                </div>
                <p className="mt-2 text-lg font-semibold">约 {quiz.durationMinutes} 分钟</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Layers3 className="size-4 text-fuchsia-300" />
                  题目数量
                </div>
                <p className="mt-2 text-lg font-semibold">{quiz.questionCount} 题</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <ShieldCheck className="size-4 text-fuchsia-300" />
                  进入说明
                </div>
                <p className="mt-2 text-sm leading-7 text-white/75">{quiz.accessSummary}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[36px] border border-black/5 bg-white/92 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">结果包含</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">你会看到什么</h2>
          <div className="mt-6 grid gap-3">
            {quiz.valuePoints.map((item) => (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700" key={item}>
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[36px] border border-black/5 bg-white/92 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">流程</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">完成路径</h2>
          <div className="mt-6 space-y-3">
            {quiz.flowSteps.map((item, index) => (
              <div className="flex gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4" key={item}>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        {quiz.detailSections.map((section) => (
          <article className="rounded-[30px] border border-black/5 bg-white/92 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.04)]" key={section.title}>
            <p className="text-sm font-semibold text-slate-950">{section.title}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{section.description}</p>
          </article>
        ))}
      </section>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400">基于 OEJTS 1.2 开放量表 · 结果仅供自我探索参考</p>
      </div>
    </div>
  )
}

