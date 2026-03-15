import { ArrowRight, Clock3, ExternalLink, ScanLine, Sparkles } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { Navigate, useNavigate, useParams } from "react-router"
import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
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

function ResultPreviewCard({ quizSlug }: { quizSlug: string }) {
  const isRelationshipQuiz = quizSlug === "relationship-preference-test"
  const preview = isRelationshipQuiz
    ? {
        badge: "RELATIONSHIP",
        title: "精心的时刻",
        subtitle: "主通道 · 被专注陪伴打动",
        description: "主语言 / 次语言、五维分布、关系里的失落触发点，以及适合直接导出的关系海报。",
        rows: [
          { label: "肯定的言辞", value: 50 },
          { label: "精心的时刻", value: 83 },
          { label: "接受礼物", value: 33 },
          { label: "服务的行动", value: 67 },
          { label: "身体的接触", value: 17 },
        ],
        chips: [
          { title: "主语言", body: "你最容易因为被认真陪伴而感到被爱。" },
          { title: "次语言", body: "行动上的照顾，会进一步加强你的安全感。" },
        ],
        posterTitle: "关系海报",
        posterBody: "结果页支持回看、分享与一键导出，适合发给伴侣一起看。",
        glowClass: "bg-rose-500/18",
        shellClass: "bg-[linear-gradient(180deg,rgba(95,22,52,0.92)_0%,rgba(35,10,22,0.98)_100%)]",
        innerClass: "bg-[#190913]/95",
        barClass: "bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300",
      }
    : {
        badge: "OEJTS",
        title: "INTJ",
        subtitle: "分析者原型 · 冷静规划型",
        description: "四条维度倾向、关系 / 工作 / 压力场景建议，以及适合保存分享的人格海报。",
        rows: [
          { label: "内向 / 外向", value: 72 },
          { label: "实感 / 直觉", value: 68 },
          { label: "情感 / 思考", value: 79 },
          { label: "判断 / 感知", value: 64 },
        ],
        chips: [
          { title: "关系", body: "偏好稳定、深度、低消耗的沟通方式。" },
          { title: "工作", body: "擅长规划、独立判断和长期推进复杂任务。" },
        ],
        posterTitle: "人格海报",
        posterBody: "完整结果支持回看、保存与一键导出分享。",
        glowClass: "bg-fuchsia-500/16",
        shellClass: "bg-[linear-gradient(180deg,rgba(49,24,92,0.92)_0%,rgba(6,14,39,0.98)_100%)]",
        innerClass: "bg-slate-950/90",
        barClass: "bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400",
      }

  return (
    <div aria-hidden="true" className="relative hidden w-full max-w-[336px] lg:block xl:max-w-[360px]">
      <div className={`absolute -inset-5 rounded-[36px] blur-3xl ${preview.glowClass}`} />
      <div className={`relative rounded-[30px] border border-white/10 p-3 shadow-[0_28px_100px_rgba(15,23,42,0.28)] ${preview.shellClass}`}>
        <div className={`rounded-[24px] border border-white/12 p-4 ${preview.innerClass}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">结果页预览</p>
              <p className="mt-2.5 text-[1.85rem] font-semibold tracking-tight text-white">{preview.title}</p>
              <p className="mt-1.5 text-xs leading-5 text-white/58">{preview.subtitle}</p>
            </div>
            <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/50">
              {preview.badge}
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-6 text-white/62">{preview.description}</p>

          <div className="mt-4 space-y-2.5">
            {preview.rows.map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-[11px] text-white/58">
                  <span>{row.label}</span>
                  <span>{row.value}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${preview.barClass}`} style={{ width: `${row.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {preview.chips.map((chip) => (
              <div className="rounded-[16px] border border-white/10 bg-white/6 p-2.5" key={chip.title}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">{chip.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-white/66">{chip.body}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-4 overflow-hidden rounded-[18px] border border-white/10 bg-white/6 p-3.5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/45">
              <Sparkles className="size-3.5" />
              <span>{preview.posterTitle}</span>
            </div>
            <p className="mt-1.5 max-w-[72%] text-xs leading-5 text-white/66">{preview.posterBody}</p>
            <img
              alt="抽象测试结果预览插图"
              className="pointer-events-none absolute bottom-0 right-1 w-16 opacity-30 mix-blend-screen"
              loading="eager"
              src={heroArt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PurchaseQrPlaceholder({
  purchaseUrl,
  salesChannel,
}: {
  purchaseUrl?: string
  salesChannel?: string
}) {
  const channelLabel = salesChannel === "xiaohongshu" ? "小红书店铺" : "购买入口"
  const hasPurchaseLink = Boolean(purchaseUrl && !purchaseUrl.includes("example.com"))

  const cardContent = (
    <div className="flex flex-col items-center text-center">
      <div className="mx-auto flex aspect-square w-[124px] items-center justify-center rounded-[20px] bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.18)] sm:w-[136px]">
        <div className="relative flex h-full w-full items-center justify-center rounded-[16px] border-[5px] border-slate-950 bg-slate-50">
          <div className="absolute left-3 top-3 h-5 w-5 rounded-[4px] border-[4px] border-slate-950" />
          <div className="absolute right-3 top-3 h-5 w-5 rounded-[4px] border-[4px] border-slate-950" />
          <div className="absolute bottom-3 left-3 h-5 w-5 rounded-[4px] border-[4px] border-slate-950" />
          <div className="absolute bottom-4 right-4 h-3.5 w-3.5 rounded-[4px] bg-slate-950" />

          <div className="flex flex-col items-center justify-center gap-1 text-slate-950">
            <ScanLine className="size-6" />
            <span className="text-xs font-semibold tracking-[0.22em]">灵测</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-white">{channelLabel}二维码</p>
      <p className="mt-1 max-w-[180px] text-[12px] leading-5 text-white/58">
        {hasPurchaseLink ? "扫码或点击即可跳转购买" : "预留展示区域，后续可替换为真实店铺二维码"}
      </p>
    </div>
  )

  if (!hasPurchaseLink || !purchaseUrl) {
    return (
      <div className="w-full max-w-[220px] rounded-[22px] border border-dashed border-white/14 bg-white/6 p-4 backdrop-blur-md sm:ml-auto">
        {cardContent}
      </div>
    )
  }

  return (
    <a
      className="group block w-full max-w-[220px] rounded-[22px] border border-dashed border-white/14 bg-white/6 p-4 backdrop-blur-md transition hover:border-fuchsia-300/35 hover:bg-white/8 sm:ml-auto"
      href={purchaseUrl}
      rel="noreferrer"
      target="_blank"
    >
      {cardContent}
      <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/8 px-3 py-2 text-sm text-white transition group-hover:bg-white/10">
        去{channelLabel}购买
        <ExternalLink className="size-4" />
      </div>
    </a>
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
      setAccessErrorMessage("请输入验证码后再开始测试")
      return
    }

    setVerifying(true)
    setAccessErrorMessage(undefined)

    try {
      const session = await verifyAccessCode(normalizedCode)

      if (!session.allowedQuizzes.some((item) => item.slug === slug)) {
        throw new Error("当前验证码未授权这套测试")
      }

      writeAccessSession(session)
      navigate(`/${slug}/test`)
    } catch (error) {
      setAccessErrorMessage(error instanceof Error ? error.message : "验证码验证失败，请稍后重试")
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
  const introNarrative =
    quiz.slug === "oejts-personality-map"
      ? "OEJTS 16 型人格图谱以经典心理类型理论中的四维偏好框架为参考，围绕 I/E、S/N、F/T、J/P 四条维度观察一个人在注意力投向、信息加工、判断决策与行动节奏上的自然偏好。它更适合用来做自我理解、关系沟通与场景反思，而不是给人下定论式标签；按第一反应作答，通常更能看见你在真实情境中的稳定倾向。"
      : quiz.detailSections.map((section) => section.description).join(" ") || quiz.summary

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
                      onClick={handleOpenAccessDialog}
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
              <ResultPreviewCard quizSlug={quiz.slug} />
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
        draftNotice={hasRememberedCode ? "已为你带入上次输入的验证码，可直接确认验证。" : undefined}
        errorMessage={accessErrorMessage}
        helperText="验证码可在小红书订单或发货消息中查看。"
        inputLabel="输入测试验证码"
        inputPlaceholder="请输入测试验证码"
        onClose={handleCloseAccessDialog}
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
