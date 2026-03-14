import {
  ArrowLeft,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  fetchQuizIntro,
  fetchQuizRuntime,
  submitQuizAnswers,
  verifyAccessCode,
} from "@/features/quizzes/api"
import { getCustomQuizPage } from "@/features/quizzes/custom-pages"
import { resolveQuizStrategies } from "@/features/quizzes/engine"
import {
  clearAccessSession,
  clearQuizDraft,
  readAccessSession,
  readQuizDraft,
  writeAccessSession,
  writeQuizDraft,
  writeStoredQuizResult,
} from "@/features/quizzes/session"
import type { QuizIntro, QuizRuntimeConfig, VerifyAccessResponse } from "@/features/quizzes/types"

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "请求失败，请稍后重试"
}

const scaleSizes = [
  "size-16 md:size-20",
  "size-14 md:size-16",
  "size-12 md:size-14",
  "size-14 md:size-16",
  "size-16 md:size-20",
]

const scaleColors = [
  "bg-fuchsia-500",
  "bg-fuchsia-400",
  "bg-slate-400",
  "bg-sky-400",
  "bg-sky-500",
]

export function QuizTestPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [quizIntro, setQuizIntro] = useState<QuizIntro>()
  const [code, setCode] = useState("")
  const [accessSession, setAccessSession] = useState<VerifyAccessResponse>()
  const [runtime, setRuntime] = useState<QuizRuntimeConfig>()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [startedAt, setStartedAt] = useState<number>()
  const [loadingIntro, setLoadingIntro] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [loadingRuntime, setLoadingRuntime] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [draftHydrated, setDraftHydrated] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)

  const quizSlug = slug ?? ""

  const loadRuntime = useCallback(
    async (token: string, currentSlug = quizSlug) => {
      if (!currentSlug) {
        return
      }

      setLoadingRuntime(true)
      setErrorMessage(undefined)

      try {
        const response = await fetchQuizRuntime(currentSlug, token)
        setRuntime(response.runtime)
        setStartedAt(Date.now())
      } catch (error) {
        clearAccessSession()
        setAccessSession(undefined)
        setRuntime(undefined)
        setErrorMessage(getErrorMessage(error))
      } finally {
        setLoadingRuntime(false)
      }
    },
    [quizSlug],
  )

  useEffect(() => {
    if (!quizSlug) {
      return
    }

    let active = true

    async function loadIntro() {
      try {
        const item = await fetchQuizIntro(quizSlug)

        if (!active) {
          return
        }

        setQuizIntro(item)
      } catch {
        if (active) {
          setQuizIntro(undefined)
        }
      } finally {
        if (active) {
          setLoadingIntro(false)
        }
      }
    }

    setCode("")
    setRuntime(undefined)
    setAnswers({})
    setActiveIndex(0)
    setStartedAt(undefined)
    setErrorMessage(undefined)
    setLoadingIntro(true)
    setDraftHydrated(false)
    setDraftRestored(false)
    void loadIntro()

    const session = readAccessSession()

    if (!session || !session.allowedQuizzes.some((item) => item.slug === quizSlug)) {
      setAccessSession(undefined)
      return () => {
        active = false
      }
    }

    setAccessSession(session)
    setCode(session.code)
    void loadRuntime(session.accessToken, quizSlug)

    return () => {
      active = false
    }
  }, [loadRuntime, quizSlug])

  useEffect(() => {
    if (!runtime || draftHydrated || !quizSlug) {
      return
    }

    const draft = readQuizDraft(quizSlug)

    if (draft && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers)
      setActiveIndex(Math.min(draft.activeIndex, runtime.questions.length - 1))
      setDraftRestored(true)
    }

    setDraftHydrated(true)
  }, [draftHydrated, quizSlug, runtime])

  useEffect(() => {
    if (!runtime || !draftHydrated || !quizSlug) {
      return
    }

    writeQuizDraft({
      slug: quizSlug,
      answers,
      activeIndex,
    })
  }, [activeIndex, answers, draftHydrated, quizSlug, runtime])

  const strategies = useMemo(() => (runtime ? resolveQuizStrategies(runtime) : undefined), [runtime])
  const CustomQuizPage =
    slug && strategies?.renderer === "custom" ? getCustomQuizPage(slug) : undefined

  const totalQuestions = runtime?.questions.length ?? 0
  const currentQuestion = runtime?.questions[activeIndex]
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const progressPercent = totalQuestions === 0 ? 0 : ((activeIndex + 1) / totalQuestions) * 100
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions
  const currentAnswer = currentQuestion ? answers[String(currentQuestion.id)] : undefined

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedCode = code.trim().toUpperCase()

    if (!normalizedCode || !quizSlug) {
      return
    }

    setVerifying(true)
    setErrorMessage(undefined)

    try {
      const session = await verifyAccessCode(normalizedCode)

      if (!session.allowedQuizzes.some((item) => item.slug === quizSlug)) {
        throw new Error("当前口令未授权这套测试")
      }

      setAccessSession(session)
      writeAccessSession(session)
      await loadRuntime(session.accessToken, quizSlug)
    } catch (error) {
      clearAccessSession()
      setAccessSession(undefined)
      setRuntime(undefined)
      setErrorMessage(getErrorMessage(error))
    } finally {
      setVerifying(false)
    }
  }

  function handleSelectAnswer(optionId: string) {
    if (!currentQuestion) {
      return
    }

    setAnswers((current) => ({
      ...current,
      [String(currentQuestion.id)]: optionId,
    }))

    // Auto next after 300ms if not the last question
    if (activeIndex < totalQuestions - 1) {
      setTimeout(() => {
        setActiveIndex((prev) => prev + 1)
      }, 350)
    }
  }

  function handleResetCurrentProgress() {
    setAnswers({})
    setActiveIndex(0)
    setDraftRestored(false)
    if (quizSlug) {
      clearQuizDraft(quizSlug)
    }
  }

  async function handleSubmit() {
    if (!runtime || !accessSession || !quizSlug || !allAnswered) {
      return
    }

    setSubmitting(true)
    setErrorMessage(undefined)

    try {
      const response = await submitQuizAnswers(
        quizSlug,
        answers,
        accessSession.accessToken,
        startedAt ? Math.round((Date.now() - startedAt) / 1000) : undefined,
      )

      writeStoredQuizResult({
        submissionId: response.submissionId,
        slug: quizSlug,
        quizTitle: runtime.meta.title,
        resultKey: response.resultKey,
        resultTitle: response.resultTitle,
        resultSummary: response.resultSummary,
        scoreBreakdown: response.scoreBreakdown,
        submittedAt: new Date().toISOString(),
      })

      clearQuizDraft(quizSlug)
      navigate(response.redirectTo)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (!slug) {
    return <Navigate replace to="/" />
  }

  if (runtime && CustomQuizPage && accessSession) {
    return <CustomQuizPage accessSession={accessSession} runtime={runtime} />
  }

  if (!runtime) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.12),_transparent_28%),linear-gradient(180deg,#fffdfd_0%,#ffffff_48%,#fafafc_100%)]">
        <div className="mx-auto max-w-5xl px-6 py-10 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <Sparkles className="size-4 text-fuchsia-500" />
                {quizIntro?.category ?? "测试入口"}
              </div>
              <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                {quizIntro?.title ?? "正在准备测试"}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                {quizIntro?.summary ?? "输入购买后获得的口令即可进入测试。"}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(quizIntro?.tags ?? []).map((tag) => (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-[36px] border border-black/5 bg-white/92 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">口令验证</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">输入口令开始测试</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                口令在有效期内可重复进入，不会因为中途退出而直接失效。
              </p>

              <form className="mt-6" onSubmit={(event) => void handleVerify(event)}>
                <label className="text-sm font-medium text-slate-900" htmlFor="quiz-access-code">
                  测试口令
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    autoComplete="off"
                    className="h-13 flex-1 rounded-full border border-slate-200 bg-white px-5 text-base text-slate-950 outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                    id="quiz-access-code"
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="输入购买后获得的口令"
                    value={code}
                  />
                  <Button className="h-13 rounded-full px-6" disabled={verifying || loadingRuntime || loadingIntro} type="submit">
                    {verifying || loadingRuntime ? <LoaderCircle className="size-4 animate-spin" /> : null}
                    {verifying || loadingRuntime ? "正在进入" : "开始测试"}
                  </Button>
                </div>
              </form>

              {errorMessage ? (
                <div className="mt-4 rounded-[22px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-fuchsia-500" />
                  <p>如果你已经输入过口令，系统会在同一设备上保留进度，下次回来可以继续。</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <Link className="transition hover:text-slate-900" to={`/${slug}`}>
                  返回详情页
                </Link>
                <span>{quizIntro?.questionCount ?? 0} 题 · 约 {quizIntro?.durationMinutes ?? 0} 分钟</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.08),_transparent_20%),linear-gradient(180deg,#ffffff_0%,#fafafc_100%)]">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="h-1.5 w-full bg-slate-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link className="p-2 hover:bg-slate-100 rounded-full transition" to={`/${slug}`}>
              <ArrowLeft className="size-4 text-slate-500" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {runtime.meta.title} · {activeIndex + 1}/{totalQuestions}
            </span>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition"
            onClick={handleResetCurrentProgress}
          >
            <RotateCcw className="size-3" />
            RESET
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {draftRestored && activeIndex === 0 && (
              <div className="mb-8 rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 flex items-center gap-3">
                <Zap className="size-4 fill-emerald-500 text-emerald-500" />
                已恢复上次作答进度
              </div>
            )}

            {currentQuestion ? (
              <section className="rounded-[42px] border border-black/5 bg-slate-950 px-8 py-12 text-white shadow-[0_40px_120px_rgba(15,23,42,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <span className="text-9xl font-black">{activeIndex + 1}</span>
                </div>
                
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/60 mb-6">
                    Question {activeIndex + 1}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                    {currentQuestion.title}
                  </h2>
                  <p className="mt-6 text-white/60 text-lg md:text-xl font-medium max-w-2xl">
                    {currentQuestion.description ?? "按第一反应作答即可，不必刻意平衡答案。"}
                  </p>

                  <div className="mt-16 grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">左侧倾向</p>
                      <p className="text-xl font-bold text-fuchsia-300">{currentQuestion.leftLabel}</p>
                    </div>
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 md:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">右侧倾向</p>
                      <p className="text-xl font-bold text-sky-300">{currentQuestion.rightLabel}</p>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-8">
                    {currentQuestion.options.map((option, index) => {
                      const selected = currentAnswer === option.id
                      const colorClass = scaleColors[index]

                      return (
                        <button
                          className={cn(
                            "relative group transition-all duration-300",
                            scaleSizes[index] ?? "size-14"
                          )}
                          key={option.id}
                          onClick={() => handleSelectAnswer(option.id)}
                          type="button"
                        >
                          <motion.div
                            className={cn(
                              "absolute inset-0 rounded-full border-2 transition-all duration-300",
                              selected ? `border-white scale-110 ${colorClass}` : "border-white/20 group-hover:border-white/40"
                            )}
                            animate={selected ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 30px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0)"] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className={cn(
                            "relative z-10 text-xl font-black transition-colors duration-300",
                            selected ? "text-white" : "text-white/40 group-hover:text-white/80"
                          )}>
                            {index + 1}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <span>{currentQuestion.leftLabel}</span>
                    <div className="h-px w-12 bg-white/10" />
                    <span>{currentQuestion.rightLabel}</span>
                  </div>
                </div>
              </section>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {errorMessage ? (
          <div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50 px-6 py-4 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <section className="mt-10 flex items-center justify-between">
          <Button
            className="h-14 rounded-full px-8 text-sm font-bold tracking-widest uppercase transition-all hover:scale-105"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((current) => Math.max(current - 1, 0))}
            type="button"
            variant="ghost"
          >
            <ArrowLeft className="size-4 mr-2" />
            PREV
          </Button>

          {activeIndex === totalQuestions - 1 ? (
            <Button 
              className="h-14 rounded-full px-10 text-sm font-bold tracking-widest uppercase bg-white text-slate-950 hover:bg-white/90 transition-all hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.15)]" 
              disabled={!allAnswered || submitting} 
              onClick={() => void handleSubmit()} 
              type="button"
            >
              {submitting ? <LoaderCircle className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
              {submitting ? "Processing" : "Reveal Results"}
            </Button>
          ) : (
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {answeredCount}/{totalQuestions} Answered
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
