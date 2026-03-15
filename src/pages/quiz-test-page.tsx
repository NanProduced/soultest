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
import { cn } from "@/lib/utils"
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

function RuntimeBootScreen({
  title,
  questionCount,
  durationMinutes,
}: {
  title?: string
  questionCount?: number
  durationMinutes?: number
}) {
  const steps = ["口令已识别", "正在同步题目", "正在恢复进度"]

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,_rgba(168,85,247,0.22),_transparent_28%),radial-gradient(circle_at_82%_10%,_rgba(56,189,248,0.18),_transparent_26%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16 md:px-8">
        <div className="w-full overflow-hidden rounded-[36px] border border-white/10 bg-white/6 p-8 shadow-[0_36px_140px_rgba(15,23,42,0.38)] backdrop-blur-xl md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/68">
            <ShieldCheck className="size-4 text-fuchsia-300" />
            已识别有效口令
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                正在进入 {title ?? "测试"}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                稍等几秒，系统会同步题目数据，并自动接上你在当前设备上的答题进度。
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
                <span className="rounded-full border border-white/10 bg-white/6 px-3.5 py-2">
                  {questionCount ? `${questionCount} 题` : "题目准备中"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/6 px-3.5 py-2">
                  {durationMinutes ? `约 ${durationMinutes} 分钟` : "时长准备中"}
                </span>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-white/54">
                {steps.map((step, index) => (
                  <span className="inline-flex items-center gap-3" key={step}>
                    <span className="size-2 rounded-full bg-fuchsia-300" />
                    {step}
                    {index < steps.length - 1 ? <span className="h-px w-8 bg-white/10" /> : null}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.28, 0.55, 0.28] }}
                className="absolute size-40 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10"
                transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                className="absolute size-24 rounded-full border border-dashed border-white/20"
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <div className="relative flex size-24 items-center justify-center rounded-full border border-white/12 bg-white/10 shadow-[0_24px_60px_rgba(168,85,247,0.18)] backdrop-blur-md">
                <LoaderCircle className="size-8 animate-spin text-fuchsia-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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

  if (!runtime && accessSession && loadingRuntime) {
    return (
      <RuntimeBootScreen
        durationMinutes={quizIntro?.durationMinutes}
        questionCount={quizIntro?.questionCount}
        title={quizIntro?.title}
      />
    )
  }

  if (!runtime) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.16),_transparent_26%),linear-gradient(180deg,#09090b_0%,#111827_52%,#020617_100%)] text-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-16">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/74 backdrop-blur-md transition hover:bg-white/12"
            to={`/${slug}`}
          >
            <ArrowLeft className="size-4" />
            返回详情页
          </Link>

          <section className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/6 p-6 shadow-[0_32px_120px_rgba(15,23,42,0.24)] backdrop-blur-xl md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/68">
              <Sparkles className="size-4 text-fuchsia-300" />
              {quizIntro?.category ?? "测试入口"}
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              {quizIntro?.title ?? "正在准备测试"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
              {quizIntro?.summary ?? "请输入购买后获得的口令，验证后即可进入测试。"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/68">
              <span className="rounded-full border border-white/10 bg-white/6 px-3.5 py-2">
                {quizIntro?.questionCount ? `${quizIntro.questionCount} 题` : "题目准备中"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/6 px-3.5 py-2">
                {quizIntro?.durationMinutes ? `约 ${quizIntro.durationMinutes} 分钟` : "时长准备中"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/6 px-3.5 py-2">支持中断后继续</span>
            </div>

            <form className="mt-8 max-w-2xl" onSubmit={(event) => void handleVerify(event)}>
              <label className="sr-only" htmlFor="quiz-access-code">
                测试口令
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  autoCapitalize="characters"
                  autoComplete="off"
                  className="h-14 flex-1 rounded-[18px] border border-white/12 bg-white/10 px-5 text-base text-white outline-none backdrop-blur-md transition placeholder:text-white/32 focus:border-fuchsia-400/70 focus:ring-4 focus:ring-fuchsia-500/15"
                  id="quiz-access-code"
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                  placeholder="输入购买后获得的口令"
                  value={code}
                />
                <Button
                  className="h-14 rounded-[18px] bg-violet-500 px-6 text-base font-medium text-white shadow-[0_18px_50px_rgba(139,92,246,0.35)] transition hover:bg-violet-400"
                  disabled={verifying || loadingRuntime || loadingIntro}
                  type="submit"
                >
                  {verifying || loadingRuntime ? <LoaderCircle className="size-4 animate-spin" /> : null}
                  {verifying || loadingRuntime ? "正在进入" : "开始测试"}
                </Button>
              </div>
              <p className="mt-3 text-sm text-white/48">口令在有效期内可重复使用，同一设备会自动保留答题进度。</p>
            </form>

            {errorMessage ? (
              <div className="mt-4 rounded-[20px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {errorMessage}
              </div>
            ) : null}

            <div className="mt-8 rounded-[24px] border border-white/10 bg-black/18 px-4 py-4 text-sm leading-7 text-white/60">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-fuchsia-300" />
                <p>如果你之前已经开始作答，再次进入时会自动恢复到上次离开的题目位置。</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.08),_transparent_20%),linear-gradient(180deg,#ffffff_0%,#fafafc_100%)]">
      <div className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="h-1.5 w-full bg-slate-100">
          <motion.div
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500"
            initial={{ width: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link className="rounded-full p-2 transition hover:bg-slate-100" to={`/${slug}`}>
              <ArrowLeft className="size-4 text-slate-500" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {runtime.meta.title} · {activeIndex + 1}/{totalQuestions}
            </span>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-rose-500"
            onClick={handleResetCurrentProgress}
            type="button"
          >
            <RotateCcw className="size-3" />
            重置进度
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            initial={{ x: 20, opacity: 0 }}
            key={activeIndex}
            transition={{ duration: 0.3 }}
          >
            {draftRestored && activeIndex === 0 ? (
              <div className="mb-8 flex items-center gap-3 rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                <Zap className="size-4 fill-emerald-500 text-emerald-500" />
                已恢复上次作答进度
              </div>
            ) : null}

            {currentQuestion ? (
              <section className="relative overflow-hidden rounded-[42px] border border-black/5 bg-slate-950 px-8 py-12 text-white shadow-[0_40px_120px_rgba(15,23,42,0.15)]">
                <div className="absolute right-0 top-0 p-10 opacity-5">
                  <span className="text-9xl font-black">{activeIndex + 1}</span>
                </div>

                <div className="relative">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                    第 {activeIndex + 1} 题
                  </div>
                  <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                    {currentQuestion.title}
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg font-medium text-white/60 md:text-xl">
                    {currentQuestion.description ?? "按第一反应作答即可，不必刻意平衡答案。"}
                  </p>

                  <div className="mt-16 grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">左侧倾向</p>
                      <p className="text-xl font-bold text-fuchsia-300">{currentQuestion.leftLabel}</p>
                    </div>
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 md:text-right">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">右侧倾向</p>
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
                            scaleSizes[index] ?? "size-14",
                          )}
                          key={option.id}
                          onClick={() => handleSelectAnswer(option.id)}
                          type="button"
                        >
                          <motion.div
                            animate={
                              selected
                                ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                      "0 0 0px rgba(255,255,255,0)",
                                      "0 0 30px rgba(255,255,255,0.3)",
                                      "0 0 0px rgba(255,255,255,0)",
                                    ],
                                  }
                                : {}
                            }
                            className={cn(
                              "absolute inset-0 rounded-full border-2 transition-all duration-300",
                              selected ? `border-white scale-110 ${colorClass}` : "border-white/20 group-hover:border-white/40",
                            )}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          />
                          <span
                            className={cn(
                              "relative z-10 text-xl font-black transition-colors duration-300",
                              selected ? "text-white" : "text-white/40 group-hover:text-white/80",
                            )}
                          >
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
            <ArrowLeft className="mr-2 size-4" />
            上一题
          </Button>

          {activeIndex === totalQuestions - 1 ? (
            <Button
              className="h-14 rounded-full bg-white px-10 text-sm font-bold tracking-widest uppercase text-slate-950 shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all hover:scale-105 hover:bg-white/90"
              disabled={!allAnswered || submitting}
              onClick={() => void handleSubmit()}
              type="button"
            >
              {submitting ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
              {submitting ? "正在生成结果" : "查看结果"}
            </Button>
          ) : (
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              已完成 {answeredCount}/{totalQuestions}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
