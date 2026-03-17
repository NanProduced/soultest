import { Sparkles, Moon, Star, Wand2, Eye } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { PurchaseQrPlaceholder } from "@/components/quiz/purchase-qr-placeholder"
import { ResultPreviewCard } from "@/components/quiz/result-preview-card"
import { QuizFeatureGrid } from "@/components/quiz/quiz-feature-grid"
import { QuizAccessBox } from "@/components/quiz/quiz-access-box"
import { QuizOutcomeList } from "@/components/quiz/quiz-outcome-list"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Spotlight } from "@/components/ui/spotlight"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

const TAROT_OUTCOME_ITEMS = [
  "你的专属灵魂塔罗牌",
  "22 张大阿卡纳深度解读",
  "牌面象征与潜意识启示",
  "当下生命课题与指引",
]

const TAROT_FEATURES = [
  { icon: Moon, label: "神秘牌阵", sub: "深度占卜", iconClass: "text-purple-400" },
  { icon: Star, label: "约 10 分钟", sub: "沉浸体验", iconClass: "text-amber-400" },
  { icon: Wand2, label: "直觉引导", sub: "心灵对话", iconClass: "text-rose-400" },
  { icon: Eye, label: "灵魂洞察", sub: "潜意识探索", iconClass: "text-cyan-400" },
]

export default function SoulTarotIntroPage({ slug }: CustomIntroPageProps) {
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<QuizIntro>()
  const [loading, setLoading] = useState(true)
  const [accessErrorMessage, setAccessErrorMessage] = useState<string>()
  const [code, setCode] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const session = readAccessSession()
    if (session?.allowedQuizzes.some((item) => item.slug === slug)) {
      setCode(session.code)
    }

    let active = true
    async function load() {
      try {
        const item = await fetchQuizIntro(slug)
        if (active) setQuiz(item)
      } catch {
        // Silent error
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [slug])

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

  if (loading) return <div className="min-h-screen bg-slate-950" />

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
      <AuroraBackground className="fixed inset-0 pointer-events-none opacity-40">
        <div />
      </AuroraBackground>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 md:pt-32">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />
        
        <div className="lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 xl:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 backdrop-blur-md">
                <Sparkles className="size-3.5" />
                MYSTICAL TAROT
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
                22 张大阿卡纳
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              揭示你的<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-300 to-rose-400">
                灵魂塔罗牌
              </span>
            </h1>

            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-slate-300/90 font-medium">
              <p>
                在 22 张大阿卡纳的智慧中，每张牌都承载着独特的灵魂讯息。通过直觉选择，让塔罗牌揭示你当下的生命状态、潜在课题与前行指引。
              </p>
              <p className="text-slate-400">
                这不是预测未来，而是一次与潜意识深处的对话，帮助你更清晰地看见自己。
              </p>
            </div>

            <div className="mt-12">
              <QuizFeatureGrid items={TAROT_FEATURES} />
            </div>

            <div className="mt-12">
              <QuizAccessBox 
                onStart={() => setDialogOpen(true)} 
                accentColor="purple"
                description="请输入你在小红书购买后获得的 10 位验证码。有效期内支持中断后继续。"
              />
            </div>

            <div className="mt-12 border-t border-white/5 pt-8">
              <QuizOutcomeList items={TAROT_OUTCOME_ITEMS} accentColor="purple" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex flex-col items-center gap-8"
          >
            <ResultPreviewCard quizSlug="soul-tarot" />
            <div className="w-full max-w-[340px]">
              <PurchaseQrPlaceholder purchaseUrl={quiz?.purchaseUrl} salesChannel={quiz?.salesChannel} />
            </div>
          </motion.div>
        </div>
      </div>

      <AccessCodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleStart}
        value={code}
        onValueChange={setCode}
        submitting={verifying}
        errorMessage={accessErrorMessage}
        title="验证后开始灵魂塔罗测试"
        description="请输入你在小红书购买后获得的验证码，验证成功后将立即进入选牌环节。"
      />
    </div>
  )
}
