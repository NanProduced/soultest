import { ArrowRight, Clock3, LoaderCircle, ShieldCheck, X } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { Navigate, useNavigate, useParams } from "react-router"
import { AnimatePresence, motion } from "framer-motion"

import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import heroArt from "@/assets/hero.png"
import type { QuizIntro } from "@/features/quizzes/types"

const OEJTS_OUTCOME_ITEMS = [
  "你的 OEJTS 16 型人格结果",
  "四条维度的倾向分析",
  "关系、工作、压力场景下的建议",
]

const OEJTS_MODEL_INTRO =
  "OEJTS 16 型人格图谱是一套基于 I/E、S/N、F/T、J/P 四条人格偏好维度的自我探索测试。它关注你更自然的注意力方向、判断方式与行动节奏，而不是把结果当成固定标签。"

function ResultPreviewCard() {
  const [imageFailed, setImageFailed] = useState(false)

  const previewRows = [
    { label: "内向 / 外向", value: 72 },
    { label: "实感 / 直觉", value: 68 },
    { label: "情感 / 思考", value: 79 },
    { label: "判断 / 感知", value: 64 },
  ]

  return (
    <div aria-hidden="true" className="relative hidden w-full max-w-[420px] lg:block">
      <div className="absolute -inset-6 rounded-[40px] bg-fuchsia-500/18 blur-3xl" />
      <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/6 shadow-[0_32px_120px_rgba(15,23,42,0.32)]">
        {imageFailed ? (
          <div className="relative h-[460px] w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.28),_transparent_30%),linear-gradient(180deg,#111827_0%,#020617_100%)]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.26)_34%,rgba(2,6,23,0.94)_100%)]" />
            <img
              alt="抽象测试结果预览插图"
              className="absolute inset-x-0 bottom-0 mx-auto w-[72%] translate-y-8 opacity-85 mix-blend-screen"
              loading="eager"
              src={heroArt}
            />
          </div>
        ) : (
          <>
            <img
              alt="紫色光影中的人物剪影"
              className="h-[460px] w-full object-cover object-center opacity-72"
              crossOrigin="anonymous"
              decoding="async"
              loading="eager"
              onError={() => setImageFailed(true)}
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1684254153218-564ec144448b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <img
              alt="抽象测试结果预览插图"
              className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-[72%] translate-y-8 opacity-40 mix-blend-screen"
              loading="eager"
              src={heroArt}
            />
          </>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.32)_35%,rgba(2,6,23,0.92)_100%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.28),transparent_36%)]" />

        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-white/62 backdrop-blur-md">
          结果页预览
        </div>

        <div className="absolute inset-x-5 bottom-5 rounded-[28px] border border-white/12 bg-black/45 p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">结果示意</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-white">INTJ</p>
              <p className="mt-2 text-sm text-white/60">分析者原型 · 长报告页预览</p>
            </div>
            <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/50">
              OEJTS
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {previewRows.map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-[11px] text-white/58">
                  <span>{row.label}</span>
                  <span>{row.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400"
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-6 text-white/62">
            冷静分析、长期规划、独立判断，以及关系、工作、压力场景下的建议。
          </div>
        </div>
      </div>
    </div>
  )
}

export function QuizDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<QuizIntro>()
  const [loading, setLoading] = useState(true)
  const [loadErrorMessage, setLoadErrorMessage] = useState<string>()
  const [accessErrorMessage, setAccessErrorMessage] = useState<string>()
  const [code, setCode] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const codeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!slug) {
      return
    }

    const session = readAccessSession()

    if (session?.allowedQuizzes.some((item) => item.slug === slug)) {
      setCode(session.code)
    }
  }, [slug])

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

        setLoadErrorMessage(error instanceof Error ? error.message : "测试详情加载失败")
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

  useEffect(() => {
    if (!dialogOpen || typeof document === "undefined") {
      return
    }

    const originalOverflow = document.body.style.overflow
    const focusHandle = window.requestAnimationFrame(() => codeInputRef.current?.focus())
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
      window.cancelAnimationFrame(focusHandle)
    }
  }, [dialogOpen])

  useEffect(() => {
    if (!dialogOpen || typeof window === "undefined") {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !verifying) {
        setDialogOpen(false)
        setAccessErrorMessage(undefined)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [dialogOpen, verifying])

  function handleOpenAccessDialog() {
    setAccessErrorMessage(undefined)
    setDialogOpen(true)
  }

  function handleCloseAccessDialog() {
    if (verifying) {
      return
    }

    setDialogOpen(false)
    setAccessErrorMessage(undefined)
  }

  async function handleStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedCode = code.trim().toUpperCase()

    if (!normalizedCode || !slug) {
      setAccessErrorMessage("请输入口令后再开始测试")
      return
    }

    setVerifying(true)
    setAccessErrorMessage(undefined)

    try {
      const session = await verifyAccessCode(normalizedCode)

      if (!session.allowedQuizzes.some((item) => item.slug === slug)) {
        throw new Error("当前口令未授权这套测试")
      }

      writeAccessSession(session)
      setDialogOpen(false)
      navigate(`/${slug}/test`)
    } catch (error) {
      setAccessErrorMessage(error instanceof Error ? error.message : "口令验证失败，请稍后重试")
    } finally {
      setVerifying(false)
    }
  }

  if (!slug) {
    return <Navigate replace to="/" />
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 md:pb-14 md:pt-28">
        <div className="h-[460px] rounded-[40px] border border-slate-200 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.04)]" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 md:pb-14 md:pt-28">
        <div className="rounded-[28px] border border-rose-100 bg-rose-50 px-6 py-5 text-sm text-rose-700">
          {loadErrorMessage ?? "未找到对应测试。"}
        </div>
      </div>
    )
  }

  const outcomeItems = quiz.slug === "oejts-personality-map" ? OEJTS_OUTCOME_ITEMS : quiz.valuePoints.slice(0, 3)
  const hasRememberedCode = code.trim().length > 0

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 md:pb-14 md:pt-28">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950 px-5 py-8 text-white shadow-[0_32px_120px_rgba(15,23,42,0.14)] sm:px-6 md:rounded-[40px] md:px-10 md:py-10 lg:px-12 lg:py-12">
          <Spotlight className="-top-24 left-0 md:-top-36 md:left-60" fill="#a855f7" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,_rgba(168,85,247,0.24),_transparent_30%),radial-gradient(circle_at_86%_14%,_rgba(56,189,248,0.16),_transparent_26%)]" />

          <div className="relative lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-10 xl:gap-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/68 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-fuchsia-300" />
                {quiz.category}
              </div>

              <h1 className="mt-5 max-w-3xl font-display text-[2.65rem] font-semibold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
                {quiz.title}
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/72 md:text-lg md:leading-8">
                {quiz.summary}
              </p>

              {quiz.slug === "oejts-personality-map" ? (
                <div className="mt-5 max-w-2xl rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">OEJTS 全名与说明</p>
                  <p className="mt-3 text-base font-medium text-white">OEJTS 16 型人格图谱</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{OEJTS_MODEL_INTRO}</p>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-2 backdrop-blur-md">
                  <Clock3 className="size-4 text-fuchsia-300" />
                  <span>约 {quiz.durationMinutes} 分钟</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3.5 py-2 backdrop-blur-md">
                  {quiz.questionCount} 题
                </span>
              </div>

              <div className="mt-7 max-w-2xl rounded-[28px] border border-white/12 bg-white/8 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">开始前验证</p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-white md:text-2xl">点击开始测试，再输入测试口令</h2>
                <p className="mt-3 text-sm leading-7 text-white/68 md:text-base">
                  口令输入放到独立弹窗中，步骤更清晰；验证成功后会自动进入答题页，手机上也更方便输入和查看提示。
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
                  <p className="text-sm text-slate-300">口令可在小红书购买 · 有效期内可重复测试</p>
                </div>

                {hasRememberedCode ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/18 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-100">
                    <span className="size-1.5 rounded-full bg-emerald-300" />
                    已识别到你上次输入的口令，打开弹窗后可直接继续验证。
                  </div>
                ) : null}
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.28em] text-white/38">做完你会看到</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/72">
                  {outcomeItems.map((item) => (
                    <span className="inline-flex items-center gap-2" key={item}>
                      <span className="size-1.5 rounded-full bg-fuchsia-300" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ResultPreviewCard />
          </div>
        </section>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">基于 OEJTS 1.2 开发 · 结果仅供自我探索参考</p>
        </div>
      </div>

      <AnimatePresence>
        {dialogOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/68 px-4 pb-4 pt-16 backdrop-blur-sm md:items-center md:px-6"
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="关闭测试口令弹窗"
              className="absolute inset-0"
              disabled={verifying}
              onClick={handleCloseAccessDialog}
              type="button"
            />

            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/96 p-6 text-white shadow-[0_32px_120px_rgba(15,23,42,0.42)] md:rounded-[32px] md:p-7"
              exit={{ opacity: 0, scale: 0.98, y: 24 }}
              initial={{ opacity: 0, scale: 0.98, y: 24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(2,6,23,0.08))]" />

              <button
                aria-label="关闭"
                className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:bg-white/10 hover:text-white"
                disabled={verifying}
                onClick={handleCloseAccessDialog}
                type="button"
              >
                <X className="size-4" />
              </button>

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/70">
                  <ShieldCheck className="size-4 text-fuchsia-300" />
                  输入测试口令
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">验证后开始 OEJTS 测试</h2>
                <p className="mt-3 text-sm leading-7 text-white/68">
                  输入你购买后获得的测试口令，验证成功后会自动进入答题页。
                </p>

                <form className="mt-6 space-y-4" onSubmit={(event) => void handleStart(event)}>
                  <div>
                    <label className="sr-only" htmlFor="detail-access-code-dialog">
                      输入测试口令
                    </label>
                    <input
                      autoCapitalize="characters"
                      autoComplete="off"
                      className="h-14 w-full rounded-[18px] border border-white/12 bg-white/10 px-5 text-base text-white outline-none backdrop-blur-md transition placeholder:text-white/35 focus:border-fuchsia-400/70 focus:ring-4 focus:ring-fuchsia-500/15"
                      id="detail-access-code-dialog"
                      inputMode="text"
                      onChange={(event) => {
                        setCode(event.target.value.toUpperCase())
                        if (accessErrorMessage) {
                          setAccessErrorMessage(undefined)
                        }
                      }}
                      placeholder="请输入测试口令"
                      ref={codeInputRef}
                      spellCheck={false}
                      value={code}
                    />
                    <p className="mt-3 text-sm text-white/52">口令可在小红书购买记录或你收到的发货消息里查看。</p>
                  </div>

                  {accessErrorMessage ? (
                    <div className="rounded-[18px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                      {accessErrorMessage}
                    </div>
                  ) : null}

                  {hasRememberedCode ? (
                    <div className="rounded-[18px] border border-emerald-400/18 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                      已为你带入口令草稿，确认无误后可直接验证。
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="h-14 flex-1 rounded-[18px] bg-violet-500 px-6 text-base font-medium text-white shadow-[0_18px_50px_rgba(139,92,246,0.35)] transition hover:bg-violet-400"
                      disabled={verifying}
                      type="submit"
                    >
                      {verifying ? <LoaderCircle className="size-4 animate-spin" /> : null}
                      {verifying ? "正在验证" : "验证并开始测试"}
                      {!verifying ? <ArrowRight className="size-4" /> : null}
                    </Button>
                    <Button
                      className="h-14 rounded-[18px] border-white/12 bg-white/6 px-5 text-base text-white hover:bg-white/10"
                      disabled={verifying}
                      onClick={handleCloseAccessDialog}
                      type="button"
                      variant="outline"
                    >
                      稍后再说
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
