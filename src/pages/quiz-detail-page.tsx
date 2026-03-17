import { ArrowRight, Clock3, Sparkles } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { Navigate, useNavigate, useParams } from "react-router"
import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"

import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import { getQuizCustomPages } from "@/features/quizzes/pages/registry"
import { PurchaseQrPlaceholder } from "@/components/quiz/purchase-qr-placeholder"
import { ResultPreviewCard } from "@/components/quiz/result-preview-card"

const ENNEAGRAM_OUTCOME_ITEMS = [
  "主型、近邻类型与翼倾向判断",
  "关系、工作、压力与成长方向解读",
  "单独排版的分享长图，更适合发到小红书",
]

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

  const customPages = slug ? getQuizCustomPages(slug) : undefined

  useEffect(() => {
    if (!slug) return
    const session = readAccessSession()
    if (session?.allowedQuizzes.some((item) => item.slug === slug)) {
      setCode(session.code)
    }
  }, [slug])

  useEffect(() => {
    if (!slug) return
    let active = true
    async function load() {
      try {
        const item = await fetchQuizIntro(slug!)
        if (active) setQuiz(item)
      } catch (error) {
        if (active) setLoadErrorMessage(error instanceof Error ? error.message : "测试详情加载失败")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [slug])

  if (customPages?.intro && slug) {
    const CustomIntroPage = customPages.intro
    return <CustomIntroPage slug={slug} />
  }

  async function handleStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedCode = code.trim().toUpperCase()
    if (!normalizedCode || !slug) {
      setAccessErrorMessage("请输入验证码后再开始测试")
      return
    }
    setVerifying(true)
    try {
      const session = await verifyAccessCode(normalizedCode)
      if (!session.allowedQuizzes.some((item) => item.slug === slug)) {
        throw new Error("当前验证码未授权这套测试")
      }
      writeAccessSession(session)
      navigate(`/${slug}/test`)
    } catch (error) {
      setAccessErrorMessage(error instanceof Error ? error.message : "验证码验证失败")
    } finally {
      setVerifying(false)
    }
  }

  if (!slug) return <Navigate replace to="/" />

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

  const outcomeItems = slug === "enneagram" ? ENNEAGRAM_OUTCOME_ITEMS : quiz.valuePoints.slice(0, 3)
  const hasRememberedCode = code.trim().length > 0
  const introNarrative = quiz.detailSections.map((section) => section.description).join(" ") || quiz.summary

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 md:pb-14 md:pt-28">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950 px-5 py-8 text-white shadow-[0_32px_120px_rgba(15,23,42,0.14)] sm:px-6 md:rounded-[40px] md:px-10 md:py-10 lg:px-12 lg:py-12">
          <Spotlight className="-top-24 left-0 md:-top-36 md:left-60" fill="#a855f7" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,_rgba(168,85,247,0.24),_transparent_30%),radial-gradient(circle_at_86%_14%,_rgba(56,189,248,0.16),_transparent_26%)]" />

          <div className="relative lg:grid lg:grid-cols-[minmax(0,1.22fr)_340px] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.18fr)_360px] xl:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <Sparkles className="size-3.5" />
                  PRO 深度解析版
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/68 backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-fuchsia-300" />
                  {quiz.category}
                </div>
              </div>

              <h1 className="mt-5 max-w-4xl font-display text-[2.65rem] font-semibold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl drop-shadow-sm">
                {quiz.title}
              </h1>

              <div className="mt-6 max-w-4xl rounded-[30px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-7 lg:max-w-none">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">测试简介</p>
                <p className="mt-4 text-[15px] leading-8 text-white/78 md:text-[17px] md:leading-8">
                  {introNarrative}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-2 backdrop-blur-md">
                    <Clock3 className="size-4 text-fuchsia-300" />
                    <span>约 {quiz.durationMinutes} 分钟</span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-2 backdrop-blur-md">
                    <span className="size-1.5 rounded-full bg-sky-300" />
                    {quiz.questionCount} 题
                  </span>
                  {quiz.priceLabel ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-amber-200 backdrop-blur-md font-medium">
                      {quiz.priceLabel}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-white/12 bg-white/8 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45 relative z-10">开始前验证</p>
                <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between relative z-10">
                  <div className="max-w-xl">
                    <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">输入购买后获得的验证码即可开始测试</h2>
                    <p className="mt-3 text-sm leading-7 text-white/68 md:text-base">
                      验证码可在小红书订单或发货消息中查看，验证成功后会自动进入答题页。
                    </p>
                  </div>

                  <div className="w-full lg:w-[240px] lg:flex-none">
                    <Button
                      className="group h-14 w-full rounded-[18px] bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 text-base font-bold text-white shadow-[0_18px_50px_rgba(168,85,247,0.35)] transition-all hover:scale-[1.02] hover:from-violet-500 hover:to-fuchsia-500"
                      onClick={() => setDialogOpen(true)}
                      type="button"
                    >
                      <Sparkles className="mr-2 size-4 text-white/80" />
                      开始深度探索
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <p className="mt-3 text-xs text-slate-400 text-center">本次有效期内可随时中断或重复测试</p>
                  </div>
                </div>

                {hasRememberedCode ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/18 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-100 relative z-10">
                    <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    已识别到上次输入的验证码，打开弹窗后可直接继续验证。
                  </div>
                ) : null}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
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

            <div className="mt-8 lg:mt-1 lg:flex lg:flex-col lg:items-end">
              <ResultPreviewCard quizSlug={slug || "default"} />
              <div className="mt-4 w-full lg:max-w-[220px] xl:max-w-[236px]">
                <PurchaseQrPlaceholder purchaseUrl={quiz.purchaseUrl} salesChannel={quiz.salesChannel} />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">正式版测试链路已启用 · 结果仅供自我探索参考</p>
        </div>
      </div>

      <AccessCodeDialog
        badgeLabel="输入测试验证码"
        description="输入你在小红书购买后获得的测试验证码，验证成功后会自动进入答题页。"
        draftNotice={hasRememberedCode ? "已为你带入上次输入的验证码，可直接继续验证。" : undefined}
        errorMessage={accessErrorMessage}
        helperText="验证码可在小红书订单或发货消息中查看。"
        inputLabel="输入测试验证码"
        inputPlaceholder="请输入测试验证码"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleStart}
        onValueChange={(value) => {
          setCode(value)
          if (accessErrorMessage) {
            setAccessErrorMessage(undefined)
          }
        }}
        open={dialogOpen}
        submitting={verifying}
        title={quiz ? `验证后开始${quiz.title}` : "验证后开始测试"}
        value={code}
      />
    </>
  )
}
