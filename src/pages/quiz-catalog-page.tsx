import { ArrowRight, Search, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"

import { CatalogQuizCard, CatalogQuizCardSkeleton } from "@/components/quiz/catalog-quiz-card"
import { fetchFreePublicQuizzes, fetchPaidPublicQuizzes } from "@/features/quizzes/api"
import type { QuizCatalogItem } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

type CatalogFilter = "all" | "free" | "paid"

function resolveFilter(value: string | null): CatalogFilter {
  return value === "free" || value === "paid" ? value : "all"
}

function updateCatalogSearchParams(
  searchParams: URLSearchParams,
  setSearchParams: ReturnType<typeof useSearchParams>[1],
  next: { type?: CatalogFilter; q?: string },
) {
  const params = new URLSearchParams(searchParams)

  if (next.type && next.type !== "all") {
    params.set("type", next.type)
  } else {
    params.delete("type")
  }

  const keyword = next.q?.trim()
  if (keyword) {
    params.set("q", keyword)
  } else {
    params.delete("q")
  }

  setSearchParams(params, { replace: true })
}

export function QuizCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [freeQuizzes, setFreeQuizzes] = useState<QuizCatalogItem[]>([])
  const [paidQuizzes, setPaidQuizzes] = useState<QuizCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  const activeFilter = resolveFilter(searchParams.get("type"))
  const keyword = searchParams.get("q") ?? ""

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [freeItems, paidItems] = await Promise.all([fetchFreePublicQuizzes(), fetchPaidPublicQuizzes()])
        if (!active) return
        setFreeQuizzes(freeItems)
        setPaidQuizzes(paidItems)
      } catch (error) {
        if (!active) return
        setErrorMessage(error instanceof Error ? error.message : "题集加载失败")
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  const allQuizzes = useMemo(() => [...freeQuizzes, ...paidQuizzes], [freeQuizzes, paidQuizzes])

  const filteredQuizzes = useMemo(() => {
    const quizzes = activeFilter === "free" ? freeQuizzes : activeFilter === "paid" ? paidQuizzes : allQuizzes
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return quizzes
    }

    return quizzes.filter((quiz) => {
      const searchableText = [quiz.title, quiz.summary, quiz.category, quiz.tagline, ...quiz.tags].join(" ").toLowerCase()
      return searchableText.includes(normalizedKeyword)
    })
  }, [activeFilter, allQuizzes, freeQuizzes, keyword, paidQuizzes])

  const filterOptions: Array<{ key: CatalogFilter; label: string; count: number }> = [
    { key: "all", label: "全部题集", count: allQuizzes.length },
    { key: "free", label: "免费测试", count: freeQuizzes.length },
    { key: "paid", label: "付费测试", count: paidQuizzes.length },
  ]

  return (
    <div className="min-h-screen bg-[#09090B] px-6 pb-20 pt-28 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[36px] border border-white/10 bg-white/[0.03] p-6 md:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                <Sparkles className="size-3.5" />
                题集中心
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">全部测试题集</h1>
              <p className="mt-4 text-base leading-7 text-slate-400 md:text-lg">
                按免费、付费分类浏览，也可以直接搜索关键词，快速找到适合你的测试题。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
              >
                返回首页
              </Link>
              <Link
                to="/quizzes?type=paid"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
              >
                查看正式测试
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-3">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => updateCatalogSearchParams(searchParams, setSearchParams, { type: option.key, q: keyword })}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                    activeFilter === option.key
                      ? "border-white/20 bg-white text-slate-950"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                value={keyword}
                onChange={(event) => updateCatalogSearchParams(searchParams, setSearchParams, { type: activeFilter, q: event.target.value })}
                className="h-11 w-full rounded-full border border-white/10 bg-[#0F0F12] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/20"
                placeholder="搜索题集名称、标签或关键词"
                type="search"
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[24px] border border-rose-900/50 bg-rose-950/20 px-5 py-4 text-sm text-rose-300">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-8">
            {loading && allQuizzes.length === 0 ? (
              <CatalogQuizCardSkeleton count={9} />
            ) : filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                {filteredQuizzes.map((quiz, index) => (
                  <CatalogQuizCard key={quiz.slug} quiz={quiz} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
                <h2 className="text-xl font-semibold text-white">没有找到匹配的题集</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  你可以切换分类，或者换一个关键词重新搜索。
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
