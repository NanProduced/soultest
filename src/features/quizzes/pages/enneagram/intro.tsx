import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Compass, Sparkles, ChevronDown, CheckCircle2 } from "lucide-react"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { QuizFeatureGrid } from "@/components/quiz/quiz-feature-grid"
import { Spotlight } from "@/components/ui/spotlight"
import { CanvasShaders } from "@/components/ui/canvas-shaders"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

const ENNEAGRAM_FEATURES = [
  { icon: Sparkles, label: "核心动机", sub: "透视本能", iconClass: "text-violet-400" },
  { icon: Compass, label: "成长路径", sub: "动态位移", iconClass: "text-pink-400" },
  { icon: CheckCircle2, label: "108 题", sub: "深度测定", iconClass: "text-amber-400" },
]

export default function EnneagramIntroPage({ slug }: CustomIntroPageProps) {
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
      } catch { /* Silent */ } finally {
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

  if (loading) return <div className="min-h-screen bg-black" />

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30 overflow-x-hidden scroll-smooth">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CanvasShaders preset="space" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
        </div>

        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(139, 92, 246, 0.25)" />

        <div className="relative z-10 max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h1 className="text-[14vw] md:text-[10vw] font-black tracking-[-0.05em] leading-[0.8] mb-12 select-none">
              看见<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-rose-400 to-amber-300">
                生存引擎
              </span>
            </h1>

            <div className="max-w-xl mx-auto h-24"> {/* Fixed height to prevent jump */}
              <TextGenerateEffect 
                words="九型人格专业版 · 开启关于动机的深度对谈" 
                className="text-lg md:text-xl text-slate-400 font-light tracking-[0.2em] uppercase"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1.5 }}
            onClick={() => document.getElementById('narrative')?.scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer mt-12 flex flex-col items-center gap-4 text-white/20 hover:text-white/50 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] group-hover:tracking-[0.6em] transition-all">Scroll to Explore</span>
            <ChevronDown className="size-5 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* 2. Narrative Intro Section (Moved Above Portal) */}
      <section id="narrative" className="relative z-10 px-6 py-32 md:py-48 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-16"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-widest">
                Deep Motivation Analysis
              </div>
              <h2 className="text-4xl md:text-6xl font-bold leading-[1.15] tracking-tight">
                不仅仅是性格分类，<br />
                而是透视行为背后的<span className="text-violet-400">驱动力</span>。
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-light">
                大多数测评只告诉你“你是什么样的人”，而九型人格关注“你为什么是这样的人”。它直击潜意识里的核心恐惧与核心渴望，揭示你在压力与成长状态下的动态位移。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-white/5">
              {ENNEAGRAM_FEATURES.map((f, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <f.icon className={`size-6 ${f.iconClass}`} />
                  <div className="text-lg font-bold">{f.label}</div>
                  <div className="text-sm text-slate-500">{f.sub}</div>
                </div>
              ))}
            </div>

            <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 text-amber-400">
                  <Sparkles className="size-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">专业版包含</span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-slate-300">
                  {[
                    "主型、翼倾向、副型全景判断",
                    "压力态与成长态的心理位移分析",
                    "职场领导力与团队协作风格解读",
                    "亲密关系中的互动模式与建议",
                    "适配小红书排版的灵魂色彩海报",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-base leading-relaxed">
                      <div className="size-1.5 rounded-full bg-violet-500 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Grand Finale: Activation Portal */}
      <section className="relative z-10 px-6 pb-48 md:pb-64 bg-black flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">准备好开启探索了吗？</h3>
            <p className="text-slate-500">身份验证成功后即可开始 108 题深度测评</p>
          </div>
          
          <QuizUnifiedPortal 
            onStart={() => setDialogOpen(true)}
            centered={true}
            accentColor="violet"
            purchaseUrl="https://xhslink.com/m/8Hcapw8hyDn"
          />
        </motion.div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-24 bg-black border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.6em] mb-4">SoulTest · Psychological Excellence</p>
        <p className="text-[10px] text-white/10 uppercase tracking-[0.2em]">基于经典人格模型改编 · 灵测实验室出品</p>
      </footer>

      <AccessCodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleStart}
        value={code}
        onValueChange={setCode}
        submitting={verifying}
        errorMessage={accessErrorMessage}
        title="建立档案"
        description="身份验证成功后，我们将为您建立私密的动机探索档案。"
      />
    </div>
  )
}
