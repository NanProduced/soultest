import { Clock3, Sparkles, Target, Brain, ShieldCheck } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { ResultPreviewCard } from "@/components/quiz/result-preview-card"
import { QuizFeatureGrid } from "@/components/quiz/quiz-feature-grid"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { QuizOutcomeList } from "@/components/quiz/quiz-outcome-list"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Spotlight } from "@/components/ui/spotlight"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

const OEJTS_OUTCOME_ITEMS = [
  "你的 OEJTS 16 型人格结果",
  "四条维度的倾向分析",
  "关系、工作、压力场景下的建议",
]

const OEJTS_FEATURES = [
  { icon: Target, label: "72 题精测", sub: "全面覆盖", iconClass: "text-sky-400" },
  { icon: Clock3, label: "约 15 分钟", sub: "沉浸体验", iconClass: "text-fuchsia-400" },
  { icon: Brain, label: "专业模型", sub: "学术参考", iconClass: "text-violet-400" },
  { icon: ShieldCheck, label: "多维解读", sub: "场景分析", iconClass: "text-emerald-400" },
]

export default function OejtsIntroPage({ slug }: CustomIntroPageProps) {
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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-fuchsia-500/30 overflow-x-hidden">
      <AuroraBackground className="fixed inset-0 pointer-events-none opacity-40">
        <div />
      </AuroraBackground>
      
      {/* Decorative Background Text */}
      <div className="fixed top-20 left-0 w-full pointer-events-none z-0 overflow-hidden select-none opacity-[0.02]">
        <h2 className="text-[20vw] font-black leading-none whitespace-nowrap translate-x-[-10%]">
          PSYCHOLOGY ASSESSMENT BLUEPRINT
        </h2>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 md:pt-32">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        
        {/* New Asymmetric Layout */}
        <div className="flex flex-col gap-12 lg:gap-24">
          
          {/* Section 1: Hero & Blueprint */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-fuchsia-500/50" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-fuchsia-400">
                  Assessment ID: OEJTS-16
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                看见你的<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400">
                  性格能量图谱
                </span>
              </h1>

              <div className="max-w-xl text-xl md:text-2xl leading-relaxed text-slate-300/90 font-light mb-10 italic">
                “这不是给你的定义，而是一份关于你如何‘运作’的精密说明书。”
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">维度数量</div>
                  <div className="text-lg font-bold">4 个核心维度</div>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">结果类型</div>
                  <div className="text-lg font-bold">16 种人格原型</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-fuchsia-500/10 blur-[100px] rounded-full" />
              <div className="relative rotate-3 hover:rotate-0 transition-transform duration-700">
                <ResultPreviewCard quizSlug="oejts-personality-map" />
              </div>
            </motion.div>
          </div>

          {/* Section 2: Unified Portal (Access + BIG QR) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <QuizUnifiedPortal 
              onStart={() => setDialogOpen(true)}
              purchaseUrl={quiz?.purchaseUrl}
              salesChannel={quiz?.salesChannel}
              accentColor="sky"
            />
          </motion.div>

          {/* Section 3: Details Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <div className="size-2 bg-fuchsia-500 rounded-full animate-pulse" />
                关于测评模型
              </h2>
              <p className="text-slate-400 leading-8 text-lg">
                OEJTS 16 型人格图谱以经典心理类型理论为核心，揭示你在注意力、信息加工、决策及行动节奏上的稳定偏好。建议按第一反应作答，还原你最自然的心理能量位置。
              </p>
              <QuizFeatureGrid items={OEJTS_FEATURES} />
            </div>

            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <QuizOutcomeList items={OEJTS_OUTCOME_ITEMS} accentColor="fuchsia" title="深度结果报告预览" />
              
              <div className="mt-12 p-6 rounded-3xl bg-fuchsia-500/5 border border-fuchsia-500/10 text-sm leading-relaxed text-slate-400">
                <Sparkles className="size-5 text-fuchsia-400 mb-3" />
                测评完成后，除了详尽的文字分析，您还将获得一张针对小红书优化排版的“人格侧写海报”，方便保存与分享。
              </div>
            </div>
          </div>

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
        title="身份验证"
        description="身份验证成功后，将为您建立个人测评档案。"
      />
    </div>
  )
}
