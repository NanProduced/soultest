import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { motion, AnimatePresence } from "framer-motion"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
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
  const steps = ["验证码已识别", "正在同步题目", "正在恢复进度"]

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,_rgba(168,85,247,0.22),_transparent_28%),radial-gradient(circle_at_82%_10%,_rgba(56,189,248,0.18),_transparent_26%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16 md:px-8">
        <div className="w-full overflow-hidden rounded-[36px] border border-white/10 bg-white/6 p-8 shadow-[0_36px_140px_rgba(15,23,42,0.38)] backdrop-blur-xl md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/68">
            <ShieldCheck className="size-4 text-fuchsia-300" />
            已识别有效验证码
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
  const [verifying, setVerifying] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loadingRuntime, setLoadingRuntime] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [draftHydrated, setDraftHydrated] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const advanceTimeoutRef = useRef<number | null>(null)

  const quizSlug = slug ?? ""

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current)
      }
    }
  }, [])

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
      }
    }

    setCode("")
    setRuntime(undefined)
    setAnswers({})
    setActiveIndex(0)
    setStartedAt(undefined)
    setErrorMessage(undefined)
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
  const isBipolarScale = Boolean(
    currentQuestion?.leftLabel && currentQuestion.rightLabel && currentQuestion.options.length === 5,
  )
  const isBinaryChoice = Boolean(!isBipolarScale && currentQuestion?.options.length === 2)
  const hasDraftCode = code.trim().length > 0

  function handleOpenAccessDialog() {
    setDialogOpen(true)
  }

  function handleCloseAccessDialog() {
    if (verifying || loadingRuntime) {
      return
    }

    setDialogOpen(false)
  }
  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedCode = code.trim().toUpperCase()

    if (!normalizedCode || !quizSlug) {
      setErrorMessage("请输入验证码后再开始测试")
      return
    }

    setVerifying(true)
    setErrorMessage(undefined)

    try {
      const session = await verifyAccessCode(normalizedCode)

      if (!session.allowedQuizzes.some((item) => item.slug === quizSlug)) {
        throw new Error("当前验证码未授权这套测试")
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

  function clearPendingAdvance() {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
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

    clearPendingAdvance()

    if (activeIndex < totalQuestions - 1) {
      advanceTimeoutRef.current = window.setTimeout(() => {
        setActiveIndex((prev) => Math.min(prev + 1, totalQuestions - 1))
        advanceTimeoutRef.current = null
      }, 350)
    }
  }

  function handleResetCurrentProgress() {
    clearPendingAdvance()
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
      <>
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
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md">
                  <Sparkles className="size-3" />
                  PRO 深度解析版
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/68">
                  {quizIntro?.category ?? "测试入口"}
                </div>
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
                {quizIntro?.title ?? "正在准备测试"}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                {quizIntro?.summary ?? "请输入购买后获得的验证码，验证后即可进入测试。"}
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

              <div className="mt-8 max-w-2xl rounded-[28px] border border-white/12 bg-white/8 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">开始前验证</p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-white md:text-2xl">点击开始测试，再输入测试验证码</h2>
                <p className="mt-3 text-sm leading-7 text-white/68 md:text-base">
                  验证成功后会继续同步题目，并尽量恢复你在当前设备上的答题进度；在手机上输入和查看错误提示也会更清晰。
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    className="h-14 rounded-[18px] bg-violet-500 px-6 text-base font-medium text-white shadow-[0_18px_50px_rgba(139,92,246,0.35)] transition hover:bg-violet-400"
                    onClick={handleOpenAccessDialog}
                    type="button"
                  >
                    开始测试
                    <ArrowRight className="size-4" />
                  </Button>
                  <p className="text-sm text-white/52">验证码在有效期内可重复使用，同一设备会自动保留答题进度。</p>
                </div>

                {hasDraftCode ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/18 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-100">
                    <span className="size-1.5 rounded-full bg-emerald-300" />
                    已保留你刚才输入的验证码，可直接继续验证。
                  </div>
                ) : null}
              </div>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-black/18 px-4 py-4 text-sm leading-7 text-white/60">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-fuchsia-300" />
                  <p>如果你之前已经开始作答，再次进入时会自动恢复到上次离开的题目位置。</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <AccessCodeDialog
          badgeLabel="输入测试验证码"
          description="输入你购买后获得的测试验证码，验证成功后会继续同步题目，并自动恢复当前设备上的答题进度。"
          draftNotice={hasDraftCode ? "已为你保留刚才输入的验证码，可直接继续验证。" : undefined}
          errorMessage={errorMessage}
          helperText="验证码在有效期内可重复使用；若刚刚网络波动，重新验证即可继续。"
          onClose={handleCloseAccessDialog}
          onSubmit={handleVerify}
          onValueChange={(value) => {
            setCode(value)
            if (errorMessage) {
              setErrorMessage(undefined)
            }
          }}
          open={dialogOpen}
          submitLabel="验证并进入测试"
          submitting={verifying || loadingRuntime}
          submittingLabel="正在进入"
          title={`验证后开始${quizIntro?.title ? ` ${quizIntro.title}` : "测试"}`}
          value={code}
        />
      </>
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
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 border border-amber-200">
                <Sparkles className="size-3" /> PRO
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                {runtime.meta.title} · {activeIndex + 1}/{totalQuestions}
              </span>
            </div>
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
                  </p>                  {isBipolarScale ? (
                    <>
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
                    </>
                  ) : isBinaryChoice ? (
                    <div className="mt-12">
                      <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                        <span>二选一</span>
                        <div className="h-px w-10 bg-white/10" />
                        <span>选更能打动你的那一项</span>
                      </div>

                      <div className="mb-4 hidden items-center justify-center lg:flex">
                        <span className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
                          VS
                        </span>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        {currentQuestion.options.map((option, index) => {
                          const selected = currentAnswer === option.id

                          return (
                            <button
                              className={cn(
                                "group relative overflow-hidden rounded-[30px] border px-6 py-6 text-left transition-all duration-300 touch-manipulation",
                                selected
                                  ? "border-rose-300/90 bg-[linear-gradient(180deg,rgba(251,113,133,0.20),rgba(244,114,182,0.12))] shadow-[0_24px_70px_rgba(244,114,182,0.18)] scale-[1.015]"
                                  : "border-white/10 bg-white/[0.055] hover:border-white/25 hover:bg-white/[0.10] hover:shadow-[0_10px_40px_rgba(255,255,255,0.06)]",
                              )}
                              key={option.id}
                              onClick={() => handleSelectAnswer(option.id)}
                              type="button"
                            >
                              {selected ? (
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.24),transparent_62%)]" />
                              ) : null}
                              <div className="relative z-10">
                                <div className="flex items-center justify-between gap-3">
                                  <span
                                    className={cn(
                                      "inline-flex size-10 items-center justify-center rounded-full border text-sm font-bold transition-colors",
                                      selected
                                        ? "border-rose-200/80 bg-rose-300/20 text-white"
                                        : "border-white/15 bg-white/6 text-white/58 group-hover:border-white/30 group-hover:text-white/90",
                                    )}
                                  >
                                    {index === 0 ? "A" : "B"}
                                  </span>
                                  <span className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                                    {selected ? "已选择" : "点击选择"}
                                  </span>
                                </div>

                                <p
                                  className={cn(
                                    "mt-5 text-lg font-semibold leading-8 transition-colors",
                                    selected ? "text-white" : "text-white/84 group-hover:text-white",
                                  )}
                                >
                                  {option.label}
                                </p>
                                {option.description ? (
                                  <p className="mt-3 text-sm leading-6 text-white/52">{option.description}</p>
                                ) : null}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-12 grid gap-4 sm:grid-cols-2">
                      {currentQuestion.options.map((option, index) => {
                        const selected = currentAnswer === option.id

                        return (
                          <button
                            className={cn(
                              "group relative overflow-hidden rounded-[28px] border px-6 py-5 text-left transition-all duration-300",
                              selected
                                ? "border-fuchsia-400/80 bg-fuchsia-500/15 shadow-[0_22px_60px_rgba(168,85,247,0.22)] scale-[1.02]"
                                : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]",
                            )}
                            key={option.id}
                            onClick={() => handleSelectAnswer(option.id)}
                            type="button"
                          >
                            {selected ? (
                              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_60%)]" />
                            ) : null}
                            <div className="relative z-10 flex items-start gap-4">
                              <span
                                className={cn(
                                  "inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors",
                                  selected
                                    ? "border-fuchsia-300 bg-fuchsia-400/20 text-white"
                                    : "border-white/15 text-white/50 group-hover:border-white/30 group-hover:text-white/90",
                                )}
                              >
                                {index + 1}
                              </span>
                              <div>
                                <p className={cn("text-base font-semibold leading-7 transition-colors", selected ? "text-white" : "text-white/80 group-hover:text-white")}>
                                  {option.label}
                                </p>
                                {option.description ? (
                                  <p className="mt-2 text-sm leading-6 text-white/50">{option.description}</p>
                                ) : null}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
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
            onClick={() => {
              clearPendingAdvance()
              setActiveIndex((current) => Math.max(current - 1, 0))
            }}
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













