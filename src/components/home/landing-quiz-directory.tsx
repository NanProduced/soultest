import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router"

import type { QuizCatalogItem } from "@/features/quizzes/types"

import { FlipQuizCard, FlipQuizCardSkeleton } from "@/components/quiz/flip-quiz-card"

interface LandingQuizDirectoryProps {
  freeQuizzes: QuizCatalogItem[]
  paidQuizzes: QuizCatalogItem[]
  loading: boolean
  errorMessage?: string
}

const PREVIEW_LIMIT = 6

function SectionEmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center text-sm text-slate-400">
      暂时还没有可展示的{label}，稍后再来看看。
    </div>
  )
}

export function LandingQuizDirectory({ freeQuizzes, paidQuizzes, loading, errorMessage }: LandingQuizDirectoryProps) {
  const previewFreeQuizzes = freeQuizzes.slice(0, PREVIEW_LIMIT)
  const previewPaidQuizzes = paidQuizzes.slice(0, PREVIEW_LIMIT)

  return (
    <section className="bg-[#09090B] py-24 md:py-32" id="catalog">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            <Sparkles className="size-3.5" />
            测试题集
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">从轻量体验到深度测试</h2>
          <p className="mt-4 text-base leading-7 text-slate-400 max-w-2xl">
            发现不同维度的自己。我们准备了即刻开启的免费体验，以及针对特定领域的深度正式量表。
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-[24px] border border-rose-900/50 bg-rose-950/20 px-5 py-4 text-sm text-rose-300">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-20">
          {/* Free Section */}
          <section className="space-y-8">
            <div className="flex items-end justify-between border-b border-white/5 pb-6">
              <div>
                <h3 className="text-2xl font-bold text-white md:text-3xl">免费测试专区</h3>
                <p className="mt-2 text-sm text-slate-500">无需购买，即刻开启灵魂探索的第一步</p>
              </div>
              <Link
                to="/quizzes?type=free"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                查看全部 <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative">
              {loading && previewFreeQuizzes.length === 0 ? (
                <FlipQuizCardSkeleton count={3} />
              ) : previewFreeQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {previewFreeQuizzes.map((quiz, index) => (
                    <FlipQuizCard key={quiz.slug} quiz={quiz} index={index} />
                  ))}
                </div>
              ) : (
                <SectionEmptyState label="免费测试" />
              )}
            </div>
          </section>

          {/* Paid Section */}
          <section className="space-y-8">
            <div className="flex items-end justify-between border-b border-white/5 pb-6">
              <div>
                <h3 className="text-2xl font-bold text-white md:text-3xl">精选测试展厅</h3>
                <p className="mt-2 text-sm text-slate-500">基于经典心理学量表，提供专业的深度解读报告</p>
              </div>
              <Link
                to="/quizzes?type=paid"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                查看全部 <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative">
              {loading && previewPaidQuizzes.length === 0 ? (
                <FlipQuizCardSkeleton count={3} />
              ) : previewPaidQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {previewPaidQuizzes.map((quiz, index) => (
                    <FlipQuizCard key={quiz.slug} quiz={quiz} index={index + PREVIEW_LIMIT} />
                  ))}
                </div>
              ) : (
                <SectionEmptyState label="付费测试" />
              )}
            </div>
          </section>
        </div>

        <div className="mt-12 rounded-[40px] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold text-white md:text-3xl">想按分类慢慢挑选？</h3>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            进入题集中心，我们为您整理了所有的测试内容，支持按关键词搜索和更细致的筛选。
          </p>
          <Link
            to="/quizzes"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-bold text-slate-950 transition-all hover:scale-105 active:scale-95"
          >
            进入题集中心
          </Link>
        </div>
      </div>
    </section>
  )
}
