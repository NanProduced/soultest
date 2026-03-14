import { ArrowRight, Sparkles, Clock, LayoutPanelTop } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"

import { fetchPublicQuizzes } from "@/features/quizzes/api"
import type { QuizCatalogItem } from "@/features/quizzes/types"
import { WavyBackground } from "@/components/ui/wavy-background"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"

export function HomePage() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<QuizCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const items = await fetchPublicQuizzes()

        if (!active) {
          return
        }

        setQuizzes(items)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "题集加载失败")
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
  }, [])

  const featuredQuiz = useMemo(
    () => quizzes.find((item) => item.slug === "oejts-personality-map") ?? quizzes[0],
    [quizzes],
  )

  const words = [
    {
      text: "你以为",
    },
    {
      text: "你了解自己？",
    },
    {
      text: "认真做完，",
      className: "text-fuchsia-400",
    },
    {
      text: "再看结果。",
      className: "text-sky-400",
    },
  ];

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-6 py-6 md:py-10">
        <section className="relative overflow-hidden rounded-[42px] border border-black/5 bg-slate-950 shadow-[0_30px_120px_rgba(15,23,42,0.12)]">
          <WavyBackground 
            containerClassName="h-auto py-20 md:py-32"
            backgroundFill="#020617"
            className="px-6 md:px-10 text-center"
            waveOpacity={0.4}
            blur={8}
          >
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
                <Sparkles className="size-4" />
                灵测 SoulTest
              </div>
              
              <div className="mt-8">
                <TypewriterEffect words={words} className="text-4xl md:text-6xl" />
              </div>
              
              <p className="mt-8 max-w-xl text-base leading-8 text-white/70 md:text-lg">
                32 道题，一份属于你的人格图谱。每一道题，都在靠近真实的你。
              </p>
              
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition hover:bg-white/92 hover:scale-105"
                  href="#catalog"
                >
                  开始探索
                  <ArrowRight className="size-4" />
                </a>
                {featuredQuiz ? (
                  <Link
                    className="inline-flex h-13 items-center rounded-full border border-white/14 bg-white/8 px-8 text-sm font-semibold text-white transition hover:bg-white/12 backdrop-blur-md hover:scale-105"
                    to={`/${featuredQuiz.slug}`}
                  >
                    主推测试
                  </Link>
                ) : null}
              </div>
            </div>
          </WavyBackground>
        </section>

        <section className="mt-16" id="catalog">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Catalog</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">当前开放题集</h2>
            </div>
            {loading ? <p className="text-sm text-slate-400 animate-pulse">正在加载…</p> : null}
          </div>

          {errorMessage ? (
            <div className="rounded-[28px] border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <BentoGrid>
            {quizzes.map((quiz, i) => (
              <BentoGridItem
                key={quiz.id}
                title={quiz.title}
                description={quiz.summary}
                header={
                  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-2xl bg-gradient-to-br from-fuchsia-100 via-fuchsia-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 relative overflow-hidden">
                    <div className="absolute top-4 right-4 rounded-full border border-black/5 bg-white px-2 py-1 text-[10px] font-bold text-slate-950">
                      {quiz.priceLabel}
                    </div>
                    <div className="mt-auto flex gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                        <Clock className="size-3" />
                        {quiz.durationMinutes} min
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                        <LayoutPanelTop className="size-3" />
                        {quiz.questionCount} questions
                      </div>
                    </div>
                  </div>
                }
                icon={<Sparkles className="size-4 text-fuchsia-500" />}
                className={i === 0 || i === 3 ? "md:col-span-2" : ""}
                onClick={() => navigate(`/${quiz.slug}`)}
              />
            ))}
          </BentoGrid>

          {!loading && quizzes.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white/85 px-5 py-20 text-center text-sm text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.04)]">
              当前还没有开放题集。
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
